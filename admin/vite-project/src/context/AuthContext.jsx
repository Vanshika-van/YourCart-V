import React, { createContext } from "react";

export const authDataContext = createContext();

export const AuthContextProvider = ({ children }) => {
  // Use environment variable or fallback to localhost
  const serverUrl =
    process.env.REACT_APP_SERVER_URL || "http://localhost:8000";

  return (
    <authDataContext.Provider value={{ serverUrl }}>
      {children}
    </authDataContext.Provider>
  );
};
