import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Title from '../component/Title.jsx'
import { authDataContext } from '../context/AuthContext'
import { ShopDataContext } from '../context/ShopContext'
import { UserDataContext } from '../context/UserContext'
import axios from 'axios'
import { toast } from 'react-toastify'


function Order() {
  const [orderData, setOrderData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { currency } = useContext(ShopDataContext)
  const { serverUrl } = useContext(authDataContext)
  const { userData } = useContext(UserDataContext)
  const navigate = useNavigate()

  const loadOrderData = async () => {
    try {
      setError(null)
      setIsLoading(true)
      
      if (!userData) {
        throw new Error('Please login to view orders')
      }
      
      console.log('Fetching orders...');
      const result = await axios.post(
        `${serverUrl}/api/order/userorder`, 
        {}, 
        { 
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Orders response:', result.data);
      
      if (result.data && Array.isArray(result.data)) {
        let allOrdersItem = [];
        result.data.forEach((order) => {
          if (order.items && Array.isArray(order.items)) {
            order.items.forEach((item) => {
              allOrdersItem.push({
                ...item,
                status: order.status || 'Order Placed',
                payment: order.payment,
                paymentMethod: order.paymentMethod,
                date: order.date,
                orderId: order._id,
                amount: order.amount,
                imageLoaded: false
              });
            });
          }
        });
        console.log('Processed order items:', allOrdersItem);
        setOrderData(allOrdersItem);
      } else {
        console.log('No orders found or invalid response format');
        setOrderData([]);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setError(error.response?.data?.message || error.message || 'Error loading orders');
      if (error.response?.status === 401) {
        toast.error('Please login to view orders');
        navigate('/login', { state: { from: '/order' }, replace: true });
      } else {
        toast.error(error.response?.data?.message || 'Failed to load orders');
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!userData) {
      navigate('/login', { state: { from: '/order' }, replace: true })
      return
    }
    loadOrderData()
  }, [userData])

  return (
    <div className='w-[99vw] min-h-[100vh] p-[20px] overflow-hidden bg-gradient-to-l from-[#141414] to-[#0c2025]'>
      <div className='h-[8%] w-[100%] text-center mt-[80px]'>
        <Title text1={'MY'} text2={'ORDER'} />
      </div>
      
      <div className='w-[100%] mt-[40px] flex flex-col gap-[20px]'>
        {isLoading ? (
          <div className='text-white text-center py-10'>Loading orders...</div>
        ) : orderData.length === 0 ? (
          <div className='text-white text-center py-10'>No orders found</div>
        ) : (
          orderData.map((item, index) => (
            <div key={index} className='w-[100%] border-t border-b border-gray-600'>
              <div className='w-[100%] flex items-center gap-6 bg-[#51808048] py-[20px] px-[20px] rounded-2xl'>
                {/* Image with loading state */}
                <div className='relative w-[130px] h-[130px]'>
                  <div className={`absolute inset-0 bg-gray-700 rounded-md ${!item.imageLoaded ? 'block' : 'hidden'}`}></div>
                  <img 
                    src={item.image1 || '/placeholder.png'} 
                    alt={item.name || 'Product'} 
                    className={`w-[130px] h-[130px] object-cover rounded-md transition-opacity duration-300 ${item.imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => {
                      const newOrderData = [...orderData];
                      newOrderData[index].imageLoaded = true;
                      setOrderData(newOrderData);
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder.png';
                      const newOrderData = [...orderData];
                      newOrderData[index].imageLoaded = true;
                      setOrderData(newOrderData);
                    }}
                  />
                </div>
                
                {/* Order Details */}
                <div className='flex-1 text-white'>
                  <h3 className='text-lg font-semibold mb-2'>{item.name}</h3>
                  <div className='flex gap-4 text-sm'>
                    <p>Price: {currency}{item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                  <p className='text-sm mt-2'>Date: {new Date(item.date).toLocaleDateString()}</p>
                  <p className='text-sm'>Payment: {item.paymentMethod}</p>
                </div>
                
                {/* Status */}
                <div className='text-right'>
                  <div className='flex flex-col items-end gap-2'>
                    <div className='flex items-center gap-2'>
                      <span className={`w-3 h-3 rounded-full ${
                        item.status === 'Delivered' ? 'bg-green-500' :
                        item.status === 'Processing' ? 'bg-yellow-500' :
                        item.status === 'Shipped' ? 'bg-blue-500' :
                        item.status === 'Out for Delivery' ? 'bg-purple-500' :
                        item.status === 'Cancelled' ? 'bg-red-500' :
                        'bg-gray-500'
                      }`}></span>
                      <span className='text-white font-medium'>{item.status}</span>
                    </div>
                    
                    <div className='text-xs text-gray-400'>
                      Last updated: {new Date(item.date).toLocaleTimeString()}
                    </div>
                    
                    <button 
                      onClick={async () => {
                        try {
                          toast.info('Fetching latest order status...', {
                            position: "top-right",
                            autoClose: 2000
                          });
                          
                          // Fetch latest order status
                          const result = await axios.post(
                            `${serverUrl}/api/order/userorder`,
                            {},
                            { 
                              withCredentials: true,
                              headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                              }
                            }
                          );

                          if (result.data) {
                            await loadOrderData(); // Refresh all orders
                            toast.success('Order status updated!', {
                              position: "top-right",
                              autoClose: 3000
                            });
                          }
                        } catch (error) {
                          console.error('Error tracking order:', error);
                          toast.error('Failed to fetch order status', {
                            position: "top-right",
                            autoClose: 3000
                          });
                        }
                      }}
                      className='mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition-colors duration-200'
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Order