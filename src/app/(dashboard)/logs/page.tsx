"use client";
import { PaginatedTable } from "@/components/PaginatedTable";
import { TableCell } from "@mui/material";

const logs = [
  { id: 1, user: "Alice Smith", event: "login", time: "2024-06-01 10:00" },
  { id: 2, user: "Bob Johnson", event: "logout", time: "2024-06-01 10:30" },
  { id: 3, user: "Charlie Lee", event: "page view", time: "2024-06-01 11:00" },
];

const columns = [
  { id: "user", label: "User" },
  { id: "event", label: "Event" },
  { id: "time", label: "Time" },
];

export default function LogsPage() {
  return (
    <PaginatedTable
      title="Logs"
      columns={columns}
      data={logs}
      renderRow={(log) => (
        <>
          <TableCell>{log.user}</TableCell>
          <TableCell>{log.event}</TableCell>
          <TableCell>{log.time}</TableCell>
        </>
      )}
    />
  );
}
