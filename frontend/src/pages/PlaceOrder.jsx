import React, { useContext, useState } from 'react';
import Title from '../component/Title';
import CartTotal from '../component/CartTotal';
import razorpay from '../assets/razorpay.png';
import { ShopDataContext } from '../context/ShopContext';
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

function PlaceOrder() {
  const [method, setMethod] = useState('cod');
  const { cartItem, setCartItem, getCartAmount, delivery_fee, products } = useContext(ShopDataContext);
  const { serverUrl } = useContext(authDataContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    pinCode: '',
    country: '',
    phone: ''
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const initPay = (data) => {
    console.log('Initializing payment with data:', data);
    if (!window.Razorpay) {
      toast.error('Razorpay SDK not loaded. Please refresh the page.');
      return;
    }
    
    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency || 'INR',
      name: data.name || 'YourCart',
      description: data.description || 'Order Payment',
      order_id: data.order_id,
      prefill: data.prefill || {
        name: formData.firstName + ' ' + formData.lastName,
        email: formData.email,
        contact: formData.phone
      },
      handler: async (response) => {
        try {
          // Log the complete response and server URL for debugging
          console.log('Payment response from Razorpay:', response);
          console.log('Server URL:', serverUrl);
          
          // Make sure we have all required fields
          if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
            throw new Error('Missing required payment response fields');
          }

          const verificationData = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature
          };
          
          console.log('Sending verification request with data:', verificationData);
          
          const verifyResult = await axios.post(
            `${serverUrl}/api/order/verifyRazorpay`,
            verificationData,
            { 
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          
          console.log('Verification response:', verifyResult);
          
          if (verifyResult.data.success) {
            console.log('Payment verified successfully');
            toast.success('Payment successful! Your order has been placed.');
            setCartItem({}); // Clear cart
            navigate('/order'); // Always navigate to orders page
          } else {
            console.error('Payment verification returned failure:', verifyResult.data);
            toast.error(verifyResult.data.message || 'Payment verification failed');
          }
        } catch (error) {
          // Detailed error logging
          console.error('Payment verification error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            config: {
              url: error.config?.url,
              method: error.config?.method,
              data: error.config?.data
            }
          });

          let errorMessage = 'Payment verification failed';
          
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Server Error Response:', error.response.data);
            errorMessage = error.response.data.message || `Server error: ${error.response.status}`;
          } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received from server');
            errorMessage = 'No response from server. Please check your connection.';
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Request setup error:', error.message);
            errorMessage = `Request error: ${error.message}`;
          }
          
          toast.error(errorMessage);
          // Log the complete error object for debugging
          console.error('Complete error object:', error);
        }
      },
      modal: {
        ondismiss: function() {
          toast.error('Payment cancelled');
        }
      },
      theme: {
        color: '#3B82F6'
      }
    };
    
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      toast.error(response.error.description || 'Payment failed');
    });
    rzp.open();
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!serverUrl) {
      toast.error('Server URL not set. Cannot place order.');
      return;
    }

    if (!cartItem || Object.keys(cartItem).length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    for (let key in formData) {
      if (!formData[key]) {
        toast.error('Please fill all required fields.');
        return;
      }
    }

    const orderItems = [];
    for (const productId in cartItem) {
      for (const size in cartItem[productId]) {
        const quantity = cartItem[productId][size];
        if (quantity > 0) {
          const productInfo = products.find(p => p._id === productId);
          if (productInfo) {
            orderItems.push({
              _id: productInfo._id,
              name: productInfo.name,
              size,
              quantity,
              price: productInfo.price,
              image1: productInfo.image1,
            });
          }
        }
      }
    }

    if (orderItems.length === 0) {
      toast.error('No items selected.');
      return;
    }

    const orderData = {
      items: orderItems,
      address: formData,
      amount: getCartAmount() + delivery_fee,
    };

    try {
      switch (method) {
        case 'cod':
          const result = await axios.post(
            `${serverUrl}/api/order/placeorder`,
            { orderData },
            { withCredentials: true }
          );
          console.log(result.data);
          if (result.data.success) {
            toast.success('Order placed successfully!');
            setCartItem({});
            navigate('/order');
          } else {
            toast.error(result.data.message || 'Order failed');
          }
          break;

        case 'razorpay':
          try {
            const resultRazorpay = await axios.post(
              `${serverUrl}/api/order/razorpay`,
              orderData,
              { withCredentials: true }
            );
            console.log('Razorpay response:', resultRazorpay.data);
            
            if (resultRazorpay.data.success) {
              const paymentData = {
                key: resultRazorpay.data.key,
                amount: resultRazorpay.data.order.amount,
                currency: resultRazorpay.data.order.currency,
                order_id: resultRazorpay.data.order.id,
                name: 'YourCart Purchase',
                description: `Order #${resultRazorpay.data.orderDetails.orderId}`,
                prefill: {
                  name: formData.firstName + ' ' + formData.lastName,
                  email: formData.email,
                  contact: formData.phone
                },
                notes: {
                  orderId: resultRazorpay.data.orderDetails.orderId
                }
              };
              console.log('Initializing payment with:', paymentData);
              initPay(paymentData);
            } else {
              throw new Error(resultRazorpay.data.message || 'Payment initialization failed');
            }
          } catch (error) {
            console.error('Razorpay initialization error:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to initialize payment');
            // Keep the user on the page to try again
          }
          break;

        default:
          toast.error('Invalid payment method');
      }
    } catch (error) {
      console.error('Place order error:', error);
      toast.error(error.response?.data?.message || error.message || 'Server error');
    }
  };

  return (
    <div className="w-[100vw] min-h-[100vh] p-[20px] pt-[110px] pb-[130px] bg-gradient-to-l from-[#141414] to-[#0c2025] flex flex-col md:flex-row gap-[50px] items-center justify-center relative">
      <ToastContainer />

      {/* Delivery Form */}
      <div className="lg:w-[50%] w-[100%] flex flex-col items-center justify-center">
        {!serverUrl && (
          <div className="mb-4 w-full text-center bg-red-600 text-white p-2 rounded-md">
            Server URL not configured. Orders cannot be placed.
          </div>
        )}

        <form onSubmit={onSubmitHandler} className="lg:w-[70%] w-[95%] flex flex-col gap-4">
          <div className="text-center mb-8">
            <Title text1="DELIVERY" text2="INFORMATION" />
          </div>

          <div className="flex gap-2">
            <input type="text" name="firstName" value={formData.firstName} onChange={onChangeHandler} placeholder="First name" required className="w-1/2 p-2 rounded-md bg-slate-700 text-white" />
            <input type="text" name="lastName" value={formData.lastName} onChange={onChangeHandler} placeholder="Last name" required className="w-1/2 p-2 rounded-md bg-slate-700 text-white" />
          </div>

          <input type="email" name="email" value={formData.email} onChange={onChangeHandler} placeholder="Email" required className="w-full p-2 rounded-md bg-slate-700 text-white" />
          <input type="text" name="street" value={formData.street} onChange={onChangeHandler} placeholder="Street" required className="w-full p-2 rounded-md bg-slate-700 text-white" />

          <div className="flex gap-2">
            <input type="text" name="city" value={formData.city} onChange={onChangeHandler} placeholder="City" required className="w-1/2 p-2 rounded-md bg-slate-700 text-white" />
            <input type="text" name="state" value={formData.state} onChange={onChangeHandler} placeholder="State" required className="w-1/2 p-2 rounded-md bg-slate-700 text-white" />
          </div>

          <div className="flex gap-2">
            <input type="text" name="pinCode" value={formData.pinCode} onChange={onChangeHandler} placeholder="Pincode" required className="w-1/2 p-2 rounded-md bg-slate-700 text-white" />
            <input type="text" name="country" value={formData.country} onChange={onChangeHandler} placeholder="Country" required className="w-1/2 p-2 rounded-md bg-slate-700 text-white" />
          </div>

          <input type="tel" name="phone" value={formData.phone} onChange={onChangeHandler} placeholder="Phone" required className="w-full p-2 rounded-md bg-slate-700 text-white" />

          <button
            type="submit"
            disabled={!serverUrl}
            className={`mt-4 py-3 px-6 rounded-xl font-semibold ${serverUrl ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-500 cursor-not-allowed text-gray-300'}`}
          >
            PLACE ORDER
          </button>
        </form>
      </div>

      {/* Payment Method */}
      <div className="lg:w-[50%] w-[100%] flex flex-col items-center justify-center gap-4">
        <CartTotal />
        <div className="text-center mb-4">
          <Title text1="PAYMENT" text2="METHOD" />
        </div>
        <div className="flex gap-4">
          <button onClick={() => setMethod('razorpay')} className={`w-[150px] h-[50px] rounded-sm ${method === 'razorpay' ? 'border-2 border-blue-900' : ''}`}>
            <img src={razorpay} alt="Razorpay" className="w-full h-full object-cover rounded-sm" />
          </button>
          <button onClick={() => setMethod('cod')} className={`w-[200px] h-[50px] rounded-sm bg-gray-300 font-bold ${method === 'cod' ? 'border-2 border-blue-900' : ''}`}>
            CASH ON DELIVERY
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;