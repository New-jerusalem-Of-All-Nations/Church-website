const express = require("express");
const router = express.Router();

console.log("🔵 Auth routes file loaded");

router.post("/test-route", (req, res) => {
  res.json({ success: true, message: "Test route works" });
});

router.post("/request-login-token", (req, res) => {
  res.json({ success: true, message: "Request login token works" });
});

router.post("/login", (req, res) => {
  res.json({ success: true, message: "Login works" });
});

console.log("🔵 Auth routes registered");

module.exports = router;
