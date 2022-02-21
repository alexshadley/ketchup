import { useState } from "react";
import { Birthday, BirthdayToCreate } from "./birthday";

const BirthdayInput = ({
  onSubmit,
}: {
  onSubmit: (birthday: BirthdayToCreate) => void;
}) => {
  const [date, setDate] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = () => {
    const parsedDate = new Date();

    onSubmit({
      name,
      month: Number.parseInt(date.slice(0, 2)) - 1,
      day: Number.parseInt(date.slice(2, 4)) - 1,
    });

    setDate("");
    setName("");
  };

  const getDateInputText = (state: string) =>
    state.length <= 2 ? state : state.slice(0, 2) + "-" + state.slice(2, 4);

  return (
    <div className="flex gap-4 items-end justify-center">
      <div>
        <p>Date</p>
        <input
          className="border rounded p-1 w-20"
          onChange={(event) => setDate(event.target.value.replace("-", ""))}
          value={getDateInputText(date)}
          placeholder="MM-DD"
        ></input>
      </div>
      <div>
        <p>Name</p>
        <input
          className="border rounded p-1"
          onChange={(event) => setName(event.target.value)}
          value={name}
        ></input>
      </div>
      <button
        className="bg-green-400 border rounded p-1"
        onClick={() => handleSubmit()}
      >
        Add
      </button>
    </div>
  );
};

export default BirthdayInput;
