import jwt from "jsonwebtoken";
import pool from "../config/db.js";

// Middleware-like function to check admin
const checkAdmin = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new Error("Unauthorized");

  const decoded = jwt.verify(token, process.env.JWT_SECRET || "mysecretkey");
  if (decoded.role !== "admin") throw new Error("Forbidden");
  return decoded;
};

export const getAllProductsAdmin = async (req, res) => {
  try {
    checkAdmin(req);
    const result = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching all products (admin):", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Add Product
export const addProduct = async (req, res) => {
  try {
    checkAdmin(req);

    const { name, price, category_id, image_url, stock, description } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    await pool.query(
      "INSERT INTO products (name, price, category_id, image_url, stock, description, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())",
      [name, price, category_id || null, image_url || "", stock || 0, description || ""]
    );

    res.json({ message: "Product added successfully" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    checkAdmin(req);
    const { id } = req.params;
    console.log("Received ID for deletion:", id); 

    const result = await pool.query(
      "UPDATE products SET is_active = false WHERE id = $1",
      [id]
    );
    console.log("Rows affected:", result.rowCount);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product marked as inactive (soft deleted)" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleProductStatus = async (req, res) => {
  try {
    checkAdmin(req);
    const { id } = req.params;
    const { is_active } = req.body;

    const result = await pool.query(
      "UPDATE products SET is_active = $1 WHERE id = $2",
      [is_active, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: `Product is now ${is_active ? "active" : "inactive"}` });
  } catch (error) {
    console.error("Error toggling product status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    checkAdmin(req);
    const { id } = req.params;
    const { name, price, category_id, image_url, stock, description } = req.body;

    const result = await pool.query(
      `UPDATE products
       SET name = $1, price = $2, category_id = $3, image_url = $4, stock = $5, description = $6
       WHERE id = $7`,
      [name, price, category_id || null, image_url || "", stock || 0, description || "", id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories ORDER BY name");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error" });
  }
};