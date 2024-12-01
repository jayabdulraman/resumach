import { UserDto } from "@/lib/dto/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  user: UserDto | null;
  userCurrentSubscription: string | null;
};

type AuthActions = {
  setUser: (user: UserDto | null, userCurrentSubscription: string | null) => void;
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      userCurrentSubscription: null,
      setUser: (user, userCurrentSubscription) => {
        set({ user, userCurrentSubscription });
      },
    }),
    { name: "auth" },
  ),
);
