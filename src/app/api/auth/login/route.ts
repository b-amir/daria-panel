import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/services/auth.service";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const result = await authenticateUser(username, password);

  if (result.success) {
    const response = NextResponse.json({ success: true });
    response.cookies.set("logged_in", "true", { path: "/" });
    response.cookies.set("username", username, { path: "/" });
    return response;
  } else {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }
}
