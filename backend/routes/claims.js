const express          = require("express");
const claimController  = require("../controllers/claimController");
const { authMiddleware, adminOnly } = require("../middleware/auth");
const router           = express.Router();
 
// GET  /api/claims             — auth (admin sees all, user sees own)
router.get("/", authMiddleware, claimController.getAll);
 
// POST /api/claims             — auth required (submit claim)
router.post("/", authMiddleware, claimController.create);
 
// PUT  /api/claims/:id/approve — admin only
router.put("/:id/approve", authMiddleware, adminOnly, claimController.approve);
 
// DELETE /api/claims/:id       — admin only
router.delete("/:id", authMiddleware, adminOnly, claimController.remove);
 
module.exports = router;
 