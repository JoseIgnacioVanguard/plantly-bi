// routes/VanguardSeasonSummarySeasonRoutes.js
const express = require("express");
const router = express.Router();
const VanguardSeasonSummary = require("../models/VanguardSeasonSummary");

router.get("/", async (req, res) => {
  try {
    const SeasonSummarizedData = await VanguardSeasonSummary.getData();
    res.json(SeasonSummarizedData);
  } catch (error) {
    console.error("Error fetching season SeasonSummarizedData:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
