import express from "express";
import {
  getIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
  recordMovement,
  getLogs,
  getInventoryStats,
} from "../../controllers/admin/adminInventoryController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import adminMiddleware from "../../middlewares/adminMiddleware.js";

const router = express.Router();
router.use(authMiddleware, adminMiddleware(["ADMIN", "STAFF"]));

router.get("/stats", getInventoryStats);
router.get("/logs", getLogs);
router.get("/", getIngredients);
router.post("/", createIngredient);
router.put("/:id", updateIngredient);
router.delete("/:id", deleteIngredient);
router.post("/:id/movement", recordMovement);

export default router;