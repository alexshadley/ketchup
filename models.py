from database import Base
from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import backref, relationship


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    email = Column(Text, unique=True)

class Friend(Base):
    __tablename__ = 'friend'
    id = Column(Integer, primary_key=True)
    user_email = Column(Text, ForeignKey('users.email'))

    name = Column(Text)
