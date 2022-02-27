#!/usr/bin/env python

from database import db_session, reset_db
from flask import Flask
from flask_cors import CORS
from schema import schema
from flask_graphql import GraphQLView
import sys
from pathlib import Path

app = Flask(__name__)
app.debug = True

app.add_url_rule(
    "/api/graphql", view_func=GraphQLView.as_view("graphql", schema=schema, graphiql=True)
)


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
