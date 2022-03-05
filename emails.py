import requests
import os


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
