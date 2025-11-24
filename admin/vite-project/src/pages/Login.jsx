import React, { useContext,  useState } from 'react'
import logo from '../assets/logo.png'
import { IoMdEye } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import Logo from '../assets/logo.png'; // adjust the path to match your file structure
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';

import { adminDataContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Login() {
    const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
const {serverUrl} = useContext(authDataContext)
const {getAdmin} = useContext(adminDataContext)
const navigate  = useNavigate();




  const AdminLogin = async(e) => {
    e.preventDefault(); 
    
    try {
      const result = await axios.post(serverUrl+"/api/auth/adminlogin", {email,password},{withCredentials:true});
      // handle successful login here (e.g., redirect, set auth state, etc.)
      console.log(result.data);
      toast.success("AdminLogin Successfully");
      await getAdmin();
      navigate("/");  
    } catch (error) {
      setError("Invalid email or password");
      console.error("Login error:", error);
      toast.error("AdminLogin Failed")
    }
  };

  return (
    <div>
        <div className="w-[100vw] h-[100vh] bg-gradient-to-r from-[#141414] to-[#0c2025] text-white flex flex-col items-center justify-start">
              {/* Header */}
              <div
                className="w-full h-[80px] flex items-center justify-start px-[30px] gap-[10px] cursor-pointer"
                
              >
                <img className="w-[40px]" src={Logo} alt="logo" />
                <h1 className="text-[22px] font-sans">Yourcart</h1>
              </div>
        
              {/* Page title */}
              <div className="w-full h-[100px] flex flex-col items-center justify-center gap-[10px]">
                <span className="text-[25px] font-semibold">Login Page</span>
                <span className="text-[16px]">Welcome to OneCart, Apply to Admin Login </span>
              </div>
        
              {/* Form card */}
              <div className="max-w-[600px] w-[90%] h-[500px] bg-[#00000025] border-[1px] border-[#96969635] backdrop-blur-2xl rounded-lg shadow-lg flex items-center justify-center">
                <form
                  onSubmit={AdminLogin}
                  className="w-[90%] h-[90%] flex flex-col items-center justify-start gap-[20px]"
                >
                  {/* Error message */}
                  {error && (
                    <div className="w-full text-red-400 text-center text-sm bg-red-900/20 border border-red-500/30 rounded p-3">
                      <p>{error}</p>
                    </div>
                  )}
        
                  {/* Email/Password inputs */}
                  <div className="w-[90%] h-[400px] flex flex-col items-center justify-center gap-[15px] relative">
                    <input
                      type="text"
                      className="w-[100%] h-[50px] border-[2px] border-[#96969635] backdrop-blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#ffffffc7] px-[20px] font-semibold"
                      placeholder="Email"
                      required
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                    />
        
                    <div className="relative w-[100%]">
                      <input
                        type={show ? "text" : "password"}
                        className="w-[100%] h-[50px] border-[2px] border-[#96969635] backdrop-blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#ffffffc7] px-[20px] font-semibold"
                        placeholder="Password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                      />
        
                      <div className="absolute right-[5%] top-[50%] -translate-y-1/2 cursor-pointer">
                        {show ? (
                          <IoMdEye
                            className="w-[20px] h-[20px]"
                            onClick={() => setShow(false)}
                          />
                        ) : (
                          <FaEye
                            className="w-[20px] h-[20px]"
                            onClick={() => setShow(true)}
                          />
                        )}
                      </div>
                    </div>
        
                    {/* Submit button */}
                    <button
                      type="submit"
                      className="w-[100%] h-[50px] bg-[#6060f5] rounded-lg flex items-center justify-center mt-[20px] text-[17px] font-semibold"
                    >
                      Login
                    </button>
        
                    
                  </div>
                </form>
              </div>
            
      
        </div>
    </div>
  )
}

export default Login
