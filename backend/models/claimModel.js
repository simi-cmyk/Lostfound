
const db = require("../config/db");
 
const ClaimModel = {
 
  // Get all claims (admin) or claims by user
  async findAll({ userId, role } = {}) {
    let sql, params;
    if (role === "admin") {
      sql = `
        SELECT c.*, i.ItemName, i.Type, u.UserName AS ClaimedByName
        FROM Claims c
        JOIN Items i ON c.ItemID    = i.ItemID
        JOIN Users u ON c.ClaimedBy = u.UserId
        ORDER BY c.DateClaimed DESC
      `;
      params = [];
    } else {
      sql = `
        SELECT c.*, i.ItemName, i.Type, u.UserName AS ClaimedByName
        FROM Claims c
        JOIN Items i ON c.ItemID    = i.ItemID
        JOIN Users u ON c.ClaimedBy = u.UserId
        WHERE c.ClaimedBy = ?
        ORDER BY c.DateClaimed DESC
      `;
      params = [userId];
    }
    const [rows] = await db.execute(sql, params);
    return rows;
  },
 
  // Get a single claim by ID
  async findById(ClaimID) {
    const [rows] = await db.execute(
      `SELECT c.*, i.ItemName, i.Type
       FROM Claims c
       JOIN Items i ON c.ItemID = i.ItemID
       WHERE c.ClaimID = ?`,
      [ClaimID]
    );
    return rows[0] || null;
  },
 
  // Check if a user already claimed an item
  async findDuplicate(ItemID, ClaimedBy) {
    const [rows] = await db.execute(
      "SELECT * FROM Claims WHERE ItemID = ? AND ClaimedBy = ?",
      [ItemID, ClaimedBy]
    );
    return rows[0] || null;
  },
 
  // Create a new claim
  async create({ ItemID, ClaimedBy }) {
    const [result] = await db.execute(
      "INSERT INTO Claims (ItemID, ClaimedBy) VALUES (?, ?)",
      [ItemID, ClaimedBy]
    );
    return { ClaimID: result.insertId, ItemID, ClaimedBy };
  },
 
  // Update claim approval status
  async updateApproval(ClaimID, Approved) {
    await db.execute(
      "UPDATE Claims SET Approved = ? WHERE ClaimID = ?",
      [Approved, ClaimID]
    );
  },
 
  // Delete a claim
  async delete(ClaimID) {
    await db.execute("DELETE FROM Claims WHERE ClaimID = ?", [ClaimID]);
  },
 
  // Count pending claims
  async countPending() {
    const [rows] = await db.execute(
      "SELECT COUNT(*) AS total FROM Claims WHERE Approved = 'Pending'"
    );
    return rows[0].total;
  },
};
 
module.exports = ClaimModel;
 