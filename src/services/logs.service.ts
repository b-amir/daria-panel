import { promises as fs } from "fs";
import path from "path";
import { apiGet, apiPost } from "@/utils/api";
import { PaginatedResponse } from "@/types/api";

const LOGS_FILE = path.join(process.cwd(), "mockDB", "logs.json");

export interface LogEntry {
  id: number;
  user: string;
  event: string;
  time: string;
  details?: string;
}

export async function fetchLogsFromApi(
  page: number = 0,
  limit: number = 20
): Promise<PaginatedResponse<LogEntry>> {
  const offset = page * limit;
  return apiGet<PaginatedResponse<LogEntry>>(
    `/api/logs?limit=${limit}&offset=${offset}`
  );
}

export async function addLogViaApi(
  user: string,
  event: string,
  details?: string
): Promise<void> {
  return apiPost("/api/logs", { user, event, details });
}

async function readAllLogsFromFile(): Promise<LogEntry[]> {
  try {
    const data = await fs.readFile(LOGS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

export async function writeLogToFile(
  user: string,
  event: string,
  details?: string
): Promise<void> {
  try {
    const logs = await readAllLogsFromFile();
    const newLog: LogEntry = {
      id: logs.length > 0 ? Math.max(...logs.map((l) => l.id)) + 1 : 1,
      user,
      event,
      time: new Date().toISOString(),
      details,
    };

    logs.push(newLog);
    await fs.writeFile(LOGS_FILE, JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error("Failed to add log:", error);
    throw new Error("Failed to add log entry");
  }
}

export async function getAllLogsFromFile(): Promise<LogEntry[]> {
  return readAllLogsFromFile();
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
