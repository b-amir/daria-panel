"use client";
import { memo } from "react";
import { useAuthState } from "@/hooks/useAuth";

interface DashboardClientWrapperProps {
  children: React.ReactNode;
}

export const DashboardClientWrapper = memo<DashboardClientWrapperProps>(
  ({ children }) => {
    useAuthState();

    return <>{children}</>;
  }
);

DashboardClientWrapper.displayName = "DashboardClientWrapper";
