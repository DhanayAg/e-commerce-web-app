import React, { useEffect, useState } from "react";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center pb-10">
        📦 Your Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          You haven’t placed any orders yet.
        </p>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  {order.name}
                </h3>
                <p className="text-blue-600 font-bold">
                  ₹{order.price} × {order.quantity}
                </p>
                <p
                  className={`text-sm font-medium mt-1 ${
                    order.status === "delivered"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  Status: {order.status}
                </p>
                <p className="text-gray-500 text-sm">
                  Ordered on:{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <img
                  src={order.image_url}
                  alt={order.name}
                  className="w-20 h-20 object-cover rounded"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
