// server/config/db.js
module.exports = {
  user: 'dw_etl',            
  password: 'Vanguard2024!',     
  server: '10.13.10.90',
  port: 49841,
  database: 'DA_DataMart',
  options: {
    encrypt: false,                 
    trustServerCertificate: true    
  }
};

