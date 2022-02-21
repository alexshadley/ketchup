import { Birthday } from "./birthday";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const BirthdayList = ({
  birthdays,
  onDeleteBirthday,
}: {
  birthdays: Birthday[];

  onDeleteBirthday: (eventId: string) => void;
}) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {[...MONTHS.entries()].map(([index, monthName]) => {
        const monthBirthdays = birthdays.filter((b) => b.month === index);

        return (
          <div className="basis-60">
            <div className="text-xl mb-4">{monthName}</div>
            <div className="flex flex-col items-stretch gap-2">
              {monthBirthdays
                .sort((b1, b2) => b1.day - b2.day)
                .map((b) => (
                  <div className="flex justify-between border rounded p-2">
                    <p>
                      <span className="ml-1 mr-3 font-bold">{b.day + 1}</span>
                      <span>{b.name}</span>
                    </p>
                    <button
                      className={"border rounded w-6 text-center shadow"}
                      onClick={() => onDeleteBirthday(b.eventId)}
                    >
                      ❌
                    </button>
                  </div>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BirthdayList;
