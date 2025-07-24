import { CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <CircularProgress className="text-accent" />
        <div className="text-lg text-gray-700">Loading...</div>
      </div>
    </div>
  );
}
