from models import User as UserModel
from models import Friend as FriendModel

import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType

from util import localize_id
from database import db_session


class Friend(SQLAlchemyObjectType):
    class Meta:
        model = FriendModel
        interfaces = (relay.Node, )


class User(SQLAlchemyObjectType):
    class Meta:
        model = UserModel
        interfaces = (relay.Node, )

    friends = graphene.List(Friend)

    def resolve_friends(self, info):
        return FriendModel.query.filter(FriendModel.user_email == self.email).all()


class CreateOrGetUser(graphene.Mutation):
    class Arguments:
        email = graphene.String()

    user = graphene.Field(User)

    def mutate(root, info, email):
        user = UserModel.query.filter_by(email=email).one_or_none()
        if user:
            return dict(user=user)

        new_user = UserModel(email=email)
        db_session.add(new_user)
        db_session.commit()

        return dict(user=new_user)


class UpdateFriendDetail(graphene.Mutation):
    class Arguments:
        id = graphene.ID()
        last_update_note = graphene.String()
        user_email = graphene.String()

    user = graphene.Field(User)

    def mutate(root, info, id, last_update_note, user_email):
        local_id = localize_id(id)

        friend = FriendModel.query.filter_by(id=local_id).one_or_none()
        friend.last_update_note = last_update_note
        db_session.commit()

        return dict(user=UserModel.query.filter(UserModel.email == user_email).one_or_none())


class AddFriend(graphene.Mutation):
    class Arguments:
        user_email = graphene.String()
        name = graphene.String()
        frequency = graphene.String()
        friend_details = graphene.String()

    user = graphene.Field(User)

    def mutate(root, info, user_email, name, frequency, friend_details):
        friend = FriendModel(user_email=user_email, name=name,
                             frequency=frequency, friend_details=friend_details, is_friend_email_paused=False)
        db_session.add(friend)
        db_session.commit()

        return dict(user=UserModel.query.filter(UserModel.email == user_email).one_or_none())


class RemoveFriend(graphene.Mutation):
    class Arguments:
        id = graphene.ID()

    user = graphene.Field(User)

    def mutate(root, info, id):
        local_id = localize_id(id)

        friend = FriendModel.query.filter_by(id=local_id).one_or_none()
        user_email = friend.user_email
        db_session.delete(friend)
        db_session.commit()

        return dict(user=UserModel.query.filter(UserModel.email == user_email).one_or_none())


class SetUserSettings(graphene.Mutation):
    class Arguments:
        email = graphene.String()
        nudge_frequency = graphene.String()
        outreach_frequency = graphene.String()

    user = graphene.Field(User)

    def mutate(root, info, email, nudge_frequency, outreach_frequency):
        user = UserModel.query.filter_by(email=email).one_or_none()
        user.nudge_frequency = nudge_frequency
        user.outreach_frequency = outreach_frequency
        db_session.commit()

        return dict(user=user)


class Query(graphene.ObjectType):
    user = graphene.Field(User, email=graphene.String(required=True))
    friend = graphene.Field(Friend, id=graphene.ID(required=True))

    def resolve_user(root, info, email):
        return UserModel.query.filter(UserModel.email == email).one_or_none()

    def resolve_friend(root, info, id):
        local_id = localize_id(id)
        return FriendModel.query.filter(FriendModel.id == local_id).one_or_none()


class Mutation(graphene.ObjectType):
    create_or_get_user = CreateOrGetUser.Field()
    add_friend = AddFriend.Field()
    remove_friend = RemoveFriend.Field()
    set_user_settings = SetUserSettings.Field()
    update_friend_detail = UpdateFriendDetail.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
