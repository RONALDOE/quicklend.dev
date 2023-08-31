const express = require("express");
const router = express.Router();
const db = require("../config/db.config");

router.use(express.json())


router.get('/', (req, res) => {
  

  const query = `SELECT * FROM Borrowers `;
  db.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
      return;
    }

    if (results.length > 0) {
      // console.log(results)
      const borrowers = results
      res.send(borrowers) ;
      return {code: 1}
    } else {
      res.sendStatus(401);
    }
  });
});

router.put('/:id', (req, res) => {
  const borrowerId = req.params.id;
  const updatedBorrowerData = req.body; // Suponiendo que estás enviando los datos actualizados en el cuerpo de la solicitud (usando axios.put o fetch con el cuerpo)

  const query = 'UPDATE Borrowers SET ? WHERE id = ?';
  db.query(query, [updatedBorrowerData, borrowerId], (error, results) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
      return;
    }

    if (results.affectedRows > 0) {
      console.log('Borrower updated successfully');
      res.send('500'); // Se actualizó correctamente
    } else {
      res.sendStatus(404); // No se encontró el prestatario con el id proporcionado
    }
  });
});

router.put('/', (req, res) => {
  const newBorrowerData = req.body; // Suponiendo que estás enviando los datos actualizados en el cuerpo de la solicitud (usando axios.put o fetch con el cuerpo)
  delete newBorrowerData.id;

  const query = 'INSERT INTO Borrowers SET ?';
  db.query(query, [newBorrowerData], (error, results) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
      return;
    }

    if (results.affectedRows > 0) {
      console.log('Borrower Created successfully');
      res.send('500'); // Se actualizó correctamente
    } else {
      res.sendStatus(404); // No se encontró el prestatario con el id proporcionado
    }
  });
});


router.delete('/:id', (req, res) => {
  const borrowerId = req.params.id;

  const query = `DELETE FROM LoansDrafts WHERE borrower_id = ${borrowerId};DELETE FROM Loans WHERE borrower_id = ${borrowerId};DELETE FROM Borrowers WHERE id = ${borrowerId}`;
  db.query(query, borrowerId, (error, results) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
      return;
    }

    if (results.affectedRows > 0) {
      console.log('Borrower deleted successfully');
      res.send('500'); // Se actualizó correctamente
    } else {
      res.sendStatus(404); // No se encontró el prestatario con el id proporcionado
    }
  });
});

router.get('/secretPassword', (req, res) =>{

  db.query('select secretPassword from globals', (error, results)=>{
    if(error){
      console.error(error)
      return 
    }
    if (results) {
      const secretPassword = results[0].secretPassword
      console.log(secretPassword)
      res.send(secretPassword) ;
      return {code: 1}
    } else {
      res.sendStatus(401);
    }

  })
});

router.get('/:name', (req, res) => {
  const name = req.params.name;

  try {
    const borrowersQuery = `SELECT * FROM Borrowers WHERE FULL_NAME = ?`;
    db.query(borrowersQuery, [name], (error, borrowers) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
        return;
      }

      if (borrowers.length > 0) {
        const borrower = borrowers[0];
        const borrowerId = borrower.id;

        const rankingQuery = `SELECT * FROM Ranking WHERE borrower_id = ?`;
        db.query(rankingQuery, [borrowerId], (error, ranking) => {
          if (error) {
            console.error(error);
            res.sendStatus(500);
            return;
          }

          const lastLoanQuery = `SELECT * FROM Loans WHERE borrower_id = ? ORDER BY fecha DESC LIMIT 1`;
          db.query(lastLoanQuery, [borrowerId], (error, lastLoan) => {
            if (error) {
              console.error(error);
              res.sendStatus(500);
              return;
            }

            const totalDebtQuery = `
            SELECT SUM(montoPagado) AS totalDebt
            FROM Payments
            WHERE loan_id = ? AND status != 'Pagado'
          `;
                      db.query(totalDebtQuery, [lastLoan[0].id], (error, totalDebtResult) => {
              if (error) {
                console.error(error);
                res.sendStatus(500);
                return;
              }
              const totalDebt = totalDebtResult[0].totalDebt;

              const remainingPaymentsQuery = `SELECT COUNT(*) AS cantidadPagosPendientes
              FROM Payments
              WHERE loan_id = ? AND status = 'No Pagado';`;
              db.query(remainingPaymentsQuery, [lastLoan[0].id], (error, remainingPaymentsResult) => {
                if (error) {
                  console.error(error);
                  res.sendStatus(500);
                  return;
                }

                const remainingPayments = remainingPaymentsResult[0].remainingPayments;

                let canBorrow;

                if(remainingPayments <= 2 ){ canBorrow = true} else {canBorrow = false}

                const customerData = {
                  borrower,
                  ranking: ranking[0] || 0,
                  lastLoan: lastLoan[0],
                  totalDebt,
                  remainingPayments,
                  canBorrow,
                };

                res.send(customerData);
              });
            });
          });
        });
      } else {
        res.sendStatus(401);
      }
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});


module.exports = router
