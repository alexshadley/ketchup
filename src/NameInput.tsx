import { useState } from "react";
import { Person, CreatedPerson, Frequency } from "./constants";

const NameInput = ({
  onSubmit,
}: {
  onSubmit: (Person: CreatedPerson) => void;
}) => {
  const [name, setName] = useState("");
  const [friendName, setFriendName] = useState("");
  const [email, setEmail] = useState("");
  const [friendEmail, setFriendEmail] = useState("");
  const [frequency, setFrequency] = useState(Frequency.Weekly);


  const handleSubmit = () => {
    const parsedDate = new Date();

    onSubmit({
      name,
      friendName,
      frequency: Frequency.Daily,
      email,
      friendEmail
    });
    setName("")
    setFriendName("")
    setEmail("")
    setFriendEmail("")
    setFrequency(Frequency.Weekly)
  };

  function createListOfOptions(props) {
    let optionList = []
    for (let val in props) {
      optionList.push(<option value={props[val]}>{props[val]}</option>)
    }
    return (optionList);
  }

  return (
    <div className="flex gap-4 items-end justify-center">
      <div>
        <div className="grid grid-flow-row auto-rows-max gap-4">
          <div className="flex justify-center">
            <div className="grid gap-4 grid-flow-col auto-cols-max ">
              <div>
                <p>Your Name</p>
                <input
                  className="border rounded p-1"
                  onChange={(event) => setName(event.target.value)}
                  value={name}
                ></input>
                <p>Your Email</p>
                <input
                  className="border rounded p-1"
                  onChange={(event) => setEmail(event.target.value)}
                  value={email}
                ></input>
              </div>

              <div>

                <p>Friend's Name</p>
                <input
                  className="border rounded p-1"
                  onChange={(event) => setFriendName(event.target.value)}
                  value={friendName}
                ></input>
                <p>Friend's Email</p>
                <input
                  className="border rounded p-1"
                  onChange={(event) => setFriendEmail(event.target.value)}
                  value={friendEmail}
                ></input>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <select value={frequency} onChange={(event) => setFrequency(Frequency[event.target.value])}>
              {createListOfOptions(Frequency)}
            </select>
          </div>
          <div>
            <div className="flex gap-10 justify-center">
              <div>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleSubmit()}>Ketchup!
            </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameInput;