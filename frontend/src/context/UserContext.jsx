import React, { createContext, useState, useContext } from "react";
import axios from "axios";
import { authDataContext } from "./AuthContext";

export const UserDataContext = createContext();

function UserContextProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const { serverUrl } = useContext(authDataContext);

  const getCurrentUser = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/getcurrentuser`,
        { 
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (result.data) {
        setUserData(result.data);
      } else {
        setUserData(null);
      }
    } catch (error) {
      setUserData(null);
      // Only log the error if it's not a 401 (unauthorized)
      if (error.response?.status !== 401) {
        console.error('Error fetching user data:', error);
      }
    }
  };

  let value = {
    userData,
    setUserData,
    getCurrentUser,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export default UserContextProvider;