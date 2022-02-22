import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

const query = gql`
  query FriendList($email: String!) {
    user(email: $email) {
      id
      friends {
        id
        name
      }
    }
  }
`;

const addFriendMutation = gql`
  mutation AddFriendMutation($userEmail: String!, $name: String!) {
    createFriend(userEmail: $userEmail, name: $name) {
      user {
        id
        friends {
          id
          name
        }
      }
    }
  }
`;

const FriendList = ({ userEmail }: { userEmail: string }) => {
  const [friendInput, setFriendInput] = useState("");
  const [addFriend] = useMutation(addFriendMutation);

  const { data } = useQuery(query, {
    variables: { email: userEmail },
  });

  const handleSubmit = () => {
    addFriend({
      variables: {
        userEmail,
        name: friendInput,
      },
    });
  };

  if (!data) {
    return null;
  }

  return (
    <div className="flex flex-col content-center">
      <div className="text-center">
        {data.user.friends.map((friend) => (
          <div>{friend.name}</div>
        ))}
      </div>
      <div className="w-20">
        <input
          onChange={(event) => setFriendInput(event.currentTarget.value)}
          value={friendInput}
        />
      </div>
      <button onClick={handleSubmit}>Add</button>
    </div>
  );
};

export default FriendList;
