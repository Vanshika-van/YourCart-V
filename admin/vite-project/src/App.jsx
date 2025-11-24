import React,{useState,useContext} from 'react'
import Add from './pages/Add'
import Lists from './pages/Lists'
import Orders from './pages/Orders'
import Home from './pages/Home'
import Login from './pages/Login'
import { Routes, Route } from 'react-router-dom' 
import { adminDataContext } from './context/AdminContext'
import { ToastContainer, toast } from 'react-toastify';
 
function App() {
  let {adminData,loading}= useContext(adminDataContext)
  if (loading) return <div>Loading...</div>;

  return (
    <>
    <ToastContainer />
      { !adminData ? <Login/> : (
        <>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/add' element={<Add/>} />
            <Route path='/lists' element={<Lists/>} />
            <Route path='/orders' element={<Orders/>} />
            <Route path='/login' element={<Login/>} />
          </Routes>
        </>
      )}
    </>
  )
}

export default App
