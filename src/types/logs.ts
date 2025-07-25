export enum LogType {
  LOGIN = "login",
  LOGIN_FAILED = "login_failed",
  LOGOUT = "logout",
  SIGNUP = "signup",
  SIGNUP_FAILED = "signup_failed",
  PAGE_VISIT = "page_visit",
}

export interface LogEntry {
  id: number;
  user: string;
  event: string;
  type: LogType;
  time: string;
  details?: string;
}
