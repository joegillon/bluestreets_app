import json

from flask import Blueprint, request, jsonify, render_template
from flask import current_app as app

from dao.dao import Dao
import dao.con_dao as con_dao
import dao.turf_dao as turf_dao
import dao.api_client as api_client

from models.address import Address
from models.contact import Contact
from models.group import Group
from models.group_member import GroupMember
from models.person_name import PersonName
from models.precinct import Precinct

con = Blueprint('con', __name__, url_prefix='/con')


@con.route('/api_import', methods=['GET', 'POST'])
def api_import():

    if request.method == 'GET':
        precincts = turf_dao.get_precincts()
        return render_template(
            'contacts/api_import.html',
            title='Contact Import',
            precincts=precincts,
            data_path=app.config['DATA_PATH']
        )

    url = 'con_api/get_by_block'
    contacts = api_client.post(url, request.form['params'])['contacts']
    return jsonify(contacts=to_local_format(contacts))


def to_local_format(contacts):
    for contact in contacts:
        con_obj = Contact(contact)
        contact['name'] = str(con_obj.name)
        contact['address'] = str(con_obj.address)
    return contacts


# @con.route('/import', methods=['GET', 'POST'])
# def csv_import():
#     if request.method == 'GET':
#         return render_template(
#             'con_import.html',
#             title='Contact Import'
#         )
#
#     data = json.loads(request.form['params'])
#     dao = Dao(stateful=True)
#     # precincts = Precinct.get_by_jwp(dao)
#     groups = Group.get_all_by_code(dao)
#     memberships = []
#     next_id = dao.get_max_id('contacts', 'id')
#     for rec in data:
#         rec['precinct_id'] = None
#         next_id += 1
#         # if rec['jurisdiction'] and rec['ward'] and rec['precinct']:
#         #     jwp = '%s:%s:%s' % (
#         #         rec['jurisdiction'].upper(),
#         #         rec['ward'].zfill(2),
#         #         rec['precinct'].zfill(3)
#         #     )
#         #     rec['precinct_id'] = precincts[jwp]['id']
#         if rec['groups']:
#             for code in rec['groups'].split('/'):
#                 if code in groups:
#                     memberships.append({
#                         'group_id': groups[code]['id'],
#                         'contact_id': next_id,
#                         'role': '',
#                         'comment': ''
#                     })
#
#     try:
#         con_dao.add_many(data)
#         GroupMember.add_many(memberships)
#         return jsonify(msg='Successful!')
#     except Exception as ex:
#         return jsonify(error=str(ex))
#     finally:
#         dao.close()
#
#
# @con.route('/entry', methods=['GET', 'POST'])
# def entry():
#     if request.method == 'GET':
#         return render_template(
#             'con_entry.html',
#             title='Contacts'
#         )


# @con.route('/synchronize', methods=['GET', 'POST'])
# def synchronize():
#     from models.contact import Contact
#
#     if request.method == 'GET':
#         # problems = Contact.synchronize()
#         return render_template(
#             'con_problems.html',
#             title='Unsynched Contacts'
#             # problems=problems
#         )
#
#
# @con.route('/precinct', methods=['GET', 'POST'])
# def assign_precinct():
#     # from models.precinct import Precinct
#
#     if request.method == 'GET':
#         # precincts = Precinct.get_all()
#         # contacts = Contact.get_with_missing_precinct()
#         return render_template(
#             'con_precinct.html',
#             title='Unassigned Precinct'
#             # precincts=precincts,
#             # contacts=contacts
#         )
#
#     params = json.loads(request.form['params'])
#     contact = Contact(params)
#     dao = Dao(stateful=True)
#     if 'voter_id' in params and params['voter_id']:
#         voter = Voter.get_one(dao, params['voter_id'])
#         nickname = contact.name.first
#         contact.name = voter.name
#         contact.name.nickname = nickname
#         contact.address = voter.address
#         contact.reg_date = voter.reg_date
#     try:
#         contact.update(dao)
#         return jsonify(msg="Update successful!")
#     except Exception as ex:
#         return jsonify(error=str(ex))
#     finally:
#         dao.close()
#
#
# @con.route('/contact_matches', methods=['POST'])
# def contact_matches():
#     contact = Contact(json.loads(request.form['params']))
#     dao = Dao(stateful=True)
#     try:
#         matches = contact.get_matches(dao)
#         for match in matches:
#             match['name'] = str(PersonName(match))
#             match['address'] = str(Address(match))
#         return jsonify(matches=matches)
#     except Exception as ex:
#         return jsonify(error=str(ex))
#
#
# @con.route('/voter_lookup', methods=['POST'])
# def voter_lookup():
#     from models.voter import Voter
#
#     contact = json.loads(request.form['params'])
#     dao = Dao()
#     try:
#         voters = Voter.lookup(dao, contact)
#         candidates = []
#         for voter in voters:
#             candidates.append({
#                 'name': str(voter.name),
#                 'address': str(voter.address),
#                 'city': voter.address.city,
#                 'zipcode': voter.address.zipcode,
#                 'birth_year': voter.birth_year,
#                 'gender': voter.gender,
#                 'voter_id': voter.voter_id,
#                 'precinct_id': voter.address.precinct_id
#             })
#         return jsonify(candidates=candidates)
#     except Exception as ex:
#         return jsonify(error=str(ex))
#
#
# @con.route('/street_lookup', methods=['POST'])
# def street_lookup():
#     params = json.loads(request.form['params'])
#     addr = Address(params)
#     try:
#         streets = Turf.get_turf(addr)
#         candidates = []
#         for street in streets:
#             candidates.append({
#                 'address': str(Address(street)),
#                 'city': street['city'],
#                 'zipcode': street['zipcode'],
#                 'house_num_low': street['house_num_low'],
#                 'house_num_high': street['house_num_high'],
#                 'odd_even': street['odd_even'],
#                 'precinct_id': street['precinct_id']
#             })
#         return jsonify(candidates=candidates)
#     except Exception as ex:
#         return jsonify(error=str(ex))


@con.route('/email_duplicates', methods=['GET', 'POST'])
def email_duplicates():
    if request.method == 'GET':
        dao = Dao(stateful=True)
        cities = turf_dao.get_city_names(dao)
        dups = con_dao.get_email_dups(dao)
        dao.close()
        for dup in dups:
            dup['name'] = str(PersonName(dup))
            dup['address'] = str(Address(dup))

        return render_template(
            'con_dups.html',
            title='Email Duplicates',
            dups=dups,
            cities=cities
        )


@con.route('/phone_duplicates', methods=['GET', 'POST'])
def phone_duplicates():
    if request.method == 'GET':
        dao = Dao(stateful=True)
        cities = turf_dao.get_city_names(dao)
        dups = con_dao.get_phone_dups(dao)
        dao.close()
        for dup in dups:
            dup['name'] = str(PersonName(dup))
            dup['address'] = str(Address(dup))

        return render_template(
            'con_dups.html',
            title='Phone Duplicates',
            dups=dups,
            cities=cities
        )


@con.route('/name_addr_duplicates', methods=['GET', 'POST'])
def name_addr_duplicates():
    if request.method == 'GET':
        dao = Dao(stateful=True)
        cities = turf_dao.get_city_names(dao)
        dups = con_dao.get_name_addr_dups(dao)
        dao.close()
        for dup in dups:
            dup['name'] = str(PersonName(dup))
            dup['address'] = str(Address(dup))

        return render_template(
            'con_dups.html',
            title='Name + Address Duplicates',
            dups=dups,
            cities=cities
        )


@con.route('/name_duplicates', methods=['GET', 'POST'])
def name_duplicates():
    if request.method == 'GET':
        dao = Dao(stateful=True)
        cities = turf_dao.get_city_names(dao)
        dups = con_dao.get_name_dups(dao)
        dao.close()
        for dup in dups:
            dup['name'] = str(PersonName(dup))
            dup['address'] = str(Address(dup))

        return render_template(
            'con_dups.html',
            title='Name Duplicates',
            dups=dups,
            cities=cities
        )


# @con.route('/dup_emails', methods=['GET'])
# def dup_emails():
#     contacts = con_dao.get_email_dups()
#     for contact in contacts:
#         contact['name'] = str(contact.name)
#         contact['address'] = str(contact.address)
#     return jsonify(dups=contacts)


# @con.route('/add_dups', methods=['POST'])
# def add_dups():
#     data = json.loads(request.form['params'])
#     try:
#         data = Contact.add_dups(data)
#         return jsonify(data=data)
#     except Exception as ex:
#         return jsonify(error=str(ex))


@con.route('/add_many', methods=['POST'])
def add_many():
    data = json.loads(request.form['params'])
    data = list(data.values())
    for rec in data:
        del rec['address']
        del rec['name']
        rec['bst_id'] = rec.pop('id')
    try:
        con_dao.add_many(data)
        return jsonify(msg='Records saved!')
    except Exception as ex:
        return jsonify(error=str(ex))


@con.route('/drop_many', methods=['POST'])
def drop_many():
    data = json.loads(request.form['params'])
    try:
        con_dao.drop_many(data['ids'])
        return jsonify(msg='Records removed!')
    except Exception as ex:
        return jsonify(error=str(ex))


@con.route('/update_many', methods=['POST'])
def update_many():
    data = json.loads(request.form['params'])
    contacts = [Contact(item) for item in data['data']]
    try:
        con_dao.update_many(contacts)
        return jsonify(msg='Records updated!')
    except Exception as ex:
        return jsonify(error=str(ex))


@con.route('/crewboard', methods=['GET', 'POST'])
def crewboard():
    if request.method == 'GET':
        dao = Dao(stateful=True)
        contacts = Contact.get_activists(dao)
        precincts = Precinct.get_all(dao)
        return render_template(
            'con_crewboard.html',
            title='Battle Stations',
            contacts=[contact.serialize() for contact in contacts],
            precincts=[precinct.serialize() for precinct in precincts]
        )
