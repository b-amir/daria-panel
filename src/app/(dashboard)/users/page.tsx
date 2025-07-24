"use client";
import { PaginatedTable } from "@/components/PaginatedTable";
import { PersonRow } from "@/components/PersonRow";

const people = [
  { id: 1, name: "Alice Smith", email: "alice@example.com" },
  { id: 2, name: "Bob Johnson", email: "bob@example.com" },
  { id: 3, name: "Charlie Lee", email: "charlie@example.com" },
];

const columns = [
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
];

export default function UsersPage() {
  return (
    <PaginatedTable
      title="Users"
      columns={columns}
      data={people}
      renderRow={(person) => <PersonRow person={person} />}
    />
  );
}
