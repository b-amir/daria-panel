import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const USERS_FILE = path.join(process.cwd(), "users.json");

type User = { username: string; password: string };

export async function getAllUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

export async function authenticateUser(
  username: string,
  password: string
): Promise<{ success: boolean; error?: string; setLoggedIn?: boolean }> {
  const users = await getAllUsers();

  if (users.length === 0) {
    return { success: false, error: "No users found" };
  }

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    return { success: true, setLoggedIn: true };
  } else {
    return { success: false, error: "Invalid credentials" };
  }
}

export async function registerUser(
  username: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const users = await getAllUsers();

  if (users.find((u) => u.username === username)) {
    return { success: false, error: "User already exists" };
  }

  users.push({ username, password });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));

  return { success: true };
}

export function logoutUser(): Response {
  const response = NextResponse.json({ success: true });
  response.cookies.set("logged_in", "", { path: "/", maxAge: 0 });
  return response;
}
