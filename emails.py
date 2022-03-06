from re import sub
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
    if not (MAILGUN_API_KEY and MAILGUN_DOMAIN):
        print("!!!!!You'll need to set your mailgun environment variables to send.!!!!!!")
        print("Subject\n", subject)
        print("Body\n", body, flush=True)
        return
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

        Emilia
        Has a new step great-uncle
        Tried oreos for the first time
    """
    friend_to_note = {}
    friend = None
    note = None
    for friend_block in txt.strip().split('\n\n'):
        # Surely some big brain way to do this with regex or something
        parts = friend_block.strip().split('\n', 1)
        friend = parts[0]
        note = None if len(parts) < 2 else parts[1]
        friend_to_note[friend] = note
    return friend_to_note


def process_received_email_raw_data(data_dict):
    sender_address = data_dict.get("sender")
    subject = data_dict.get("Subject")
    received_time = dt.datetime.fromtimestamp(
        int(data_dict.get("timestamp", 0)))
    simple_text = data_dict.get("stripped-text")
    full_body_html = data_dict.get("body-html")
    email = ReceivedEmail(
        sender_address=sender_address,
        subject=subject,
        received_time=received_time,
        simple_text=simple_text,
        full_body_html=full_body_html
    )
    db_session.add(email)
    db_session.commit()

    user = User.query.where(User.email == sender_address).first()
    if user is None:
        print(f"Email received from unregistered user: {sender_address}")
        send_simple_message(sender_address,  "We don't recognize your account",
                            "We recieved an email from this address," +
                            "but we don't seem to have your email " +
                            f"registered at {DOMAIN_NAME}")
        return

    # Create a dict of exisiting friends in the database which we'll update
    registered_friends = {f.name: f for f in Friend.query.filter_by(
        user_email=user.email).all()}

    not_found = []
    no_notes = []
    found = []
    # For each friend and note from the email, update the db rows
    for friend, note in get_notes_from_text(simple_text).items():
        if friend not in registered_friends:
            not_found.append(friend)  # keep track of friends we don't have
            continue
        registered_friends[friend].last_reached_out_to = received_time
        if note is not None:
            registered_friends[friend].last_update_note = note
            found.append(friend)
        else:
            no_notes.append(friend)

    db_session.add_all(registered_friends.values())
    db_session.commit()  # Should we only have one db commit per fn?

    # Stupid, someone make a better email template
    send_simple_message(
        sender_address,
        "Updates Noted!",
        (f"We've:\n\tupdated notes for {', '.join(found)}" if found else "") +
        (f"\n\tnoted that you've contacted {', '.join(no_notes)} without notes" if no_notes else "") +
        (f"\n\tnoticed that you mentioned {', '.join(not_found)}. We don't know them." if not_found else ""))
