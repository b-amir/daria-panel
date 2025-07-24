"use client";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { error, isSubmitting, onSubmit } = useAuth("login");

  return (
    <AuthForm
      mode="login"
      onSubmit={onSubmit}
      error={error}
      isSubmitting={isSubmitting}
    />
  );
}
