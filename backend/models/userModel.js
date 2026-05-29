
 
const db = require("../config/db");
 
const UserModel = {
 
  // Find a user by username
  async findByUsername(UserName) {
    const [rows] = await db.execute(
      "SELECT * FROM Users WHERE UserName = ?",
      [UserName]
    );
    return rows[0] || null;
  },
 
  // Find a user by ID
  async findById(UserId) {
    const [rows] = await db.execute(
      "SELECT UserId, UserName, Role, CreatedAt FROM Users WHERE UserId = ?",
      [UserId]
    );
    return rows[0] || null;
  },
 
  // Create a new user
  async create({ UserName, Password, Role = "user" }) {
    const [result] = await db.execute(
      "INSERT INTO Users (UserName, Password, Role) VALUES (?, ?, ?)",
      [UserName, Password, Role]
    );
    return { UserId: result.insertId, UserName, Role };
  },
 
  // Get all users (admin use)
  async findAll() {
    const [rows] = await db.execute(
      "SELECT UserId, UserName, Role, CreatedAt FROM Users ORDER BY CreatedAt DESC"
    );
    return rows;
  },
 
  // Delete a user
  async delete(UserId) {
    await db.execute("DELETE FROM Users WHERE UserId = ?", [UserId]);
  },
};
 
module.exports = UserModel;