// routes/DataSourcesRoutes.js
const express = require("express");
const router = express.Router();
const DataSources = require("../models/DataSources");

router.get("/", async (req, res) => {
  try {
    const DataSourcesData = await DataSources.getData();
    res.json(DataSourcesData);
  } catch (error) {
    console.error("Error fetching DataSources data:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
