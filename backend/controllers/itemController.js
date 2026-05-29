
 
const ItemModel = require("../models/ItemModel");
 
const itemController = {
 
  // GET /api/items
  async getAll(req, res) {
    try {
      const { type, status } = req.query;
      const items = await ItemModel.findAll({ type, status });
      return res.json(items);
    } catch (err) {
      console.error("Get items error:", err.message);
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  },
 
  // GET /api/items/:id
  async getOne(req, res) {
    try {
      const item = await ItemModel.findById(req.params.id);
      if (!item) return res.status(404).json({ message: "Item not found" });
      return res.json(item);
    } catch (err) {
      console.error("Get item error:", err.message);
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  },
 
  // POST /api/items
  async create(req, res) {
    const { ItemName, Description, Type } = req.body;
 
    if (!ItemName || !ItemName.trim()) {
      return res.status(400).json({ message: "ItemName is required" });
    }
    if (!Type || !["Lost", "Found"].includes(Type)) {
      return res.status(400).json({ message: "Type must be Lost or Found" });
    }
 
    try {
      const item = await ItemModel.create({
        ItemName: ItemName.trim(),
        Description: Description?.trim() || "",
        Type,
        PostedBy: req.user.userId,
      });
      return res.status(201).json({ message: "Item reported successfully", ItemID: item.ItemID });
    } catch (err) {
      console.error("Create item error:", err.message);
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  },
 
  // PUT /api/items/:id
  async update(req, res) {
    try {
      const item = await ItemModel.findById(req.params.id);
      if (!item) return res.status(404).json({ message: "Item not found" });
 
      // Only owner or admin can update
      if (item.PostedBy !== req.user.userId && req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorised to update this item" });
      }
 
      await ItemModel.update(req.params.id, {
        ItemName:    req.body.ItemName    || item.ItemName,
        Description: req.body.Description ?? item.Description,
        Type:        req.body.Type        || item.Type,
        Status:      req.body.Status      || item.Status,
      });
      return res.json({ message: "Item updated successfully" });
    } catch (err) {
      console.error("Update item error:", err.message);
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  },
 
  // DELETE /api/items/:id  (admin only — enforced in route)
  async remove(req, res) {
    try {
      const item = await ItemModel.findById(req.params.id);
      if (!item) return res.status(404).json({ message: "Item not found" });
 
      await ItemModel.delete(req.params.id);
      return res.json({ message: "Item deleted successfully" });
    } catch (err) {
      console.error("Delete item error:", err.message);
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  },
};
 
module.exports = itemController;