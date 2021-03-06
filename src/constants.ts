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

// keep in sync with email_worker.py
export const FRQ_DAYS: Record<Frequency, number> = {
  daily: 1,
  weekly: 7,
  monthly: 30,
  quarterly: 90,
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
