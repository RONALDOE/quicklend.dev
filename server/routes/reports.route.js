const express = require("express");
const mysql = require("mysql2/promise");
const ExcelJS = require("exceljs");
const fs = require("fs");
const nodemailer = require("nodemailer");
const router = express();


router.get("/", async (req, res) => {
  try {
    // Conectar a la base de datos
    const connection = await mysql.createConnection({
            host: "localhost",
            user: "remote",
            password: "password123",
            database: "quicklend",
            multipleStatements: true,
          });

    // Consulta SQL para recuperar datos (personaliza según tu esquema de base de datos)
    const [rows] = await connection.query("SELECT * FROM users");

    // Crear un nuevo archivo Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Datos");

    // Encabezados de columna (asume que las columnas son los nombres de las propiedades en las filas)
    const headers = Object.keys(rows[0]);
    worksheet.addRow(headers);

    // Agregar filas de datos
    rows.forEach((row) => {
      const values = headers.map((header) => row[header]);
      worksheet.addRow(values);
    });

    // Guardar el archivo Excel en el sistema de archivos
    const excelFilePath = "datos.xlsx";
    await workbook.xlsx.writeFile(excelFilePath);

    // Configurar encabezados HTTP para descargar el archivo
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${excelFilePath}`);

    // Leer el archivo Excel y enviarlo al cliente
    const fileStream = fs.createReadStream(excelFilePath);

    fileStream.pipe(res);
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // El mes comienza desde 0
    const year = String(today.getFullYear()).slice(-2); // Obtiene los últimos dos dígitos del año
    
    const formattedDate = `${day}-${month}-${year}`;
    console.log(formattedDate);    const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
              user: "quicklend.services@gmail.com",
              pass: "zheb uptl gibg quxb",
            },
          });
    
    // Define el correo electrónico de destino y el asunto
    const mailOptions = {
            from: 'quicklend.services@gmail.com',
            to: 'est.ronaldoernesto@gmail.com', // La dirección de correo electrónico del usuario
            subject: `Informe de Préstamos y Pagos - [${formattedDate}]`, // Asunto del correo electrónico
            text: `Informe de préstamos y pagos de la fecha ${formattedDate}`, // Texto del correo electrónico
            attachments: [
              {
                filename: `Informe Prestamos y Pagos a ${formattedDate}.xlsx`,
                path: excelFilePath, // Adjunta el archivo PDF guardado
              },
            ],
          };
    
    // Adjunta el archivo PDF
    mailOptions.attachments = [
      {
        filename: `Informe Prestamos y Pagos a ${formattedDate}.xlsx`, // Nombre del archivo adjunto
        content: fs.createReadStream(excelFilePath), // Ruta al archivo PDF
      },
    ];
    
    // Envía el correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error al enviar el correo electrónico:", error);
      } else {
        console.log("Correo electrónico enviado:", info.response);
      }
    });
  } catch (error) {
    console.error("Error al exportar a Excel:", error);
    res.status(500).send("Error al exportar a Excel.");
  }
});




// const express = require("express");
// const PDFDocument = require("pdfkit");
// const router = express.Router();
// const fs = require("fs");
// const mysql = require("mysql2/promise"); // Cambia la importación
// const nodemailer = require("nodemailer");

// const db = require("../config/db.config");
// const path = require("path");

// // Función para verificar y reemplazar datos vacíos con "N/A"
// function checkEmpty(data) {
//   return data ? data : "N/A";
// }

// // Ruta para generar y servir el PDF
// router.get("/", (req, res) => {
//   // Ejecuta tus Stored Procedures para obtener los datos necesarios
//   db.query("CALL dashboard_stadictics", (err, results) => {
//     if (err) {
//       console.error("Error al ejecutar el Stored Procedure:", err);
//       res.sendStatus(500);
//       return;
//     }

//     // Almacena los resultados de los Stored Procedures en variables
//     const [
//       [noPagadosDia],
//       [pagadosDia],
//       [prestamosActivos],
//       [totalPrestado],
//       [totalClientes],
//       [gananciasDelMes],
//       [pagosPorFecha],
//       [prestamosPorDia],
//       [pagosPorDia],
//     ] = results;

//     console.log(results);

//     // Crear un nuevo documento PDF
//     const doc = new PDFDocument();
//     doc.pipe(res);

//     const imageWidth = 100;
//     const logoPath = path.join(__dirname, "../public/QL.png"); // Ruta absoluta al logotipo
//     doc.image(logoPath, doc.page.width / 2 - imageWidth / 2, doc.y, {
//       width: imageWidth,
//     });
//     // Definir fuente y tamaño de fuente
//     doc.font("Helvetica-Bold");
//     doc.fontSize(20);

//     // Encabezado
//     doc.text("Informe de Préstamos y Pagos", { align: "center" });

//     // Separador
//     doc.moveDown(0.5);
//     doc.rect(30, doc.y, 540, 1).fill("#333");
//     doc.moveDown(0.5);

//     // Título de sección
//     doc.fontSize(16).text("Resumen de Préstamos", { align: "center" });
//     doc.moveDown(0.5);

//     // Información sobre préstamos
//     const prestamosInfo = [
//       {
//         label: "Total de préstamos activos",
//         value: checkEmpty(prestamosActivos.prestamosActivos),
//       },
//       {
//         label: "Total de préstamos completados",
//         value: checkEmpty(prestamosActivos.prestamosCompletados),
//       },
//       {
//         label: "Total de préstamos pendientes",
//         value: checkEmpty(prestamosActivos.prestamosPendientes),
//       },
//       {
//         label: "Total de préstamos rechazados",
//         value: checkEmpty(prestamosActivos.prestamosRechazados),
//       },
//       {
//         label: "Total de préstamos simulados",
//         value: checkEmpty(prestamosActivos.prestamosSimulados),
//       },
//       {
//         label: "Total de préstamos vencidos",
//         value: checkEmpty(prestamosActivos.prestamosVencidos),
//       },
//       {
//         label: "Total prestado",
//         value: `$${checkEmpty(totalPrestado.totalPrestado)}`,
//       },
//       {
//         label: "Total de clientes",
//         value: checkEmpty(totalClientes.totalClientes),
//       },
//       {
//         label: "Ganancias del mes",
//         value: `$${checkEmpty(gananciasDelMes.gananciasDelMes)}`,
//       },
//     ];

//     prestamosInfo.forEach((info) => {
//       doc.text(`${info.label}:`, { continued: true });
//       doc.text(info.value, { align: "right" });
//       doc.moveDown(0.2);
//     });

//     // Título de sección
//     doc.fontSize(16).text("Prestamos por Día", { align: "left" });
//     doc.moveDown(0.5);

//     // Verifica si prestamosPorDia contiene datos antes de iterar
//     if (prestamosPorDia && prestamosPorDia.length > 0) {
//       prestamosPorDia.forEach((row) => {
//         doc.text(
//           `${checkEmpty(row.dia)} ${row.fecha}: ${checkEmpty(row.cantidad)}`
//         );
//         doc.moveDown(0.2);
//       });
//     } else {
//       doc.text("No hay datos de préstamos por día disponibles.");
//       doc.moveDown(0.5);
//     }

//     // Título de sección
//     doc.fontSize(16).text("Pagos por Día", { align: "left" });
//     doc.moveDown(0.5);

//     // Verifica si pagosPorDia contiene datos antes de iterar
//     if (pagosPorDia && pagosPorDia.length > 0) {
//       pagosPorDia.forEach((row) => {
//         doc.text(
//           `${checkEmpty(row.dia)} ${row.fecha}: ${checkEmpty(row.cantidad)}`
//         );
//         doc.moveDown(0.2);
//       });
//     } else {
//       doc.text("No hay datos de pagos por día disponibles.");
//       doc.moveDown(0.5);
//     }

//     // Título de sección
//     doc.fontSize(16).text("Pagos por Fecha", { align: "left" });
//     doc.moveDown(0.5);

//     // Verifica si pagosPorFecha contiene datos antes de iterar
//     if (pagosPorFecha && pagosPorFecha.length > 0) {
//       pagosPorFecha.forEach((row) => {
//         doc.text(`${row.fecha}: ${checkEmpty(row.cantidad_pagos)}`);
//         doc.moveDown(0.2);
//       });
//     } else {
//       doc.text("No hay datos de pagos por fecha disponibles.");
//     }

//     // Finaliza y envía el PDF al frontend
//     doc.end();
//   });
// });

// router.get("/email-pdf", async (req, res) => {
//   try {
//     // Obtén el ID de usuario de los datos del usuario actual (supongamos que se almacena en req.user)

//     // Consulta la base de datos para obtener la dirección de correo electrónico del usuario
//     const connection = await mysql.createConnection({
//       host: "localhost",
//       user: "remote",
//       password: "password123",
//       database: "quicklend",
//       multipleStatements: true,
//     });

//     const [userData] = await connection.query(
//       'SELECT email FROM Users WHERE username = "admin"'
//     );

//     if (userData.length === 0 || !userData[0].email) {
//       console.log(
//         "No se encontró la dirección de correo electrónico del usuario."
//       );
//       return res
//         .status(400)
//         .send("No se encontró la dirección de correo electrónico del usuario.");
//     }

//     const userEmail = userData[0].email;

//     const fecha = new Date();

//     // Crear un nuevo transporte de nodemailer (debes configurar esto con tus propios detalles de correo electrónico)
//     const transporter = nodemailer.createTransport({
//       service: "Gmail",
//       auth: {
//         user: "quicklend.services@gmail.com",
//         pass: "zheb uptl gibg quxb",
//       },
//     });

//     let [
//       [noPagadosDia],
//       [pagadosDia],
//       [prestamosActivos],
//       [totalPrestado],
//       [totalClientes],
//       [gananciasDelMes],
//       [pagosPorFecha],
//       [prestamosPorDia],
//       [pagosPorDia],
//     ] = [[]]
//     db.query("CALL dashboard_stadictics", (err, results) => {
//       if (err) {
//         console.error("Error al ejecutar el Stored Procedure:", err);
//         res.sendStatus(500);
//         return;
//       }
  
//       // Almacena los resultados de los Stored Procedures en variables
//        [
//         [noPagadosDia],
//         [pagadosDia],
//         [prestamosActivos],
//         [totalPrestado],
//         [totalClientes],
//         [gananciasDelMes],
//         [pagosPorFecha],
//         [prestamosPorDia],
//         [pagosPorDia],
//       ]= results;
  
//       console.log(results);
//   })  
//     // Crear un nuevo documento PDF
//     const doc = new PDFDocument();

//     // Configura el encabezado HTTP para enviar un archivo PDF
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", 'inline; filename="Informe.pdf"');

//     // Utiliza un flujo Node.js para enviar el PDF al cliente
//     doc.pipe(res);

//     const imageWidth = 100;
//     const logoPath = path.join(__dirname, "../public/QL.png"); // Ruta absoluta al logotipo
//     doc.image(logoPath, doc.page.width / 2 - imageWidth / 2, doc.y, {
//       width: imageWidth,
//     });
//     // Definir fuente y tamaño de fuente
//     doc.font("Helvetica-Bold");
//     doc.fontSize(20);

//     // Encabezado
//     doc.text("Informe de Préstamos y Pagos", { align: "center" });

//     // Separador
//     doc.moveDown(0.5);
//     doc.rect(30, doc.y, 540, 1).fill("#333");
//     doc.moveDown(0.5);

//     // Título de sección
//     doc.fontSize(16).text("Resumen de Préstamos", { align: "center" });
//     doc.moveDown(0.5);

//     // Información sobre préstamos
//     const prestamosInfo = [
//       {
//         label: "Total de préstamos activos",
//         value: checkEmpty(prestamosActivos.prestamosActivos),
//       },
//       {
//         label: "Total de préstamos completados",
//         value: checkEmpty(prestamosActivos.prestamosCompletados),
//       },
//       {
//         label: "Total de préstamos pendientes",
//         value: checkEmpty(prestamosActivos.prestamosPendientes),
//       },
//       {
//         label: "Total de préstamos rechazados",
//         value: checkEmpty(prestamosActivos.prestamosRechazados),
//       },
//       {
//         label: "Total de préstamos simulados",
//         value: checkEmpty(prestamosActivos.prestamosSimulados),
//       },
//       {
//         label: "Total de préstamos vencidos",
//         value: checkEmpty(prestamosActivos.prestamosVencidos),
//       },
//       {
//         label: "Total prestado",
//         value: `$${checkEmpty(totalPrestado.totalPrestado)}`,
//       },
//       {
//         label: "Total de clientes",
//         value: checkEmpty(totalClientes.totalClientes),
//       },
//       {
//         label: "Ganancias del mes",
//         value: `$${checkEmpty(gananciasDelMes.gananciasDelMes)}`,
//       },
//     ];

//     prestamosInfo.forEach((info) => {
//       doc.text(`${info.label}:`, { continued: true });
//       doc.text(info.value, { align: "right" });
//       doc.moveDown(0.2);
//     });

//     // Título de sección
//     doc.fontSize(16).text("Prestamos por Día", { align: "left" });
//     doc.moveDown(0.5);

//     // Verifica si prestamosPorDia contiene datos antes de iterar
//     if (prestamosPorDia && prestamosPorDia.length > 0) {
//       prestamosPorDia.forEach((row) => {
//         doc.text(
//           `${checkEmpty(row.dia)} ${row.fecha}: ${checkEmpty(row.cantidad)}`
//         );
//         doc.moveDown(0.2);
//       });
//     } else {
//       doc.text("No hay datos de préstamos por día disponibles.");
//       doc.moveDown(0.5);
//     }

//     // Título de sección
//     doc.fontSize(16).text("Pagos por Día", { align: "left" });
//     doc.moveDown(0.5);

//     // Verifica si pagosPorDia contiene datos antes de iterar
//     if (pagosPorDia && pagosPorDia.length > 0) {
//       pagosPorDia.forEach((row) => {
//         doc.text(
//           `${checkEmpty(row.dia)} ${row.fecha}: ${checkEmpty(row.cantidad)}`
//         );
//         doc.moveDown(0.2);
//       });
//     } else {
//       doc.text("No hay datos de pagos por día disponibles.");
//       doc.moveDown(0.5);
//     }

//     // Título de sección
//     doc.fontSize(16).text("Pagos por Fecha", { align: "left" });
//     doc.moveDown(0.5);

//     // Verifica si pagosPorFecha contiene datos antes de iterar
//     if (pagosPorFecha && pagosPorFecha.length > 0) {
//       pagosPorFecha.forEach((row) => {
//         doc.text(`${row.fecha}: ${checkEmpty(row.cantidad_pagos)}`);
//         doc.moveDown(0.2);
//       });
//     } else {
//       doc.text("No hay datos de pagos por fecha disponibles.");
//     }

//     // Finaliza y envía el PDF al frontend

//     const pdfFilePath = path.join(__dirname, "informe.pdf"); // Ruta donde guardarás el PDF
//     doc.pipe(fs.createWriteStream(pdfFilePath));
//     doc.end();

//     console.log("PDF guardado en:", pdfFilePath);
//     doc.end();

//     console.log("llega");

//     const mailOptions = {
//       from: 'quicklend.services@gmail.com',
//       to: userEmail, // La dirección de correo electrónico del usuario
//       subject: `Informe de Préstamos y Pagos - [${fecha.getDate().toLocaleString()}]`, // Asunto del correo electrónico
//       text: `Informe de préstamos y pagos de la fecha ${fecha.getDate().toLocaleString()}`, // Texto del correo electrónico
//       attachments: [
//         {
//           filename: `Informe Prestamos y Pagos ${fecha.getDate().toLocaleString()}.pdf`,
//           path: pdfFilePath, // Adjunta el archivo PDF guardado
//         },
//       ],
//     };

//     // Envía el correo electrónico
//     await transporter.sendMail(mailOptions);

//     res
//       .status(200)
//       .send("El informe se ha enviado por correo electrónico correctamente.");
//   } catch (error) {
//     console.error("Error al enviar el correo electrónico:", error);
//     res.status(500).send("Error al enviar el correo electrónico.");
//   }
// });
module.exports = router;
