import json

from flask import Blueprint, request, jsonify, render_template
from flask import current_app as app

import dao.turf_dao as turf_dao
import dao.api_client as api_client
from dao.dao import Dao
import dao.vtr_dao as vtr_dao

from models.voter import Voter

vtr = Blueprint('vtr', __name__, url_prefix='/vtr')


@vtr.route('/api_import', methods=['GET', 'POST'])
def api_import():

    if request.method == 'GET':
        precincts = turf_dao.get_precincts()
        return render_template(
            'voters/api_import.html',
            title='Voter Import',
            precincts=precincts,
            data_path=app.config['DATA_PATH']
        )

    blocks = json.loads(request.form['params'])
    if not blocks:
        voters = api_client.get('vtr_api/all')
    elif len(blocks[0]) == 1 and 'precinct_id' in blocks[0]:
        voters = api_client.get('vtr_api/pct/%d' % blocks[0]['precinct_id'])
    else:
        data = {'blocks': request.form['params']}
        voters = api_client.post('vtr_api/blocks', data)

    inserts, conflicts, deletes = filter_api_imports(voters)
    return jsonify(
        inserts=inserts,
        conflicts=conflicts,
        deletes=deletes
    )


@vtr.route('/csv_import', methods=['GET', 'POST'])
def csv_import():
    # from models.submission import Submission

    if request.method == 'GET':
        return render_template(
            'voters/csv_import.html',
            title='Voter Import'
        )

    # data = json.loads(request.form['params'])['data']
    # cities = turf_dao.get_cities()
    # submissions = [Submission.from_web(rec, cities) for rec in data if rec['data0']]
    # Voter.batch_lookup(submissions)
    # return jsonify(lookups=[submission.serialize() for submission in submissions])


@vtr.route('/worksheet', methods=['GET', 'POST'])
def worksheet():
    if request.method == 'GET':
        return render_template(
            'voters/worksheet.html',
            title='Voter Worksheet'
        )


@vtr.route('/sync', methods=['GET'])
def sync():
    return render_template(
        'voters/sync.html',
        title='Synchronize Voters'
    )


def to_local_format(voters):
    for voter in voters:
        vtr_obj = Voter(voter)
        voter['name'] = str(vtr_obj.name)
        voter['address'] = str(vtr_obj.address)
    return voters


@vtr.route('/add_many', methods=['POST'])
def add_many():
    data = json.loads(request.form['params'])
    flds = list(data[0].keys())
    vals = [list(rec.values()) for rec in data]
    dao = Dao()
    try:
        dao.add_many('voters', flds, vals)
        return jsonify(msg='Records saved!')
    except Exception as ex:
        return jsonify(error=str(ex))


@vtr.route('/update_many', methods=['POST'])
def update_many():
    data = json.loads(request.form['params'])
    flds = list(data[0].keys())
    vals = [list(rec.values()) for rec in data]
    for i in range(0, len(data)):
        vals[i].append(data[i]['voter_id'])
    dao = Dao()
    try:
        dao.update_many('voters', 'voter_id', flds, vals)
        return jsonify(msg='Records saved!')
    except Exception as ex:
        return jsonify(error=str(ex))


@vtr.route('/drop_many', methods=['POST'])
def drop_many():
    data = json.loads(request.form['params'])
    dao = Dao()
    try:
        dao.drop_many('voters', 'voter_id', data)
        return jsonify(msg='Records dropped!')
    except Exception as ex:
        return jsonify(error=str(ex))


def filter_api_imports(api_voters):
    dao = Dao()
    my_voters = vtr_dao.get_all(dao)
    my_voters = {v['voter_id']: v for v in my_voters}
    api_voters = {v['voter_id']: v for v in api_voters}
    inserts = []
    conflicts = []
    deletes = []
    for api_id, api_voter in api_voters.items():
        if api_id in my_voters:
            if has_diff(api_voter, my_voters[api_id]):
                conflicts.append(api_voter)
                conflicts.append(my_voters[api_id])
        else:
            inserts.append(api_voter)
    for vid in my_voters.keys():
        if vid not in api_voters:
            deletes.append(my_voters[vid])
    return inserts, conflicts, deletes


def has_diff(api_voter, my_voter):
    for fld in vtr_dao.db_cols:
        if api_voter[fld] != my_voter[fld]:
            return True
    return False

