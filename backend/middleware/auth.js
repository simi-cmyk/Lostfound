const jwt = require("jsonwebtoken");
 
function authMiddleware(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) return res.status(401).json({ message: "No token provided" });
 
  const token = header.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Malformed token" });
 
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;   // { userId, userName, role }
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
 
function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}
 
module.exports = { authMiddleware, adminOnly };
 