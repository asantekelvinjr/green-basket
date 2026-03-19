import Order from "../models/order.js";
import Product from "../models/product.js";
import User from "../models/user.js";

import axios from "axios";

// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    // Calculate amount using items
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // Add Tax charge 2%
    amount += Math.floor(amount * 0.02);

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });
    return res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Place Order Paystack: /api/order/paystack
export const placeOrderPaystack = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    const { origin } = req.headers;
    if (!address || items.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid data" });
    }

    // Check if user exists
    const user = await User.findOne({ _id: userId });
    console.log(user);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
    }

    let productData = [];
    // Calculate amount using items
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // Add Tax charge 2%
    amount += Math.floor(amount * 0.02);

    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
    });

    // PayStack Gateway Initialize
    // const paystackInstance = new paystack(process.env.PAYSTACK_SECRET_KEY);

    // Create line items for Paystack
    // const line_items = productData.map((item) => {
    //       return{
    //         price_data: {
    //             currency : "GH₵",
    //             product_data: {
    //                 name: item.name,
    //             },
    //             unit_amount : Math.floor(item.price + item.price * 0.02)*100
    //         },
    //         quantity:item.quantity,
    //       }
    // })

    // // Create Session
    // const session = await paystackInstance.checkout.sessions.create({
    //     line_items,
    //     mode: "payment",
    //     success_url:  `${origin}/loader?next=my-orders`,
    //     cancel_url:  `${origin}/cart`,
    //     metadata: {
    //         orderId : order._id.toString(),
    //         userId,
    //     }
    // })

    const paystackData = {
      email: user.email,
      amount,
      callback_url: `${process.env.CLIENT_URL}/my-orders/${order._id}/verify-payment`,
      metadata: {
        order_id: order._id,
        custom_note: `Thank you for shopping with us!`,
      },
    };

    console.log(paystackData);
    const headers = {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    };

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      paystackData,
      { headers }
    );

    return res
      .status(200)
      .json({ success: true, paystack: response.data.data });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// Verify Order Paystack: /api/order/verify-payment
export const verifyOrderPayment = async (req, res) => {
  try {
    const { reference } = req.body;
    // check if reference exists,else throw an error
    if (!reference) {
      res.status(400).json({ error: "Payment reference is required" });
      return;
    }

    // Make request to paystack to verify payment
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const { data } = response.data;

    // check if status is success
    if (data?.status !== "success") {
      // Throw an error saying payment failed
      res.status(400).json({ error: "Payment verification failed" });
      return;
    }

    // get order id from the transaction
    const { metadata } = data;
    const { order_id } = metadata;

    // change the status of the order to paid or processing
    const t = await Order.updateOne(
      { _id: order_id },
      { $set: { status: "paid" } }
    );
    console.log(t);
    res.status(200).json({
      success: true,
      message: "Payment verification was successful.",
      order_id,
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ error: "An error occurred during payment verification." });
    return;
  }
};

//  Get Orders by User ID : /api/order/user
export const getUserOrder = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await Order.find({
      userId,
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Get All Orders (for seller/ admin) : /api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
