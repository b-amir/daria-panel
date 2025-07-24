import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/app/utils/user";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const result = await registerUser(username, password);

  if (result.success) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
}
