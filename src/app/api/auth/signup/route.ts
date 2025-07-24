import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/services/auth.service";
import { addLogViaApi } from "@/services/logs.service";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const result = await registerUser(username, password);

  if (result.success) {
    try {
      await addLogViaApi(username, "signup", "User account created");
    } catch {
      console.error("Failed to add signup log");
    }
    return NextResponse.json({ success: true });
  } else {
    try {
      await addLogViaApi(
        username || "unknown",
        "signup_failed",
        result.error || "Registration failed"
      );
    } catch {
      console.error("Failed to add signup failed log");
    }
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
}
