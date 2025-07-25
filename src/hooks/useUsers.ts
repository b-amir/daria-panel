"use client";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useEffect } from "react";
import { fetchUsers } from "@/services/users.service";
import { useUserStore } from "@/stores/userStore";
import { QUERY_KEYS } from "@/constants/queryKeys";

export function useUsers() {
  const { users, optimisticUsers, setUsers } = useUserStore();

  const {
    data: apiUsers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.usersList(),
    queryFn: fetchUsers,
  });

  useEffect(() => {
    if (apiUsers.length > 0) {
      setUsers(apiUsers);
    }
  }, [apiUsers, setUsers]);

  const allUsers = useMemo(() => {
    const convertedOptimisticUsers = optimisticUsers.map((user) => ({
      id: parseInt(user.id) || 999999, // temporary ID for sorting
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      website: user.website,
      address: {
        street: "",
        suite: "",
        city: "",
        zipcode: "",
        geo: { lat: "", lng: "" },
      },
      company: {
        name: "",
        catchPhrase: "",
        bs: "",
      },
    }));

    return [...convertedOptimisticUsers, ...users];
  }, [users, optimisticUsers]);

  const loadNextPage = useCallback(async () => {}, []);

  return {
    users: allUsers,
    isLoading,
    error,
    hasNextPage: false,
    isNextPageLoading: false,
    loadNextPage,
    totalCount: allUsers.length,
  };
}
