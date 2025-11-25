import React, { createContext } from 'react';

// Create the context
export const authDataContext = createContext();

// Context provider component
function AuthContext({ children }) {
  // Backend server URL
  const serverUrl = "https://yourcart-v-backend.onrender.com";

  return (
    <authDataContext.Provider value={{ serverUrl }}>
      {children}
    </authDataContext.Provider>
  );
}

export default AuthContext;
