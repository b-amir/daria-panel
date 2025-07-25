import { render, screen } from "@testing-library/react";
import { LogRow } from "../LogRow";
import { LogEntry, LogType } from "@/types/logs";

const createMockLog = (overrides?: Partial<LogEntry>): LogEntry => ({
  id: 1,
  user: "testuser",
  event: "test_event",
  type: LogType.LOGIN,
  time: "2024-01-01T10:00:00.000Z",
  details: "Test details",
  ...overrides,
});

describe("LogRow", () => {
  it("renders log information correctly", () => {
    const log = createMockLog({
      user: "john_doe",
      event: "successful_login",
      type: LogType.LOGIN,
      time: "2024-01-01T14:30:00.000Z",
      details: "Login from Chrome browser",
    });

    render(<LogRow log={log} />);

    expect(screen.getByText("john_doe")).toBeInTheDocument();
    expect(screen.getByText("successful_login")).toBeInTheDocument();
    expect(screen.getByText("Login from Chrome browser")).toBeInTheDocument();
    expect(screen.getByRole("row")).toBeInTheDocument();
  });

  it("renders without details when details is undefined", () => {
    const log = createMockLog({
      user: "jane_doe",
      event: "logout",
      type: LogType.LOGOUT,
      details: undefined,
    });

    render(<LogRow log={log} />);

    expect(screen.getByText("jane_doe")).toBeInTheDocument();
    expect(screen.getByText("logout")).toBeInTheDocument();
    expect(screen.queryByText("Test details")).not.toBeInTheDocument();
  });

  it("handles different log types", () => {
    const logTypes = [
      { type: LogType.LOGIN, event: "user_login" },
      { type: LogType.LOGOUT, event: "user_logout" },
      { type: LogType.LOGIN_FAILED, event: "failed_login" },
      { type: LogType.SIGNUP, event: "new_registration" },
      { type: LogType.PAGE_VISIT, event: "page_visit: dashboard" },
      { type: LogType.PROFILE_VISIT, event: "profile_visit: user123" },
    ];

    logTypes.forEach(({ type, event }) => {
      const log = createMockLog({ type, event });
      const { unmount } = render(<LogRow log={log} />);

      expect(screen.getByText(event)).toBeInTheDocument();
      expect(screen.getByRole("row")).toBeInTheDocument();

      unmount();
    });
  });

  it("handles edge cases gracefully", () => {
    const edgeCases = [
      { user: "", event: "", details: "" },
      {
        user: "user@domain.com",
        event: "login/success",
        details: 'User "John" logged in',
      },
      { time: "invalid-date-string" },
    ];

    edgeCases.forEach((overrides) => {
      const log = createMockLog(overrides);
      const { unmount } = render(<LogRow log={log} />);

      expect(screen.getByRole("row")).toBeInTheDocument();

      unmount();
    });
  });
});
