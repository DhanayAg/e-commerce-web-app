import express from "express";
import { verifyAdmin } from "../middleware/authMiddleware.js";

import { 
    getAllProducts, 
    getProductsByCategory, 
    addProduct, 
    deleteProduct 
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/category/:categoryName", getProductsByCategory);

// Admin
router.post("/", verifyAdmin, addProduct);
router.delete("/:id", verifyAdmin, deleteProduct);

export default router;
