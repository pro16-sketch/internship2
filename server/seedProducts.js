const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Product = require("./models/Product");

const products = [
  {
    id: 1, name: "Wireless Headphones",
    category: "Electronics", price: 2499, oldPrice: 3499,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    description: "Premium wireless headphones with immersive sound, comfortable ear cushions and long battery life."
  },
  {
    id: 2, name: "Smart Watch",
    category: "Electronics", price: 3999, oldPrice: 4999,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    description: "A stylish smartwatch featuring fitness tracking, notifications and everyday health monitoring."
  },
  {
    id: 3, name: "Running Shoes",
    category: "Fashion", price: 1999, oldPrice: 2999,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    description: "Lightweight running shoes designed for comfort and everyday performance."
  },
  {
    id: 4, name: "Classic Backpack",
    category: "Accessories", price: 1499, oldPrice: 1999,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
    description: "A spacious everyday backpack with multiple compartments and a durable design."
  },
  {
    id: 5, name: "Camera",
    category: "Electronics", price: 24999, oldPrice: 29999,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600",
    description: "Capture memorable moments with this versatile digital camera."
  },
  {
    id: 6, name: "Sunglasses",
    category: "Fashion", price: 999, oldPrice: 1499,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600",
    description: "Modern sunglasses with a lightweight frame and timeless styling."
  },
  {
    id: 7, name: "Mechanical Keyboard",
    category: "Electronics", price: 3299, oldPrice: 4299,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600",
    description: "A responsive mechanical keyboard designed for productivity and gaming."
  },
  {
    id: 8, name: "Travel Bottle",
    category: "Accessories", price: 699, oldPrice: 999,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600",
    description: "A reusable travel bottle for convenient hydration on the go."
  }
];

const seedProducts = async () => {
  try {
    await connectDB();

    for (const product of products) {
      await Product.updateOne(
        { id: product.id },
        { $set: product },
        { upsert: true }
      );
    }

    console.log("8 products added/updated successfully!");
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

seedProducts();