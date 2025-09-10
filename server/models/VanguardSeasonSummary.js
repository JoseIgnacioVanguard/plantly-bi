// server/models/kpiModel.js
const sql = require('mssql');
const dbConfig = require('../dbConfig'); 

async function getData() {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .query(`SELECT * FROM VanguardSeasonSummary`);
    return result.recordset;
  } catch (error) {
    console.error('Error al obtener los KPIs:', error);
    throw error;
  }
}

module.exports = {
  getData
,
};