// server/models/InvoicingDetail.js
const sql = require('mssql');
const dbConfig = require('../dbConfig'); 

// 🔹 Get all records
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

// 🔹 Insert new record
async function createDataSource(data) {
  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool.request()
      .input('source_system', sql.NVarChar, data.source_system)
      .input('source_location', sql.NVarChar, data.source_location)
      .input('host_api_url', sql.NVarChar, data.host_api_url)
      .input('source_type', sql.NVarChar, data.source_type)
      .input('system_type', sql.NVarChar, data.system_type)
      .input('source_name', sql.NVarChar, data.source_name)
      .input('source_status', sql.NVarChar, data.source_status)
      .input('valid_from', sql.DateTime, data.valid_from || null)
      .input('valid_to', sql.DateTime, data.valid_to || null)
      .input('source_description', sql.NVarChar, data.source_description)
      .query(`
        INSERT INTO dbo.data_source_systems
        ( source_system, source_location, host_api_url, source_type, system_type, source_name, source_status, valid_from, valid_to, source_description)
        VALUES ( @source_system, @source_location, @host_api_url, @source_type, @system_type, @source_name, @source_status, @valid_from, @valid_to, @source_description)
      `);

    return result.rowsAffected[0]; // number of rows inserted
  } catch (error) {
    console.error('Error al crear Data Source:', error);
    throw error;
  }
}

// 🔹 Update existing record
async function updateDataSource(source_id, data) {
  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool.request()
      .input('source_id', sql.Int, source_id)
      .input('source_system', sql.NVarChar, data.source_system)
      .input('source_location', sql.NVarChar, data.source_location)
      .input('host_api_url', sql.NVarChar, data.host_api_url)
      .input('source_type', sql.NVarChar, data.source_type)
      .input('system_type', sql.NVarChar, data.system_type)
      .input('source_name', sql.NVarChar, data.source_name)
      .input('source_status', sql.NVarChar, data.source_status)
      .input('valid_from', sql.DateTime, data.valid_from || null)
      .input('valid_to', sql.DateTime, data.valid_to || null)
      .input('source_description', sql.NVarChar, data.source_description)
      .query(`
        UPDATE dbo.data_source_systems
        SET 
          source_system = @source_system,
          source_location = @source_location,
          host_api_url = @host_api_url,
          source_type = @source_type,
          system_type = @system_type,
          source_name = @source_name,
          source_status = @source_status,
          valid_from = @valid_from,
          valid_to = @valid_to,
          source_description = @source_description
        WHERE source_id = @source_id
      `);

    return result.rowsAffected[0]; // number of rows updated
  } catch (error) {
    console.error('Error al actualizar Data Source:', error);
    throw error;
  }
}
// in server/models/DataSources.js (or InvoicingDetail.js if that’s the actual file)
async function deleteDataSource(source_id) {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input("source_id", sql.Int, source_id)
      .query("DELETE FROM dbo.data_source_systems WHERE source_id = @source_id");

    return result.rowsAffected[0]; // number of rows deleted
  } catch (error) {
    console.error("Error al eliminar Data Source:", error);
    throw error;
  }
}

module.exports = {
  getData,
  createDataSource,
  updateDataSource,
  deleteDataSource
};
