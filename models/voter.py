from dao.dao import get_dao
from models.address import Address
from models.person_name import PersonName
from utils.match import MatchLib


class Voter(object):

    def __init__(self, d=None):
        self.id = None
        self.name = None
        self.address = None
        self.birth_year = None
        self.gender = None
        self.voter_id = None
        self.reg_date = None
        self.perm_abs = None
        self.status = None
        self.uocava = None
        self.ballot = None
        if d:
            for attr in self.__dict__:
                if attr in d:
                    setattr(self, attr, d[attr])
            self.name = PersonName(d)
            self.address = Address(d)

    def __str__(self):
        return str(self.name)

    def serialize(self):
        d = {
            'voter_id': self.voter_id,
            'name': self.name.serialize(),
            'address': self.address.serialize(),
            'precinct_id': self.address.precinct_id,
            'birth_year': self.birth_year,
            'gender': self.gender,
            'reg_date': self.reg_date,
            'perm_abs': self.perm_abs if self.perm_abs else 'N',
            'status': self.status,
            'uocava': self.uocava
        }
        if 'score' in self.__dict__:
            d['score'] = self.__dict__['score']
        return d

    def get_values(self):
        return (
            self.name.last,
            self.name.first,
            self.name.middle,
            self.name.suffix,
            self.name.last_meta,
            self.name.first_meta,
            self.birth_year,
            self.gender,
            self.address.house_number,
            self.address.pre_direction,
            self.address.street_name,
            self.address.street_type,
            self.address.suf_direction,
            self.address.unit,
            self.address.metaphone,
            self.address.city,
            self.address.zipcode,
            self.address.precinct_id,
            self.voter_id,
            self.reg_date,
            self.perm_abs,
            self.status,
            self.uocava
        )

