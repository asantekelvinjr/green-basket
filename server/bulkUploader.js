// bulkUploader.js

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import cloudinary from './configs/cloudinary.js'; // ✅ must export full cloudinary instance
import Product from './models/product.js';
import dummyProducts from './data/dummyProducts.js';

dotenv.config();

const uploadImageToCloudinary = async (localPath) => {
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      folder: 'greencart-products',
    });
    return result.secure_url;
  } catch (err) {
    console.error('❌ Cloudinary upload error:', err.message);
    return null;
  }
};

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Product.deleteMany({});
    console.log('🧹 Cleared existing products');

    for (const product of dummyProducts) {
      const imageUrls = [];

      for (const imgFileName of product.image) {
        const localPath = path.join('assets', imgFileName); // adjust if path is different

        if (fs.existsSync(localPath)) {
          const cloudUrl = await uploadImageToCloudinary(localPath);
          if (cloudUrl) imageUrls.push(cloudUrl);
        } else {
          console.warn(`⚠️ Image not found: ${localPath}`);
        }
      }

      if (imageUrls.length > 0) {
        await Product.create({
          ...product,
          image: imageUrls,
        });
        console.log(`✅ Inserted: ${product.name}`);
      } else {
        console.warn(`⛔ Skipped ${product.name} due to missing images`);
      }
    }

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  }
};

seedProducts();
