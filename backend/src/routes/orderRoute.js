import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createOrderFromCart,
  createOrderFromCustomCake,
  getMyOrders,
  getOrderDetail,
  cancelOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/from-cart", createOrderFromCart);
router.post("/from-custom", createOrderFromCustomCake);

router.get("/", getMyOrders);
router.get("/:id", getOrderDetail);
router.put("/:id/cancel", cancelOrder);

export default router;
