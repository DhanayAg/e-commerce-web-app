import React, { useEffect, useState } from "react";
import axios from "axios";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(res.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, [token]);

  const updateQuantity = async (cartId, newQuantity) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/cart/${cartId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (newQuantity <= 0) {
        setCartItems(cartItems.filter((item) => item.cart_id !== cartId));
      } else {
        setCartItems(
          cartItems.map((item) =>
            item.cart_id === cartId ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const placeOrder = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Order placed successfully!");
      setCartItems([]);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="pt-20 px-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 pb-10">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">No items in cart</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.cart_id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-600">₹{item.price}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      updateQuantity(item.cart_id, item.quantity - 1)
                    }
                    className="bg-gray-200 px-2 py-1 rounded-l hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="px-3">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.cart_id, item.quantity + 1)
                    }
                    className="bg-gray-200 px-2 py-1 rounded-r hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <h3 className="text-xl font-bold mb-4">Bill Summary</h3>
            <p className="text-gray-700">Total Items: {totalItems}</p>
            <p className="text-lg font-semibold mt-2">
              Total Price: ₹{totalPrice.toFixed(2)}
            </p>
            <button
              onClick={placeOrder}
              className="w-full bg-green-600 text-white py-2 mt-4 rounded hover:bg-green-700"
            >
              ✅ Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
