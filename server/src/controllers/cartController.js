import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const addToCart = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mysecretkey");
    const user_id = decoded.id;
    const { product_id, quantity } = req.body;

    // Check if product already exists in cart
    const existingItem = await pool.query(
      "SELECT id, quantity FROM cart WHERE user_id = $1 AND product_id = $2",
      [user_id, product_id]
    );

    if (existingItem.rows.length > 0) {
      const newQuantity = existingItem.rows[0].quantity + quantity;
      await pool.query("UPDATE cart SET quantity = $1 WHERE id = $2", [
        newQuantity,
        existingItem.rows[0].id,
      ]);
    } else {     
      await pool.query(
        "INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)",
        [user_id, product_id, quantity]
      );
    }

    res.json({ message: "Product added to cart" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getCartItems = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mysecretkey");
    const user_id = decoded.id;

    const result = await pool.query(
      `SELECT c.id AS cart_id, p.name, p.price, p.image_url, c.quantity
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [user_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { cart_id } = req.params;

    await pool.query("DELETE FROM cart WHERE id = $1", [cart_id]);
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update cart quantity
export const updateCartQuantity = async (req, res) => {
  try {
    const { cart_id } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      await pool.query("DELETE FROM cart WHERE id = $1", [cart_id]);
      return res.json({ message: "Item removed from cart" });
    }

    await pool.query("UPDATE cart SET quantity = $1 WHERE id = $2", [
      quantity,
      cart_id,
    ]);
    res.json({ message: "Cart quantity updated" });
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    res.status(500).json({ message: "Server error" });
  }
};
