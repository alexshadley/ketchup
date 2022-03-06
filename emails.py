import requests
import os
import datetime as dt
from database import db_session
from models import Friend, ReceivedEmail, User

DOMAIN_NAME = 'https://ketchup-main.herokuapp.com/'


def send_simple_message(recipient, subject, body):
    """Sends an email with the provided subject and body"""

    MAILGUN_API_KEY = os.environ.get('MAILGUN_API_KEY')
    MAILGUN_DOMAIN = os.environ.get('MAILGUN_DOMAIN')
    assert MAILGUN_API_KEY and MAILGUN_DOMAIN, (
        "You'll need to set your mailgun environment variables.")
    return requests.post(
        f"https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages",
        auth=("api", MAILGUN_API_KEY),
        data={"from": f"Excited User <mailgun@{MAILGUN_DOMAIN}>",
              "to": [recipient],
              "subject": subject,
              "text": body})


def route_mailgun_to_api(email_post_route):
    """
    Send a message to mailgun letting them know how to forward
    emails they receive
    """
    MAILGUN_API_KEY = os.environ.get('MAILGUN_API_KEY')
    assert MAILGUN_API_KEY, (
        "You'll need to set your mailgun environment variables.")
    return requests.post(
        "https://api.mailgun.net/v3/routes",
        auth=("api", MAILGUN_API_KEY),
        data={"priority": 0,
              "description": f"forward all routes to {email_post_route}",
              "expression": "catch_all()",
              "action": [f"forward('{email_post_route}')", "stop()"]})


def get_notes_from_text(txt):
    """
    TODO: This isn't robust at all

    Expects a format where each friend to note starts with the friend followed by
    new-line, then the note (with potentially several new-lines), and ends with a blank line

    ex:
        Alex
        Bought a new dog today
        Drank some coffee
        His grandma's birthday next month

        Harry
        Joined an acting class
    """
    friend_to_note = {}
    friend = None
    note = None
    for ln in txt.split('\n'):
        # Surely some big brain way to do this with regex or something
        if friend is None:
            friend = ln
        elif note is None:
            note = ln
        elif ln != '':
            note += ln
        else:
            friend_to_note[friend] = note
            friend = None
            note = None
    if friend and note:
        friend_to_note[friend] = note
    return friend_to_note


def process_received_email_raw_data(data_dict):
    sender_address = data_dict.get("sender")
    subject = data_dict.get("Subject")
    receieved_time = dt.datetime.fromtimestamp(data_dict.get("timestamp", 0))
    simple_text = data_dict.get("stripped-text")
    full_body_html = data_dict.get("body-html")
    email = ReceivedEmail(
        sender_address=sender_address,
        subject=subject,
        receieved_time=receieved_time,
        simple_text=simple_text,
        full_body_html=full_body_html
    )
    db_session.add(email)
    db_session.commit()
    not_found = []
    no_notes = []
    found = []
    user = User.query.where(User.email == sender_address).fetchone()
    if user is None:
        print(f"Email received from unregistered user {sender_address}")
        send_simple_message(sender_address, "We don't recognize your account",
                            f"We recieved an email from this address, but we don't seem to have you're email registered at {DOMAIN_NAME}")

    # Create a dict of exisiting friends in the database which we'll update
    registered_friends = {f.name: f for f in Friend.query.filter_by(
        user_email=user.email).all()}

    # For each friend and note from the email, update the db rows
    for friend, note in get_notes_from_text(simple_text):
        if friend not in registered_friends:
            not_found.append(friend)  # keep track of friends we don't have
            continue
        registered_friends[friend].last_reached_out_to = receieved_time
        if note is not None:
            registered_friends[friend].last_update_note = note
            found.append(friend)
        else:
            no_notes.append(friend)

    db_session.add_all(registered_friends)
    db_session.commit()  # Should we only have one db commit per fn?
    send_simple_message(
        sender_address,
        "Updates Noted!",
        f"We've updated records for {', '.join(found)} " +
        f"and noted that you've contacted {', '.join(no_notes)}")
