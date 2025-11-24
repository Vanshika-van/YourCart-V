import React, { useContext } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Registration from "./pages/Registration.jsx";
import Nav from "./component/Nav";
import { AuthContextProvider } from "./context/AuthContext"; 
import UserContextProvider, { UserDataContext } from "./context/UserContext";
import About from "./pages/About.jsx";
import Collections from "./pages/Collections.jsx";
import Product from "./pages/Product.jsx";
import Contact from "./pages/Contact.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import PlaceOrder from "./pages/PlaceOrder.jsx";
import Order from "./pages/Order.jsx";
import NotFound from "./pages/NotFound.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Ai from "./component/Ai.jsx";
function App() {
 
  
  return (
    <AuthContextProvider>
      {/* UserContextProvider is already provided in main.jsx - avoid double-wrapping */}
      <MainAppRoutes />
      <ToastContainer />
    </AuthContextProvider>
  );
}

function MainAppRoutes() {
  const { userData } = useContext(UserDataContext);
  const location = useLocation();

  if (userData === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Nav />
      <Routes>
        <Route 
          path="/" 
          element={userData ? <Home /> : <Navigate to="/login" state={{ from: location.pathname }} />} 
        />
        <Route 
          path="/login" 
          element={userData ? <Navigate to={location.state?.from || "/"} /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={userData ? <Navigate to={location.state?.from || "/"} /> : <Registration />} 
        />
        <Route 
          path="/about" 
          element={userData ? <About /> : <Navigate to="/login" state={{ from: location.pathname }} />} 
        />
        <Route 
          path="/collection" 
          element={userData ? <Collections /> : <Navigate to="/login" state={{ from: location.pathname }} />} 
        />
        <Route 
          path="/product" 
          element={userData ? <Product /> : <Navigate to="/login" state={{ from: location.pathname }} />} 
        />
        <Route 
          path="/contact" 
          element={userData ? <Contact /> : <Navigate to="/login" state={{ from: location.pathname }} />} 
        />
        <Route 
          path="/productdetail/:productId" 
          element={userData ? <ProductDetail /> : <Navigate to="/login" state={{ from: location.pathname }} />} 
        />
        <Route 
          path="/cart" 
          element={userData ? <Cart /> : <Navigate to="/login" state={{ from: location.pathname }} />} 
        />
        <Route 
          path="/placeorder" 
          element={userData ? <PlaceOrder /> : <Navigate to="/login" state={{ from: location.pathname }} />} 
        />
        <Route 
          path="/order" 
          element={userData ? <Order /> : <Navigate to="/login" state={{ from: location.pathname }} />} 
        />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Ai/>
    </>
  );
}

export default App;
