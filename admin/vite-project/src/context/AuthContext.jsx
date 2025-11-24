import React, { createContext } from 'react';
export const authDataContext = createContext()
function AuthContext({children}) {
    let serverUrl ="https://yourcart-v-backend.onrender.com"

    
  return (
    
      <authDataContext.Provider value={{ serverUrl }}>
        {children}
      </authDataContext.Provider>
    
  )
}

export default AuthContext
