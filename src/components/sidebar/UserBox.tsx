"use client";

import { useState } from "react";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { FiLogOut as LogoutIcon } from "react-icons/fi";
import { useAuthStore } from "@/stores/authStore";
import { useLogStore } from "@/stores/logStore";
import { LogType } from "@/types/logs";
import { COMMON_STYLES } from "@/constants/commonStyles";

export function UserBox({ username }: { username?: string }) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const addOptimisticLog = useLogStore((state) => state.addOptimisticLog);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    if (username) {
      addOptimisticLog(username, "logout", LogType.LOGOUT, "User logged out");
    }

    await fetch("/api/auth/logout", { method: "POST" });
    logout();
    router.push("/login");
  };

  return (
    <div
      className={`${
        COMMON_STYLES.heights.userBox
      } p-2 px-4 flex items-center bg-gray-50 justify-between border-t shadow-inner border-gray-300 hover:border-gray-300 ${
        isLoggingOut ? "animate-pulse" : ""
      }`}
    >
      <span className="text-sm font-semibold text-gray-800">
        {isLoggingOut ? "Logging out..." : username}
      </span>
      <Button
        variant="text"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="min-w-0 p-0 text-accent"
      >
        <span className="sr-only">logout</span>
        <LogoutIcon className="w-5 h-5" />
      </Button>
    </div>
  );
}
