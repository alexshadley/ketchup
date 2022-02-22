from models import User as UserModel
from models import Friend as FriendModel

import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyConnectionField, SQLAlchemyObjectType


class User(SQLAlchemyObjectType):
    class Meta:
        model = UserModel
        interfaces = (relay.Node, )

    def resolve_friends():
        


class Friend(SQLAlchemyObjectType):
    class Meta:
        model = FriendModel
        interfaces = (relay.Node, )


class Query(graphene.ObjectType):
    def resolve_user(root, info, id):
        return UserModel.query(id=id)

    def resolve_friend(root, info, id):
        return FriendModel.query(id=id)


schema = graphene.Schema(query=Query)
