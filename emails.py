import requests
import os

# TODO: Use defaults if running locally so you don't have to configure.
# Quickly find the correct environment variables by running `heroku config` and then
# setting them manually.  If you're not setup with heroku, check out the README
MAILGUN_API_KEY = os.environ.get('MAILGUN_API_KEY')
MAILGUN_DOMAIN = os.environ.get('MAILGUN_DOMAIN')
MAILGUN_PUBLIC_KEY = os.environ.get('MAILGUN_PUBLIC_KEY')

print(MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_PUBLIC_KEY)

assert MAILGUN_API_KEY and MAILGUN_DOMAIN and MAILGUN_PUBLIC_KEY, """
\tYou'll need to set your mailgun environment variables.
\tSee emails.py for more info."""


def send_simple_message(recipient, subject, body):
    """Sends an email with the provided subject and body"""
    return requests.post(
        f"https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages",
        auth=("api", MAILGUN_API_KEY),
        data={"from": f"Excited User <mailgun@{MAILGUN_DOMAIN}>",
              "to": [recipient],
              "subject": subject,
              "text": body})


def create_route(email_post_route):
    """Send a message to mailgun letting them know how to reply to emails it receives"""
    return requests.post(
        "https://api.mailgun.net/v3/routes",
        auth=("api", MAILGUN_API_KEY),
        data={"priority": 0,
              "description": f"forward all routes to {email_post_route}",
              "expression": "catch_all()",
              "action": [f"forward('{email_post_route}')", "stop()"]})
