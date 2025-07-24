"use client";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { LogEntry } from "@/services/logs.service";
import { QUERY_KEYS } from "@/constants/query-keys";

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

export function useOptimizedLogs() {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
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

  const allLogs = useMemo(() => {
    return data?.pages.flatMap((page) => page.logs) || [];
  }, [data]);

  const totalCount = useMemo(() => {
    return data?.pages[0]?.total || 0;
  }, [data]);

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.logs });
    refetch();
  }, [queryClient, refetch]);

  const loadNextPage = useCallback(async () => {
    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    logs: allLogs,
    totalCount,
    isLoading,
    error,
    hasNextPage: hasNextPage || false,
    isNextPageLoading: isFetchingNextPage,
    handleRefresh,
    loadNextPage,
  };
}
