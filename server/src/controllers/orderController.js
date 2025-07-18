import jwt from "jsonwebtoken";
import pool from "../config/db.js";

// Place order
export const placeOrder = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mysecretkey");
    const user_id = decoded.id;

    const cartItems = await pool.query(
      "SELECT product_id, quantity FROM cart WHERE user_id = $1",
      [user_id]
    );

    if (cartItems.rows.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    for (const item of cartItems.rows) {
      await pool.query(
        `INSERT INTO orders (user_id, product_id, quantity, status)
         VALUES ($1, $2, $3, $4)`,
        [user_id, item.product_id, item.quantity, "Placed"]
      );
    }

    await pool.query("DELETE FROM cart WHERE user_id = $1", [user_id]);

    res.json({ message: "Order placed successfully!" });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get order history
export const getOrders = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mysecretkey");
    const user_id = decoded.id;

    const result = await pool.query(
      `SELECT 
         o.id AS order_id,
         p.name, 
         p.price, 
         p.image_url, 
         o.quantity, 
         o.status, 
         o.created_at
       FROM orders o
       JOIN products p ON o.product_id = p.id
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC`,
      [user_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};
