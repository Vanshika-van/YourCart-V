import Order from "../model/orderModel.js";
import User from "../model/userModel.js";
import razorpay from 'razorpay';
import dotenv from 'dotenv'
import crypto from 'crypto';
dotenv.config()

let razorpayInstance;
const currency = 'INR';

const initializeRazorpay = () => {
  try {
    // Debug log to check environment variables
    console.log('Checking Razorpay credentials:');
    console.log('Key ID exists:', !!process.env.RAZORPAY_KEY_ID);
    console.log('Key Secret exists:', !!process.env.RAZORPAY_KEY_SECRET);
    
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials not found in environment variables');
    }

    console.log('Attempting to initialize Razorpay with key:', 
      process.env.RAZORPAY_KEY_ID.substring(0, 8) + '...');
    
    // Check if razorpay module is available
    if (!razorpay) {
      throw new Error('Razorpay module not found');
    }
    
    razorpayInstance = new razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Verify the instance was created
    if (!razorpayInstance) {
      throw new Error('Failed to create Razorpay instance');
    }

    console.log('Razorpay initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing Razorpay:', error.message);
    console.error('Stack trace:', error.stack);
    return false;
  }
};

// Initialize Razorpay
const isRazorpayInitialized = initializeRazorpay();

//for User
export const placeOrder = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("User ID:", req.userId);

    const { orderData } = req.body;
    const { items, amount, address } = orderData;
    const userId = req.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Transform address data to match expected format
    const formattedAddress = {
      name: `${address.firstName} ${address.lastName}`.trim(),
      email: address.email,
      phone: address.phone,
      address: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pinCode,
      country: address.country
    };

    const newOrder = new Order({
      items,
      amount,
      userId,
      address: formattedAddress,
      paymentMethod: orderData.paymentMethod || "COD",
      payment: orderData.paymentMethod === "COD" ? false : true,
      status: "Order Placed",
      date: Date.now(),
    });

    const savedOrder = await newOrder.save();
    console.log("Order saved:", savedOrder);
    
    // Clear the user's cart
    await User.findByIdAndUpdate(userId, { cart: [] });

    res.status(201).json({ 
      success: true,
      message: "Order placed successfully",
      orderId: savedOrder._id
    });
  } catch (error) {
    console.error("Place order backend error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to place order",
      error: error.message 
    });
  }
};

export const userOrders = async(req,res) => {
  try {
    console.log("Fetching orders for user:", req.userId);
    
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Please login to view orders" });
    }

    const orders = await Order.find({ userId: userId })
      .sort({ date: -1 })
      .lean();
    
    console.log("Found orders:", orders);

    if (!orders || orders.length === 0) {
      console.log("No orders found for user:", userId);
      return res.status(200).json([]);
    }
    
    // Transform orders for client-side rendering
    const transformedOrders = orders.map(order => {
      // Extract basic order info
      const baseOrder = {
        _id: order._id,
        status: order.status || 'Order Placed',
        paymentMethod: order.paymentMethod,
        payment: order.payment,
        date: order.date,
        amount: order.amount,
        address: order.address
      };

      // Transform items with order status
      const items = order.items.map(item => ({
        ...item,
        orderId: order._id,
        status: order.status || 'Order Placed',
        payment: order.payment,
        paymentMethod: order.paymentMethod,
        date: order.date,
        formattedDate: new Date(order.date).toLocaleDateString(),
        formattedTime: new Date(order.date).toLocaleTimeString()
      }));

      return { ...baseOrder, items };
    });

    console.log("Sending transformed orders:", transformedOrders);
    return res.status(200).json(transformedOrders);
    
  } catch (error) {
    console.error("User orders error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
}
 
//For Admin

export const allOrders = async(req,res) => {
  try {
    const orders = await Order.find({})
      .populate({
        path: 'userId',
        model: User,
        select: 'name email'
      })
      .sort({date: -1});

    if (!orders || orders.length === 0) {
      return res.status(404).json({message: "No orders found"});
    }

    // Transform the data to include user details
    const ordersWithUserDetails = orders.map(order => {
      const orderObj = order.toObject();
      return {
        ...orderObj,
        userName: orderObj.userId?.name || 'N/A',
        userEmail: orderObj.userId?.email || 'N/A'
      };
    });

    res.status(200).json(ordersWithUserDetails);
  } catch (error) {
    console.log("Admin all orders error:", error);
    return res.status(500).json({message:"adminAllOrders error"});
  }
}

export const updateStatus = async(req,res) => {
  try {
    const { orderId, status } = req.body;
    console.log('Updating order status:', { orderId, status });

    if (!orderId || !status) {
      return res.status(400).json({ 
        success: false,
        message: 'Order ID and status are required' 
      });
    }

    // Validate status
    const validStatuses = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    // Update the order
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { 
        status,
        lastUpdated: Date.now() // Add timestamp for last status update
      },
      { 
        new: true, // Returns the updated document
        runValidators: true // Run model validations
      }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    console.log('Order updated successfully:', updatedOrder);

    return res.status(200).json({
      success: true,
      message: 'Status Updated Successfully',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Update status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
}

export const placeOrderRazorpay = async (req, res) => {
  try {
    // Check if Razorpay is properly initialized
    if (!isRazorpayInitialized || !razorpayInstance) {
      // Try to initialize Razorpay again
      const initialized = initializeRazorpay();
      if (!initialized) {
        console.error('Razorpay initialization failed');
        return res.status(500).json({
          success: false,
          message: 'Payment service is currently unavailable. Please try cash on delivery.'
        });
      }
    }

    const { items, amount, address } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Please login to continue'
      });
    }

    // Format the address
    const formattedAddress = {
      name: `${address.firstName} ${address.lastName}`.trim(),
      email: address.email,
      phone: address.phone,
      address: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pinCode,
      country: address.country
    };

    // Create initial order
    const orderData = {
      items,
      amount,
      userId,
      address: formattedAddress,
      paymentMethod: 'Razorpay',
      payment: false,
      status: 'Payment Pending',
      date: Date.now(),
      razorpay: {
        orderId: null,
        paymentId: null,
        signature: null
      }
    };

    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();

    try {
      // Create Razorpay order
      // Create Razorpay order with proper amount conversion
      const amountInPaise = Math.round(amount * 100);
      console.log('Creating Razorpay order:', {
        amount: amountInPaise,
        currency: currency,
        receipt: savedOrder._id.toString()
      });
      
      const razorpayOrder = await razorpayInstance.orders.create({
        amount: amountInPaise,
        currency: currency,
        receipt: savedOrder._id.toString(),
        notes: {
          orderId: savedOrder._id.toString(),
          userId: userId,
          customerEmail: address.email,
          customerPhone: address.phone
        }
      });

      // Update order with Razorpay orderId
      savedOrder.razorpay.orderId = razorpayOrder.id;
      await savedOrder.save();

      console.log('Razorpay order created:', razorpayOrder);

      // Send a properly structured response
      return res.status(200).json({
        success: true,
        key: process.env.RAZORPAY_KEY_ID,
        order: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          receipt: razorpayOrder.receipt
        },
        orderDetails: {
          orderId: savedOrder._id,
          amount: amount,
          currency: currency
        }
      });

    } catch (razorpayError) {
      console.error('Razorpay order creation error:', razorpayError);
      // Delete the order if Razorpay order creation fails
      await Order.findByIdAndDelete(savedOrder._id);
      
      return res.status(500).json({
        success: false,
        message: 'Unable to initialize payment. Please try again or use cash on delivery.',
        error: razorpayError.message
      });
    }

  } catch (error) {
    console.error('Place order Razorpay error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while processing your order',
      error: error.message
    });
  }
}

// Add verification endpoint
export const verifyRazorpayPayment = async (req, res) => {
  try {
    // Log incoming request body for debugging
    console.log('verifyRazorpayPayment called with body:', req.body);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.log('Missing fields in verification request:', { razorpay_order_id, razorpay_payment_id, razorpay_signature });
      return res.status(400).json({ success: false, message: 'Missing required payment fields' });
    }

    // Ensure razorpay instance is available
    if (!razorpayInstance) {
      console.log('Razorpay instance not initialized. Attempting to initialize now.');
      const initialized = initializeRazorpay();
      if (!initialized || !razorpayInstance) {
        console.error('Unable to initialize Razorpay instance for verification');
        return res.status(500).json({ success: false, message: 'Payment service unavailable' });
      }
    }

  // First verify using the signature (HMAC)
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest('hex');

    // Log signatures for debugging (do not expose secrets in production)
    console.log('Expected signature:', expectedSignature);
    console.log('Received signature:', razorpay_signature);

    if (expectedSignature !== razorpay_signature) {
      console.log('Signature verification failed for order:', razorpay_order_id);
      return res.status(400).json({ success: false, message: 'Payment signature verification failed' });
    }

    // Then verify with Razorpay's API that the order is paid
    let orderInfo;
    try {
      orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
      console.log('Razorpay orderInfo:', orderInfo);
    } catch (fetchErr) {
      console.error('Error fetching order from Razorpay:', fetchErr && fetchErr.message ? fetchErr.message : fetchErr);
      return res.status(500).json({ success: false, message: 'Error fetching order from payment gateway', error: fetchErr?.message || String(fetchErr) });
    }

    if (!orderInfo || orderInfo.status !== 'paid') {
      console.log('Order is not marked paid. orderInfo.status:', orderInfo?.status);

      // Fallback: some integrations capture payment but order status may not be updated.
      // Try fetching the payment by payment id and check its status (captured/authorized).
      try {
        const paymentInfo = await razorpayInstance.payments.fetch(razorpay_payment_id);
        console.log('Razorpay paymentInfo fallback:', paymentInfo);
        const paymentStatus = paymentInfo?.status;
        // Consider 'captured' or 'authorized' as success for our flow
        if (paymentStatus === 'captured' || paymentStatus === 'authorized') {
          console.log('Payment is captured/authorized via payments API:', paymentStatus);
          // proceed to update order (skip the early return)
        } else {
          console.log('Payment not completed according to payments API:', paymentStatus);
          return res.status(400).json({ success: false, message: 'Payment not completed' });
        }
      } catch (paymentsFetchErr) {
        console.error('Error fetching payment info from Razorpay:', paymentsFetchErr?.message || paymentsFetchErr);
        return res.status(500).json({ success: false, message: 'Error verifying payment status with gateway', error: paymentsFetchErr?.message || String(paymentsFetchErr) });
      }
    }

    // Find and update the order
    const order = await Order.findOne({ "razorpay.orderId": razorpay_order_id });
    if (!order) {
      console.log('Order not found for razorpay_order_id:', razorpay_order_id);
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Update order with payment details
    order.payment = true;
    order.status = 'Order Placed';
    order.razorpay = {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature
    };
    await order.save();
    
    // Clear user's cart after successful payment
    await User.findByIdAndUpdate(order.userId, { cart: [] });
    
    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      orderId: order._id
    });

  } catch (error) {
    console.error('Payment verification error:', error && error.stack ? error.stack : error);
    console.error('Request body at error time:', req.body);
    return res.status(500).json({
      success: false,
      message: "Error verifying payment",
      error: error?.message || String(error)
    });
  }
}
