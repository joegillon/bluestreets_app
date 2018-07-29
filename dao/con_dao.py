from dao.dao import get_dao
from models.contact import Contact


db_cols = [
    'last_name', 'first_name', 'middle_name', 'name_suffix',
    'nickname', 'last_name_meta', 'first_name_meta', 'nickname_meta',
    'birth_year', 'gender', 'email', 'phone1', 'phone2',
    'house_number', 'pre_direction', 'street_name', 'street_type',
    'suf_direction', 'unit', 'street_name_meta', 'city', 'zipcode',
    'precinct_id', 'voter_id', 'reg_date', 'bst_id'
]


@get_dao
def get_all(dao):
    sql = ("SELECT * FROM contacts "
           "ORDER BY last_name, first_name, middle_name")
    rex = dao.execute(sql)
    return [Contact(rec) for rec in rex]


@get_dao
def add_many(dao, data):
    contacts = [Contact(d) for d in data]
    values = [contact.get_values() for contact in contacts]
    dao.add_many('contacts', db_cols, values)


@get_dao
def update_many(dao, contacts):
    values = [contact.get_values() + (contact.id,) for contact in contacts]
    dao.update_many('contacts', db_cols, values)


@get_dao
def drop_many(dao, ids):
    dao.drop_many('contacts', ids)


@get_dao
def get_email_dups(dao):
    sql = ("SELECT * "
           "FROM contacts "
           "WHERE email IN "
           "(SELECT email "
           "FROM contacts "
           "WHERE email <> '' "
           "GROUP BY email HAVING COUNT(email) > 1) "
           "ORDER BY last_name, first_name, middle_name;")
    return dao.execute(sql)


@get_dao
def get_phone_dups(dao):
    p_clause_1 = "(SELECT phone1 FROM contacts " \
                 "WHERE phone1 <> '' " \
                 "GROUP BY phone1 HAVING COUNT(phone1) > 1) "
    p_clause_2 = "(SELECT phone2 FROM contacts " \
                 "WHERE phone2 <> '' " \
                 "GROUP BY phone2 HAVING COUNT(phone2) > 1) "
    sql = ("SELECT * FROM contacts "
           "WHERE phone1 IN %s "
           "OR phone1 IN %s "
           "OR phone2 IN %s "
           "OR phone2 IN %s "
           "ORDER BY last_name, first_name, middle_name;") % (
        p_clause_1, p_clause_2, p_clause_1, p_clause_2)
    return dao.execute(sql)


@get_dao
def get_name_addr_dups(dao):
    sql = ("SELECT * FROM contacts "
           "INNER JOIN "
           "(SELECT last_name_meta, street_name_meta FROM contacts "
           "GROUP BY (last_name_meta || ':' || street_name_meta) "
           "HAVING count(id) > 1) dup "
           "ON contacts.last_name_meta=dup.last_name_meta "
           "WHERE contacts.street_name_meta <> '' "
           "ORDER BY last_name, first_name, middle_name;")
    return dao.execute(sql)


@get_dao
def get_name_dups(dao):
    sql = ("SELECT contacts.* FROM contacts "
           "JOIN "
           "(SELECT last_name_meta, last_name, first_name_meta FROM contacts "
           "GROUP BY (last_name_meta || ':' || first_name_meta) "
           "HAVING count(id) > 1) dup "
           "ON contacts.last_name_meta=dup.last_name_meta "
           "AND substr(contacts.last_name,1,1)=substr(dup.last_name,1,1) "
           "AND contacts.first_name_meta LIKE (dup.first_name_meta || '%') "
           "ORDER BY last_name, first_name, middle_name;")
    return dao.execute(sql)


@get_dao
def get_activists(dao):
    sql = "SELECT * FROM contacts WHERE active=1 ORDER BY last_name, first_name, middle_name;"
    rex = dao.execute(sql)
    return [Contact(rec) for rec in rex] if rex else []


@get_dao
def get_by_precinct(dao, precinct_id):
    sql = ("SELECT * FROM contacts "
           "WHERE precinct_id=? "
           "AND active=1 "
           "ORDER BY last_name, first_name, middle_name;")
    vals = (precinct_id,)
    rex = dao.execute(sql, vals)
    return [Contact(rec) for rec in rex] if rex else []


@get_dao
def get_by_precinct_list(dao, precinct_list):
    sql = ("SELECT * FROM contacts "
           "WHERE precinct_id IN (%s) "
           "AND active=1 "
           "ORDER BY last_name, first_name, middle_name;") % (
        dao.get_param_str(precinct_list)
    )
    rex = dao.execute(sql, precinct_list)
    return [Contact(rec) for rec in rex] if rex else []
