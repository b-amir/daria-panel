import { TableCell } from "@mui/material";

interface Log {
  id: number;
  user: string;
  event: string;
  time: string;
}

export function LogRow({ log }: { log: Log }) {
  return (
    <>
      <TableCell>{log.user}</TableCell>
      <TableCell>{log.event}</TableCell>
      <TableCell>{log.time}</TableCell>
    </>
  );
}