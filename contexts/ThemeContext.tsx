import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

export interface Theme {
  isDark: boolean;
  colors: {
    background: string;
    surface: string;
    card: string;
    text: string;
    textSecondary: string;
    primary: string;
    success: string;
    warning: string;
    error: string;
    border: string;
    shadow: string;
    profit: string;
    loss: string;
    breakEven: string;
    gradientStart: string;
    gradientEnd: string;
  };
}

const lightTheme: Theme = {
  isDark: false,
  colors: {
    background: '#f8fafc',
    surface: '#ffffff',
    card: '#ffffff',
    text: '#1f2937',
    textSecondary: '#6b7280',
    primary: '#2563eb',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#dc2626',
    border: '#e5e7eb',
    shadow: '#000000',
    profit: '#dcfce7',
    loss: '#fee2e2',
    breakEven: '#fef3c7',
    gradientStart: '#2563eb',
    gradientEnd: '#10b981',
  },
};

const darkTheme: Theme = {
  isDark: true,
  colors: {
    background: '#0f172a',
    surface: '#1e293b',
    card: '#334155',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    primary: '#3b82f6',
    success: '#22c55e',
    warning: '#eab308',
    error: '#ef4444',
    border: '#475569',
    shadow: '#000000',
    profit: '#166534',
    loss: '#991b1b',
    breakEven: '#a16207',
    gradientStart: '#1e40af',
    gradientEnd: '#059669',
  },
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const colorScheme = Appearance.getColorScheme();
    setIsDark(colorScheme === 'dark');

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDark(colorScheme === 'dark');
    });

    return () => subscription?.remove();
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};