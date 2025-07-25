export type Column = {
  id: string;
  label: string;
  hideOnMobile?: boolean;
};

export const ROW_HEIGHT = 48;

export const LOGS_TABLE_COLUMNS: Column[] = [
  { id: "user", label: "User" },
  { id: "event", label: "Event" },
  { id: "time", label: "Time", hideOnMobile: true },
];

export const USERS_TABLE_COLUMNS: Column[] = [
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone", hideOnMobile: true },
];
