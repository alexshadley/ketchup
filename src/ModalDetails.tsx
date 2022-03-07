import { gql, useMutation, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { Button, Form, Table, Modal, InputGroup, FormControl } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import { Frequency, FRQ_DAYS } from "./constants";

const updateFriendDetailMutation = gql`
  mutation UpdateFriendDetailMutation($id: ID! , $lastUpdateNote: String!, $userEmail: String!) {
    updateFriendDetail(id: $id, lastUpdateNote: $lastUpdateNote, userEmail: $userEmail) {
      user {
        id
        friends {
          id
          name
          lastUpdateNote
          timeLastUpdated
        }
      }
    }
  }
`;

const ModalDetails = ({ data, email, currentFriendTarget, show, flipModal }: { data: any, email: String, currentFriendTarget: String, show: boolean, flipModal: any }) => {
    const [lastUpdateNote, setlastUpdateNote] = useState("");
    const [updateFriendDetail] = useMutation(updateFriendDetailMutation);
    const [friendName, setFriendName] = useState("");
    const [lastUpdated, setLastUpdated] = useState("");



    useEffect(() => {
        data.user.friends.forEach((f) => { if (String(f.id) == currentFriendTarget) { setlastUpdateNote(f.lastUpdateNote != null ? f.lastUpdateNote : ""); setFriendName(f.name); setLastUpdated(f.timeLastUpdated); } });
    }, [currentFriendTarget]);

    function onSaveUpdateDescription() {
        updateFriendDetail({ variables: { id: currentFriendTarget, lastUpdateNote: lastUpdateNote, userEmail: email }, });
        setlastUpdateNote("")
    }

    return (<div>
        <Modal show={show} onHide={() => { setlastUpdateNote(""); flipModal() }}>
            <Modal.Header closeButton>
                <Modal.Title>Update notes on {friendName}</Modal.Title>
            </Modal.Header>
            <Modal.Body> <i>{friendName}'s note was last updated on {lastUpdated != null ? (lastUpdated.split("T")[0]) : "Unknown"} </i>
                <div>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Control as="textarea" rows={3}
                                onChange={(event) => setlastUpdateNote(String(event.currentTarget.value))}
                                value={lastUpdateNote}
                            />
                        </Form.Group>
                    </Form>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => { flipModal() }}>
                    Close
  </Button>
                <Button variant="primary" onClick={() => { onSaveUpdateDescription(); flipModal() }}>
                    Save Changes
  </Button>
            </Modal.Footer></Modal></div>);
};


export default ModalDetails;