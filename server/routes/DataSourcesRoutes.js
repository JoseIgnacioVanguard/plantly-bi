// routes/DataSourcesRoutes.js
const express = require("express");
const router = express.Router();
const DataSources = require("../models/DataSources");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// 🔹 GET all data sources
router.get(
  "/",
  authMiddleware,
  authorizeRoles("admin", "editor", "viewer"),
  async (req, res) => {
    try {
      const DataSourcesData = await DataSources.getData();
      res.json(DataSourcesData);
    } catch (error) {
      console.error("Error fetching DataSources data:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// 🔹 POST new data source
router.post("/", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const newDataSource = req.body;
    const result = await DataSources.createDataSource(newDataSource);
    res.status(201).json({
      message: "Data Source created successfully",
      rowsInserted: result,
    });
  } catch (error) {
    console.error("Error creating Data Source:", error);
    res.status(500).json({ message: error.message });
  }
});

// 🔹 PATCH update existing data source
router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "editor"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const result = await DataSources.updateDataSource(id, updatedData);

      if (result === 0) {
        return res.status(404).json({ message: "Data Source not found" });
      }

      res.json({
        message: "Data Source updated successfully",
        rowsUpdated: result,
      });
    } catch (error) {
      console.error("Error updating Data Source:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// 🔹 DELETE a data source
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const result = await DataSources.deleteDataSource(id);

      if (result === 0) {
        return res.status(404).json({ message: "Data Source not found" });
      }

      res.json({
        message: "Data Source deleted successfully",
        rowsDeleted: result,
      });
    } catch (error) {
      console.error("Error deleting Data Source:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
