import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface LogEntry {
  id: number;
  user: string;
  event: string;
  time: string;
  details?: string;
}

interface QueuedLog {
  id: string;
  user: string;
  event: string;
  details?: string;
  timestamp: number;
  status: "pending" | "sending" | "failed";
}

interface LogState {
  recentLogs: LogEntry[];
  queuedLogs: QueuedLog[];

  addOptimisticLog: (user: string, event: string, details?: string) => void;
  logPageVisit: (username: string, pathname: string) => void;
}

export const useLogStore = create<LogState>()(
  persist(
    (set) => ({
      recentLogs: [],
      queuedLogs: [],

      addOptimisticLog: (user: string, event: string, details?: string) => {
        const optimisticLog: LogEntry = {
          id: Date.now(),
          user,
          event,
          time: new Date().toISOString(),
          details,
        };

        set((state) => ({
          recentLogs: [optimisticLog, ...state.recentLogs].slice(0, 50),
        }));

        const queuedLog: QueuedLog = {
          id: crypto.randomUUID(),
          user,
          event,
          details,
          timestamp: Date.now(),
          status: "pending",
        };

        set((state) => ({
          queuedLogs: [...state.queuedLogs, queuedLog],
        }));

        const sendLog = async () => {
          set((state) => ({
            queuedLogs: state.queuedLogs.map((log) =>
              log.id === queuedLog.id
                ? { ...log, status: "sending" as const }
                : log
            ),
          }));

          try {
            await fetch("/api/logs", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user: queuedLog.user,
                event: queuedLog.event,
                details: queuedLog.details,
              }),
            });

            set((state) => ({
              queuedLogs: state.queuedLogs.filter(
                (log) => log.id !== queuedLog.id
              ),
            }));
          } catch (error) {
            console.error("Failed to send log:", error);
            set((state) => ({
              queuedLogs: state.queuedLogs.map((log) =>
                log.id === queuedLog.id
                  ? { ...log, status: "failed" as const }
                  : log
              ),
            }));
          }
        };

        sendLog();
      },

      logPageVisit: (username: string, pathname: string) => {
        const getPageName = (path: string) => {
          const segments = path.split("/").filter(Boolean);
          return segments[segments.length - 1] || "home";
        };

        const pageName = getPageName(pathname);

        const { addOptimisticLog } = useLogStore.getState();
        addOptimisticLog(
          username,
          `page_visit: ${pageName}`,
          `Visited ${pathname}`
        );
      },
    }),
    {
      name: "log-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        queuedLogs: state.queuedLogs,
      }),
    }
  )
);
