"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthFormData } from "@/components/AuthForm";

type AuthMode = "login" | "signup";

const API_ROUTES = {
  login: "/api/auth/login",
  signup: "/api/auth/signup",
};

const SUCCESS_REDIRECTS = {
  login: "/users",
  signup: "/login",
};

async function performAuthRequest(mode: AuthMode, data: AuthFormData) {
  const res = await fetch(API_ROUTES[mode], {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const responseData = await res.json();
    throw new Error(responseData.error || `An error occurred during ${mode}.`);
  }
}

export function useAuth(mode: AuthMode) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: AuthFormData) => {
    setError(null);
    setIsSubmitting(true);

    try {
      await performAuthRequest(mode, data);

      router.push(SUCCESS_REDIRECTS[mode]);
      if (mode === "login") {
        router.refresh();
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return { error, isSubmitting, onSubmit };
}
