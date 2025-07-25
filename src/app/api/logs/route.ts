import { NextRequest, NextResponse } from "next/server";
import {
  writeLogToFile,
  readPaginatedLogsFromFile,
  getLogsCountFromFile,
} from "@/services/logs.service";
import { LogType } from "@/types/logs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    let limit = 20;
    const limitParam = searchParams.get("limit");
    if (limitParam) {
      const parsedLimit = parseInt(limitParam);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        limit = Math.min(parsedLimit, 100);
      }
    }

    let offset = 0;
    const offsetParam = searchParams.get("offset");
    if (offsetParam) {
      const parsedOffset = parseInt(offsetParam);
      if (!isNaN(parsedOffset) && parsedOffset >= 0) {
        offset = parsedOffset;
      }
    }

    const logs = await readPaginatedLogsFromFile(limit, offset);
    const total = await getLogsCountFromFile();

    return NextResponse.json({
      logs,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
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
  } catch (error) {
    console.error("Error adding log:", error);
    return NextResponse.json({ error: "Failed to add log" }, { status: 500 });
  }
}
