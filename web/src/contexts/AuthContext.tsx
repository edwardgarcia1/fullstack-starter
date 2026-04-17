import { createContext } from 'react';

export interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (tokens: { accessToken: string; refreshToken: string }, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
