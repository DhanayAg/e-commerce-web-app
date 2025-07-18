import pool from "../config/db.js";

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM products WHERE is_active = true");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get products by category (Clothes or Sneakers)
export const getProductsByCategory = async (req, res) => {
    const { categoryName } = req.params;
    try {
        const result = await pool.query(`
            SELECT p.id, p.name, p.description, p.price, p.stock, p.image_url, c.name AS category
            FROM products p
            JOIN categories c ON p.category_id = c.id
            WHERE LOWER(c.name) = LOWER($1);
        `, [categoryName]);

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching category products:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Add new product (Admin only)
export const addProduct = async (req, res) => {
    const { name, description, price, stock, image_url, category_id } = req.body;

    try {
        await pool.query(`
            INSERT INTO products (name, description, price, stock, image_url, category_id)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [name, description, price, stock, image_url, category_id]);

        res.status(201).json({ message: "Product added successfully" });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete a product (Admin only)
export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query("DELETE FROM products WHERE id = $1", [id]);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Server error" });
    }
};
