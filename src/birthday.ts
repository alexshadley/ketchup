export type BirthdayToCreate = Omit<Birthday, "eventId">;

export type Birthday = {
  name: string;
  // 0-indexed :(
  month: number;
  day: number;
  eventId: string;
};

export const getBirthdayDate = (birthday: BirthdayToCreate) => {
  const date = new Date();
  date.setMonth(birthday.month);
  date.setDate(birthday.day);

  return date;
};
