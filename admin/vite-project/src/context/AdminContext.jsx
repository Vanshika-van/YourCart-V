import React, { createContext, useState } from "react";
import axios from "axios";

export const adminDataContext = createContext();

export const AdminContextProvider = ({ children }) => {
  const [adminData, setAdminData] = useState(null);

  // Lazy function to get serverUrl inside function (Render-friendly)
  const getAdmin = async (serverUrl) => {
    try {
      const res = await axios.get(`${serverUrl}/api/auth/getadmin`, {
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

export default AdminContext;
