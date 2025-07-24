"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function usePageVisitLogger(username?: string) {
  const pathname = usePathname();

  useEffect(() => {
    if (!username) return;

    const getPageName = (path: string) => {
      const segments = path.split("/").filter(Boolean);
      return segments[segments.length - 1] || "home";
    };

    const logPageVisit = async () => {
      try {
        const pageName = getPageName(pathname);
        await fetch("/api/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: username,
            event: `page_visit: ${pageName}`,
            details: `Visited ${pathname}`,
          }),
        });
      } catch (error) {
        console.error("Failed to log page visit:", error);
      }
    };

    logPageVisit();
  }, [username, pathname]);
}
