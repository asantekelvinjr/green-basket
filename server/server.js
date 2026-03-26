import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';

import connectDB from './configs/db.js';

import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';

const app = express();
const port = process.env.PORT || 4000;

// --- Connect to MongoDB ---
await connectDB();

// --- Trust proxy for secure cookies behind hosting (Vercel/Render) ---
app.set('trust proxy', 1);

// --- CORS setup ---
const allowedOrigins = [
  'http://localhost:5173',                   // local dev
  'https://green-basket-store.vercel.app',  // production frontend
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow Postman, curl
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.log('[CORS] Blocked origin:', origin);
    return callback(new Error('CORS policy does not allow this origin.'), false);
  },
  credentials: true, // ✅ allow cookies
}));

// --- Middleware ---
app.use(express.json());
app.use(cookieParser());

// --- Test endpoints ---
app.get('/', (req, res) => res.send('API is working'));
app.get('/api/debug-cookies', (req, res) => {
  console.log('[Debug] Cookies:', req.cookies);
  res.json({ cookies: req.cookies });
});

// --- Routes ---
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

// --- 404 handler ---
app.use((req, res) => res.status(404).json({ success: false, message: 'Endpoint not found' }));

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message);
  res.status(500).json({ success: false, message: err.message });
});

// --- Start server ---
app.listen(port, () => console.log(`Server is running on port ${port}`));