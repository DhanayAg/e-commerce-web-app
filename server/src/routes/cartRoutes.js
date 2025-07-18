import express from "express";
import {
  addToCart,
  getCartItems,
  removeFromCart,
  updateCartQuantity,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/", addToCart);
router.get("/", getCartItems);
router.patch("/:cart_id", updateCartQuantity);
router.delete("/:cart_id", removeFromCart);

export default router;

