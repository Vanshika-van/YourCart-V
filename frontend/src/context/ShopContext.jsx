import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserDataContext } from "./UserContext"; // ✅ ADD THIS
import { toast } from 'react-toastify';

export const ShopDataContext = createContext();

function ShopContext({ children }) {
  const { userData } = useContext(UserDataContext); // ✅ Get userData from context
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItem, setCartItem] = useState({});
  const [loading, setLoading] = useState(false);
  const serverUrl = import.meta.env.VITE_SERVER_URL || "https://yoourcart-v-backend.onrender.com";
  const currency = "₹";
  const delivery_fee = 40;

  const getProducts = async () => {
  try {
    const response = await axios.get(`${serverUrl}/api/product/list`);
    setProducts(response.data.products || response.data);
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Check if it's a connection error
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      console.error('❌ Backend server is not running on', serverUrl);
      toast.error('Cannot connect to server. Please start the backend.');
    } else {
      toast.error('Failed to load products');
    }
  }
};

  // ✅ Fetch user's cart from backend
  const getUserCart = async () => {
    try {
      const response = await axios.get(serverUrl + '/api/cart/get', {
        withCredentials: true
      });
      if (response.data.success) {
        setCartItem(response.data.cartData || {});
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // ✅ FIXED: Removed userData parameter
  const addToCart = async (itemId, size) => {
    if (!size) {
      console.log("Select Product Size");
      return;
    }

    let cartData = structuredClone(cartItem);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItem(cartData);

    if (userData) {
      try {
        setLoading(true);
        await axios.post(
          serverUrl + '/api/cart/add',
          { itemId, size },
          { withCredentials: true }
        );
        setLoading(false);
      } catch (error) {
        console.error(error); // ✅ FIXED: Was FaTowerBroadcast.error
        setLoading(false);
      }
    }
  };

  // ✅ FIXED: Moved outside addToCart
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItem);
    cartData[itemId][size] = quantity;
    setCartItem(cartData);

    if (userData) {
      try {
        await axios.post(
          serverUrl + '/api/cart/update',
          { itemId, size, quantity },
          { withCredentials: true }
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  // ✅ Get total count of items
  const getCartCount = () => {
    let totalCount = 0;

    for (const items in cartItem) {
      for (const item in cartItem[items]) {
        try {
          if (cartItem[items][item] > 0) {
            totalCount += cartItem[items][item];
          }
        } catch (error) {
          console.error(error);
        }
      }
    }

    return totalCount;
  };

  // ✅ NEW: Get total amount/price
  const getCartAmount = () => {
    let totalAmount = 0;

    for (const items in cartItem) {
      let itemInfo = products.find((product) => product._id === items);
      
      if (itemInfo) {
        for (const item in cartItem[items]) {
          try {
            if (cartItem[items][item] > 0) {
              totalAmount += itemInfo.price * cartItem[items][item];
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
    }

    return totalAmount;
  };

  useEffect(() => {
    getProducts();
  }, []);

  // ✅ Fetch cart when user logs in/out
  useEffect(() => {
    if (userData) {
      getUserCart();
    } else {
      setCartItem({});
    }
  }, [userData]);

  const value = {
    products,
    currency,
    delivery_fee,
    getProducts,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItem,
    addToCart,
    getCartCount,
    getCartAmount, // ✅ NEW: Added getCartAmount
    setCartItem,
    updateQuantity,
    loading,
    getUserCart,
  };

  return (
    <ShopDataContext.Provider value={value}>
      {children}
    </ShopDataContext.Provider>
  );
}

export default ShopContext;
