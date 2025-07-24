export type Column = {
  id: string;
  label: string;
  width?: string;
};

export const LOGS_TABLE_COLUMNS: Column[] = [
  { id: "user", label: "User", width: "20%" },
  { id: "event", label: "Event", width: "40%" },
  { id: "time", label: "Time", width: "40%" },
];

export const USERS_TABLE_COLUMNS: Column[] = [
  { id: "name", label: "Name", width: "20%" },
  { id: "email", label: "Email", width: "40%" },
  { id: "phone", label: "Phone", width: "40%" },
];

export const getFlexClassFromWidth = (width?: string): string => {
  if (!width) return "flex-1";

  const percentage = parseInt(width.replace("%", ""));
  const flexRatio = Math.round(percentage / 20);

  return `flex-[${flexRatio}]`;
};
