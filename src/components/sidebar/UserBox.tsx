"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import { useAuthStore } from "@/stores/authStore";
import { useLogStore } from "@/stores/logStore";

export function UserBox({ username }: { username?: string }) {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { addOptimisticLog } = useLogStore();

  const handleLogout = async () => {
    if (username) {
      addOptimisticLog(username, "logout", "User logged out");
    }

    await fetch("/api/auth/logout", { method: "POST" });
    logout();
    router.push("/login");
  };

  return (
    <div className="mt-auto p-2 px-4 flex items-center justify-between border border-gray-200 hover:border-gray-300 rounded-md">
      <span className="text-sm font-semibold text-gray-800">{username}</span>
      <Button
        variant="text"
        onClick={handleLogout}
        className="min-w-0 p-0 text-accent "
      >
        <span className="sr-only">logout</span>
        <FiLogOut className="w-5 h-5" />
      </Button>
    </div>
  );
}
