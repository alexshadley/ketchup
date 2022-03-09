from sqlalchemy import Integer
from database import db_session
from emails import send_simple_message
from models import Friend, User
from util import format_email
from datetime import datetime


# keep in sync with constants.ts
frq_days = {
    'daily': 1,
    'weekly': 7,
    'monthly': 30,
    'quarterly': 90,
}

# no more than this many friends per outreach
OUTREACH_LIMIT = 3


def should_nudge_for_friend(user, friend):
    if not friend.last_reached_out_to:
        return True

    days_since_last_outreach = (
        datetime.now() - friend.last_reached_out_to).days
    return frq_days[user.outreach_frequency] < days_since_last_outreach


def send_emails():
    """
    Super basic, sends an email to every user telling them to message all of
    their friends. Once we get more certainty around how we want to handle
    frequencies we can make this less dumb.
    """
    users = User.query.all()
    to_email = [user for user in users if
                user.last_nudged is None or
                (datetime.now() - user.last_nudged).days >=
                frq_days[user.nudge_frequency]]
    for user in to_email:
        # Skip a nudge if we've nudged them within their notification prefs
        friends = [f for f in Friend.query.filter_by(
            user_email=user.email).all() if should_nudge_for_friend(user, f)]

        if len(friends) > OUTREACH_LIMIT:
            friends = friends[:OUTREACH_LIMIT]

        message = format_email(user.email, [f.name for f in friends])
        send_simple_message(user.email, 'Ketchup Time', message)
        print(
            f'sent email to {user.email} for friends {[f.name for f in friends]}')
        user.last_nudged = datetime.now()
        db_session.add(user)
    db_session.commit()
    print(f'Sent emails to {len(to_email)} users')


if __name__ == '__main__':
    send_emails()
