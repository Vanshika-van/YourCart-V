import React, { createContext, useState } from "react";
import axios from "axios";

export const AdminContext = createContext();   // CHANGED name so default export works

export const AdminContextProvider = ({ children }) => {
  const [adminData, setAdminData] = useState(null);

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
    <AdminContext.Provider value={{ adminData, setAdminData, getAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

// DEFAULT EXPORT
export default AdminContext;
