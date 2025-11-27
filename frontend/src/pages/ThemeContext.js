import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const getInitialTheme = () => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return document.body.classList.contains('dark-mode');
  };

  const getInitialCursor = () => {
    return localStorage.getItem('cursor') || 'default';
  };

  const [isDark, setIsDark] = useState(getInitialTheme);
  const [cursor, setCursor] = useState(getInitialCursor);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    document.body.style.cursor = cursor;
    localStorage.setItem('cursor', cursor);
  }, [cursor]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, toggleTheme, cursor, setCursor }}>
      {children}
    </ThemeContext.Provider>
  );
};