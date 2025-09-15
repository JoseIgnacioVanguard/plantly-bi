require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const VanguardSeasonSummaryRoutes = require("./routes/VanguardSeasonSummaryRoutes");
const InvoicingDetailRoutes = require("./routes/InvoicingDetailRoutes");
const DataSourcesRoutes = require("./routes/DataSourcesRoutes");
const AuthRoutes = require("./routes/AuthRoutes");
const RlsDmRoutes = require("./routes/RlsDmRoutes");

const app = express();
const PORT = process.env.PORT || 5001;


// Middleware
app.use(cors());
app.use(express.json());

// SQL Server Connection Test
sql.connect(dbConfig)
  .then(() => {
    console.log("✅ Connected to SQL Server");
  })
  .catch((err) => {
    console.error("❌ SQL Server connection error:", err);
  });

// Routes
app.use("/api/allSeasons", VanguardSeasonSummaryRoutes);
app.use("/api/invoicing", InvoicingDetailRoutes);
app.use("/api/dataSources", DataSourcesRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/rlsDm", RlsDmRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

