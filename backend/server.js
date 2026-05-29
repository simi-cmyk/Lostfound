require("dotenv").config();
const express = require("express");
const cors    = require("cors");
 
const authRoutes   = require("./routes/auth");
const itemRoutes   = require("./routes/items");
const claimRoutes  = require("./routes/claims");
 
const app  = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
 
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/auth",   authRoutes);
app.use("/api/items",  itemRoutes);
app.use("/api/claims", claimRoutes);

app.get("/", (req, res) => res.json({ status: "Lost & Found API running" }));
 
// ── Start ──────────────────────────────────
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
 