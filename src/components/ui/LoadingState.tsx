interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "Loading...",
  className = "flex items-center justify-center p-8 h-full",
}: LoadingStateProps) {
  return (
    <div className={className}>
      <div className="text-lg text-gray-700">{message}</div>
    </div>
  );
}
