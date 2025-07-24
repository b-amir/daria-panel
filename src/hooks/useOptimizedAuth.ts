"use client";
import { useEffect, useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { getUsernameFromCookies } from "@/utils/cookies";
import { QUERY_KEYS } from "@/constants/query-keys";
import { usePageVisitLogger } from "./usePageVisitLogger";

export function useOptimizedAuth() {
  const [username, setUsername] = useState<string>();
  const queryClient = useQueryClient();
  const pathname = usePathname();

  useEffect(() => {
    const detectedUsername = getUsernameFromCookies();
    setUsername(detectedUsername);
  }, []);

  useEffect(() => {
    if (pathname === "/logs") {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.logs });
    }
  }, [pathname, queryClient]);

  usePageVisitLogger(username);

  const authState = useMemo(
    () => ({
      username,
      isAuthenticated: !!username,
    }),
    [username]
  );

  return authState;
}
