from base64 import b64decode

def localize_id(id):
    """
    graphql ids look something like: RnJpZW5kOjE=
    
    To get this, we take the type of object it is (Friend) and the ID in the
    database (1), and put them together:
    'Friend:1'

    Then base-64 encode it:
    'RnJpZW5kOjE='

    graphql does this because it gives every object a unique id, which is very
    handy when caching. However, when running a query we'll need to have the db
    id, not the graphql query. This takes a graphql id, decodes from base 64
    and grabs the id portion. Essentially the reverse of the process above.
    """
    try:
        return b64decode(id).decode('utf-8').split(':')[1]
    except:
        raise Exception('Could not parse local id from string: ' + id)
