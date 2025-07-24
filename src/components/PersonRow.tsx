import { TableCell } from "@mui/material";
import { User } from "@/services/users.service";

export function PersonRow({ person }: { person: User }) {
  return (
    <>
      <TableCell>{person.name}</TableCell>
      <TableCell>{person.email}</TableCell>
      <TableCell>{person.phone}</TableCell>
      <TableCell>{person.company.name}</TableCell>
    </>
  );
}
