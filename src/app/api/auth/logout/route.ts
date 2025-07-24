import { NextRequest, NextResponse } from "next/server";
import { addLogViaApi } from "@/services/logs.service";

export async function POST(req: NextRequest) {
  const username = req.cookies.get("username")?.value || "unknown";

  await addLogViaApi(username, "logout", "User logged out");

  const response = NextResponse.json({ success: true });
  response.cookies.set("logged_in", "", { path: "/", maxAge: 0 });
  response.cookies.set("username", "", { path: "/", maxAge: 0 });
  return response;
}
