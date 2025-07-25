import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/services/auth.service";
import { addLogViaApi } from "@/services/logs.service";
import { LogType } from "@/types/logs";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const result = await authenticateUser(username, password);

  if (result.success) {
    try {
      await addLogViaApi(
        username,
        "login",
        LogType.LOGIN,
        "User logged in successfully"
      );
    } catch {
      console.error("Failed to add login log");
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("logged_in", "true", { path: "/" });
    response.cookies.set("username", username, { path: "/" });
    return response;
  } else {
    try {
      await addLogViaApi(
        username || "unknown",
        "login_failed",
        LogType.LOGIN_FAILED,
        "Invalid credentials"
      );
    } catch {
      console.error("Failed to add login failed log");
    }

    return NextResponse.json({ error: result.error }, { status: 401 });
  }
}
