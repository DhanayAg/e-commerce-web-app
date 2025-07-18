import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addToCart = async (productId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/cart`,
        { product_id: productId, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Added to cart!");
    } catch (error) {
      alert("Error adding to cart");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center pb-10">
        🛍️ Latest Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="h-40 w-full object-cover rounded"
            />
            <h3 className="text-lg font-semibold text-gray-700 mt-3">
              {product.name}
            </h3>
            <p className="text-gray-500 text-sm">{product.description}</p>
            <p className="text-blue-600 font-bold text-lg mt-2">
              ₹{product.price}
            </p>
            <button
              onClick={() => addToCart(product.id)}
              className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
