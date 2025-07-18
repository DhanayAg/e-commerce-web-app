import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // 
  const [form, setForm] = useState({
    name: "",
    price: "",
    category_id: "",
    image_url: "",
    stock: "",
    description: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories(); // 
  }, []);

  const addOrUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/admin/products/${editingProduct.id}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("✅ Product updated successfully!");
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/products`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Product added successfully!");
      }

      setForm({
        name: "",
        price: "",
        category_id: "",
        image_url: "",
        stock: "",
        description: "",
      });
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("❌ Error saving product");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Product soft deleted (inactive)!");
      fetchProducts();
    } catch (error) {
      alert("❌ Error deleting product");
    }
  };

  const toggleStatus = async (id, is_active) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/admin/products/${id}/status`,
        { is_active },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`✅ Product is now ${is_active ? "Active" : "Inactive"}`);
      fetchProducts();
    } catch (error) {
      alert("❌ Error toggling status");
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: product.price,
      category_id: product.category_id || "",
      image_url: product.image_url || "",
      stock: product.stock || "",
      description: product.description || "",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        🛠 Admin Panel
      </h2>

      {/* ✅ Add/Edit Product Form */}
      <form
        onSubmit={addOrUpdateProduct}
        className="bg-white shadow-md rounded-lg p-6 space-y-4"
      >
        <input
          type="text"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={form.category_id}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Image URL"
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex gap-3">
          <button
            type="submit"
            className={`px-4 py-2 rounded text-white ${
              editingProduct ? "bg-orange-500" : "bg-green-600"
            } hover:opacity-90`}
          >
            {editingProduct ? "✏ Update Product" : "➕ Add Product"}
          </button>
          {editingProduct && (
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setForm({
                  name: "",
                  price: "",
                  category_id: "",
                  image_url: "",
                  stock: "",
                  description: "",
                });
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:opacity-90"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 pt-10 pb-5">
        📦 All Products
      </h3>
      <div className="space-y-4">
        {products.map((p) => (
          <div
            key={p.id}
            className={`p-4 rounded-lg shadow-md flex justify-between items-center ${
              p.is_active ? "bg-white" : "bg-red-100"
            }`}
          >
            <div>
              <h4 className="text-lg font-bold">{p.name}</h4>
              <p className="text-gray-600">
                ₹{p.price} | Stock: {p.stock} |{" "}
                <span className="font-medium">
                  Category:{" "}
                  {categories.find((c) => c.id === p.category_id)?.name ||
                    "N/A"}
                </span>
              </p>
              <p className="text-sm text-gray-500">{p.description}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => startEdit(p)}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:opacity-90"
              >
                ✏ Edit
              </button>
              <button
                onClick={() => deleteProduct(p.id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:opacity-90"
              >
                🗑 Delete
              </button>
              <button
                onClick={() => toggleStatus(p.id, !p.is_active)}
                className={`px-3 py-1 rounded text-white ${
                  p.is_active ? "bg-gray-700" : "bg-green-600"
                } hover:opacity-90`}
              >
                {p.is_active ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;
