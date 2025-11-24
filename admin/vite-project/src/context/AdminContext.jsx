import React, { createContext, useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { authDataContext } from './AuthContext';


export const adminDataContext = createContext();
function AdminContext({children}) {
    let [adminData,setAdminData] = useState(null);
    let {serverUrl} = useContext(authDataContext);
let [loading, setLoading] = useState(true);

    
    const getAdmin = async()=>{
try{
      let res = await axios.post(serverUrl+"/api/user/getadmin",{},{withCredentials:true});

      setAdminData(res.data);
console.log(res.data);}
catch(error){
  setAdminData(null);
  console.log(error);
} finally{
  setLoading(false);
}
    }

    useEffect(()=>{
      getAdmin();
    },[])
    let value={
      adminData,setAdminData,getAdmin

    }
  return (
    <div>
     <adminDataContext.Provider value={{adminData,setAdminData,getAdmin}}>
        {children}
      </adminDataContext.Provider> 
    </div>
  )
}

export default AdminContext
