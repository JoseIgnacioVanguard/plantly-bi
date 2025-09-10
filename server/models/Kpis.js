const mongoose = require("mongoose");

const kpiSchema = new mongoose.Schema(
  {
    kpi_id: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    target_value: {
      type: Number,
      required: true,
    },
    actual_value: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    frequency: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly", "Quarterly", "Annually"],
      required: true,
    },
    status: {
      type: String,
      enum: ["On Track", "At Risk", "Off Track"],
      required: true,
    },
    department_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  },
  {
    timestamps: true,
    collection: "kpis",
  }
);

// Function to generate kpi ID
function generateKpiId() {
  const year = new Date().getFullYear().toString();
  const month = (new Date().getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `KPI${year}${month}-${random}`;
}

// Pre-save middleware to auto-generate kpiId
kpiSchema.pre("save", async function (next) {
  if (!this.kpi_id) {
    let newId;
    let existingKpi;
    do {
      newId = generateKpiId();
      existingKpi = await mongoose.model("Kpi").findOne({ kpi_id: newId });
    } while (existingKpi);
    this.kpi_id = newId;
  }
  next();
});

const Kpi = mongoose.model("Kpi", kpiSchema);

module.exports = Kpi;
