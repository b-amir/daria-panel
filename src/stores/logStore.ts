import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { LogType, LogEntry } from "@/types/logs";

interface QueuedLog {
  id: string;
  user: string;
  event: string;
  type: LogType;
  details?: string;
  timestamp: number;
  status: "pending" | "sending" | "failed";
}

interface LogState {
  recentLogs: LogEntry[];
  queuedLogs: QueuedLog[];

  addOptimisticLog: (
    user: string,
    event: string,
    type: LogType,
    details?: string
  ) => void;
  logPageVisit: (username: string, pathname: string) => void;
  logProfileVisit: (username: string, profileName: string) => void;
}

export const useLogStore = create<LogState>()(
  persist(
    immer((set, get) => ({
      recentLogs: [],
      queuedLogs: [],

      addOptimisticLog: (
        user: string,
        event: string,
        type: LogType,
        details?: string
      ) => {
        const optimisticLog: LogEntry = {
          id: Date.now(),
          user,
          event,
          type,
          time: new Date().toISOString(),
          details,
        };

        // ✅ Using Immer for immutable updates - better performance
        set((draft) => {
          draft.recentLogs.unshift(optimisticLog);
          draft.recentLogs = draft.recentLogs.slice(0, 50);
        });

        const queuedLog: QueuedLog = {
          id: crypto.randomUUID(),
          user,
          event,
          type,
          details,
          timestamp: Date.now(),
          status: "pending",
        };

        set((draft) => {
          draft.queuedLogs.push(queuedLog);
        });

        const sendLog = async () => {
          set((draft) => {
            const log = draft.queuedLogs.find(
              (log: QueuedLog) => log.id === queuedLog.id
            );
            if (log) {
              log.status = "sending";
            }
          });

          try {
            await fetch("/api/logs", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user: queuedLog.user,
                event: queuedLog.event,
                type: queuedLog.type,
                details: queuedLog.details,
              }),
            });

            set((draft) => {
              const index = draft.queuedLogs.findIndex(
                (log: QueuedLog) => log.id === queuedLog.id
              );
              if (index !== -1) {
                draft.queuedLogs.splice(index, 1);
              }
            });
          } catch (error) {
            console.error("Failed to send log:", error);
            set((draft) => {
              const log = draft.queuedLogs.find(
                (log: QueuedLog) => log.id === queuedLog.id
              );
              if (log) {
                log.status = "failed";
              }
            });
          }
        };

        sendLog();
      },

      logPageVisit: (username: string, pathname: string) => {
        const getPageName = (path: string) => {
          const segments = path.split("/").filter(Boolean);
          if (segments[0] === "users" && segments.length > 1) {
            return null;
          }
          return segments[segments.length - 1] || "home";
        };

        const pageName = getPageName(pathname);

        if (!pageName) {
          return;
        }

        const { addOptimisticLog } = get();
        addOptimisticLog(
          username,
          `page_visit: ${pageName}`,
          LogType.PAGE_VISIT,
          `Visited ${pathname}`
        );
      },

      logProfileVisit: (username: string, profileName: string) => {
        const { addOptimisticLog, queuedLogs, recentLogs } = get();

        const event = `profile_visit: ${profileName}`;

        const isAlreadyLogged =
          recentLogs.some((log: LogEntry) => log.event === event) ||
          queuedLogs.some((log) => log.event === event);

        if (isAlreadyLogged) {
          return;
        }

        addOptimisticLog(
          username,
          event,
          LogType.PROFILE_VISIT,
          `Visited profile of ${profileName}`
        );
      },
    })),
    {
      name: "log-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        queuedLogs: state.queuedLogs,
      }),
    }
  )
);
