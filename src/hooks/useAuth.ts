"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthFormData } from "@/components/AuthForm";
import { useAuthStore } from "@/stores/authStore";
import { useLogStore } from "@/stores/logStore";
import { usePageVisitLogger } from "./useLogs";

type AuthMode = "login" | "signup";

const SUCCESS_REDIRECTS = {
  login: "/users",
  signup: "/login",
};

export function useAuth(mode: AuthMode) {
  const router = useRouter();
  const { error, isSubmitting, submitAuth } = useAuthStore();
  const { addOptimisticLog } = useLogStore();

  const onSubmit = async (data: AuthFormData) => {
    await submitAuth(
      mode,
      data,
      (authMode) => {
        router.push(SUCCESS_REDIRECTS[authMode]);
        if (authMode === "login") {
          router.refresh();
        }
      },
      addOptimisticLog
    );
  };

  return { error, isSubmitting, onSubmit };
}

export function useAuthState() {
  const { user, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  usePageVisitLogger(user?.username);

  return {
    username: user?.username,
    isAuthenticated: user?.isAuthenticated || false,
  };
}
