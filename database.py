from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
import os


if 'DATABASE_URL' in os.environ:
    db_uri = os.environ['DATABASE_URL']

    #  See: https://stackoverflow.com/questions/62688256/
    db_uri = db_uri.replace("postgres://", "postgresql://", 1)
else:
    # stupid hack: get username from environment, assume this is the db username as well
    mac_user = os.environ['USER']
    db_uri = f'postgresql://{mac_user}@localhost:5432/crm'

engine = create_engine(db_uri)
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()


two_weeks_ago = datetime.now() - timedelta(days=14)
six_weeks_ago = datetime.now() - timedelta(days=7*6)


def reset_db(test_populate=True):
    # import all modules here that might define models so that
    # they will be registered properly on the metadata.  Otherwise
    # you will have to import them first before calling init_db()
    from models import User, Friend
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    if test_populate:
        alex = User(email="shadleyalex@gmail.com")
        trent = User(email="trpotter72@gmail.com")
        db_session.add_all([alex, trent])
        db_session.commit()
        for name, last_outreach in [('Harry', two_weeks_ago), ('Emilia', six_weeks_ago), ('Trent', None)]:
            db_session.add(Friend(user_email=alex.email,
                                  name=name, last_outreach_sent=last_outreach, friend_details="Awesome friends!!"))
            db_session.add(Friend(user_email=alex.email,
                                  name=name, last_outreach_sent=last_outreach, friend_details="Lame ass friends!!"))
        for name, last_outreach in [('Harry', two_weeks_ago), ('Emilia', six_weeks_ago), ('Alex', None)]:
            db_session.add(Friend(user_email=trent.email,
                                  name=name, last_outreach_sent=last_outreach, friend_details="Kinda Awesome friends!!"))

    db_session.commit()
