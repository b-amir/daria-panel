"use client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { usePageVisitLogger } from "./usePageVisitLogger";

export function useOptimizedAuth() {
  const { user, initializeAuth } = useAuthStore();
  const queryClient = useQueryClient();
  const pathname = usePathname();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (pathname === "/logs") {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.logs });
    }
  }, [pathname, queryClient]);

  usePageVisitLogger(user?.username);

  return {
    username: user?.username,
    isAuthenticated: user?.isAuthenticated || false,
  };
}
