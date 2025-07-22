# 🛒 E-commerce Web Application

A **full-stack e-commerce web app** built with **React (frontend)**, **Node.js + Express (backend)**, and **PostgreSQL (database)**.  
Users can browse products, add them to the cart, place orders, and admins can manage products via a dedicated admin panel.

---

## ✨ Features

### 👤 User
- ✅ Register & Login with **JWT authentication**  
- ✅ Browse products by category  
- ✅ Add, update, and remove items from the **cart**  
- ✅ Place orders and view order history  

### 🛠 Admin
- ✅ Add, update, and soft-delete products  
- ✅ Activate / Deactivate products  
- ✅ Manage stock and product details  

### 💻 General
- ✅ Fully responsive UI built with **Tailwind CSS**  
- ✅ Secure REST API with JWT authentication  

---

## 🛠 Tech Stack

![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Styling-TailwindCSS-06B6D4?logo=tailwindcss)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)
![Express](https://img.shields.io/badge/Framework-Express-black?logo=express)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql)
![JWT](https://img.shields.io/badge/Auth-JWT-orange?logo=jsonwebtokens)
![Render](https://img.shields.io/badge/Hosting-Render-46E3B7?logo=render)


## ⚡ Installation & Setup

1. **Clone the repository**
    git clone https://github.com/DhanayAg/e-commerce-web-app.git
    cd e-commerce-web-app

2. **Backend**
    cd server
    npm install

3. **Frontend**
    cd ../client
    npm install

4. **Set up environment variables**
Create a .env file in the server folder:
    DATABASE_URL=your_postgresql_connection_string
    JWT_SECRET=your_jwt_secret

5. **Run the app locally**

Backend (from server folder)
    npm run dev

Frontend (from client folder)
    npm start

6. **Visit in browser**

Frontend: http://localhost:3000
Backend API: http://localhost:5000


**Next Steps (Optional Enhancements)**

🔹 Add Google Login with Firebase
🔹 Integrate Payment Gateway (Stripe/Razorpay)
🔹 Add Product Reviews & Ratings


**Author**
Dhanay Agarwal

📧 2022ume0201@iitjammu.ac.in

🌐 https://github.com/DhanayAg