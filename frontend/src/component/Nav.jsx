 import React, { useContext, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import axios from "axios";
  import { UserDataContext } from "../context/UserContext";
  import logo from "../assets/logo.png";
  import { IoSearchCircle, IoSearchCircleOutline, IoCartOutline } from "react-icons/io5";
  import { FaRegUserCircle } from "react-icons/fa";
  import { IoMdHome } from "react-icons/io";
  import { HiOutlineCollection } from "react-icons/hi";
  import { MdContacts } from "react-icons/md";
import { ShopDataContext } from "../context/ShopContext";
  
  function Nav() {
    const { getCurrentUser, userData } = useContext(UserDataContext);
    const {serverUrl}= useContext(UserDataContext)
    const {showSearch, setShowSearch,search,setSearch,getCartCount} = useContext(ShopDataContext);
    const [showProfile, setShowProfile] = useState(false);
    const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const result = await axios.get(serverUrl+"/api/auth/logout", { withCredentials: true });
      console.log(result.data);
      getCurrentUser();
     
    } catch (error) {
      console.error(error);
      
    }
  }

  return (
    <>
      {/* Navbar */}
      <div className="w-[100vw] h-[70px] bg-[#ecfafaec] z-20 fixed top-0 flex items-center justify-between px-[30px] shadow-md shadow-black">
        
        {/* Left - Logo */}
        <div className="w-[20%] lg:w-[30%] flex items-center gap-[20px]">
          <img src={logo} alt="Logo" className="w-[30px]" />
          <h1 className="text-[25px] text-black font-sans">Yourcart</h1>
        </div>
         <div className='w-[50%] lg:w-[40%] hidden md:flex'>
        {/* Middle - Menu */}
        <ul className="flex items-center gap-[19px] text-[white] ">
          <li className="text-[15px] hover:bg-slate-500 cursor-pointer bg-[#000000c9] py-[10px] px-[20px] rounded-2xl" onClick={()=>navigate("/")}>HOME</li>
          <li className="text-[15px] hover:bg-slate-500 cursor-pointer bg-[#000000c9] py-[10px] px-[20px] rounded-2xl" onClick={()=>navigate("/collection")}>COLLECTIONS</li>
          <li className="text-[15px] hover:bg-slate-500 cursor-pointer bg-[#000000c9] py-[10px] px-[20px] rounded-2xl" onClick={()=>navigate("/about")}>ABOUT</li>
          <li className="text-[15px] hover:bg-slate-500 cursor-pointer bg-[#000000c9] py-[10px] px-[20px] rounded-2xl" onClick={()=>navigate("/contact")}>CONTACT</li>
        </ul>
        </div>

        {/* Right - Icons */}
        <div className="flex items-center gap-[20px] relative">
          {/* Search Icon */}
          {showSearch ? (
            <IoSearchCircle
              className="w-[30px] h-[30px] text-black cursor-pointer"
              onClick={() => {setShowSearch(prev=>!prev);navigate("/collection")}}
            />
          ) : (
            <IoSearchCircleOutline
              className="w-[30px] h-[30px] text-black cursor-pointer"
              onClick={() => setShowSearch(true)}
            />
          )}

          {/* User Icon / Profile */}
          {!userData ? (
            <FaRegUserCircle
              className="w-[29px] h-[29px] text-black cursor-pointer"
              onClick={() => setShowProfile(prev => !prev)}
            />
          ) : (
            <div
              className="w-[30px] h-[30px] bg-black text-white rounded-full flex items-center justify-center cursor-pointer"
              onClick={() => setShowProfile(prev => !prev)}
            >
              {userData?.name ? userData.name[0].toUpperCase() : "U"}
            </div>
          )}

          {showProfile && (
            <div className="absolute top-[40px] right-0 w-[220px] h-[150px] bg-[#000000d7] border border-[#aaa9a9] rounded-[10px] z-30 flex flex-col text-white p-3">
              {!userData && (
                <p
                  className="w-full hover:bg-gray-700 px-[15px] py-[10px] cursor-pointer"
                  onClick={() => { navigate("/login"); setShowProfile(false); }}
                >
                  Login
                </p>
              )}
              {userData &&<p className="w-full hover:bg-gray-700 px-[15px] py-[10px] cursor-pointer"onClick={()=>{handleLogout();setShowProfile(false)}}>LogOut</p>}
              <p className="w-full hover:bg-gray-700 px-[15px] py-[10px] cursor-pointer" onClick={()=>{navigate("/order");setShowProfile(false)}}>Orders</p>
              <p className="w-full hover:bg-gray-700 px-[15px] py-[10px] cursor-pointer" onClick={()=> {navigate("/about");setShowProfile(false)}}>About</p>
            </div>
          )}

          {/* Cart Icon */}
          <div className="relative">
            <IoCartOutline className="w-[30px] h-[30px] text-black cursor-pointer hidden md:block" onClick={()=> navigate("/cart")} />
            <p className="absolute w-[18px] h-[18px] flex items-center justify-center bg-black text-white rounded-full text-[9px] top-[-5px] right-[-10px]  md:block">
              {getCartCount()}
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="fixed top-[70px] left-0 w-[100vw] h-[80px] bg-[#d8f6f9dd] flex items-center justify-center z-10">
          <input
            type="text"
            className="w-[50%] h-[60px] bg-[#233533] rounded-[30px] px-[50px] placeholder:text-white text-white text-[18px] outline-none"
            placeholder="Search Here" onChange={(e)=>{setSearch(e.target.value)}} value={search}
          />
        </div>
      )}
      <div className='w-[100vw] h-[90px] flex items-center justify-between px-[20px] text-[12px] fixed bottom-0 left-0 bg-[#191818] md:hidden'>
        <button className='text-[white] flex items-center justify-center flex-col gap-[2px]' onClick={() => navigate('/') }>
          <IoMdHome className='w-[25px] h-[25px] text-[white] md:hidden' />
          Home
        </button>
        <button className='text-[white] flex items-center justify-center flex-col gap-[2px]' onClick={() => navigate('/collection') }>
          <HiOutlineCollection className='w-[25px] h-[25px] text-[white] md:hidden' />
          Collections
        </button>
        <button className='text-[white] flex items-center justify-center flex-col gap-[2px]' onClick={() => navigate('/about') }>
          <MdContacts className='w-[25px] h-[25px] text-[white] md:hidden' />
          Contact
        </button>
        <button className='text-[white] flex items-center justify-center flex-col gap-[2px]' onClick={() => navigate('/cart') }>
          <IoCartOutline className='w-[25px] h-[25px] text-[white] md:hidden' />
          Cart
        </button>
        <p className="absolute w-[18px] h-[18px] flex items-center justify-center bg-white px-[5px] py-[2px] text-black font-semibold rounded-full text-[9px] top-[8px] right-[18px] ">
        {getCartCount()}
        </p>
      </div>
    </>
  );
}

export default Nav;
