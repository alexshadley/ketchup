import { useState } from "react";
import FriendList from "./FriendList";
import UserSettings from "./UserSettings";
import Login from "./Login";

const App = () => {
  const [email, setEmail] = useState<string | null>(null);

  return (
    <>
      {email === null && <Login onLogin={(e) => setEmail(e)} />}
      {email !== null && (
        <>
          <div>
            <h2 style={{ textAlign: "center" }}>
              Ketchup with Friends
            </h2>
            <p style={{ textAlign: "center" }}>
              Get a quick reminder to catch up with friends old and new.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "60px",
                marginTop: "30px",
              }}
            >
              <FriendList email={email} />
              <UserSettings email={email} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default App;
