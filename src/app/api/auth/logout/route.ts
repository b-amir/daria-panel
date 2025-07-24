import { logoutUser } from "@/app/utils/user";

export async function POST() {
  return logoutUser();
}
