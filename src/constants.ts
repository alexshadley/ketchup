export type CreatedPerson = Omit<Person, "eventId">;

export type Person = {
  name: string;
  friendName: string
  // 0-indexed :(
  frequency: Frequency;
  email: string;
  friendEmail: string
  eventId: string;
};


export enum Frequency {
  Daily,
  BiWeekly,
  TriWeekly,
  Weekly,
  EveryOtherWeek,
  Monthly,
  EveryOtherMonth,
  EverySixMonths,
  Yearly
}