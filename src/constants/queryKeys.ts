export const QUERY_KEYS = {
  users: ["users"] as const,
  usersList: () => [...QUERY_KEYS.users, "list"] as const,
  userDetail: (id: string) => [...QUERY_KEYS.users, "detail", id] as const,

  logs: ["logs"] as const,
  logsList: () => [...QUERY_KEYS.logs, "list"] as const,
  logsInfinite: () => [...QUERY_KEYS.logs, "infinite"] as const,
} as const;
