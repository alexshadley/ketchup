#!/usr/bin/env python

from database import db_session, init_db
from flask import Flask
from flask_cors import CORS
from schema import schema

from flask_graphql import GraphQLView

app = Flask(__name__)
app.debug = True
CORS(app)

example_query = """
{
  allEmployees(sort: [NAME_ASC, ID_ASC]) {
    edges {
      node {
        id
        name
        department {
          id
          name
        }
        role {
          id
          name
        }
      }
    }
  }
}
"""


app.add_url_rule(
    "/", view_func=GraphQLView.as_view("graphql", schema=schema, graphiql=True)
)


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


if __name__ == "__main__":
    init_db()
    app.run()
