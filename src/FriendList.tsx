import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import { Frequency } from "./constants";

const query = gql`
  query FriendList($email: String!) {
    user(email: $email) {
      id
      friends {
        id
        name
        lastOutreachSent
      }
    }
  }
`;

const addFriendMutation = gql`
  mutation AddFriendMutation(
    $userEmail: String!
    $name: String!
    $frequency: String!
  ) {
    addFriend(
      userEmail: $userEmail
      name: $name
      frequency: $frequency
      friendDetails: ""
    ) {
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

const addDays = (date: Date, days: number) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

type Friend = {
  id: string;
  name: string;
  lastOutreachSent: string | null;
};

const FriendList = ({ userEmail }: { userEmail: string }) => {
  const [friendInput, setFriendInput] = useState("");
  const [addFriend] = useMutation(addFriendMutation);
  const [removeFriend] = useMutation(removeFriendMutation);
  const [frequency, setFrequency] = useState(Frequency.Weekly);

  const { data } = useQuery(query, {
    variables: { email: userEmail },
  });

  const handleSubmit = () => {
    addFriend({
      variables: {
        userEmail,
        name: friendInput,
        frequency: frequency.toString(),
      },
    });
    setFriendInput("");
  };

  function createListOfFrequencyOptions(options) {
    let optionList = [];
    for (let val in options) {
      optionList.push(
        <option value={val} label={options[val]}>
          {" "}
          {options[val]}
        </option>
      );
    }
    return optionList;
  }

  if (!data) {
    return null;
  }

  const getOutreachDates = (friend: Friend) => {
    if (friend.lastOutreachSent) {
      const lastOutreach = friend.lastOutreachSent.split("T")[0];
      const nextOutreach = addDays(new Date(friend.lastOutreachSent), 30);
      return {
        lastOutreach,
        nextOutreach:
          nextOutreach.getTime() - new Date().getTime() > 0
            ? nextOutreach.toISOString().split("T")[0]
            : "now!",
      };
    } else {
      return { lastOutreach: "never", nextOutreach: "now!" };
    }
  };

  const FriendRow = ({ friend }: { friend: Friend }) => {
    const { lastOutreach, nextOutreach } = getOutreachDates(friend);

    return (
      <tr>
        <td>{friend.name}</td>
        <td>{lastOutreach}</td>
        <td>{nextOutreach}</td>
        <td>
          <Trash
            style={{ cursor: "pointer" }}
            onClick={() => {
              removeFriend({
                variables: {
                  id: friend.id,
                },
              });
            }}
          />
        </td>
      </tr>
    );
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <h4>Friends</h4>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Last outreach</th>
            <th>Next outreach</th>
          </tr>
        </thead>
        <tbody>
          {data.user.friends.map((f) => (
            <FriendRow friend={f as Friend} />
          ))}
        </tbody>
      </Table>
      <div style={{ display: "flex", gap: "10px" }}>
        <select
          value={frequency}
          onChange={(event) =>
            setFrequency(event.currentTarget.value as Frequency)
          }
        >
          {createListOfFrequencyOptions(Frequency)}
        </select>
      </div>
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
