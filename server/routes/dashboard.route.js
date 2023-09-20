const express = require("express");
const router = express.Router();
const db = require("../config/db.config");

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


module.exports = router