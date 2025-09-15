const express = require("express");
const router = express.Router();
const Auth = require("../models/Auth");

router.post("/register", async (req, res) => {
  const { user_id, password } = req.body;
  try {
    await Auth.registerUser(user_id, password);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { user_id, password } = req.body;
  try {
    const data = await Auth.loginUser(user_id, password);
    res.json(data);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = router;
