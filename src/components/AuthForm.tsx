"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Alert, Paper, Typography } from "@mui/material";
import Link from "next/link";

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type AuthFormData = z.infer<typeof schema>;

type AuthFormProps = {
  mode: "login" | "signup";
  onSubmit: (data: AuthFormData) => Promise<void>;
  error: string | null;
  isSubmitting: boolean;
};

const modeConfig = {
  login: {
    title: "Login",
    linkText: "Don't have an account? Sign up",
    linkHref: "/signup",
  },
  signup: {
    title: "Sign Up",
    linkText: "Already have an account? Login",
    linkHref: "/login",
  },
};

export function AuthForm({
  mode,
  onSubmit,
  error,
  isSubmitting,
}: AuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(schema),
  });

  const { title, linkText, linkHref } = modeConfig[mode];

  return (
    <Paper
      elevation={0}
      className="w-full mt-6 p-8 flex flex-col items-center !rounded-xl !shadow-md border border-gray-300"
    >
      <Typography
        component="h1"
        variant="h6"
        className="mb-2 !font-bold !text-base text-gray-700"
      >
        {title}
      </Typography>
      {error && (
        <Alert
          severity="error"
          className="mb-4 mt-2 !rounded-md w-full text-sm"
        >
          {error}
        </Alert>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-1 mt-4"
      >
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          {...register("username")}
          error={!!errors.username}
          helperText={errors.username?.message}
          autoComplete="username"
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isSubmitting}
          sx={{ mt: 2, py: 1.5 }}
        >
          {isSubmitting ? "Processing..." : title}
        </Button>
        <Link
          href={linkHref}
          className="text-sm text-center mt-4 text-accent hover:underline"
        >
          {linkText}
        </Link>
      </form>
    </Paper>
  );
}
