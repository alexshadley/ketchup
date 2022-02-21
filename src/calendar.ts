import axios from "axios";
import { Birthday, BirthdayToCreate, getBirthdayDate } from "./birthday";

export type Auth = {
  accessToken: string;
  tokenObj: {
    expires_at: number;
  };
};

export type FetchedEvent = {
  id: string;
  summary: string;
  start: {
    date: string;
  };
};

const BIRTHDAYS_CALENDAR_NAME = "Birthdays";

const GOOGLE_CALENDAR_URL = "https://www.googleapis.com/calendar/v3";

const buildHeaders = (auth: Auth) => {
  return { Authorization: `Bearer ${auth.accessToken}` };
};

export const fetchBirthdayCalendar = (auth: Auth) => {
  return axios
    .get(GOOGLE_CALENDAR_URL + "/users/me/calendarList", {
      headers: buildHeaders(auth),
    })
    .then((response) => {
      return response.data.items.find(
        (calendar) => calendar?.summary === BIRTHDAYS_CALENDAR_NAME
      );
    });
};

const parseBirthday = (fetchedEvent: FetchedEvent): Birthday | null => {
  if (!fetchedEvent.start) {
    return null;
  }

  const eventDate = new Date(fetchedEvent.start.date);
  return {
    name: fetchedEvent.summary,
    month: eventDate.getMonth(),
    day: eventDate.getDate(),
    eventId: fetchedEvent.id,
  };
};

export const fetchCalendarEvents = (
  auth: Auth,
  calendarId: string
): Promise<Birthday[]> => {
  return axios
    .get(GOOGLE_CALENDAR_URL + `/calendars/${calendarId}/events`, {
      headers: buildHeaders(auth),
    })
    .then((response) => {
      console.log(response.data.items);
      return response.data.items.map(parseBirthday).filter((b) => !!b);
    });
};

export const writeNewBirthday = (
  auth: Auth,
  calendarId: string,
  birthday: BirthdayToCreate
) => {
  const birthdayDate = getBirthdayDate(birthday);
  // stupid hack, should fix
  const startDateStr = birthdayDate.toISOString().split("T")[0];
  birthdayDate.setDate(birthdayDate.getDate() + 1);
  const endDateStr = birthdayDate.toISOString().split("T")[0];

  return axios.post(
    GOOGLE_CALENDAR_URL + `/calendars/${calendarId}/events`,
    {
      start: { date: startDateStr },
      end: { date: endDateStr },
      recurrence: ["RRULE:FREQ=YEARLY"],
      summary: birthday.name,
    },
    { headers: buildHeaders(auth) }
  );
};

export const deleteBirthday = (
  auth: Auth,
  calendarId: string,
  eventId: string
) => {
  return axios.delete(
    GOOGLE_CALENDAR_URL + `/calendars/${calendarId}/events/${eventId}`,
    { headers: buildHeaders(auth) }
  );
};
