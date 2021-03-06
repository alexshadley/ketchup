#!/usr/bin/env python

from database import db_session, reset_db
from flask import Flask, request, Response
from flask_cors import CORS
from schema import schema
from flask_graphql import GraphQLView
import sys
from pathlib import Path
from emails import DOMAIN_NAME, route_mailgun_to_api, process_received_email_raw_data
import json

app = Flask(__name__)
app.debug = True

app.add_url_rule(
    "/api/graphql", view_func=GraphQLView.as_view("graphql", schema=schema, graphiql=True)
)


@app.route("/api/receive_email", methods=['POST'])
def receive_email():
    content_type = request.headers.get('Content-Type')
    if request.json is not None:
        data_dict = request.json
    elif request.form is not None:
        data_dict = request.form
    else:
        raise NotImplementedError(
            f"Don't know what to do with a call of type: {content_type}")

    process_received_email_raw_data(data_dict)

    return ""  # The decorator will turn this into the body of a 200 response


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


if __name__ == "__main__":
    assert len(
        sys.argv) > 1, f"""Use one or more of:
    --reset-db
    --test-populate
    --start-server
    when calling {Path(__file__).name}"""
    if "--reset-db" in sys.argv:
        reset_db("--test-populate" in sys.argv)
    if "--start-server" in sys.argv:
        app.run(port=4321)
    if "--route-incoming-emails" in sys.argv:
        route_mailgun_to_api(
            f'{DOMAIN_NAME}/api/receive_email')
