import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    alert("Logged out!");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white px-12 py-10 flex justify-between items-center shadow-lg z-50">
      <div className="text-3xl font-bold text-blue-400 hover:text-blue-300 transition">
        <Link to="/">E-Commerce</Link>
      </div>

      <div className="space-x-6 text-2xl">
        {isLoggedIn && (
          <>
            <Link
              to="/"
              className="hover:text-blue-400 transition font-semibold"
            >
              Home
            </Link>
            <Link
              to="/cart"
              className="hover:text-blue-400 transition font-semibold"
            >
              Cart
            </Link>
            <Link
              to="/orders"
              className="hover:text-blue-400 transition font-semibold"
            >
              Orders
            </Link>
            {role === "admin" && (
              <Link
                to="/admin"
                className="hover:text-blue-400 transition font-semibold"
              >
                Admin Panel
              </Link>
            )}
          </>
        )}

        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              className="hover:text-green-400 transition font-semibold"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="hover:text-green-400 transition font-semibold"
            >
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-lg font-semibold transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
