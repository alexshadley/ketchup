import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

const CREATE_OR_GET_USER_QUERY = gql`
  mutation CreateOrGetUserQuery($email: String!) {
    createOrGetUser(email: $email) {
      user {
        id
        email
      }
    }
  }
`;

const GET_USER_QUERY = gql`
  query GetUser($clientSavedEmail: String!) {
    user(email: $clientSavedEmail) {
        id
        email
    }
  }
`;

const EMAIL_LOCAL_STORAGE_KEY = "ketchup-email";

const Login = ({ onLogin }: { onLogin: (email: string) => void }) => {

  // Pre-populate the email field in the event we don't have a row in the DB
  const [email, setEmail] = useState(localStorage.getItem(EMAIL_LOCAL_STORAGE_KEY) || "");
  const [createOrGetUser] = useMutation(CREATE_OR_GET_USER_QUERY);

  // See if the email in the local storage has a corresponding DB entry
  const clientSavedEmail = localStorage.getItem(EMAIL_LOCAL_STORAGE_KEY) || ""
  const { loading, error, data } = useQuery(GET_USER_QUERY, {
    variables: { clientSavedEmail }
  });
  // When we see the 'data' variable change, we'll run this code 
  //(it's created uninitialized), but it'll change once the query from the backend returns
  useEffect(() => {
    if (!loading) { // TODO: add error handling here
      if (data.user == null) {
        // TODO: Error msg here in the case they have a been here, but they aren't in the db?
        console.log("didn't recognize: " + clientSavedEmail)
      }

      else {
        console.log("Logging on " + clientSavedEmail)
        // User exists in DB, pass them on
        onLogin(clientSavedEmail);
      }
    }
  }, [data]); // Only run this hook when the data changes!

  const handleLogin = async () => {
    await createOrGetUser({ variables: { email } });
    localStorage.setItem(EMAIL_LOCAL_STORAGE_KEY, email);
    onLogin(email);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <h3>Enter your email</h3>
      <Form.Control
        style={{ width: "20%" }}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleLogin();
          }
        }}
      />
    </div>
  );
};

export default Login;
