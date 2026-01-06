import React, { createContext, useState, useCallback } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Try to restore user from localStorage
    const stored = localStorage.getItem('edupulse_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((userName, role) => {
    const newUser = { name: userName, role };
    setUser(newUser);
    localStorage.setItem('edupulse_user', JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('edupulse_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
