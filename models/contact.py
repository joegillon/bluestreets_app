from models.person_name import PersonName
from models.address import Address
from models.contact_info import ContactInfo


class Contact(object):

    def __init__(self, d=None):
        self.id = None
        self.name = None
        self.birth_year = None
        self.gender = ''
        self.info = None
        self.address = None
        self.voter_id = None
        self.reg_date = ''
        self.bst_id = None
        if d:
            for attr in self.__dict__:
                if attr in d:
                    setattr(self, attr, d[attr])
            self.name = PersonName(d)
            self.address = Address(d)
            self.info = ContactInfo(d)

    def __str__(self):
        return str(self.name)

    def serialize(self):
        return {
            'name': self.name.serialize(),
            'whole_name': str(self.name),
            'birth_year': self.birth_year,
            'gender': self.gender,
            'contact': self.info.serialize(),
            'address': self.address.serialize(),
            'voter_id': self.voter_id,
            'reg_date': self.reg_date,
            'id': self.id,
            'bst_id': self.bst_id
        }

    def get_values(self):
        return (
            self.name.last,
            self.name.first,
            self.name.middle,
            self.name.suffix,
            self.name.nickname,
            self.name.last_meta,
            self.name.first_meta,
            self.name.nickname_meta,
            self.birth_year,
            self.gender,
            self.info.email,
            self.info.phone1,
            self.info.phone2,
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
            self.bst_id
        )

    def copy_voter(self, voter):
        if not self.name.nickname:
            self.name.nickname = self.name.first
        self.name.last = voter.name.last
        self.name.first = voter.name.first
        self.name.middle = voter.name.middle
        self.name.suffix = voter.name.suffix
        self.address.house_number = voter.address.house_number
        self.address.pre_direction = voter.address.pre_direction
        self.address.street_name = voter.address.street_name
        self.address.street_type = voter.address.street_type
        self.address.suf_direction = voter.address.suf_direction
        self.address.unit = voter.address.unit
        self.address.city = voter.address.city
        self.address.zipcode = voter.address.zipcode
        self.address.precinct_id = voter.address.precinct_id
        self.gender = voter.gender
        self.birth_year = voter.birth_year
        self.reg_date = voter.reg_date
        self.voter_id = voter.voter_id

