import { gql, useMutation, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { Button, Form, Table, Modal, InputGroup, FormControl } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import { Frequency, FRQ_DAYS } from "./constants";

const updateFriendDetailMutation = gql`
  mutation UpdateFriendDetailMutation($id: ID! , $friendDetails: String!, $userEmail: String!) {
    updateFriendDetail(id: $id, friendDetails: $friendDetails, userEmail: $userEmail) {
      user {
        id
        friends {
          id
          name
          friendDetails
        }
      }
    }
  }
`;

const ModalDetails = ({ data, email, currentFriendTarget, show, flipModal }: { data: any, email: String, currentFriendTarget: String, show: boolean, flipModal: any }) => {
    const [friendDetails, setFriendDetails] = useState("");
    const [updateFriendDetail] = useMutation(updateFriendDetailMutation);

    useEffect(() => {
        data.user.friends.forEach((f) => { if (String(f.id) == currentFriendTarget) setFriendDetails(f.friendDetails); });
    }, [currentFriendTarget]);

    function onSaveUpdateDescription() {
        updateFriendDetail({ variables: { id: currentFriendTarget, friendDetails: friendDetails, userEmail: email }, });
        setFriendDetails("")
    }

    return (<div>
        <Modal show={show} onHide={() => { setFriendDetails(""); flipModal() }}>
            <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body></Modal.Body>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Update your friend notes</Form.Label>
                    <Form.Control as="textarea" rows={3}
                        onChange={(event) => setFriendDetails(String(event.currentTarget.value))}
                        value={friendDetails}
                    />
                </Form.Group>
            </Form>
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