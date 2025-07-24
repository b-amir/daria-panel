"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLogStore } from "@/stores/logStore";

export function usePageVisitLogger(username?: string) {
  const pathname = usePathname();
  const { addOptimisticLog } = useLogStore();

  useEffect(() => {
    if (!username) return;

    const getPageName = (path: string) => {
      const segments = path.split("/").filter(Boolean);
      return segments[segments.length - 1] || "home";
    };

    const pageName = getPageName(pathname);

    addOptimisticLog(
      username,
      `page_visit: ${pageName}`,
      `Visited ${pathname}`
    );
  }, [username, pathname, addOptimisticLog]);
}
