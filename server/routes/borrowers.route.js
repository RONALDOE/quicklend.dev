const express = require("express");
const router = express.Router();
const db = require("../config/db.config");

router.use(express.json());

router.get("/", (req, res) => {
  const query = `SELECT * FROM Borrowers `;
  db.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
      return;
    }

    if (results.length > 0) {
      // console.log(results)
      const borrowers = results;
      res.send(borrowers);
      console.log(borrowers)
      return { code: 1 };
    } else {
      res.send([{
        "id": 1,
        "FULL_NAME": "Datos De Relleno",
        "IDENTIFICATION_NUMBER": "Datos De Relleno",
        "PHONE": "Datos De Relleno",
        "AGE": "Datos De Relleno",
        "ADDRESS": "Datos De Relleno",
        "WORKPLACE": "Datos De Relleno",
        "WORKING_TIME": "Datos De Relleno",
        "STATUS": "Activo"
      }]);
    }
  });
});

router.get("/active", (req, res) => {
  const query = `SELECT * FROM Borrowers WHERE STATUS = "Activo"`;
  db.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
      return;
    }

    if (results.length > 0) {
      // console.log(results)
      const borrowers = results;
      res.send(borrowers);
      return { code: 1 };
    } else {
      res.sendStatus(401);
    }
  });
});

router.put("/:id", (req, res) => {
  const borrowerId = req.params.id;
  const updatedBorrowerData = req.body; // Suponiendo que estás enviando los datos actualizados en el cuerpo de la solicitud (usando axios.put o fetch con el cuerpo)

  const query = "UPDATE Borrowers SET ? WHERE id = ?";
  db.query(query, [updatedBorrowerData, borrowerId], (error, results) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
      return;
    }

    if (results.affectedRows > 0) {
      console.log("Borrower updated successfully");
      res.send("500"); // Se actualizó correctamente
    } else {
      res.sendStatus(404); // No se encontró el prestatario con el id proporcionado
    }
  });
});

router.post("/", (req, res) => {
  const newBorrowerData = req.body;
  delete newBorrowerData.id;

  const query = "INSERT INTO Borrowers SET ?";
  db.query(query, [newBorrowerData], async (error, results) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
      return;
    }

    if (results.affectedRows > 0) {
      console.log("Borrower Created successfully");

      // Aquí, después de crear el cliente, creamos un préstamo ficticio
      const borrowerId = results.insertId; // El ID del nuevo cliente
      const defaultLoan = {
        borrower_id: borrowerId,
        importeCredito: 0, // Cambia estos valores según tus necesidades
        modalidad: "Mensual",
        tasa: 0.0,
        numCuotas: 0,
        importeCuotas: 0.0,
        totalAPagar: 0.0,
        fecha: new Date().toISOString().slice(0, 10), // Fecha actual
        cuotasSegunModalidad: "",
        paymentsMade: 0,
        loanStatus: "Dummy",
        remainingPayments: 0,
      };

      try {
        const insertLoanQuery = "INSERT INTO Loans SET ?";
        await db.query(insertLoanQuery, [defaultLoan]);
        console.log("Default loan created successfully");
      } catch (loanError) {
        console.error("Error creating default loan:", loanError);
      }

      res.send("500"); // Se actualizó correctamente
    } else {
      res.sendStatus(404); // No se encontró el prestatario con el id proporcionado
    }
  });
});

router.put("/:id/inactive", (req, res) => {
  const borrowerId = req.params.id;

  // const query = `DELETE FROM LoansDrafts WHERE borrower_id = ${borrowerId};DELETE FROM PAYMENTS WHERE loan_id = (SELECT id from loans where borrower_id = ${borrowerId} LIMIT 1); DELETE FROM Loans WHERE borrower_id = ${borrowerId};DELETE FROM Borrowers WHERE id = ${borrowerId}`;
  const query = `UPDATE BORROWERS SET STATUS = 'Inactivo' WHERE id  = ${borrowerId}`;
  db.query(query, borrowerId, (error, results) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
      return;
    }

    if (results.affectedRows > 0) {
      console.log("Borrower inactived successfully");
      res.send("500"); // Se actualizó correctamente
    } else {
      res.sendStatus(404); // No se encontró el prestatario con el id proporcionado
    }
  });
});

router.put("/:id/active", (req, res) => {
  const borrowerId = req.params.id;

  const veryfyQuery = `SELECT id from Loans where loanStatus != Completed and  borrower_id=${borrowerId}`;

  db.query(veryfyQuery, borrowerId, (error, results) => {
    if (results.length > 0) {
      console.log('Borrower have active Loans')
      res.sendStatus(403)
      return;
    }
  });
  // const query = `DELETE FROM LoansDrafts WHERE borrower_id = ${borrowerId};DELETE FROM PAYMENTS WHERE loan_id = (SELECT id from loans where borrower_id = ${borrowerId} LIMIT 1); DELETE FROM Loans WHERE borrower_id = ${borrowerId};DELETE FROM Borrowers WHERE id = ${borrowerId}`;
  const query = `UPDATE BORROWERS SET STATUS = 'Activo' WHERE id  = ${borrowerId}`;
  db.query(query, borrowerId, (error, results) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
      return;
    }

    if (results.affectedRows > 0) {
      console.log("Borrower actived successfully");
      res.send("500"); // Se actualizó correctamente
    } else {
      res.sendStatus(404); // No se encontró el prestatario con el id proporcionado
    }
  });
});

router.get("/secretPassword", (req, res) => {
  db.query("select secretPassword from globals", (error, results) => {
    if (error) {
      console.error(error);
      return;
    }
    if (results) {
      const secretPassword = results[0].secretPassword;
      console.log(secretPassword);
      res.send(secretPassword);
      return { code: 1 };
    } else {
      res.sendStatus(401);
    }
  });
});

router.get("/:name", (req, res) => {
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
            db.query(
              totalDebtQuery,
              [lastLoan[0].id],
              (error, totalDebtResult) => {
                if (error) {
                  console.error(error);
                  res.sendStatus(500);
                  return;
                }
                const totalDebt = totalDebtResult[0].totalDebt;

                const remainingPaymentsQuery = `SELECT COUNT(*) AS cantidadPagosPendientes
              FROM Payments
              WHERE loan_id = ? AND status != 'Pagado';`;
                db.query(
                  remainingPaymentsQuery,
                  [lastLoan[0].id],
                  (error, remainingPaymentsResult) => {
                    if (error) {
                      console.error(error);
                      res.sendStatus(500);
                      return;
                    }

                    let remainingPayments =
                      remainingPaymentsResult[0].remainingPayments;

                      let canBorrow;
                      if(remainingPayments === undefined) {
                        remainingPayments = 0}

                    if (remainingPayments <= 2 ) {
                      canBorrow = true;
                    } else {
                      canBorrow = false;
                    }

                    const customerData = {
                      borrower,
                      ranking: ranking[0] || 0,
                      lastLoan: lastLoan[0],
                      totalDebt,
                      remainingPayments,
                      canBorrow,
                    };

                    res.send(customerData);
                  }
                );
              }
            );
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

module.exports = router;
