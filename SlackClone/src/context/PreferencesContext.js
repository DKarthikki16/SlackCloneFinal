import React, { createContext, useContext, useState } from 'react';

const PreferencesContext = createContext();

export function PreferencesProvider({ children }) {
  const [compactMode, setCompactMode] = useState(false);
  const [underlineLinks, setUnderlineLinks] = useState(false);
  const [showTypingIndicators, setShowTypingIndicators] = useState(true);
  const [raiseHand, setRaiseHand] = useState(false);

  return (
    <PreferencesContext.Provider value={{
      compactMode, setCompactMode,
      underlineLinks, setUnderlineLinks,
      showTypingIndicators, setShowTypingIndicators,
      raiseHand, setRaiseHand,
    }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  return useContext(PreferencesContext);
}