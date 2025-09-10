import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [allSeasons, setAllSeasons] = useState([]);
  const [error, setError] = useState("");

const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const formatNumber = (value) =>
  typeof value === "number" ? numberFormatter.format(value) : "-";

const twoDecimalFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const totalExportedFCL = allSeasons.reduce(
  (sum, item) => sum + (item.dsph_fcl || 0),
  0
);
const formattedTotalExportedFCL = formatNumber(totalExportedFCL);

const totalExportedEqBoxes = allSeasons.reduce(
  (sum, item) => sum + (item.dsph_eqbx || 0),
  0
);
const formattedTotalExportedEqBoxes = formatNumber(totalExportedEqBoxes);

const totalFobSales = allSeasons.reduce(
  (sum, item) => sum + (item.adj_fob_sls_usd || 0),
  0
);
const formattedTotalFobSales = formatNumber(totalFobSales);

const maxLaborEndDt = allSeasons.length
  ? new Date(
      Math.max(...allSeasons.map((s) => new Date(s.labor_end_dt)))
    ).toISOString().slice(0, 10) // format as YYYY-MM-DD
  : "N/A";

useEffect(() => {
  fetch("http://10.13.10.12:5001/api/allSeasons")
    .then((res) => res.json())
    .then((data) => {
      console.log("📥 Received from API:", data);
      setAllSeasons(data);
    })
    .catch((err) => {
      console.error("❌ Fetch error:", err);
      setError("Error fetching data");
    });
}, []);

  return (
    <div>
      <h1>Dashboard</h1>

      {/* allSeasons */}
      <div className="kpis">
        <div className="kpi">
          <h1>{formattedTotalExportedFCL}</h1>
          <p>Historic Exported (FCL)</p>
        </div>
        <div className="kpi">
          <h1>{formattedTotalExportedEqBoxes}</h1>
          <p>Historic Exported (Eq.Boxes)</p>
        </div>
        <div className="kpi">
          <h1>{formattedTotalFobSales}</h1>
          <p>Historic FOB Sales (USD)</p>
        </div>
        <div className="kpi">
          <h1>{twoDecimalFormatter.format(totalFobSales/totalExportedEqBoxes)}</h1>
          <p>Historic FOB Price (USD/Eq.Box)</p>
        </div>
      </div>

      {/* Summary table */}
      <div className="allSeasons-list">
        <h3>Seasons</h3>
        <p>Last Register: {maxLaborEndDt}</p>
        {error && <div className="error-message">{error}</div>}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Season</th>
                <th>Crop</th>
                <th className="number-cell">#People</th>
                <th className="number-cell">#Workdays</th>
                <th className="number-cell">Harvested Area (Ha)</th>
                <th className="number-cell">Exported (FCL)</th>
                <th className="number-cell">Exported (Eq.Boxes)</th>
                <th className="number-cell">Adj.FOB.Sales (USD)</th>
                <th className="number-cell">Adj.FOB.Price (USD/Eq.Box)</th>                
              </tr>
            </thead>
            <tbody>
              {allSeasons
                .sort((a, b) => a.season.localeCompare(b.season)) // ascending
                .map((season) => (
                  <tr key={season.season}>
                    <td>{season.season}</td>
                    <td>{season.crop}</td>
                    <td className="number-cell">{formatNumber(season.ppl)}</td>
                    <td className="number-cell">{formatNumber(season.workdays)}</td>
                    <td className="number-cell">{twoDecimalFormatter.format(season.hvst_area_ha)}</td>
                    <td className="number-cell">{formatNumber(season.dsph_fcl)}</td>
                    <td className="number-cell">{formatNumber(season.dsph_eqbx)}</td>
                    <td className="number-cell">{formatNumber(season.adj_fob_sls_usd)}</td>
                    <td className="number-cell">{twoDecimalFormatter.format(season.adj_fob_price_usd_eqbx)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
