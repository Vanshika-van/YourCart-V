import React, { createContext, useState } from "react";

export const authDataContext = createContext({
  serverUrl: "http://localhost:8000",
});

export const AuthContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
    const serverUrl = "http://localhost:8000";
  
  return (
    <authDataContext.Provider value={{ userData, setUserData, serverUrl }}>
      {children}
    </authDataContext.Provider>
  );
};
