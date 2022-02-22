from database import Base
from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import backref, relationship


class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    email = Column(String)

class Friend(Base):
    __tablename__ = 'friend'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'))

    name = Column(Text)
