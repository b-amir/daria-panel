import { LogEntry, LogType } from "@/types/logs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";

export const mockLogEntries: LogEntry[] = [
  {
    id: 1,
    user: "testuser1",
    event: "login_success",
    type: LogType.LOGIN,
    time: "2024-01-01T10:00:00.000Z",
    details: "Successful login",
  },
  {
    id: 2,
    user: "testuser2",
    event: "page_visit: dashboard",
    type: LogType.PAGE_VISIT,
    time: "2024-01-01T10:01:00.000Z",
    details: "Visited /dashboard",
  },
  {
    id: 3,
    user: "testuser1",
    event: "profile_visit: user123",
    type: LogType.PROFILE_VISIT,
    time: "2024-01-01T10:02:00.000Z",
    details: "Viewed profile of user123",
  },
  {
    id: 4,
    user: "testuser3",
    event: "signup_attempt",
    type: LogType.SIGNUP,
    time: "2024-01-01T10:03:00.000Z",
    details: "New user registration",
  },
  {
    id: 5,
    user: "testuser2",
    event: "logout",
    type: LogType.LOGOUT,
    time: "2024-01-01T10:04:00.000Z",
    details: "User logged out",
  },
];

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
        gcTime: 0,
      },
    },
  });

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  queryClient?: QueryClient;
}

export const renderWithQueryClient = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { queryClient = createTestQueryClient(), ...renderOptions } = options;
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
};

export const mockLogsResponse = {
  logs: mockLogEntries.slice(0, 3),
  total: 50,
  limit: 20,
  offset: 0,
  hasMore: true,
};

export const mockLogsResponsePage2 = {
  logs: mockLogEntries.slice(3, 5),
  total: 50,
  limit: 20,
  offset: 20,
  hasMore: false,
};

export const createFetchMock = (responses: unknown[]) => {
  let callCount = 0;
  return jest.fn().mockImplementation(() => {
    const response = responses[callCount++] || responses[responses.length - 1];
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(response),
    });
  });
};

export const waitForAsync = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

export const mockFS = {
  readFile: jest.fn(),
  writeFile: jest.fn(),
  access: jest.fn(),
};

export const mockPath = {
  join: jest.fn((...paths) => paths.join("/")),
};

export const fixedDate = new Date("2024-01-01T10:00:00.000Z");
export const mockDateNow = jest.fn(() => fixedDate.getTime());

export const setupMockDate = () => {
  jest.spyOn(Date, "now").mockImplementation(mockDateNow);
  jest
    .spyOn(global, "Date")
    .mockImplementation(() => fixedDate as unknown as Date);
};

export const cleanupMockDate = () => {
  jest.restoreAllMocks();
};
