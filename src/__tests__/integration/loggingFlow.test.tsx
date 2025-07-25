import { waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { useLogs } from "@/hooks/useLogs";
import { useLogStore } from "@/stores/logStore";
import { LogType } from "@/types/logs";
import { mockLogEntries, createTestQueryClient } from "@/utils/testUtils";

const mockFetch = jest.fn();
global.fetch = mockFetch;

Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: jest.fn(() => "integration-test-uuid"),
  },
  writable: true,
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("Logging Flow Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
    useLogStore.setState({
      recentLogs: [],
      queuedLogs: [],
    });
  });

  it("handles complete optimistic update to API flow", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          logs: mockLogEntries,
          total: mockLogEntries.length,
          limit: 20,
          offset: 0,
          hasMore: false,
        }),
    });

    const { result: logsResult } = renderHook(() => useLogs(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(logsResult.current.isLoading).toBe(false);
    });
    expect(logsResult.current.logs).toHaveLength(mockLogEntries.length);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    act(() => {
      const store = useLogStore.getState();
      store.addOptimisticLog(
        "integration_user",
        "integration_event",
        LogType.LOGIN,
        "Integration test"
      );
    });

    await waitFor(() => {
      const store = useLogStore.getState();
      expect(store.recentLogs).toHaveLength(1);
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: "integration_user",
          event: "integration_event",
          type: LogType.LOGIN,
          details: "Integration test",
        }),
      });
    });
  });

  it("handles API failures gracefully", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    act(() => {
      const store = useLogStore.getState();
      store.addOptimisticLog("failed_user", "failed_event", LogType.LOGIN);
    });

    await waitFor(() => {
      const store = useLogStore.getState();
      expect(store.recentLogs).toHaveLength(1);
    });

    await waitFor(() => {
      const currentStore = useLogStore.getState();
      expect(currentStore.queuedLogs).toHaveLength(1);
      expect(currentStore.queuedLogs[0]?.status).toBe("failed");
    });
  });

  it("combines optimistic logs with paginated data", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          logs: mockLogEntries.slice(0, 3),
          total: 5,
          limit: 3,
          offset: 0,
          hasMore: true,
        }),
    });

    const { result } = renderHook(() => useLogs(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.logs).toHaveLength(3);
    expect(result.current.hasNextPage).toBe(true);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    act(() => {
      const store = useLogStore.getState();
      store.addOptimisticLog(
        "paginated_user",
        "paginated_event",
        LogType.PAGE_VISIT
      );
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          logs: mockLogEntries.slice(3, 5),
          total: 5,
          limit: 3,
          offset: 3,
          hasMore: false,
        }),
    });

    await act(async () => {
      await result.current.loadNextPage();
    });

    await waitFor(() => {
      expect(result.current.isNextPageLoading).toBe(false);
    });

    expect(result.current.logs).toHaveLength(6);
  });
});
