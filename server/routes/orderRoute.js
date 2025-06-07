import express from 'express';
import authUser from '../middlewares/authUser.js';
import authSeller from '../middlewares/authSeller.js';

import {
  getAllOrders,
  getUserOrder,
  placeOrderCOD,
  placeOrderPaystack
} from '../controllers/orderController.js';

import { paystackWebhook } from '../controllers/webhookController.js';

const orderRouter = express.Router();

orderRouter.post('/cod', authUser, placeOrderCOD);
orderRouter.post('/paystack', authUser, placeOrderPaystack);
orderRouter.get('/user', authUser, getUserOrder);
orderRouter.get('/seller', authSeller, getAllOrders);

// Paystack Webhook (no auth middleware)
orderRouter.post(
  '/webhook/paystack',
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  }),
  paystackWebhook
);

export default orderRouter;
