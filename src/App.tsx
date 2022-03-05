import { useState } from "react";
import FriendList from "./FriendList";
import UserSettings from "./UserSettings";
import Login from "./Login";

const App = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      {email === null && <Login onLogin={(e) => setEmail(e)} />}
      {email !== null && (
        <>
          <div>
            <h2 style={{ textAlign: "center" }}>
              Ketchup with Friends
              <span onClick={() => setShowInfo(true)}>ℹ️</span>
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

          {showInfo && (
            <div
              className="w-screen h-screen bg-gray-800/90 fixed top-0 left-0"
              onClick={() => setShowInfo(false)}
            >
              <div className="text-center w-80 m-auto my-20 text-white">
                <div className="text-xl mb-4">How to use:</div>
                <p className="mb-4">
                  Set a reminder of when to catch up with your friends!! Add
                  their email and set a time range to catch up in. No
                  information provided here will leave our servers, to edit or
                  remove yourself from our mailing list enter you and your
                  friends email and select a new frequency.
                </p>
                <p>(click anywhere to close)</p>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default App;
