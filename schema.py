from models import User as UserModel
from models import Friend as FriendModel

import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType

from util import localize_id


class Friend(SQLAlchemyObjectType):
    class Meta:
        model = FriendModel
        interfaces = (relay.Node, )


class User(SQLAlchemyObjectType):
    class Meta:
        model = UserModel
        interfaces = (relay.Node, )

    hello = graphene.String()
    def resolve_hello(self, info):
        return 'world'

    friends = graphene.List(Friend)
    def resolve_friends(self, info):
        return FriendModel.query.filter(FriendModel.user_id == self.id).all()


class Query(graphene.ObjectType):
    user = graphene.Field(User, email=graphene.String(required=True))
    friend = graphene.Field(Friend, id=graphene.ID(required=True))

    def resolve_user(root, info, email):
        return UserModel.query.filter(UserModel.email==email).one_or_none()
    def resolve_friend(root, info, id):
        local_id = localize_id(id)
        return FriendModel.query.filter(FriendModel.id==local_id).one_or_none()


schema = graphene.Schema(query=Query)
