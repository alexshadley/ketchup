import { useState } from "react";
import NameInput from "./NameInput";
import { Person, CreatedPerson, Frequency } from "./constants";
import { gql, useQuery } from "@apollo/client";

const query = gql`
  query {
    user(email: "shadleyalex@gmail.com") {
      id
      friends {
        id
        name
      }
    }
  }
`;

const App = () => {
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const { data } = useQuery(query);
  console.log(data);

  return (
    <>
      <div className="mx-20 my-10 flex flex-col gap-12">
        <div className="text-center text-3xl">
          Ketchup with Friends
          <span
            className="ml-4 cursor-pointer"
            onClick={() => setShowInfo(true)}
          >
            ℹ️
          </span>
        </div>
        <div className="text-center">
          Get a quick reminder to catch up with friends old and new.
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
              Set a reminder of when to catch up with your friends!! Add their
              email and set a time range to catch up in. No information provided
              here will leave our servers, to edit or remove yourself from our
              mailing list enter you and your friends email and select a new
              frequency.
            </p>
            <p>(click anywhere to close)</p>
          </div>
        </div>
      )}
      <div>
        <NameInput
          onSubmit={(person) => {
            console.log(person.email);
          }}
        />
      </div>
    </>
  );
};

export default App;
