
const bcrypt    = require("bcryptjs");
const jwt       = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
 
const authController = {
 
  // POST /api/auth/register
  async register(req, res) {
    const { UserName, Password } = req.body;
 
    if (!UserName || !Password) {
      return res.status(400).json({ message: "UserName and Password are required" });
    }
    if (Password.length < 4) {
      return res.status(400).json({ message: "Password must be at least 4 characters" });
    }
 
    try {
      // Check if username already taken
      const existing = await UserModel.findByUsername(UserName);
      if (existing) {
        return res.status(409).json({ message: "Username already taken" });
      }
 
      const hashedPassword = await bcrypt.hash(Password, 10);
      const user = await UserModel.create({
        UserName,
        Password: hashedPassword,
        Role: "user",
      });
 
      return res.status(201).json({
        message: "Registered successfully",
        UserId:  user.UserId,
      });
    } catch (err) {
      console.error("Register error:", err);
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  },
 
  // POST /api/auth/login
  async login(req, res) {
    const { UserName, Password } = req.body;
 
    if (!UserName || !Password) {
      return res.status(400).json({ message: "UserName and Password are required" });
    }
 
    try {
      const user = await UserModel.findByUsername(UserName);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
 
      const match = await bcrypt.compare(Password, user.Password);
      if (!match) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
 
      const token = jwt.sign(
        { userId: user.UserId, userName: user.UserName, role: user.Role },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
      );
 
      return res.json({
        token,
        role:     user.Role,
        userName: user.UserName,
        userId:   user.UserId,
      });
    } catch (err) {
      console.error("Login error:", err.message);
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  },
};
 
module.exports = authController;