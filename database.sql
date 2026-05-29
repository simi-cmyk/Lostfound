
 
CREATE DATABASE IF NOT EXISTS lostfound_db;
USE lostfound_db;
 
-- ── Users ──────────────────────────────────
CREATE TABLE IF NOT EXISTS Users (
  UserId    INT          AUTO_INCREMENT PRIMARY KEY,
  UserName  VARCHAR(100) NOT NULL UNIQUE,
  Password  VARCHAR(255) NOT NULL,          -- bcrypt hash
  Role      ENUM('user','admin') DEFAULT 'user',
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
 
-- ── Items ──────────────────────────────────
CREATE TABLE IF NOT EXISTS Items (
  ItemID      INT          AUTO_INCREMENT PRIMARY KEY,
  ItemName    VARCHAR(150) NOT NULL,
  Description TEXT,
  Type        ENUM('Lost','Found') NOT NULL,
  DatePosted  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  Status      ENUM('Open','Claimed','Closed') DEFAULT 'Open',
  PostedBy    INT,
  FOREIGN KEY (PostedBy) REFERENCES Users(UserId) ON DELETE SET NULL
);
 
-- ── Claims ─────────────────────────────────
CREATE TABLE IF NOT EXISTS Claims (
  ClaimID     INT  AUTO_INCREMENT PRIMARY KEY,
  ItemID      INT  NOT NULL,
  ClaimedBy   INT  NOT NULL,
  DateClaimed DATETIME DEFAULT CURRENT_TIMESTAMP,
  Approved    ENUM('Pending','Approved','Rejected') DEFAULT 'Pending',
  FOREIGN KEY (ItemID)    REFERENCES Items(ItemID)   ON DELETE CASCADE,
  FOREIGN KEY (ClaimedBy) REFERENCES Users(UserId)   ON DELETE CASCADE
);
 
-- ── Seed: default admin account ─────────────
-- Password: admin123  (bcrypt hash below)
INSERT IGNORE INTO Users (UserName, Password, Role)
VALUES ('admin', '$2b$10$KIXmBvMn9l6QK1VuOPZpEODJhSt4s5VzXQY1W7VlkYdpSFkBIr5NO', 'admin');
 