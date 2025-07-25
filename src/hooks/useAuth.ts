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
  const error = useAuthStore((state) => state.error);
  const isSubmitting = useAuthStore((state) => state.isSubmitting);
  const submitAuth = useAuthStore((state) => state.submitAuth);
  const addOptimisticLog = useLogStore((state) => state.addOptimisticLog);

  const onSubmit = async (data: AuthFormData) => {
    await submitAuth(
      mode,
      data,
      (authMode: AuthMode) => {
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
  const user = useAuthStore((state) => state.user);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  usePageVisitLogger(user?.username);

  return {
    username: user?.username,
    isAuthenticated: user?.isAuthenticated || false,
  };
}
