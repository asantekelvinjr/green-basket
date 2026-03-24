import Order from "../models/order.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import axios from "axios";

// 🔥 HELPER: calculate total
const calculateAmount = async (items) => {
  let total = 0;

  for (let item of items) {
    const product = await Product.findById(item.product);
    total += product.offerPrice * item.quantity;
  }

  // 2% tax
  total += Math.floor(total * 0.02);

  return total;
};

// =========================
// ✅ PLACE ORDER COD
// =========================
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    const amount = await calculateAmount(items);

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
      paymentStatus: "PENDING",
      status: "PLACED",
    });

    return res.json({
      success: true,
      message: "Order Placed Successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// =========================
// ✅ PLACE ORDER PAYSTACK
// =========================
export const placeOrderPaystack = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    if (!address || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid data" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const amount = await calculateAmount(items);

    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
      paymentStatus: "PENDING",
      status: "PLACED",
    });

    const paystackData = {
      email: user.email,
      amount: amount * 100, // 🔥 Paystack uses kobo/pesewas
      callback_url: `${process.env.CLIENT_URL}/my-orders/${order._id}/verify-payment`,
      metadata: {
        order_id: order._id,
      },
    };

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      paystackData,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return res.json({
      success: true,
      paystack: response.data.data,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// =========================
// ✅ VERIFY PAYMENT
// =========================
export const verifyOrderPayment = async (req, res) => {
  try {
    const { reference } = req.body;

    if (!reference) {
      return res.status(400).json({ error: "Reference required" });
    }

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = response.data.data;

    if (data.status !== "success") {
      return res.json({ success: false, message: "Payment failed" });
    }

    const orderId = data.metadata.order_id;

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "PAID",
      status: "CONFIRMED",
    });

    return res.json({
      success: true,
      message: "Payment verified",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// =========================
// ✅ UPDATE ORDER STATUS (ADMIN)
// =========================
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    const validFlow = ["PLACED", "CONFIRMED", "READY", "COMPLETED"];

    const currentIndex = validFlow.indexOf(order.status);
    const newIndex = validFlow.indexOf(status);

    if (newIndex < currentIndex && status !== "CANCELLED") {
      return res.json({
        success: false,
        message: "Invalid status transition",
      });
    }

    // 🔥 COD auto paid on completion
    if (order.paymentType === "COD" && status === "COMPLETED") {
      order.paymentStatus = "PAID";
    }

    order.status = status;

    await order.save();

    return res.json({ success: true, message: "Order updated" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// =========================
// ✅ USER ORDERS
// =========================
export const getUserOrder = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await Order.find({ userId })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// =========================
// ✅ SELLER ORDERS
// =========================
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { paymentStatus: "PAID" }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// =========================
// ✅ GET SINGLE ORDER (TRACK)
// =========================
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Validate MongoDB ObjectId
    if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.json({ success: false, message: "Invalid Order ID" });
    }

    const order = await Order.findById(orderId)
      .populate("items.product address");

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    return res.json({ success: true, order });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};