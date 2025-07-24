"use client";
import { useQuery } from "@tanstack/react-query";
import { PaginatedTable } from "@/components/PaginatedTable";
import { PersonRow } from "@/components/PersonRow";
import { fetchUsers } from "@/services/users.service";

const columns = [
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "company", label: "Company" },
];

export default function UsersPage() {
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-red-600">
          Error loading users:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      </div>
    );
  }

  return (
    <PaginatedTable
      title="Users"
      columns={columns}
      data={users}
      renderRow={(person) => <PersonRow person={person} />}
    />
  );
}
