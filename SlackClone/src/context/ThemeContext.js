import React, { createContext, useContext, useState } from 'react';

const themes = {
  dark: {
    background: '#18171C',
    card: '#232129',
    text: '#fff',
    secondaryText: '#A3A3A3',
    accent: '#4A99E9',
    border: '#232129',
    input: '#232129',
    placeholder: '#888',
  },
  light: {
    background: '#fff',
    card: '#f5f5f5',
    text: '#18171C',
    secondaryText: '#888',
    accent: '#4A99E9',
    border: '#e0e0e0',
    input: '#f0f0f0',
    placeholder: '#aaa',
  },
};

const ThemeContext = createContext({
  theme: themes.dark,
  isDark: true,
  setIsDark: () => {},
});

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? themes.dark : themes.light;
  return (
    <ThemeContext.Provider value={{ theme, isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}