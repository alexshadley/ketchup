from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker

engine = create_engine(
    'postgresql://alex@localhost:5432/crm', convert_unicode=True)
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()


def init_db():
    # import all modules here that might define models so that
    # they will be registered properly on the metadata.  Otherwise
    # you will have to import them first before calling init_db()
    from models import User, Friend
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    alex = User(email="shadleyalex@gmail.com")
    db_session.add(alex)
    for name in ['Harry', 'Emilia', 'Trent']:
        db_session.add(Friend(user_id=alex.id, name=name))

    db_session.commit()
