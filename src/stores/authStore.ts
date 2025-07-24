import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getUsernameFromCookies } from "@/utils/cookies";

interface User {
  username: string;
  isAuthenticated: boolean;
}

interface AuthState {
  user: User | null;

  login: (username: string) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,

      login: (username: string) => {
        set({
          user: {
            username,
            isAuthenticated: true,
          },
        });
      },

      logout: () => {
        set({
          user: null,
        });
      },

      initializeAuth: () => {
        const username = getUsernameFromCookies();
        if (username) {
          get().login(username);
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
