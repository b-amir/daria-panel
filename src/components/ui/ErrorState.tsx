interface ErrorStateProps {
  error: Error | unknown;
  prefix?: string;
  className?: string;
}

export function ErrorState({
  error,
  prefix = "Error",
  className = "flex items-center justify-center p-8 h-full",
}: ErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : "Unknown error";

  return (
    <div className={className}>
      <div className="text-lg text-red-600 text-center max-w-md">
        {prefix}: {errorMessage}
      </div>
    </div>
  );
}
