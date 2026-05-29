
const ClaimModel = require("../models/ClaimModel");
const ItemModel  = require("../models/ItemModel");
 
const claimController = {
 
  // GET /api/claims
  async getAll(req, res) {
    try {
      const claims = await ClaimModel.findAll({
        userId: req.user.userId,
        role:   req.user.role,
      });
      return res.json(claims);
    } catch (err) {
      console.error("Get claims error:", err.message);
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  },
 
  // POST /api/claims  — user submits a claim
  async create(req, res) {
    const { ItemID } = req.body;
    if (!ItemID) {
      return res.status(400).json({ message: "ItemID is required" });
    }
 
    try {
      // Item must exist and be Open
      const item = await ItemModel.findById(ItemID);
      if (!item) return res.status(404).json({ message: "Item not found" });
      if (item.Status !== "Available") {
        return res.status(400).json({ message: "This item is no longer available for claiming" });
      }
 
      // Cannot claim your own posted item
      if (item.PostedBy === req.user.userId) {
        return res.status(400).json({ message: "You cannot claim your own item" });
      }
 
      // Prevent duplicate claims
      const duplicate = await ClaimModel.findDuplicate(ItemID, req.user.userId);
      if (duplicate) {
        return res.status(409).json({ message: "You have already submitted a claim for this item" });
      }
 
      // Create the claim
      const claim = await ClaimModel.create({ ItemID, ClaimedBy: req.user.userId });
 
      // Mark item as Claimed
      await ItemModel.updateStatus(ItemID, "Claimed");
 
      return res.status(201).json({ message: "Claim submitted successfully", ClaimID: claim.ClaimID });
    } catch (err) {
      console.error("Create claim error:", err.message);
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  },
 
  // PUT /api/claims/:id/approve  — admin approves or rejects
  async approve(req, res) {
    const { decision } = req.body;
 
    if (!["Approved", "Rejected"].includes(decision)) {
      return res.status(400).json({ message: "decision must be Approved or Rejected" });
    }
 
    try {
      const claim = await ClaimModel.findById(req.params.id);
      if (!claim) return res.status(404).json({ message: "Claim not found" });
 
      // Update the claim
      await ClaimModel.updateApproval(req.params.id, decision);
 
      // Update the item status accordingly
      const newItemStatus = decision === "Approved" ? "Closed" : "Open";
      await ItemModel.updateStatus(claim.ItemID, newItemStatus);
 
      return res.json({ message: `Claim ${decision} successfully` });
    } catch (err) {
      console.error("Approve claim error:", err.message);
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  },
 
  // DELETE /api/claims/:id  — admin only
  async remove(req, res) {
    try {
      const claim = await ClaimModel.findById(req.params.id);
      if (!claim) return res.status(404).json({ message: "Claim not found" });
 
      await ClaimModel.delete(req.params.id);
      return res.json({ message: "Claim deleted successfully" });
    } catch (err) {
      console.error("Delete claim error:", err.message);
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  },
};
 
module.exports = claimController;