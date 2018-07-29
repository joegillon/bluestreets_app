from flask import Blueprint, request, jsonify

from dao.dao import Dao
import dao.turf_dao as turf_dao

trf = Blueprint('trf', __name__, url_prefix='/trf')


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
