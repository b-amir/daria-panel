import { promises as fs } from "fs";
import path from "path";
import { apiPost } from "@/utils/api";
import { LogType, LogEntry } from "@/types/logs";

const LOGS_FILE = path.join(process.cwd(), "mockDB", "logs.json");

export async function addLogViaApi(
  user: string,
  event: string,
  type: LogType,
  details?: string
): Promise<void> {
  return apiPost("/api/logs", { user, event, type, details });
}

async function readAllLogsFromFile(): Promise<LogEntry[]> {
  try {
    const data = await fs.readFile(LOGS_FILE, "utf-8");
    if (!data.trim()) {
      return [];
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    console.error("Error reading logs file:", error);
    return [];
  }
}

export async function writeLogToFile(
  user: string,
  event: string,
  type: LogType,
  details?: string
): Promise<void> {
  try {
    const logs = await readAllLogsFromFile();
    const newLog: LogEntry = {
      id: logs.length > 0 ? Math.max(...logs.map((l) => l.id)) + 1 : 1,
      user,
      event,
      type,
      time: new Date().toISOString(),
      details,
    };

    logs.push(newLog);
    await fs.writeFile(LOGS_FILE, JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error("Failed to write log:", error);
    throw new Error("Failed to add log entry");
  }
}

export async function readPaginatedLogsFromFile(
  limit: number,
  offset: number
): Promise<LogEntry[]> {
  const allLogs = await readAllLogsFromFile();
  const sortedLogs = allLogs.sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
  );
  return sortedLogs.slice(offset, offset + limit);
}

export async function getLogsCountFromFile(): Promise<number> {
  const logs = await readAllLogsFromFile();
  return logs.length;
}
