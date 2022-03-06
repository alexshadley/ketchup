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
    mark_outreach_automatically = Column(Boolean, default=False)

    # metadata
    user_created_ts = Column(DateTime, server_default=func.now())


class Friend(Base):
    __tablename__ = 'friend'
    id = Column(Integer, primary_key=True)
    user_email = Column(Text, ForeignKey('users.email'))
    name = Column(Text)

    # last time the user was sent an outreach notification
    last_outreach_sent = Column(DateTime)

    # last time a user responded with an update on this friend
    last_reached_out_to = Column(DateTime)

    # Note most recently proviced by user on this friend
    last_update_note = Column(Text)

    # unused
    time_last_updated = Column(DateTime, onupdate=func.now())
    friend_creation_time = Column(DateTime, server_default=func.now())
    frequency = Column(Text)
    is_friend_email_paused = Column(Boolean)
    friend_details = Column(Text)


class ReceivedEmail(Base):
    __tablename__ = 'received_email'
    id = Column(Integer, primary_key=True)
    sender_address = Column(Text)
    subject = Column(Text)
    received_time = Column(DateTime)
    simple_text = Column(Text)
    full_body_html = Column(Text)
