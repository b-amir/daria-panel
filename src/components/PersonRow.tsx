import { TableCell } from "@mui/material";

interface Person {
  id: number;
  name: string;
  email: string;
}

export function PersonRow({ person }: { person: Person }) {
  return (
    <>
      <TableCell>{person.name}</TableCell>
      <TableCell>{person.email}</TableCell>
    </>
  );
}