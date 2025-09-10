// routes/InvoicingDetailRoutes.js
const express = require("express");
const router = express.Router();
const InvoicingDetail = require("../models/InvoicingDetail");

router.get("/", async (req, res) => {
  try {
    const InvoicingDetailData = await InvoicingDetail.getData();
    res.json(InvoicingDetailData);
  } catch (error) {
    console.error("Error fetching InvoicingDetail data:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
