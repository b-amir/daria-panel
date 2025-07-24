"use client";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { fetchUsers } from "@/services/users.service";
import { QUERY_KEYS } from "@/constants/queryKeys";

export function useOptimizedUsers() {
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.users,
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const loadNextPage = useCallback(async () => {}, []);

  return {
    users,
    isLoading,
    error,
    hasNextPage: false,
    isNextPageLoading: false,
    loadNextPage,
    totalCount: users.length,
  };
}
