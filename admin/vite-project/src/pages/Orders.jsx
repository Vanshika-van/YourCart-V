import React from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { useState } from 'react'
import { useContext } from 'react'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { useEffect } from 'react'

function Orders() {

  let [orders,setOrders] =useState([])
  let {serverUrl} = useContext(authDataContext)

  const fetchAllOrders = async () => {
    try {
      const result = await axios.post(serverUrl + '/api/order/list', {}, { withCredentials: true });
      console.log('Orders data:', result.data); // For debugging
      if (result.data) {
        setOrders(result.data);
      }
    } catch (error) { 
      console.log('Error fetching orders:', error);
    }
  }
  
  useEffect(() => {
    fetchAllOrders()
  }, [])
  return (
    <div className='w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-[white] '>
      <Nav/>
      <div className='w-[100%] h-[100%] flex items-center lg:justify-start justify-center'>
        <Sidebar/>
        <div className='lg:w-[85%] md:w-[70%] h-[100%] lg:ml-[310px] md:ml-[250px] mt-[70px] flex flex-col gap-[30px] overflow-x-hidden py-[50px] ml-[100px] '>
<div className='w-[400px] h-[50px] text-[28px] md:text-[40px] mb-[20px] text-white '>
All Orders List
</div>
{orders.length === 0 ? (
  <div className="text-white text-center">No orders found</div>
) : (
  orders.map((order, index) => (
    <div key={index} className='w-[90%] h-auto bg-slate-600 rounded-xl flex lg:items-center items-start justify-between flex-col lg:flex-row p-[10px] md:px-[20px] gap-[20px]'>
      {/* Order Info Section */}
      <div className='flex-1'>
        <h3 className='text-xl font-semibold mb-4'>Order #{order._id.slice(-6)}</h3>
        
        {/* Items List with Images at Top */}
        <div className='mb-4'>
          <h4 className='font-medium mb-2'>Order Items:</h4>
          <div className='flex flex-wrap gap-4 mb-4'>
            {order.items.map((item, idx) => (
              <div key={idx} className='bg-slate-700 p-3 rounded w-[200px]'>
                <img 
                  src={item.image1} 
                  alt={item.name}
                  className='w-full h-[200px] object-cover rounded mb-2'
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder.png';
                  }}
                />
                <div>
                  <p className='font-medium text-sm'>{item.name}</p>
                  <p className='text-sm text-gray-300'>Size: {item.size}</p>
                  <p className='text-sm text-gray-300'>Quantity: {item.quantity}</p>
                  <p className='text-sm font-medium mt-1'>₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Info */}
        <div className='mb-4 bg-slate-700 p-3 rounded'>
          <h4 className='font-medium mb-2'>Customer Information</h4>
          <div className='text-gray-300 text-sm grid gap-2'>
            <div className='grid grid-cols-2'>
              <span className='font-medium'>Name:</span>
              <span>{order.userName || 'N/A'}</span>
            </div>
            <div className='grid grid-cols-2'>
              <span className='font-medium'>Email:</span>
              <span>{order.userEmail || 'N/A'}</span>
            </div>
            <div className='grid grid-cols-2'>
              <span className='font-medium'>Order Date:</span>
              <span>{new Date(order.date).toLocaleString()}</span>
            </div>
            <div className='grid grid-cols-2'>
              <span className='font-medium'>Total Amount:</span>
              <span>₹{order.amount}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className='mb-4 bg-slate-700 p-3 rounded'>
          <h4 className='font-medium mb-2'>Shipping Address</h4>
          {order.address ? (
            <div className='text-gray-300 text-sm grid gap-2'>
              <div className='grid grid-cols-2'>
                <span className='font-medium'>Name:</span>
                <span>{order.address.name || 'N/A'}</span>
              </div>
              <div className='grid grid-cols-2'>
                <span className='font-medium'>Email:</span>
                <span>{order.address.email || 'N/A'}</span>
              </div>
              <div className='grid grid-cols-2'>
                <span className='font-medium'>Phone:</span>
                <span>{order.address.phone || 'N/A'}</span>
              </div>
              <div className='grid grid-cols-2'>
                <span className='font-medium'>Street:</span>
                <span className='break-words'>{order.address.address || 'N/A'}</span>
              </div>
              <div className='grid grid-cols-2'>
                <span className='font-medium'>City:</span>
                <span>{order.address.city || 'N/A'}</span>
              </div>
              <div className='grid grid-cols-2'>
                <span className='font-medium'>State:</span>
                <span>{order.address.state || 'N/A'}</span>
              </div>
              <div className='grid grid-cols-2'>
                <span className='font-medium'>Pin Code:</span>
                <span>{order.address.pincode || 'N/A'}</span>
              </div>
              <div className='grid grid-cols-2'>
                <span className='font-medium'>Country:</span>
                <span>{order.address.country || 'N/A'}</span>
              </div>
            </div>
          ) : (
            <div className='text-gray-300 text-sm'>No address information available</div>
          )}
        </div>
      </div>

      {/* Order Status Section */}
      <div className='lg:w-[200px] w-full'>
        <div className='bg-slate-700 p-4 rounded'>
          <h4 className='font-medium mb-2'>Order Status</h4>
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              const status = e.target.status.value;
              try {
                const response = await axios.post(
                  `${serverUrl}/api/order/status`, 
                  {
                    orderId: order._id,
                    status: status
                  }, 
                  { 
                    withCredentials: true,
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                    }
                  }
                );
                if (response.data.success) {
                  alert('Status updated successfully');
                  // Refresh the orders list
                  await fetchAllOrders();
                } else {
                  throw new Error(response.data.message || 'Update failed');
                }
              } catch (error) {
                console.error('Status update error:', error);
                alert(error.response?.data?.message || 'Failed to update status');
              }
            }}
          >
            <select 
              name="status"
              className='w-full p-2 bg-slate-800 rounded text-white mb-2'
              defaultValue={order.status}
            >
              <option disabled>Select Status</option>
              <option value="Order Placed">Order Placed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            
            <button 
              type="submit" 
              className='w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200'
            >
              Update Status
            </button>
          </form>
          
          <div className='mt-4 border-t border-gray-600 pt-4'>
            <p className='text-sm text-gray-300 flex justify-between'>
              <span>Payment Method:</span>
              <span className='font-medium'>{order.paymentMethod}</span>
            </p>
            <p className='text-sm text-gray-300 flex justify-between mt-2'>
              <span>Payment Status:</span>
              <span className={`font-medium ${order.payment ? 'text-green-400' : 'text-yellow-400'}`}>
                {order.payment ? 'Paid' : 'Pending'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  ))
)}
        </div>
      </div>
    </div>
  )
}

export default Orders
