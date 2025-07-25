import { User } from "@/stores/userStore";

export type { User };

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
};

export const fetchUserById = async (id: string | number): Promise<User> => {
  const response = await fetch(`/api/users/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("User not found");
    }
    throw new Error("Failed to fetch user");
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch user");
  }

  return result.data;
};
