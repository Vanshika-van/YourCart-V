import React, { useContext, useState } from "react";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { adminDataContext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const { serverUrl } = useContext(authDataContext);
  const { getAdmin } = useContext(adminDataContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        serverUrl + "/api/auth/adminlogin",
        { email, password },
        { withCredentials: true }
      );

      toast.success("Admin login successful!");
      await getAdmin(); // fetch and store admin data
      navigate("/admin"); // navigate to admin home page
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
      toast.error("Admin login failed!");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-[#141414] to-[#0c2025] text-white">
      <form
        onSubmit={handleLogin}
        className="bg-[#00000025] backdrop-blur-2xl p-10 rounded-lg flex flex-col gap-4 w-[400px]"
      >
        <h1 className="text-2xl font-semibold text-center">Admin Login</h1>
        {error && <div className="text-red-400 text-center">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded bg-transparent border border-gray-500"
          required
        />
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 rounded bg-transparent border border-gray-500 w-full"
            required
          />
          <span
            className="absolute right-2 top-2 cursor-pointer"
            onClick={() => setShow(!show)}
          >
            {show ? "Hide" : "Show"}
          </span>
        </div>

        <button
          type="submit"
          className="bg-[#6060f5] p-2 rounded font-semibold mt-2"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
