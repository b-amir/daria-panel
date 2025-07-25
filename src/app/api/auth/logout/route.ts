import { NextRequest, NextResponse } from "next/server";
import { addLogViaApi } from "@/services/logs.service";
import { LogType } from "@/types/logs";

export async function POST(req: NextRequest) {
  const username = req.cookies.get("username")?.value || "unknown";

  try {
    await addLogViaApi(username, "logout", LogType.LOGOUT, "User logged out");
  } catch {
    console.error("Failed to add logout log");
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("logged_in", "", { path: "/", maxAge: 0 });
  response.cookies.set("username", "", { path: "/", maxAge: 0 });
  return response;
}
