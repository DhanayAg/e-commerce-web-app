import express from "express";

import {
  addProduct,
  deleteProduct,
  toggleProductStatus,
  updateProduct,
  getAllProductsAdmin,
  getCategories 
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/products", getAllProductsAdmin); 
router.post("/products", addProduct);
router.delete("/products/:id", deleteProduct);
router.put("/products/:id", updateProduct);
router.patch("/products/:id/status", toggleProductStatus);
router.get("/categories", getCategories);

export default router;
