from database import Base
from sqlalchemy import Column, ForeignKey, Integer, String, Text, DateTime, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import backref, relationship


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    email = Column(Text, unique=True)

    # user settings
    nudge_frequency = Column(Text, default="weekly")
    outreach_frequency = Column(Text, default="monthly")

    # metadata
    user_creation_datetime = Column(DateTime, server_default=func.now())
    time_last_updated = Column(DateTime, onupdate=func.now())


class Friend(Base):
    __tablename__ = 'friend'
    id = Column(Integer, primary_key=True)
    user_email = Column(Text, ForeignKey('users.email'))
    name = Column(Text)
    last_emailed_time = Column(DateTime)
    time_last_updated = Column(DateTime, onupdate=func.now())
    friend_creation_time = Column(DateTime, server_default=func.now())
    frequency = Column(Text)
    is_friend_email_paused = Column(Boolean)
    friend_details = Column(Text)
