export type Column = {
  id: string;
  label: string;
};

export const ROW_HEIGHT = 48;

export const LOGS_TABLE_COLUMNS: Column[] = [
  { id: "user", label: "User" },
  { id: "event", label: "Event" },
  { id: "time", label: "Time" },
];

export const USERS_TABLE_COLUMNS: Column[] = [
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
];
