import React, { useState } from 'react';
import { AuthContext, type User } from './AuthContext';

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
