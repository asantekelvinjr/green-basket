import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import connectCloudinary from './configs/cloudinary.js';
import 'dotenv/config';

import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';

const app = express();
const port = process.env.PORT || 4000;

// --- Connect to DB and Cloudinary ---
await connectDB();
// await connectCloudinary();

// --- Trust proxy for Render (cookies work behind proxy) ---
app.set('trust proxy', 1);

// --- CORS setup ---
const allowedOrigins = [
  'http://localhost:5173',                    // local dev
  'https://green-basket-store.vercel.app'    // Vercel frontend
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow non-browser requests like Postman
    if(allowedOrigins.indexOf(origin) === -1){
      return callback(new Error('CORS policy does not allow this origin.'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// --- Middleware ---
app.use(express.json());
app.use(cookieParser());

// --- Routes ---
app.get('/', (req, res) => res.send('API is working'));
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

// --- Start server ---
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});