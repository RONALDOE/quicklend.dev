const express = require("express");
const router = express.Router();
const db = require("../config/db.config");
const mysql2 = require('mysql2/promise')
router.use(express.json())


router.get("/stats", (req, res) => {
    const query = "CALL dashboard_stadictics";
  
    db.query(query, (error, results, fields) => {
      if (error) {
        console.error("Error executing query:", error);
        res.status(500).json({ error: "An error occurred" });
        return;
      }
  console.log(results)
      const [noPagosResult, pagosResult, prestamosActivosResult, totalPrestadoResult, borrowersCountResult, gananciasDelMesResult, pagosSemanalesResult, pagosDiariosResult] = results;
  
      const dashboardStats = {
        noPagos: noPagosResult[0].noPagadosDia,
        pagos: pagosResult[0].pagos,
        prestamosActivos: prestamosActivosResult[0].prestamosActivos,
        totalPrestado: totalPrestadoResult[0].totalPrestado,
        cantidadBorrowers: borrowersCountResult[0].totalClientes,
        gananciasDelMes: gananciasDelMesResult[0].gananciasDelMes,
        pagosSemanales: pagosSemanalesResult,
        pagosDiarios: pagosDiariosResult,
      };
  
      res.json(dashboardStats);
    });
  });

router.get('/clientes-pagos-cercanos', async (req, res) => {
  try {
    // Obtener la fecha actual
    const currentDate = new Date();

    // Obtener clientes con pagos atrasados

    const pool = mysql2.createPool({
      host: "localhost",
      user: "remote",
      password: "password123",
      database: "quicklend",
      multipleStatements: true
    });
  
    const atrasadosQuery = `
      SELECT DISTINCT b.*
      FROM Borrowers b
      INNER JOIN Loans l ON b.id = l.borrower_id
      INNER JOIN Payments p ON l.id = p.loan_id
      WHERE p.status = 'Vencido' AND p.fechaAPagar < ?
    `;

    const atrasadosResults = await pool.query(atrasadosQuery, [currentDate]);

    // Obtener clientes con pagos de hoy
    const deHoyQuery = `
      SELECT DISTINCT b.*
      FROM Borrowers b
      INNER JOIN Loans l ON b.id = l.borrower_id
      INNER JOIN Payments p ON l.id = p.loan_id
      WHERE p.status = 'Pagado' AND p.fechaAPagar = ?
    `;

    const deHoyResults = await pool.query(deHoyQuery, [currentDate]);

    // Obtener clientes con pagos de mañana
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const deMananaQuery = `
      SELECT DISTINCT b.*
      FROM Borrowers b
      INNER JOIN Loans l ON b.id = l.borrower_id
      INNER JOIN Payments p ON l.id = p.loan_id
      WHERE p.status = 'No Pagado' AND p.fechaAPagar = ?
    `;

    const deMananaResults = await pool.query(deMananaQuery, [tomorrow]);

    // Combinar los resultados en el orden deseado (atrasados, de hoy, de mañana)
    const clientesConPagosCercanos = {
      atrasados: atrasadosResults,
      deHoy: deHoyResults,
      deManana: deMananaResults,
    };

    console.log(clientesConPagosCercanos)
    res.json(clientesConPagosCercanos);
  } catch (error) {
    console.error('Error al obtener clientes con pagos cercanos:', error);
    res.status(500).json({ error: 'Error al obtener clientes con pagos cercanos' });
  }
});

module.exports = router