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
  Daily = "Daily",
  BiWeekly = "Bi-Weekly",
  TriWeekly = "Tri-Weekly",
  Weekly = "Weekly",
  EveryOtherWeek = "Every other week",
  Monthly = "Monthly",
  EveryOtherMonth = "Every other month",
  EverySixMonths = "Every six months",
  Yearly = "Yearly"
}