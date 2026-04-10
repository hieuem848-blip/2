import Ingredient from "../../models/Ingredient.js";
import InventoryLog from "../../models/InventoryLog.js";

// GET /admin/inventory — Lấy danh sách nguyên liệu (chưa bị xoá)
export const getIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json({ ingredients });
  } catch (error) {
    console.error("getIngredients error:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// POST /admin/inventory — Thêm nguyên liệu mới
export const createIngredient = async (req, res) => {
  try {
    const { name, unit, stock, minThreshold } = req.body;
    if (!name || !unit) {
      return res.status(400).json({ message: "Thiếu tên hoặc đơn vị" });
    }

    const ingredient = await Ingredient.create({
      name,
      unit,
      stock: stock || 0,
      minThreshold: minThreshold || 0,
    });

    // Ghi log nhập kho đầu nếu stock > 0
    if (stock > 0) {
      await InventoryLog.create({
        ingredient: ingredient._id,
        ingredientName: ingredient.name,
        type: "import",
        quantity: stock,
        reason: "Thêm nguyên liệu mới vào kho",
        createdBy: req.user?._id,
      });
    }

    res.status(201).json({ ingredient });
  } catch (error) {
    console.error("createIngredient error:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// PUT /admin/inventory/:id — Cập nhật thông tin nguyên liệu (tên, đơn vị, ngưỡng)
export const updateIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, unit, minThreshold } = req.body;

    const ingredient = await Ingredient.findByIdAndUpdate(
      id,
      { name, unit, minThreshold },
      { new: true }
    );

    if (!ingredient) return res.status(404).json({ message: "Không tìm thấy nguyên liệu" });
    res.json({ ingredient });
  } catch (error) {
    console.error("updateIngredient error:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// DELETE /admin/inventory/:id — Xoá mềm nguyên liệu
export const deleteIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const ingredient = await Ingredient.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!ingredient) return res.status(404).json({ message: "Không tìm thấy nguyên liệu" });
    res.json({ message: "Đã xoá nguyên liệu" });
  } catch (error) {
    console.error("deleteIngredient error:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// POST /admin/inventory/:id/movement — Nhập / Xuất / Hủy kho
export const recordMovement = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, quantity, reason } = req.body;

    if (!["import", "export", "spoilage"].includes(type)) {
      return res.status(400).json({ message: "Loại giao dịch không hợp lệ" });
    }
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Số lượng phải lớn hơn 0" });
    }
    if ((type === "spoilage") && !reason) {
      return res.status(400).json({ message: "Vui lòng nhập lý do hủy" });
    }

    const ingredient = await Ingredient.findById(id);
    if (!ingredient || ingredient.isDeleted) {
      return res.status(404).json({ message: "Không tìm thấy nguyên liệu" });
    }

    if (type === "import") {
      ingredient.stock += quantity;
    } else {
      // export hoặc spoilage: trừ stock
      if (ingredient.stock < quantity) {
        return res.status(400).json({
          message: `Không đủ tồn kho! Chỉ còn ${ingredient.stock} ${ingredient.unit}`,
        });
      }
      ingredient.stock -= quantity;
    }

    await ingredient.save();

    const log = await InventoryLog.create({
      ingredient: ingredient._id,
      ingredientName: ingredient.name,
      type,
      quantity,
      reason: reason || "",
      createdBy: req.user?._id,
    });

    res.json({ ingredient, log });
  } catch (error) {
    console.error("recordMovement error:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// GET /admin/inventory/logs — Lịch sử giao dịch gần nhất
export const getLogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const logs = await InventoryLog.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("ingredient", "name unit")
      .populate("createdBy", "displayName");

    res.json({ logs });
  } catch (error) {
    console.error("getLogs error:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// GET /admin/inventory/stats — Thống kê nhanh cho kho
export const getInventoryStats = async (req, res) => {
  try {
    const ingredients = await Ingredient.find({ isDeleted: false });
    const total = ingredients.length;
    const lowStock = ingredients.filter((i) => i.stock <= i.minThreshold).length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayLogs = await InventoryLog.countDocuments({ createdAt: { $gte: today } });

    res.json({ total, lowStock, todayTransactions: todayLogs });
  } catch (error) {
    console.error("getInventoryStats error:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};