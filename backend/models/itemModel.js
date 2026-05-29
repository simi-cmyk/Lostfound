
 
const db = require("../config/db");
 
const ItemModel = {
 
  // Get all items (with optional type/status filter)
  async findAll({ type, status } = {}) {
    let sql = `
      SELECT i.*, u.UserName AS PostedByName
      FROM Items i
      LEFT JOIN Users u ON i.PostedBy = u.UserId
      WHERE 1=1
    `;
    const params = [];
    if (type)   { sql += " AND i.Type = ?";   params.push(type); }
    if (status) { sql += " AND i.Status = ?"; params.push(status); }
    sql += " ORDER BY i.DatePosted DESC";
    const [rows] = await db.execute(sql, params);
    return rows;
  },
 
  // Get a single item by ID
  async findById(ItemID) {
    const [rows] = await db.execute(
      `SELECT i.*, u.UserName AS PostedByName
       FROM Items i
       LEFT JOIN Users u ON i.PostedBy = u.UserId
       WHERE i.ItemID = ?`,
      [ItemID]
    );
    return rows[0] || null;
  },
 
  // Create a new item
  async create({ ItemName, Description, Type, PostedBy }) {
    const [result] = await db.execute(
      "INSERT INTO Items (ItemName, Description, Type, PostedBy) VALUES (?, ?, ?, ?)",
      [ItemName, Description || "", Type, PostedBy]
    );
    return { ItemID: result.insertId, ItemName, Description, Type, PostedBy };
  },
 
  // Update an item
  async update(ItemID, { ItemName, Description, Type, Status }) {
    await db.execute(
      "UPDATE Items SET ItemName = ?, Description = ?, Type = ?, Status = ? WHERE ItemID = ?",
      [ItemName, Description, Type, Status, ItemID]
    );
  },
 
  // Update only the status
  async updateStatus(ItemID, Status) {
    await db.execute(
      "UPDATE Items SET Status = ? WHERE ItemID = ?",
      [Status, ItemID]
    );
  },
 
  // Delete an item
  async delete(ItemID) {
    await db.execute("DELETE FROM Items WHERE ItemID = ?", [ItemID]);
  },
 
  // Count items by type
  async countByType(Type) {
    const [rows] = await db.execute(
      "SELECT COUNT(*) AS total FROM Items WHERE Type = ?",
      [Type]
    );
    return rows[0].total;
  },
 
  // Count items by status
  async countByStatus(Status) {
    const [rows] = await db.execute(
      "SELECT COUNT(*) AS total FROM Items WHERE Status = ?",
      [Status]
    );
    return rows[0].total;
  },
};
 
module.exports = ItemModel;