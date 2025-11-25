import React, { createContext, useState } from "react";
import axios from "axios";
import { authDataContext } from "./AuthContext";

export const adminDataContext = createContext();

export const AdminContextProvider = ({ children }) => {
  const [adminData, setAdminData] = useState(null);
  const { serverUrl } = React.useContext(authDataContext);

  const getAdmin = async () => {
    try {
      const res = await axios.get(serverUrl + "/api/auth/getadmin", {
        withCredentials: true,
      });
      setAdminData(res.data.admin);
    } catch (err) {
      setAdminData(null);
      console.error("Failed to fetch admin:", err);
    }
  };

  return (
    <adminDataContext.Provider value={{ adminData, setAdminData, getAdmin }}>
      {children}
    </adminDataContext.Provider>
  );
};
