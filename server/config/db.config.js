const mysql = require('mysql2')
const mysql2 = require("mysql2/promise");
/*Coneccion a mi base de datos local */

const db = mysql.createConnection({
    host: "localhost",
    user: "remote",
    password: "password123",
    database: "quicklend",
    multipleStatements: true
  });

  const pool = mysql2.createPool({
    host: "localhost",
    user: "remote",
    password: "password123",
    database: "quicklend",
    multipleStatements: true
  });

  
function handleDisconnect() {
  db.connect(function (err) {
    if (err) {
      console.error('Error al conectar a MySQL:', err);
      setTimeout(handleDisconnect, 2000); // Intenta reconectar después de un tiempo
    } else {
      console.log('Conexión a MySQL establecida');
    }
  });

  db.on('error', function (err) {
    console.error('Error de MySQL:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });

  pool.on('error', function (err) {
    console.error('Error de MySQL:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

module.exports = db;