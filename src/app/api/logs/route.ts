import { NextRequest, NextResponse } from "next/server";
import {
  writeLogToFile,
  readPaginatedLogsFromFile,
  getLogsCountFromFile,
} from "@/services/logs.service";
import { LogType } from "@/types/logs";

async function readAllLogsFromFile() {
  const { promises: fs } = await import("fs");
  const path = await import("path");
  const LOGS_FILE = path.join(process.cwd(), "mockDB", "logs.json");

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
    return [];
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (searchParams.has("limit") || searchParams.has("offset")) {
      const logs = await readPaginatedLogsFromFile(limit, offset);
      const total = await getLogsCountFromFile();

      return NextResponse.json({
        logs,
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      });
    }

    const logs = await readAllLogsFromFile();
    return NextResponse.json(logs);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user, event, type, details } = await req.json();

    if (!user || !event || !type) {
      return NextResponse.json(
        { error: "User, event, and type are required" },
        { status: 400 }
      );
    }

    await writeLogToFile(user, event, type as LogType, details);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to add log" }, { status: 500 });
  }
}
