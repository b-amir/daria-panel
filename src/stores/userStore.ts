import { create } from "zustand";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

interface OptimisticUser {
  id: string; // temporary ID for optimistic updates
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  isOptimistic: true;
}

interface UserState {
  users: User[];
  optimisticUsers: OptimisticUser[];

  setUsers: (users: User[]) => void;
  addOptimisticUser: (
    user: Omit<OptimisticUser, "id" | "isOptimistic">
  ) => void;
  removeOptimisticUser: (id: string) => void;
  clearOptimisticUsers: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  optimisticUsers: [],

  setUsers: (users: User[]) => {
    set({ users });
  },

  addOptimisticUser: (
    userData: Omit<OptimisticUser, "id" | "isOptimistic">
  ) => {
    const optimisticUser: OptimisticUser = {
      ...userData,
      id: crypto.randomUUID(),
      isOptimistic: true,
    };

    set((state) => ({
      optimisticUsers: [...state.optimisticUsers, optimisticUser],
    }));
  },

  removeOptimisticUser: (id: string) => {
    set((state) => ({
      optimisticUsers: state.optimisticUsers.filter((user) => user.id !== id),
    }));
  },

  clearOptimisticUsers: () => {
    set({ optimisticUsers: [] });
  },
}));
