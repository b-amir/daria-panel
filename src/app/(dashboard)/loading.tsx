import { CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <CircularProgress className="text-accent" />
    </div>
  );
}