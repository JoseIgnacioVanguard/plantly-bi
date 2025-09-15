// routes/RlsDmRoutes.js
const express = require("express");
const router = express.Router();
const RlsDmRoutes = require("../models/RlsDm");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// 🔹 GET all RLS DM permissions
router.get(
  "/",
  authMiddleware,
  authorizeRoles("admin", "editor", "viewer"),
  async (req, res) => {
    try {
      const RlsDmData = await RlsDmRoutes.getData();
      res.json(RlsDmData);
    } catch (error) {
      console.error("Error fetching RLS DM data:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// 🔹 POST new RLS DM permission
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin", "editor", "viewer"),
  async (req, res) => {
    try {
      const newRlsPermission = req.body;
      const result = await RlsDmRoutes.createRlsPermission(newRlsPermission);
      res.status(201).json({
        message: "RLS DM Permission created successfully",
        rowsInserted: result,
      });
    } catch (error) {
      console.error("Error creating RLS DM Permission:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// 🔹 PATCH update existing RLS DM permission
router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "editor"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const result = await RlsDmRoutes.updateRlsPermission(id, updatedData);

      if (result === 0) {
        return res.status(404).json({ message: "RLS DM Permission not found" });
      }

      res.json({
        message: "RLS DM Permission updated successfully",
        rowsUpdated: result,
      });
    } catch (error) {
      console.error("Error updating RLS DM Permission:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// 🔹 DELETE a RLS DM permission
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const result = await RlsDmRoutes.deleteRlsPermission(id);

      if (result === 0) {
        return res.status(404).json({ message: "RLS DM Permission not found" });
      }

      res.json({
        message: "RLS DM Permission deleted successfully",
        rowsDeleted: result,
      });
    } catch (error) {
      console.error("Error deleting RLS DM Permission:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
