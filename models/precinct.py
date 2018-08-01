class Precinct(object):

    db_cols = [
        'county_code', 'jurisdiction_code',
        'ward', 'precinct', 'state_house', 'state_senate',
        'congress', 'county_commissioner', 'school_precinct'
    ]

    def __init__(self, d=None):
        self.id = None
        self.county_code = ''
        self.county_name = ''
        self.jurisdiction_code = ''
        self.jurisdiction_name = ''
        self.ward = ''
        self.precinct = ''
        self.slots = 0
        self.state_house = ''
        self.state_senate = ''
        self.congress = ''
        self.county_commissioner = ''
        self.school_precinct = ''
        if d:
            for attr in self.__dict__:
                if attr in d:
                    setattr(self, attr, d[attr])

    def __str__(self):
        return '%s: %s: %s' % (
            self.jurisdiction_code,
            self.ward, self.precinct
        )

    def serialize(self):
        return {
            'id': self.id,
            'jurisdiction_code': self.jurisdiction_code,
            'jurisdiction_name': self.jurisdiction_name,
            'ward': self.ward,
            'precinct': self.precinct,
            'slots': self.slots,
            'state_house': self.state_house,
            'state_senate': self.state_senate,
            'congress': self.congress,
            'county_commissioner': self.county_commissioner,
            'school_precinct': self.school_precinct
        }
