import React, { createContext, useContext } from 'react';

export const theme = {
  colors: {
    primary: '#facc15', // жълт
    primaryDark: '#eab308',
    secondary: '#713f12', // кафяв
    secondaryLight: '#92400e',
    background: '#fef3c7',
    white: '#ffffff',
    black: '#000000',
    gray: '#6b7280',
    error: '#ef4444',
    success: '#22c55e',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  fontSizes: {
    small: 12,
    regular: 14,
    medium: 16,
    large: 18,
    xlarge: 24,
  },
};

const ThemeContext = createContext(theme);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
