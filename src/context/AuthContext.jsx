import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password, role = 'Operator') => {
    // Simulate API delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email || !password) {
          reject(new Error('Please fill in all fields.'));
          return;
        }
        
        // Simple validation rule
        if (password.length < 4) {
          reject(new Error('Password must be at least 4 characters.'));
          return;
        }

        const userData = {
          email,
          role,
          name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          department: 'Urban Transit Management (Saarthi)',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
          badgeId: 'SRT-' + Math.floor(1000 + Math.random() * 9000),
          lastLogin: new Date().toLocaleString(),
          stats: {
            ticketsResolved: 142,
            uptime: '99.8%',
            alertsSent: 34
          }
        };

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        resolve(userData);
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (updatedData) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedData };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
