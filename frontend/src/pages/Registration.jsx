import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { UserDataContext } from "../context/UserContext";
import Logo from "../assets/logo.png";
import { IoMdEye } from "react-icons/io";
import { FaEye } from "react-icons/fa";

function Registration() {
  const navigate = useNavigate();
  const { serverUrl } = useContext(authDataContext);
  const { getCurrentUser } = useContext(UserDataContext);

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Email/Password signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${serverUrl || "http://localhost:8000"}/api/auth/registration`,
        { name, email, password },
        { withCredentials: true }
      );
      await getCurrentUser();
      navigate("/login");
      console.log("Signup success:", res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-[#141414] to-[#0c2025] text-white flex flex-col items-center justify-start p-4">
      {/* Header */}
      <div className="w-full h-[80px] flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
        <img className="w-[40px]" src={Logo} alt="logo" />
        <h1 className="text-[22px] font-sans">Yourcart</h1>
      </div>

      {/* Page Title */}
      <div className="flex flex-col items-center mt-4 gap-2">
        <span className="text-[25px] font-semibold">Registration Page</span>
        <span className="text-[16px]">Welcome to OneCart, place your order</span>
      </div>

      {/* Form Card */}
      <div className="max-w-[600px] w-full mt-6 bg-[#00000025] border border-[#96969635] backdrop-blur-2xl rounded-lg shadow-lg flex flex-col items-center p-6 gap-4">
        {error && (
          <div className="w-full text-red-400 text-center text-sm bg-red-900/20 border border-red-500/30 rounded p-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="w-full flex flex-col gap-4 relative">
          <input
            type="text"
            placeholder="UserName"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="w-full h-[50px] border-2 border-[#96969635] rounded-lg bg-transparent placeholder-white/70 px-4 font-semibold"
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            autoComplete="username"
            className="w-full h-[50px] border-2 border-[#96969635] rounded-lg bg-transparent placeholder-white/70 px-4 font-semibold"
          />
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              disabled={loading}
              className="w-full h-[50px] border-2 border-[#96969635] rounded-lg bg-transparent placeholder-white/70 px-4 font-semibold"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">
              {showPassword ? (
                <IoMdEye onClick={() => setShowPassword(false)} />
              ) : (
                <FaEye onClick={() => setShowPassword(true)} />
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[50px] bg-[#6060f5] rounded-lg flex items-center justify-center text-[17px] font-semibold hover:bg-[#4a4af0] transition-colors disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="flex gap-2 mt-2 text-sm">
            Already have an account?
            <span
              className="text-[#5555f6cf] font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Registration;