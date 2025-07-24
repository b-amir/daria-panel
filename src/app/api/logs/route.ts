import { NextRequest, NextResponse } from "next/server";
import {
  writeLogToFile,
  getAllLogsFromFile,
  readPaginatedLogsFromFile,
  getLogsCountFromFile,
} from "@/services/logs.service";

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

    const logs = await getAllLogsFromFile();
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
    const { user, event, details } = await req.json();

    if (!user || !event) {
      return NextResponse.json(
        { error: "User and event are required" },
        { status: 400 }
      );
    }

    await writeLogToFile(user, event, details);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to add log" }, { status: 500 });
  }
}
