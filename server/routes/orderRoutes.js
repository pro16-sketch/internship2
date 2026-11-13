
const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// PLACE ORDER
router.post("/", protect, async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = [];
    let total = 0;

    for (const item of items) {
      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          message: "Invalid product quantity",
        });
      }

      const product = await Product.findOne({
        id: Number(item.id),
      });

      if (!product) {
        return res.status(404).json({
          message: `Product ${item.id} not found`,
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity,
      });

      total += product.price * quantity;
    }

    // Reduce stock after validating all products
    for (const item of items) {
      await Product.updateOne(
        { id: Number(item.id) },
        { $inc: { stock: -Number(item.quantity) } }
      );
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      total,
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
});

module.exports = router;
