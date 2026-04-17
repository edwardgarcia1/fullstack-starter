import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  login: (tokens: { accessToken: string; refreshToken: string }, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      login: (tokens, user) => {
        set({ accessToken: tokens.accessToken, user });
        localStorage.setItem('refreshToken', tokens.refreshToken);
      },
      logout: () => {
        set({ accessToken: null, user: null });
        localStorage.removeItem('refreshToken');
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken }),
    }
  )
);
