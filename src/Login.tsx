import { useMutation } from "@apollo/client";
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

const EMAIL_LOCAL_STORAGE_KEY = "ketchup-email";

const Login = ({ onLogin }: { onLogin: (email: string) => void }) => {
  const [email, setEmail] = useState("");
  const [createOrGetUser] = useMutation(CREATE_OR_GET_USER_QUERY);

  useEffect(() => {
    if (localStorage.getItem(EMAIL_LOCAL_STORAGE_KEY) !== null) {
      onLogin(localStorage.getItem(EMAIL_LOCAL_STORAGE_KEY));
    }
  }, []);

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
