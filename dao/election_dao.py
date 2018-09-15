from dao.dao import get_dao


db_cols = ['id', 'code', 'date', 'description']


@get_dao
def get(dao, election_codes=None):
    sql = "SELECT * FROM elections "
    if election_codes:
        ec = '"' + '","'.join(election_codes) + '"'
        sql += "WHERE code IN (%s) " % (ec,)
    sql += "ORDER BY date DESC;"
    return dao.execute(sql)


@get_dao
def get_latest_date(dao):
    sql = "SELECT MAX(date) FROM elections;"
    rex = dao.execute(sql)
    return rex[0]['MAX(date)'] if rex else ''


def add_one(dao, election):
    sql = ("INSERT INTO elections "
           "(code, date, description) "
           "VALUES (?,?,?);")
    vals = (election['code'], election['date'], election['description'])
    return dao.execute(sql, vals)


def add_many(dao, elections):
    return dao.add_many(
        'elections',
        ['code', 'date', 'description'],
        [tuple(election.values()) for election in elections])


@get_dao
def add(dao, elections):
    if len(elections) == 1:
        return add_one(dao, elections[0])
    return add_many(dao, elections)
