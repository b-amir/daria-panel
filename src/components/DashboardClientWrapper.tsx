"use client";
import { memo } from "react";
import { useOptimizedAuth } from "@/hooks/useOptimizedAuth";

interface DashboardClientWrapperProps {
  children: React.ReactNode;
}

export const DashboardClientWrapper = memo<DashboardClientWrapperProps>(
  ({ children }) => {
    useOptimizedAuth();

    return <>{children}</>;
  }
);

DashboardClientWrapper.displayName = "DashboardClientWrapper";
