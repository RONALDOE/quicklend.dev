const express = require("express");
const router = express.Router();
const db = require("../config/db.config");
const { addDays, addWeeks, addMonths, addQuarters } = require("date-fns");

router.use(express.json());

router.get("/", (req, res) => {
  const query = `SELECT id,( select FULL_NAME  from Borrowers where Borrowers.id = Loans.borrower_id ) as borrowerName, importeCredito, modalidad, tasa, numCuotas, importeCuotas, totalAPagar, fecha, cuotasSegunModalidad, paymentsMade, loanStatus, remainingPayments
  FROM Loans where loanStatus != 'Dummy'`;
  db.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
      return;
    }

    if (results.length > 0) {
      console.log(results);
      const borrowers = results;
      res.send(borrowers);
      console.log(results);
      return { code: 1 };
    } else {
      res.sendStatus(401);
    }
  });
});


router.post("/decline/:id", (req, res) => {
  const loanId = req.params.id;

  // Aquí puedes agregar la lógica para marcar el préstamo como declinado en tu base de datos.
  // Por ejemplo, podrías ejecutar una consulta SQL para actualizar el estado del préstamo.

  const updateLoanStatusQuery = `
    UPDATE Loans
    SET loanStatus = 'Declined'
    WHERE id = ?
  `;

  db.query(updateLoanStatusQuery, [loanId], (error, updateResult) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
      return;
    }

    if (updateResult.affectedRows > 0) {
      console.log("Loan declined successfully");
      res.sendStatus(200); // Préstamo marcado como declinado correctamente
    } else {
      res.sendStatus(404); // No se encontró el préstamo con el ID proporcionado
    }
  });
});


router.get("/:name", (req, res) => {
  const borrowerName = req.params.name;
  const selectBorrowerQuery = `SELECT id FROM Borrowers WHERE FULL_NAME = ? `;

  db.query(selectBorrowerQuery, [borrowerName], (error, results) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
      return;
    }

    if (results.length === 0) {
      res.status(404).send("Loan not found"); // No se encontró el prestatario con el nombre proporcionado
      return;
    }

    const borrowerId = results[0].id;

    const query = "SELECT * FROM LOANS WHERE  borrower_id = ?";
    db.query(query, borrowerId, (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
        return;
      }

      if (results) {
        console.log("Loan Searched Sucessfully");
        res.json(results[0]); // Se actualizó correctamente
      } else {
        res.sendStatus(404); // No se encontró el prestatario con el id proporcionado
      }
    });
  });

  router.post("/", (req, res) => {
    const loanData = req.body; // Datos enviados desde el frontend

    // Primero, busca el ID del prestatario basado en su nombre
    const borrowerName = loanData.borrower;
    const selectBorrowerQuery = `SELECT id FROM Borrowers WHERE FULL_NAME = ?`;

    db.query(selectBorrowerQuery, [borrowerName], (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
        return;
      }

      if (results.length === 0) {
        res.status(404).send("Loan not found"); // No se encontró el prestatario con el nombre proporcionado
        return;
      }

      const borrowerId = results[0].id;

      // Ahora, realiza la inserción en la tabla "Loans" utilizando borrowerId
      const insertLoanQuery = `
      INSERT INTO Loans (borrower_id, importeCredito, modalidad, tasa, numCuotas, importeCuotas, totalAPagar, fecha, cuotasSegunModalidad )
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)
    `;

      const loanValues = [
        borrowerId,
        loanData.importeCredito,
        loanData.modalidad,
        loanData.tasa,
        loanData.numCuotas,
        loanData.importeCuotas,
        loanData.totalAPagar,
        loanData.fecha,
        loanData.cuotasSegunModalidad,
        loanData.tipoPago,
      ];

      db.query(insertLoanQuery, loanValues, (error, insertResult) => {
        if (error) {
          console.error(error);
          res.sendStatus(500);
          return;
        }

        if (insertResult.affectedRows > 0) {
          console.log("Loan inserted successfully");
          res.sendStatus(201); // Préstamo insertado correctamente
        } else {
          res.sendStatus(500); // Error en la inserción
        }
      });
    });
  });


    router.post("/declined", (req, res) => {
    console.log("llega")
    const loanData = req.body; // Datos enviados desde el frontend

    // Primero, busca el ID del prestatario basado en su nombre
    const borrowerName = loanData.borrower;
    const selectBorrowerQuery = `SELECT id FROM Borrowers WHERE FULL_NAME = ?`;

    db.query(selectBorrowerQuery, [borrowerName], (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
        return;
      }

      if (results.length === 0) {
        res.status(404).send("Loan not found"); // No se encontró el prestatario con el nombre proporcionado
        return;
      }

      const borrowerId = results[0].id;

      // Ahora, realiza la inserción en la tabla "Loans" utilizando borrowerId
      const insertLoanQuery = `
      INSERT INTO Loans (borrower_id, importeCredito, modalidad, tasa, numCuotas, importeCuotas, totalAPagar, fecha, cuotasSegunModalidad, loanStatus )
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, 'Rejected')
    `;

      const loanValues = [
        borrowerId,
        loanData.importeCredito,
        loanData.modalidad,
        loanData.tasa,
        loanData.numCuotas,
        loanData.importeCuotas,
        loanData.totalAPagar,
        loanData.fecha,
        loanData.cuotasSegunModalidad,
        loanData.tipoPago,
      ];

      db.query(insertLoanQuery, loanValues, (error, insertResult) => {
        if (error) {
          console.error(error);
          res.sendStatus(500);
          return;
        }

        if (insertResult.affectedRows > 0) {
          console.log("Loan declined successfully");
          res.sendStatus(201); // Préstamo insertado correctamente
        } else {
          res.sendStatus(500); // Error en la inserción
        }
      });
    });
  });


  router.post("/", (req, res) => {
    const loanData = req.body; // Datos enviados desde el frontend

    // Primero, busca el ID del prestatario basado en su nombre
    const borrowerName = loanData.borrower;
    const selectBorrowerQuery = `SELECT id FROM Borrowers WHERE FULL_NAME = ?`;

    db.query(selectBorrowerQuery, [borrowerName], (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
        return;
      }

      if (results.length === 0) {
        res.status(404).send("Loan not found"); // No se encontró el prestatario con el nombre proporcionado
        return;
      }

      const borrowerId = results[0].id;

      // Ahora, realiza la inserción en la tabla "Loans" utilizando borrowerId
      const insertLoanQuery = `
      INSERT INTO Loans (borrower_id, importeCredito, modalidad, tasa, numCuotas, importeCuotas, totalAPagar, fecha, cuotasSegunModalidad )
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)
    `;

      const loanValues = [
        borrowerId,
        loanData.importeCredito,
        loanData.modalidad,
        loanData.tasa,
        loanData.numCuotas,
        loanData.importeCuotas,
        loanData.totalAPagar,
        loanData.fecha,
        loanData.cuotasSegunModalidad,
        loanData.tipoPago,
      ];

      db.query(insertLoanQuery, loanValues, (error, insertResult) => {
        if (error) {
          console.error(error);
          res.sendStatus(500);
          return;
        }

        if (insertResult.affectedRows > 0) {
          console.log("Loan inserted successfully");
          res.sendStatus(201); // Préstamo insertado correctamente
        } else {
          res.sendStatus(500); // Error en la inserción
        }
      });
    });
  });



  router.post("/draft", (req, res) => {
    const loanData = req.body; // Datos enviados desde el frontend

    // Primero, busca el ID del prestatario basado en su nombre
    const borrowerName = loanData.borrower;
    const selectBorrowerQuery = `SELECT id FROM Borrowers WHERE FULL_NAME = ?`;

    db.query(selectBorrowerQuery, [borrowerName], (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
        return;
      }

      if (results.length === 0) {
        res.status(404).send("Loan not found"); // No se encontró el prestatario con el nombre proporcionado
        return;
      }

      const borrowerId = results[0].id;

      // Ahora, realiza la inserción en la tabla "Loans" utilizando borrowerId
      const insertLoanQuery = `
      INSERT INTO LoansDrafts (borrower_id, importeCredito, modalidad, tasa, numCuotas, importeCuotas, totalAPagar, fecha, cuotasSegunModalidad )
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)
    `;

      const loanValues = [
        borrowerId,
        loanData.importeCredito,
        loanData.modalidad,
        loanData.tasa,
        loanData.numCuotas,
        loanData.importeCuotas,
        loanData.totalAPagar,
        loanData.fecha,
        loanData.cuotasSegunModalidad,
        loanData.tipoPago,
      ];

      db.query(insertLoanQuery, loanValues, (error, insertResult) => {
        if (error) {
          console.error(error);
          res.sendStatus(500);
          return;
        }

        if (insertResult.affectedRows > 0) {
          console.log("Draft inserted successfully");
          res.sendStatus(201); // Préstamo insertado correctamente
        } else {
          res.sendStatus(500); // Error en la inserción
        }
      });
    });
  });

  router.delete("/:id", (req, res) => {
    const borrowerId = req.params.id;

    const query = "DELETE FROM Borrowers WHERE id = ?";
    db.query(query, borrowerId, (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
        return;
      }

      if (results.affectedRows > 0) {
        console.log("Borrower deleted successfully");
        res.send("500"); // Se actualizó correctamente
      } else {
        res.sendStatus(404); // No se encontró el prestatario con el id proporcionado
      }
    });
  });

  router.post("/loan", (req, res) => {
    const loanData = req.body; // Datos enviados desde el frontend
    const isPostman = req.get("User-Agent").includes("Postman")
      ? "Postman"
      : "Other";
    console.log(isPostman);
    console.log(loanData);

    // Primero, busca el ID del prestatario basado en su nombre
    const borrowerName = loanData.borrower;
    const selectBorrowerQuery = `SELECT id FROM Borrowers WHERE FULL_NAME = ?`;

    db.query(selectBorrowerQuery, [borrowerName], (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
        return;
      }

      if (results.length === 0) {
        res.status(404).send("Borrower not found"); // No se encontró el prestatario con el nombre proporcionado
        return;
      }

      const borrowerId = results[0].id;

      // Ahora, realiza la inserción en la tabla "Loans" utilizando borrowerId
      const insertLoanQuery = `
      INSERT INTO Loans (borrower_id, importeCredito, modalidad, tasa, numCuotas, importeCuotas, totalAPagar, fecha, cuotasSegunModalidad, remainingPayments )
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?,?)
    `;

      const loanValues = [
        borrowerId,
        loanData.importeCredito,
        loanData.modalidad,
        loanData.tasa,
        loanData.numCuotas,
        loanData.importeCuotas,
        loanData.totalAPagar,
        loanData.cuotasSegunModalidad,
        loanData.numCuotas,
      ];

      db.query(insertLoanQuery, loanValues, (error, insertResult) => {
        if (error) {
          console.error(error);
          res.sendStatus(500);
          return;
        }

        if (insertResult.affectedRows > 0) {
          console.log("Loan inserted successfully");

          // Obtener el ID del préstamo recién insertado
          const loanId = insertResult.insertId;

          // Calcular la fecha de inicio para los pagos
          // Calcular la fecha de inicio para los pagos
          const startDate = addDays(new Date(loanData.fecha), 1); // Se agrega un día a la fecha de inicio
          const paymentValues = [];

          const modalidad = loanData.modalidad.toLowerCase();

          // Calcular las fechas y montos de los pagos
          for (
            let cuotaNumero = 1;
            cuotaNumero <= loanData.numCuotas;
            cuotaNumero++
          ) {
            let paymentDate;

            if (modalidad === "diario") {
              paymentDate = addDays(startDate, cuotaNumero);
            } else if (modalidad === "semanal") {
              paymentDate = addWeeks(startDate, cuotaNumero);
            } else if (modalidad === "quincenal") {
              paymentDate = addDays(startDate, cuotaNumero * 14 + 1); // Agregar 14 días de distancia
            } else if (modalidad === "mensual") {
              paymentDate = addMonths(startDate, cuotaNumero);
            }

            paymentValues.push([
              loanId,
              cuotaNumero,
              null,
              loanData.importeCuotas,
              "No Pagado",
              paymentDate,
            ]);
          }

          // Insertar los pagos en la tabla "Payments"
          const insertPaymentsQuery = `
  INSERT INTO Payments (loan_id, cuotaNumero, fechaPago, montoPagado, status, fechaAPagar)
  VALUES ?
`;

          db.query(
            insertPaymentsQuery,
            [paymentValues],
            (error, insertPaymentsResult) => {
              if (error) {
                console.error(error);
                res.sendStatus(500);
                return;
              }

              if (insertPaymentsResult.affectedRows > 0) {
                console.log("Payments inserted successfully");
                res.sendStatus(201); // Préstamo y pagos insertados correctamente
              } else {
                res.sendStatus(500); // Error en la inserción de pagos
              }
            }
          );
        } else {
          res.sendStatus(500); // Error en la inserción del préstamo
        }
      });
    });
  });

  router.post("/date", (req, res) => {
    const fecha = Date(req.body.fecha);
    const numCuotas = req.body.numCuotas;
    const modal = req.body.modal.toLowerCase();
    console.log(req.body);

    const startDate = addDays(new Date(fecha), 0); // Se agrega un día a la fecha de inicio
    const paymentDates = [];

    // Calcular las fechas y montos de los pagos
    for (let cuotaNumero = 1; cuotaNumero <= numCuotas; cuotaNumero++) {
      let paymentDate;

      if (modal === "diario") {
        paymentDate = addDays(startDate, cuotaNumero);
      } else if (modal === "semanal") {
        paymentDate = addWeeks(startDate, cuotaNumero);
      } else if (modal === "quincenal") {
        paymentDate = addDays(startDate, cuotaNumero * 14 + 1); // Agregar 14 días de distancia
      } else if (modal === "mensual") {
        paymentDate = addMonths(startDate, cuotaNumero);
      }

      paymentDates.push(paymentDate);
    }

    const response = {
      startDay: paymentDates[0].toLocaleDateString(),
      endDay: paymentDates[paymentDates.length - 1].toLocaleDateString(),
    };
    console.log(response);
    res.json(response);
  });
});



router.post("/declined", (req, res) => {
  console.log("llega")
  const loanData = req.body; // Datos enviados desde el frontend

  // Primero, busca el ID del prestatario basado en su nombre
  const borrowerName = loanData.borrower;
  const selectBorrowerQuery = `SELECT id FROM Borrowers WHERE FULL_NAME = ?`;

  db.query(selectBorrowerQuery, [borrowerName], (error, results) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
      return;
    }

    if (results.length === 0) {
      res.status(404).send("Loan not found"); // No se encontró el prestatario con el nombre proporcionado
      return;
    }

    const borrowerId = results[0].id;

    // Ahora, realiza la inserción en la tabla "Loans" utilizando borrowerId
    const insertLoanQuery = `
    INSERT INTO Loans (borrower_id, importeCredito, modalidad, tasa, numCuotas, importeCuotas, totalAPagar, fecha, cuotasSegunModalidad, loanStatus )
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, 'Rejected')
  `;

    const loanValues = [
      borrowerId,
      loanData.importeCredito,
      loanData.modalidad,
      loanData.tasa,
      loanData.numCuotas,
      loanData.importeCuotas,
      loanData.totalAPagar,
      loanData.fecha,
      loanData.cuotasSegunModalidad,
      loanData.tipoPago,
    ];

    db.query(insertLoanQuery, loanValues, (error, insertResult) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
        return;
      }

      if (insertResult.affectedRows > 0) {
        console.log("Loan declined successfully");
        res.sendStatus(201); // Préstamo insertado correctamente
      } else {
        res.sendStatus(500); // Error en la inserción
      }
    });
  });
});


module.exports = router;
