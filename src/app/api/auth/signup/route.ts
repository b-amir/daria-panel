import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/services/auth.service";
import { addLogViaApi } from "@/services/logs.service";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const result = await registerUser(username, password);

  if (result.success) {
    await addLogViaApi(username, "signup", "User account created");
    return NextResponse.json({ success: true });
  } else {
    await addLogViaApi(
      username || "unknown",
      "signup_failed",
      result.error || "Registration failed"
    );
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
}
