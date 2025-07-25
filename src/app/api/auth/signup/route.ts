import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/services/auth.service";
import { addLogViaApi } from "@/services/logs.service";
import { LogType } from "@/types/logs";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const result = await registerUser(username, password);

  if (result.success) {
    try {
      await addLogViaApi(
        username,
        "signup",
        LogType.SIGNUP,
        "User account created"
      );
    } catch (error) {
      console.error("Failed to add signup log", error);
    }
    return NextResponse.json({ success: true });
  } else {
    try {
      await addLogViaApi(
        username || "unknown",
        "signup_failed",
        LogType.SIGNUP_FAILED,
        result.error || "Registration failed"
      );
    } catch (error) {
      console.error("Failed to add signup failed log", error);
    }
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
}
