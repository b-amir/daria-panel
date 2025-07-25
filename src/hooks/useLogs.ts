"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LogEntry } from "@/types/logs";
import { useLogStore } from "@/stores/logStore";
import { QUERY_KEYS } from "@/constants/queryKeys";

interface LogsResponse {
  logs: LogEntry[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

async function fetchLogsPage({ pageParam = 0 }): Promise<LogsResponse> {
  const limit = 20;
  const offset = pageParam * limit;

  const response = await fetch(`/api/logs?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error("Failed to fetch logs");
  }
  return response.json();
}

export function useLogs() {
  const recentLogs = useLogStore((state) => state.recentLogs);

  const { data, isLoading, error, fetchNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery({
      queryKey: QUERY_KEYS.logsInfinite(),
      queryFn: fetchLogsPage,
      initialPageParam: 0,
      getNextPageParam: (lastPage: LogsResponse, allPages) => {
        if (!lastPage.hasMore) return undefined;
        return allPages.length;
      },
      staleTime: 30 * 1000, // 30 seconds
      refetchOnWindowFocus: true,
      gcTime: 2 * 60 * 1000, // 2 minutes
    });

  const apiLogs = useMemo(() => {
    return data?.pages.flatMap((page: LogsResponse) => page.logs) || [];
  }, [data]);

  const allLogs = useMemo(() => {
    if (recentLogs.length === 0) {
      return apiLogs;
    }

    const currentTime = Date.now();
    const oneMinuteAgo = currentTime - 60000;

    const recentOptimisticLogs = recentLogs.filter((log) => {
      const logTime = new Date(log.time).getTime();
      return logTime > oneMinuteAgo;
    });

    if (recentOptimisticLogs.length === 0) {
      return apiLogs;
    }

    const apiLogsWithTimestamps = apiLogs.map((log) => ({
      ...log,
      timestamp: new Date(log.time).getTime(),
    }));

    const filteredOptimistic = recentOptimisticLogs.filter((optimisticLog) => {
      const optimisticTime = new Date(optimisticLog.time).getTime();

      return !apiLogsWithTimestamps.some((apiLog) => {
        const timeDiff = Math.abs(optimisticTime - apiLog.timestamp);

        return (
          apiLog.user === optimisticLog.user &&
          apiLog.event === optimisticLog.event &&
          timeDiff < 2000 // Within 2 seconds
        );
      });
    });

    const combinedLogs = [...filteredOptimistic, ...apiLogs];

    const sortedLogs = combinedLogs.sort((a, b) => {
      const aTime =
        "timestamp" in a ? (a.timestamp as number) : new Date(a.time).getTime();
      const bTime =
        "timestamp" in b ? (b.timestamp as number) : new Date(b.time).getTime();
      return bTime - aTime;
    });

    const pagesLoaded = data?.pages.length || 0;
    const maxRows = pagesLoaded * 20;

    return sortedLogs.slice(0, maxRows);
  }, [recentLogs, apiLogs, data?.pages.length]);

  const totalCount = useMemo(() => {
    return data?.pages[0]?.total || 0;
  }, [data]);

  const loadNextPage = async () => {
    if (data?.pages && data.pages[data.pages.length - 1]?.hasMore) {
      await fetchNextPage();
    }
  };

  const hasNextPage = useMemo(() => {
    return data?.pages
      ? data.pages[data.pages.length - 1]?.hasMore || false
      : false;
  }, [data]);

  return {
    logs: allLogs,
    totalCount,
    isLoading,
    error,
    hasNextPage,
    isNextPageLoading: isFetchingNextPage,
    loadNextPage,
    refetch,
  };
}

export function usePageVisitLogger(username?: string) {
  const pathname = usePathname();
  const logPageVisit = useLogStore((state) => state.logPageVisit);

  useEffect(() => {
    if (!username) return;
    logPageVisit(username, pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, pathname]);
}
