import { renderHook } from "@testing-library/react";
import { usePageVisitLogger } from "../useLogs";
import { usePathname } from "next/navigation";

const mockLogPageVisit = jest.fn();
jest.mock("@/stores/logStore", () => ({
  useLogStore: jest.fn((selector) => {
    const mockState = {
      recentLogs: [],
      queuedLogs: [],
      addOptimisticLog: jest.fn(),
      logPageVisit: mockLogPageVisit,
      logProfileVisit: jest.fn(),
    };
    return selector ? selector(mockState) : mockState;
  }),
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe("usePageVisitLogger", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("logs page visit when username is provided", () => {
    mockUsePathname.mockReturnValue("/dashboard");

    renderHook(() => usePageVisitLogger("testuser"));

    expect(mockLogPageVisit).toHaveBeenCalledWith("testuser", "/dashboard");
  });

  it("does not log when username is missing", () => {
    mockUsePathname.mockReturnValue("/dashboard");

    const testCases = [undefined, "", null];

    testCases.forEach((username) => {
      mockLogPageVisit.mockClear();
      renderHook(() => usePageVisitLogger(username as string));
      expect(mockLogPageVisit).not.toHaveBeenCalled();
    });
  });

  it("logs new visits when pathname or username changes", () => {
    const { rerender } = renderHook(
      ({ username, pathname }) => {
        mockUsePathname.mockReturnValue(pathname);
        return usePageVisitLogger(username);
      },
      { initialProps: { username: "user1", pathname: "/dashboard" } }
    );

    expect(mockLogPageVisit).toHaveBeenCalledWith("user1", "/dashboard");
    expect(mockLogPageVisit).toHaveBeenCalledTimes(1);

    rerender({ username: "user1", pathname: "/users" });
    expect(mockLogPageVisit).toHaveBeenCalledWith("user1", "/users");
    expect(mockLogPageVisit).toHaveBeenCalledTimes(2);

    rerender({ username: "user2", pathname: "/users" });
    expect(mockLogPageVisit).toHaveBeenCalledWith("user2", "/users");
    expect(mockLogPageVisit).toHaveBeenCalledTimes(3);
  });

  it("does not log duplicate visits for same user and path", () => {
    mockUsePathname.mockReturnValue("/dashboard");

    const { rerender } = renderHook(
      ({ username }) => usePageVisitLogger(username),
      { initialProps: { username: "testuser" } }
    );

    expect(mockLogPageVisit).toHaveBeenCalledTimes(1);

    rerender({ username: "testuser" });
    expect(mockLogPageVisit).toHaveBeenCalledTimes(1);
  });
});
