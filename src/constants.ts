export type CreatedPerson = Omit<Person, "eventId">;

export type Person = {
  name: string;
  friendName: string;
  // 0-indexed :(
  frequency: Frequency;
  email: string;
  friendEmail: string;
  eventId: string;
};

// for now we don't need all of these, cutting down
export enum Frequency {
  Daily = "daily",
  //BiWeekly = "bi_weekly",
  //TriWeekly = "tri_weekly",
  Weekly = "weekly",
  //EveryOtherWeek = "every_other_week",
  Monthly = "monthly",
  Quarterly = "quarterly",
  //EveryOtherMonth = "every_other_month",
  //EverySixMonths = "every_six_months",
  //Yearly = "yearly",
}
