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

const people = [
  { id: 1, name: "Alice Smith", email: "alice@example.com" },
  { id: 2, name: "Bob Johnson", email: "bob@example.com" },
  { id: 3, name: "Charlie Lee", email: "charlie@example.com" },
];

export default function UsersPage() {
  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" className="p-4 pb-0 pt-10 font-bold text-2xl">
        Users
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {people.map((person) => (
            <TableRow key={person.id}>
              <TableCell>{person.name}</TableCell>
              <TableCell>{person.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
