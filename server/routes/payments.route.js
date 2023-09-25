const express = require("express");
const router = express.Router();
const db = require("../config/db.config");

router.use(express.json())
router.put('/', (req, res) => {
  const loan_id = req.body.loanId;
  const ammount = req.body.amount;
  const paid = req.body.paid;
  const numCuota = req.body.numCuota;
  let query = "";

  if (ammount == paid) {
    query = `
      UPDATE Payments
      SET fechaPago = NOW(), montoAbonado = ${paid}, status = "Pagado"
      WHERE cuotaNumero = ${numCuota} AND loan_id = ${loan_id};`;

    // Actualizar el préstamo si todos los pagos están completos
    query += ` 
      UPDATE Loans
      SET paymentsMade = paymentsMade + 1, remainingPayments = remainingPayments - 1, loanStatus = 
      CASE
        WHEN remainingPayments = 0 THEN 'Completed'
        ELSE loanStatus
      END
      WHERE id = ${loan_id}`;

  } else if (paid < ammount) {
    query = `
      UPDATE Payments
      SET fechaPago = NOW(), montoAbonado = ${paid}, status = "Abonado", montoPagado = montoPagado - ${paid}
      WHERE cuotaNumero = ${numCuota} AND loan_id = ${loan_id};`;

    // Actualizar el préstamo si el pago es un abono
    query += `
      UPDATE Loans
      SET paymentsMade = paymentsMade + 1
      WHERE id = ${loan_id}`;
  }

  db.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
      return;
    }

    res.sendStatus(200); // 200 OK
  });
});


  router.get('/:name/last-incomplete-payment', (req, res) => {
    const borrowerName = req.params.name;
    const selectBorrowerQuery = `SELECT id FROM Borrowers WHERE FULL_NAME = ?`;
  
    db.query(selectBorrowerQuery, [borrowerName], (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
        return;
      }
  
      if (results.length === 0) {
        res.status(404).send('Borrower not found'); // No se encontró el prestatario con el nombre proporcionado
        return;
      }
  
      const borrowerId = results[0].id;
      console.log(borrowerId)
  
      const query = `
        SELECT id FROM LOANS 
        WHERE borrower_id = ? 
        AND loanStatus != 'Completed' 
        AND loanStatus != 'Dummy' 
        ORDER BY fecha DESC 
        LIMIT 1
      `;
      
      db.query(query, [borrowerId], (error, loanResults) => {
        
        if (error) {
          console.error(error);
          res.sendStatus(500);
          return;
        }
        
  
        if (loanResults.length === 0) {
          res.status(404).send('Loan not found'); // No se encontró un préstamo aprobado para el prestatario
          return;
        }
  
        const loanId = loanResults[0].id;
  
        
        const paymentQuery = `
          SELECT id, cuotaNumero, montoPagado 
          FROM Payments
          WHERE loan_id = ${loanId} 
          AND status != 'Pagado' 
          ORDER BY cuotaNumero ASC 
          LIMIT 1
        `;
        
        db.query(paymentQuery, (error, paymentResults) => {
          console.log(paymentQuery)
          if (error) {
            console.error(error);
            res.sendStatus(500);
            return;
          }
        console.log(paymentResults)
  
  
          if (paymentResults.length === 0) {
            res.status(404).send('No incomplete payments found'); // No se encontraron cuotas no completadas para este préstamo
            return;
          }
  
          const { id: paymentId, cuotaNumero, montoPagado } = paymentResults[0];
  
          res.json({
            paymentId,
            cuotaNumero,
            montoPagado,
            loanId,
          });
        });
      });
    });
  });



module.exports = router