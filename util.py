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


ADD_FRIEND = "{index}. {friend_name} \n"


def format_email(users_name, list_of_friends):
    file = open('email_templates/default_email_template.txt', 'r')
    email_template = file.read()
    friends = ""
    for index, friend in enumerate(list_of_friends):
        friends += ADD_FRIEND.format(index=index+1, friend_name=friend)

    # Add all the info to the email template
    email_template = email_template.format(
        users_name=users_name, friends=friends)

    file.close()
    return email_template


print(format_email("Alex", ["Harry", "Trent"]))
