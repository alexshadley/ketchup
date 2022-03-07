import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { Button, Form, Table, Modal, InputGroup, FormControl } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import { Frequency, FRQ_DAYS } from "./constants";
import ModalDetails from "./ModalDetails"

const query = gql`
  query FriendList($email: String!) {
    user(email: $email) {
      id
      outreachFrequency
      friends {
        id
        name
        lastOutreachSent
        lastUpdateNote
        timeLastUpdated
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
          timeLastUpdated
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
  lastUpdateNote: string;
  timeLastUpdated: string;
};

const FriendList = ({ email }: { email: string }) => {
  const [friendInput, setFriendInput] = useState("");
  const [addFriend] = useMutation(addFriendMutation);
  const [removeFriend] = useMutation(removeFriendMutation);
  const [frequency, setFrequency] = useState(Frequency.Weekly);
  const [show, setShow] = useState(false);
  const [friendTarget, setFriendTarget] = useState("");

  function modalFlip() {
    setFriendTarget("");
    setShow(!show);
  }

  const { data } = useQuery(query, {
    variables: { email },
  });

  const handleSubmit = () => {
    addFriend({
      variables: {
        userEmail: email,
        name: friendInput,
        frequency: frequency.toString(),
      },
    });
    setFriendInput("");
  };

  if (!data) {
    return null;
  }

  const getOutreachDates = (friend: Friend) => {
    if (friend.lastOutreachSent) {
      const lastOutreach = friend.lastOutreachSent.split("T")[0];
      const nextOutreach = addDays(
        new Date(friend.lastOutreachSent),
        FRQ_DAYS[data.user.outreachFrequency]
      );
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
        <td>{friend.lastUpdateNote}
        </td>
        <td><button type="button" onClick={() => { setShow(true); setFriendTarget(friend.id) }}>
          Edit details
              </button>

        </td>
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
      </tr >
    );
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <h4>Friends</h4>
      <ModalDetails data={data} email={email} show={show} flipModal={modalFlip} currentFriendTarget={friendTarget}></ModalDetails>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Last outreach</th>
            <th>Next outreach</th>
            <th>Friend Details</th>
            <th>Edit Friend Details</th>
          </tr>
        </thead>
        <tbody>
          {data.user.friends.map((f) => (
            <FriendRow friend={f as Friend} />
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

    </div >
  );
};

export default FriendList;
