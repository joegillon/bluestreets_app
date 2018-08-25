from flask import Blueprint, request, jsonify, render_template, json

from dao.dao import Dao
import dao.turf_dao as turf_dao

trf = Blueprint('trf', __name__, url_prefix='/trf')


@trf.route('/neighborhoods', methods=['GET', 'POST'])
def neighborhoods():
    if request.method == 'GET':
        dao = Dao(stateful=True)
        types = turf_dao.get_turf_types(dao)
        jurisdictions = turf_dao.get_jurisdictions(dao)
        juris_names = [j['jurisdiction_name'] for j in jurisdictions]
        precincts = turf_dao.get_precincts(dao)
        pct_names = ['%s, %s, %s' % (p['jurisdiction_name'], p['ward'], p['precinct']) for p in precincts]
        wards = build_wards(precincts)
        state_house_districts = sorted(list(set([p['state_house'] for p in precincts])))
        state_senate_districts = sorted(list(set([p['state_senate'] for p in precincts])))
        congressional_districts = sorted(list(set([p['congress'] for p in precincts])))
        nhoods = turf_dao.get_neighborhoods(dao)
        dao.close()
        return render_template(
            'neighborhoods.html',
            title="Neighborhoods",
            types=types,
            jurisdictions=jurisdictions,
            juris_names=juris_names,
            wards=wards,
            precincts=precincts,
            pct_names=pct_names,
            state_house_districts=state_house_districts,
            state_senate_districts=state_senate_districts,
            congressional_districts=congressional_districts,
            neighborhoods=nhoods
        )

    params = json.loads(request.form['params'])

    block_vals = []
    if params['blocks']:
        block_vals = [(
            block['street_name'],
            block['low_addr'],
            block['high_addr'],
            block['odd_even'],
            block['precinct_id']
        ) for block in params['blocks']]

    dao = Dao(stateful=True)
    nbh_id = turf_dao.add_neighborhood(
        dao,
        params['type'],
        params['name'],
        params['pct_ids'],
        block_vals
    )
    dao.close()
    return jsonify(nbh_id=nbh_id)


@trf.route('/neighborhood_name', methods=['POST'])
def neighborhood_name():
    params = json.loads(request.form['params'])
    dao = Dao()
    try:
        turf_dao.neighborhood_name(dao, params['id'], params['name'])
        return jsonify(msg='Name changed!')
    except Exception as ex:
        return jsonify(error=str(ex))


@trf.route('/neighborhood_drop', methods=['POST'])
def neighborhood_drop():
    params = json.loads(request.form['params'])
    dao = Dao(stateful=True)
    try:
        turf_dao.neighborhood_drop(dao, params['id'])
        return jsonify(msg='Neighborhood dropped!')
    except Exception as ex:
        return jsonify(error=str(ex))
    finally:
        dao.close()


def build_wards(precincts):
    wards = []
    for p in precincts:
        w = p['jurisdiction_name']
        if p['ward'] != '00':
            w += ', ' + p['ward']
        wards.append(w)
    return sorted(list(set(wards)))


@trf.route('/get_wards', methods=['GET'])
def get_wards():
    dao = Dao()
    wards = turf_dao.get_wards(dao, request.args['jurisdiction_code'])
    return jsonify(wards=wards)


@trf.route('/get_precincts', methods=['GET'])
def get_precincts():
    dao = Dao()
    if 'ward_no' in request.args:
        precincts = turf_dao.get_precincts(
            dao,
            request.args['jurisdiction_code'],
            request.args['ward_no']
        )
    else:
        precincts = turf_dao.get_precincts(dao, request.args['jurisdiction_code'])
    return jsonify(precincts=precincts)


@trf.route('/get_streets', methods=['GET'])
def get_streets():
    dao = Dao()
    streets = turf_dao.get_streets(
        dao,
        request.args['jurisdiction_code'],
        request.args['ward'],
        request.args['precinct']
    )
    return jsonify(streets=streets)


@trf.route('/get_house_nums', methods=['GET'])
def get_house_nums():
    dao = Dao()
    nums = turf_dao.get_house_nums(
        dao,
        request.args['county_code'],
        request.args['jurisdiction_code'],
        request.args['street_name'],
        request.args['street_type']
    )
    return jsonify(house_nums=nums)
