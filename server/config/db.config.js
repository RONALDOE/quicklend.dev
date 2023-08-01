const mysql = require('mysql2')
/*Coneccion a mi base de datos local */

const db = mysql.createConnection({
    host: "localhost",
    user: "remote",
    password: "password123",
    database: "quicklend",
  });


module.exports = db;