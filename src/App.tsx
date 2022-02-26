import { useState } from "react";
import NameInput from "./NameInput";
import { Person, CreatedPerson, Frequency } from "./constants";
import { gql, useQuery } from "@apollo/client";
import FriendList from "./FriendList";

const App = () => {

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2>
          Ketchup with Friends
        </h2>
        <h4 className="text-center">
          Get a quick reminder to catch up with friends old and new.
        </h4>
        <FriendList userEmail="shadleyalex@gmail.com" />
      </div>
    </>
  );
};

export default App;
