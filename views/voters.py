import json

from flask import Blueprint, request, jsonify, render_template
from flask import current_app as app

import dao.turf_dao as turf_dao
import dao.api_client as api_client
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

    url = 'vtr_api/get_by_block'
    voters = api_client.post(url, request.form['params'])['voters']
    return jsonify(voters=to_local_format(voters))


@vtr.route('/csv_import', methods=['GET', 'POST'])
def csv_import():
    from models.submission import Submission

    if request.method == 'GET':
        return render_template(
            'voters/csv_import.html',
            title='Voter Import'
        )

    data = json.loads(request.form['params'])['data']
    cities = turf_dao.get_cities()
    submissions = [Submission.from_web(rec, cities) for rec in data if rec['data0']]
    Voter.batch_lookup(submissions)
    return jsonify(lookups=[submission.serialize() for submission in submissions])


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
    data = list(data.values())
    for rec in data:
        del rec['address']
        del rec['name']
    try:
        vtr_dao.add_many(data)
        return jsonify(msg='Records saved!')
    except Exception as ex:
        return jsonify(error=str(ex))


