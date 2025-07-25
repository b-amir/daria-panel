import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";
import { useLogs } from "../useLogs";
import { useLogStore } from "@/stores/logStore";
import { LogType, LogEntry } from "@/types/logs";
import { mockLogsResponse, mockLogsResponsePage2 } from "@/utils/testUtils";

const mockRecentLogs: LogEntry[] = [];
const mockLogState = {
  recentLogs: mockRecentLogs,
  queuedLogs: [],
  addOptimisticLog: jest.fn(),
  logPageVisit: jest.fn(),
  logProfileVisit: jest.fn(),
};

jest.mock("@/stores/logStore", () => ({
  useLogStore: jest.fn(),
}));
const mockUseLogStore = useLogStore as jest.MockedFunction<typeof useLogStore>;

const mockFetch = jest.fn();
global.fetch = mockFetch;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
  const TestWrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return TestWrapper;
};

describe("useLogs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
    mockRecentLogs.length = 0;
    mockUseLogStore.mockImplementation((selector) => {
      if (typeof selector === "function") {
        return selector(mockLogState);
      }
      return mockLogState.recentLogs;
    });
  });

  it("fetches logs from API", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockLogsResponse),
    });

    const { result } = renderHook(() => useLogs(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/logs?limit=20&offset=0");
    expect(result.current.logs).toEqual(mockLogsResponse.logs);
    expect(result.current.totalCount).toBe(50);
    expect(result.current.hasNextPage).toBe(true);
  });

  it("handles API errors", async () => {
    mockFetch.mockRejectedValueOnce(new Error("API Error"));

    const { result } = renderHook(() => useLogs(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.logs).toEqual([]);
  });

  it("handles pagination", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockLogsResponse),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockLogsResponsePage2),
      });

    const { result } = renderHook(() => useLogs(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.logs).toHaveLength(3);

    await result.current.loadNextPage();

    await waitFor(() => {
      expect(result.current.isNextPageLoading).toBe(false);
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      "/api/logs?limit=20&offset=20"
    );
    expect(result.current.logs).toHaveLength(5);
    expect(result.current.hasNextPage).toBe(false);
  });

  it("combines recent logs from store with API logs", async () => {
    const recentLogs = [
      {
        id: 999,
        user: "optimistic_user",
        event: "optimistic_event",
        type: LogType.LOGIN,
        time: "2024-01-01T10:05:00.000Z",
      },
    ];
    mockRecentLogs.push(...recentLogs);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockLogsResponse),
    });

    const { result } = renderHook(() => useLogs(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.logs).toHaveLength(3);
    expect(result.current.logs).toEqual(mockLogsResponse.logs);
  });
});
