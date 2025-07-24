"use client";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/hooks/useAuth";

export default function SignupPage() {
  const { error, isSubmitting, onSubmit } = useAuth("signup");

  return (
    <AuthForm
      mode="signup"
      onSubmit={onSubmit}
      error={error}
      isSubmitting={isSubmitting}
    />
  );
}
