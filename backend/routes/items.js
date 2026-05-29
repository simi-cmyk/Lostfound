const express        = require("express");
const itemController = require("../controllers/itemController");
const { authMiddleware, adminOnly } = require("../middleware/auth");
const router         = express.Router();
 
// GET  /api/items        — public
router.get("/",    itemController.getAll);
 
// GET  /api/items/:id    — public
router.get("/:id", itemController.getOne);
 
// POST /api/items        — auth required
router.post("/", authMiddleware, itemController.create);
 
// PUT  /api/items/:id    — auth required (owner or admin)
router.put("/:id", authMiddleware, itemController.update);
 
// DELETE /api/items/:id  — admin only
router.delete("/:id", authMiddleware, adminOnly, itemController.remove);
 
module.exports = router;