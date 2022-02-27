import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { useState } from "react";
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

const Login = ({ onLogin }: { onLogin: (email: string) => void }) => {
  const [email, setEmail] = useState("");
  const [createOrGetUser] = useMutation(CREATE_OR_GET_USER_QUERY);

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
            createOrGetUser({
              variables: {
                email,
              },
            }).then(({ data }) => {
              onLogin(data.createOrGetUser.user.email);
            });
          }
        }}
      />
    </div>
  );
};

export default Login;
