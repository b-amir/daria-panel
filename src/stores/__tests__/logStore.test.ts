import { useLogStore } from "../logStore";
import { LogType } from "@/types/logs";
import { act } from "@testing-library/react";

const mockFetch = jest.fn();
global.fetch = mockFetch;

Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: jest.fn(() => "test-uuid-123"),
  },
  writable: true,
});

describe("logStore", () => {
  beforeEach(() => {
    useLogStore.setState({
      recentLogs: [],
      queuedLogs: [],
    });
    jest.clearAllMocks();
  });

  describe("addOptimisticLog", () => {
    it("adds log to recent logs with correct data", () => {
      const fixedTime = new Date("2024-01-01T10:00:00.000Z");
      jest
        .spyOn(Date.prototype, "toISOString")
        .mockReturnValue(fixedTime.toISOString());
      jest.spyOn(Date, "now").mockReturnValue(fixedTime.getTime());

      act(() => {
        useLogStore
          .getState()
          .addOptimisticLog(
            "testuser",
            "login_attempt",
            LogType.LOGIN,
            "successful login"
          );
      });

      const { recentLogs } = useLogStore.getState();
      expect(recentLogs).toHaveLength(1);
      expect(recentLogs[0]).toMatchObject({
        id: fixedTime.getTime(),
        user: "testuser",
        event: "login_attempt",
        type: LogType.LOGIN,
        details: "successful login",
        time: fixedTime.toISOString(),
      });
    });

    it("maintains maximum of 50 recent logs", () => {
      for (let i = 0; i < 52; i++) {
        act(() => {
          useLogStore
            .getState()
            .addOptimisticLog(`user${i}`, `event${i}`, LogType.LOGIN);
        });
      }

      const { recentLogs } = useLogStore.getState();
      expect(recentLogs).toHaveLength(50);
      expect(recentLogs[0].user).toBe("user51");
      expect(recentLogs[49].user).toBe("user2");
    });

    it("queues log for API persistence", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      act(() => {
        useLogStore
          .getState()
          .addOptimisticLog("testuser", "test_event", LogType.LOGIN);
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(mockFetch).toHaveBeenCalledWith("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: "testuser",
          event: "test_event",
          type: LogType.LOGIN,
          details: undefined,
        }),
      });

      expect(useLogStore.getState().queuedLogs).toHaveLength(0);
    });

    it("marks queued log as failed when API call fails", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      act(() => {
        useLogStore
          .getState()
          .addOptimisticLog("testuser", "test_event", LogType.LOGIN);
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      const { queuedLogs } = useLogStore.getState();
      expect(queuedLogs).toHaveLength(1);
      expect(queuedLogs[0].status).toBe("failed");
    });
  });

  describe("logPageVisit", () => {
    it("logs visits to trackable pages", () => {
      const store = useLogStore.getState();
      const spy = jest.spyOn(store, "addOptimisticLog");

      act(() => {
        store.logPageVisit("testuser", "/dashboard");
      });

      expect(spy).toHaveBeenCalledWith(
        "testuser",
        "page_visit: dashboard",
        LogType.PAGE_VISIT,
        "Visited /dashboard"
      );
    });

    it("extracts correct page names from various paths", () => {
      const store = useLogStore.getState();
      const spy = jest.spyOn(store, "addOptimisticLog");

      const testCases = [
        { path: "/", expectedName: "home" },
        { path: "/logs/", expectedName: "logs" },
        { path: "/dashboard/settings", expectedName: "settings" },
      ];

      testCases.forEach(({ path, expectedName }) => {
        spy.mockClear();
        act(() => {
          store.logPageVisit("testuser", path);
        });

        expect(spy).toHaveBeenCalledWith(
          "testuser",
          `page_visit: ${expectedName}`,
          LogType.PAGE_VISIT,
          `Visited ${path}`
        );
      });
    });

    it("ignores user profile pages", () => {
      const store = useLogStore.getState();
      const spy = jest.spyOn(store, "addOptimisticLog");

      act(() => {
        store.logPageVisit("testuser", "/users/123");
      });

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
