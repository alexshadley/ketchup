import { useEffect, useState } from "react";
import {
  Auth,
  deleteBirthday,
  fetchBirthdayCalendar,
  fetchCalendarEvents,
  writeNewBirthday,
} from "./calendar";
import BirthdayList from "./BirthdayList";
import BirthdayInput from "./BirthdayInput";
import { Birthday } from "./birthday";
import { Toaster, toast } from "react-hot-toast";
import useGoogleAuth from "./useGoogleAuth";

const App = () => {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [calendarId, setCalendarId] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const fetchBirthdays = (auth: Auth): Promise<Birthday[]> => {
    return fetchBirthdayCalendar(auth).then((calendar) => {
      setCalendarId(calendar.id);
      return fetchCalendarEvents(auth, calendar.id);
    });
  };

  const auth = useGoogleAuth();

  useEffect(() => {
    if (auth) {
      fetchBirthdays(auth).then(setBirthdays);
    }
  }, [auth]);

  return (
    <>
      <div className="mx-20 my-10 flex flex-col gap-12">
        <div className="text-center text-3xl">
          Birthday Time
          <span
            className="ml-4 cursor-pointer"
            onClick={() => setShowInfo(true)}
          >
            ℹ️
          </span>
        </div>
        <BirthdayInput
          onSubmit={(birthday) => {
            writeNewBirthday(auth, calendarId, birthday)
              .then(() => fetchBirthdays(auth))
              .then(setBirthdays)
              .then(() => toast.success("Added birthday"));
          }}
        />
        <BirthdayList
          birthdays={birthdays}
          onDeleteBirthday={(eventId) => {
            deleteBirthday(auth, calendarId, eventId)
              .then(() => fetchBirthdays(auth))
              .then(setBirthdays)
              .then(() => toast.success("Deleted birthday"));
          }}
        />
        <Toaster />
      </div>
      {showInfo && (
        <div
          className="w-screen h-screen bg-gray-800/90 fixed top-0 left-0"
          onClick={() => setShowInfo(false)}
        >
          <div className="text-center w-80 m-auto my-20 text-white">
            <div className="text-xl mb-4">How to use</div>
            <p className="mb-4">
              Make a calendar with the title 'Birthdays' in google calendar.
              It's probably case sensitive but I haven't tested it. Once you've
              done that, you can add birthdays to the calendar in this webpage.
              Birthdays will appear as day-long events that repeat annually,
              with a title of the person having the birthday. From there you can
              set up whatever calendar alerts you prefer for birthdays. Go nuts.
            </p>
            <p>(click anywhere to close)</p>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
