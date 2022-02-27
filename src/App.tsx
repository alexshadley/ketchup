import { useState } from "react";
import NameInput from "./NameInput";
import { Person, CreatedPerson, Frequency } from "./constants";
import { gql, useQuery } from "@apollo/client";
import FriendList from "./FriendList";
import UserSettings from "./UserSettings";

const App = () => {
  return (
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
          <FriendList userEmail="shadleyalex@gmail.com" />
          <UserSettings email="shadleyalex@gmail.com" />
        </div>
      </div>
    </>
  );
};

export default App;
