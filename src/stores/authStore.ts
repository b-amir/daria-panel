import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getUsernameFromCookies } from "@/utils/cookies";

interface User {
  username: string;
  isAuthenticated: boolean;
}

type AuthMode = "login" | "signup";

interface AuthFormData {
  username: string;
  password: string;
}

interface AuthState {
  user: User | null;
  error: string | null;
  isSubmitting: boolean;

  login: (username: string) => void;
  logout: () => void;
  initializeAuth: () => void;
  submitAuth: (
    mode: AuthMode,
    data: AuthFormData,
    onSuccess: (mode: AuthMode) => void,
    addOptimisticLog: (user: string, event: string, details?: string) => void
  ) => Promise<void>;
  clearError: () => void;
}

const API_ROUTES = {
  login: "/api/auth/login",
  signup: "/api/auth/signup",
};

async function performAuthRequest(mode: AuthMode, data: AuthFormData) {
  const res = await fetch(API_ROUTES[mode], {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    try {
      const responseData = await res.json();
      throw new Error(responseData.error || `${mode} failed`);
    } catch {
      throw new Error(`Server error (${res.status})`);
    }
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      error: null,
      isSubmitting: false,

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

      submitAuth: async (
        mode: AuthMode,
        data: AuthFormData,
        onSuccess: (mode: AuthMode) => void,
        addOptimisticLog: (
          user: string,
          event: string,
          details?: string
        ) => void
      ) => {
        set({ error: null, isSubmitting: true });

        try {
          await performAuthRequest(mode, data);

          if (mode === "login") {
            get().login(data.username);
            addOptimisticLog(
              data.username,
              "login",
              "User logged in successfully"
            );
          } else {
            addOptimisticLog(data.username, "signup", "User account created");
          }

          onSuccess(mode);
        } catch (err) {
          const errorMsg =
            err instanceof Error ? err.message : "Authentication failed";
          set({ error: errorMsg });
          addOptimisticLog(
            data.username || "unknown",
            `${mode}_failed`,
            errorMsg
          );
        } finally {
          set({ isSubmitting: false });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
