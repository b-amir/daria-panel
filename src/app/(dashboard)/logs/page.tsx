"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const logs = [
  { id: 1, user: "Alice Smith", event: "login", time: "2024-06-01 10:00" },
  { id: 2, user: "Bob Johnson", event: "logout", time: "2024-06-01 10:30" },
  { id: 3, user: "Charlie Lee", event: "page view", time: "2024-06-01 11:00" },
];

export default function LogsPage() {
  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" className="p-4 pb-0 font-bold">
        Logs
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Event</TableCell>
            <TableCell>Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{log.user}</TableCell>
              <TableCell>{log.event}</TableCell>
              <TableCell>{log.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
