// server/models/InvoicingDetail.js
const sql = require('mssql');
const dbConfig = require('../dbConfig'); 

// 🔹 Get all records
async function getData() {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .query(`SELECT * FROM dbo._RLS_DM`);
    return result.recordset;
  } catch (error) {
    console.error('Error al obtener los Permisos de RLS:', error);
    throw error;
  }
}

// 🔹 Insert new record
async function createRlsPermission(data) {
  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool.request()
      .input('sql_user', sql.NVarChar, data.sql_user)
      .input('table_name', sql.NVarChar, data.table_name)
      .input('column_name', sql.NVarChar, data.column_name)
      .input('access_value', sql.NVarChar, data.access_value|| null)
      .query(`
        INSERT INTO dbo._RLS_DM
        ( sql_user, table_name, column_name, access_value)
        VALUES ( @sql_user, @table_name, @column_name, @access_value)
      `);

    return result.rowsAffected[0]; // number of rows inserted
  } catch (error) {
    console.error('Error al crear RLS Permission:', error);
    throw error;
  }
}

// 🔹 Update existing record
async function updateRlsPermission(id, data) {
  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('sql_user', sql.NVarChar, data.sql_user)
      .input('table_name', sql.NVarChar, data.table_name)
      .input('column_name', sql.NVarChar, data.column_name)
      .input('access_value', sql.NVarChar, data.access_value)
      .query(`
        UPDATE dbo._RLS_DM
        SET 
          sql_user = @sql_user,
          table_name = @table_name,
          column_name = @column_name,
          access_value = @access_value
        WHERE id = @id
      `);

    return result.rowsAffected[0]; // number of rows updated
  } catch (error) {
    console.error('Error al actualizar RLS Permission:', error);
    throw error;
  }
}

// in server/models/RlsDm.js
async function deleteRlsPermission(id) {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query("DELETE FROM dbo._RLS_DM WHERE id = @id");

    return result.rowsAffected[0]; // number of rows deleted
  } catch (error) {
    console.error("Error al eliminar RLS Permission:", error);
    throw error;
  }
}

module.exports = {
  getData,
  createRlsPermission,
  updateRlsPermission,
  deleteRlsPermission
};
