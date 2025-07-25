import { CircularProgress } from "@mui/material";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "Loading...",
  className = "flex items-center justify-center min-h-screen",
}: LoadingStateProps) {
  return (
    <div className={className}>
      <div className="flex flex-col items-center gap-4">
        <CircularProgress className="text-accent" />
        <div className="text-sm text-gray-600 animate-pulse mt-2">
          {message}
        </div>
      </div>
    </div>
  );
}
