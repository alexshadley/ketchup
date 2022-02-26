import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import Table from "./Table";
import { Button } from "react-bootstrap";

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
    <div className="flex flex-col items-center gap-2">
      <Table
        headers={["Name", "Last outreach"]}
        data={data.user.friends.map((f) => [f.name, "never"])}
      />
      <div className="flex gap-4">
        <input
          className="border rounded p-2"
          onChange={(event) => setFriendInput(event.currentTarget.value)}
          value={friendInput}
        />
        <Button onClick={handleSubmit}>Add</Button>
      </div>
    </div>
  );
};

export default FriendList;
