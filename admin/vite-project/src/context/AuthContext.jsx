import React, { createContext } from 'react';
export const authDataContext = createContext()
function AuthContext({children}) {
    let serverUrl ="https://yoourcart-v-backend.onrender.com"

    
  return (
    
      <authDataContext.Provider value={{ serverUrl }}>
        {children}
      </authDataContext.Provider>
    
  )
}

export default AuthContext

