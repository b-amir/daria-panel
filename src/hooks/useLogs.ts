"use client";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LogEntry } from "@/services/logs.service";
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
  const queryClient = useQueryClient();
  const { recentLogs } = useLogStore();

  const { data, isLoading, error, fetchNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery({
      queryKey: QUERY_KEYS.logs,
      queryFn: fetchLogsPage,
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage.hasMore) return undefined;
        return allPages.length;
      },
      refetchOnWindowFocus: true,
      staleTime: 30000, // 30 seconds
    });

  const apiLogs = useMemo(() => {
    return data?.pages.flatMap((page) => page.logs) || [];
  }, [data]);

  const allLogs = useMemo(() => {
    const recentOptimisticLogs = recentLogs.filter((log) => {
      const logTime = new Date(log.time).getTime();
      const oneMinuteAgo = Date.now() - 60000;
      return logTime > oneMinuteAgo;
    });

    const filteredOptimistic = recentOptimisticLogs.filter((optimisticLog) => {
      const optimisticTime = new Date(optimisticLog.time).getTime();

      return !apiLogs.some((apiLog) => {
        const apiTime = new Date(apiLog.time).getTime();
        const timeDiff = Math.abs(optimisticTime - apiTime);

        return (
          apiLog.user === optimisticLog.user &&
          apiLog.event === optimisticLog.event &&
          timeDiff < 2000 // Within 2 seconds
        );
      });
    });

    const combinedLogs = [...filteredOptimistic, ...apiLogs];
    const sortedLogs = combinedLogs.sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
    );

    const pagesLoaded = data?.pages.length || 0;
    const maxRows = pagesLoaded * 20;

    return sortedLogs.slice(0, maxRows);
  }, [recentLogs, apiLogs, data?.pages.length]);

  const totalCount = useMemo(() => {
    return data?.pages[0]?.total || 0;
  }, [data]);

  const adjustedHasNextPage = useMemo(() => {
    if (!data?.pages.length) return false;

    const apiTotal = data.pages[0]?.total || 0;
    const pagesLoaded = data.pages.length;
    const apiRowsLoaded = pagesLoaded * 20;

    return apiRowsLoaded < apiTotal;
  }, [data]);

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.logs });
    refetch();
  }, [queryClient, refetch]);

  const loadNextPage = useCallback(async () => {
    if (adjustedHasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
  }, [adjustedHasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    logs: allLogs,
    totalCount,
    isLoading,
    error,
    hasNextPage: adjustedHasNextPage,
    isNextPageLoading: isFetchingNextPage,
    handleRefresh,
    loadNextPage,
  };
}

export function usePageVisitLogger(username?: string) {
  const pathname = usePathname();
  const { logPageVisit } = useLogStore();

  useEffect(() => {
    if (!username) return;
    logPageVisit(username, pathname);
  }, [username, pathname, logPageVisit]);
}
