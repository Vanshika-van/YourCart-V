import React, { createContext, useState } from "react";

export const authDataContext = createContext({
  serverUrl: "https://yoourcart-v-backend.onrender.com",
});

export const AuthContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
    const serverUrl = "https://yoourcart-v-backend.onrender.com";
  
  return (
    <authDataContext.Provider value={{ userData, setUserData, serverUrl }}>
      {children}
    </authDataContext.Provider>
  );
};
