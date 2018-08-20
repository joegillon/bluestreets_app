from dao.dao import get_dao


@get_dao
def get_neighborhoods(dao):
    sql = "SELECT * FROM neighborhoods;"
    return dao.execute(sql)


@get_dao
def get_turf_types(dao):
    sql = "SELECT * FROM neighborhood_type;"
    return dao.execute(sql)


@get_dao
def get_my_county(dao):
    sql = "SELECT DISTINCT county_code, county_name FROM precincts"
    return dao.execute(sql)


@get_dao
def get_jurisdictions(dao):
    sql = ("SELECT DISTINCT jurisdiction_code, jurisdiction_name "
           "FROM precincts;")
    return dao.execute(sql)


@get_dao
def get_wards(dao, jurisdiction_code):
    sql = ("SELECT DISTINCT(ward) FROM precincts "
           "WHERE jurisdiction_code=?;")
    vals = (jurisdiction_code,)
    return dao.execute(sql, vals)


@get_dao
def get_precincts(dao, jurisdiction_code=None, ward_no=None):
    sql = "SELECT * FROM precincts "
    vals = None
    if jurisdiction_code:
        sql += " WHERE jurisdiction_code=?"
        vals = (jurisdiction_code,)
    if ward_no:
        sql += " AND ward=?"
        vals = (jurisdiction_code, ward_no)
    sql += 'ORDER BY jurisdiction_name, ward, precinct;'
    return dao.execute(sql, vals)


@get_dao
def get_turf(dao, addr):
    sql = ("SELECT * FROM streets "
           "WHERE street_name_meta LIKE ? "
           "AND street_name LIKE ? "
           "AND ? BETWEEN block_low AND block_high "
           "AND odd_even IN (?, ?) ")
    vals = [
        addr.metaphone + '%',
        addr.street_name[0] + '%',
        addr.house_number,
        "B", addr.odd_even
    ]

    if addr.pre_direction:
        sql += "AND pre_direction=? "
        vals.append(addr.pre_direction)
    if addr.suf_direction:
        sql += "AND suf_direction=? "
        vals.append(addr.suf_direction)

    if addr.zipcode:
        sql += "AND zipcode LIKE ? "
        vals.append(addr.zipcode[0:-1] + '%')
    elif addr.city:
        sql += "AND city=? "
        vals.append(addr.city)

    return dao.execute(sql, vals)


@get_dao
def get_streets(dao, jurisdiction_code, ward, precinct):
    sql = ("SELECT street_name, street_type "
           "FROM streets "
           "WHERE jurisdiction_code=? "
           "AND ward=? "
           "AND precinct=? "
           "GROUP BY street_name, street_type;")
    vals = [jurisdiction_code, ward, precinct]
    return dao.execute(sql, vals)


@get_dao
def get_house_nums(dao, county_code, jurisdiction, street_name, street_type):
    sql = ("SELECT * "
           "FROM streets "
           "WHERE county_code=? "
           "AND jurisdiction_code=? "
           "AND street_name=? "
           "AND street_type=? "
           "GROUP BY house_num_low, house_num_high;")
    vals = [
        county_code, jurisdiction, street_name, street_type
    ]
    return dao.execute(sql, vals)

