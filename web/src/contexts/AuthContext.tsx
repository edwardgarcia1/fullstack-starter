import React, { createContext, useState } from 'react';

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (tokens: { accessToken: string; refreshToken: string }, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to get initial state from localStorage
const getInitialState = () => {
  const storedToken = localStorage.getItem('accessToken');
  const storedUser = localStorage.getItem('user');
  return {
    accessToken: storedToken,
    user: storedUser ? JSON.parse(storedUser) : null,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(() => getInitialState().accessToken);
  const [user, setUser] = useState<User | null>(() => getInitialState().user);

  const login = (tokens: { accessToken: string; refreshToken: string }, user: User) => {
    setAccessToken(tokens.accessToken);
    setUser(user);
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
