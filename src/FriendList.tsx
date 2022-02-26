import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";

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
    addFriend(userEmail: $userEmail, name: $name) {
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

const removeFriendMutation = gql`
  mutation RemoveFriendMutation($id: ID!) {
    removeFriend(id: $id) {
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
  const [removeFriend] = useMutation(removeFriendMutation);

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
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Last outreach</th>
          </tr>
        </thead>
        <tbody>
          {data.user.friends.map((f) => (
            <tr>
              <td>{f.name}</td>
              <td>never</td>
              <td>
                <Trash
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    removeFriend({
                      variables: {
                        id: f.id,
                      },
                    });
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div style={{ display: "flex", gap: "6px" }}>
        <Form.Control
          onChange={(event) => setFriendInput(event.currentTarget.value)}
          value={friendInput}
        />
        <Button onClick={handleSubmit}>Add</Button>
      </div>
    </div>
  );
};

export default FriendList;
