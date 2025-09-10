// server/models/InvoicingDetail.js
const sql = require('mssql');
const dbConfig = require('../dbConfig'); 

async function getData() {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .query(`SELECT * FROM dbo.data_source_systems`);
    return result.recordset;
  } catch (error) {
    console.error('Error al obtener los Data Sources:', error);
    throw error;
  }
}

module.exports = {
  getData
,
};