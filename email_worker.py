from database import db_session
from emails import send_simple_message
from models import Friend, User
from util import format_email


def send_emails():
    """
    Super basic, sends an email to every user telling them to message all of
    their friends. Once we get more certainty around how we want to handle
    frequencies we can make this less dumb.
    """
    users = User.query.all()

    for user in users:
        friends = Friend.query.filter_by(user_email=user.email).all()

        message = format_email(user.email, [f.name for f in friends])
        send_simple_message(user.email, 'Ketchup Time', message)
        print(f'sent email to {user.email}')

    print(f'Sent emails to {len(users)} users')


if __name__ == '__main__':
    send_emails()
