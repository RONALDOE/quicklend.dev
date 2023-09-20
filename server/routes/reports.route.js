const express = require("express");
const PDFDocument = require("pdfkit");
const router = express.Router();
const fs = require('fs');
const db = require("../config/db.config");
const path = require('path');

// Función para verificar y reemplazar datos vacíos con "N/A"
function checkEmpty(data) {
  return data ? data : "N/A";
}

// Ruta para generar y servir el PDF
router.get('/', (req, res) => {
  // Ejecuta tus Stored Procedures para obtener los datos necesarios
  db.query('CALL dashboard_stadictics', (err, results) => {
    if (err) {
      console.error('Error al ejecutar el Stored Procedure:', err);
      res.sendStatus(500);
      return;
    }

    // Almacena los resultados de los Stored Procedures en variables
    const [
      [noPagadosDia],
      [pagadosDia],
      [prestamosActivos],
      [totalPrestado],
      [totalClientes],
      [gananciasDelMes],
      [pagosPorFecha],
      [prestamosPorDia],
      [pagosPorDia],
    ] = results;

    console.log(results);
    
    // Crear un nuevo documento PDF
    const doc = new PDFDocument();
    doc.pipe(res);

    const imageWidth = 100
    const logoPath = path.join(__dirname, '../public/QL.png'); // Ruta absoluta al logotipo
    doc.image(logoPath, doc.page.width/2 - imageWidth/2,doc.y,{
      width:imageWidth
    });
    // Definir fuente y tamaño de fuente
    doc.font('Helvetica-Bold');
    doc.fontSize(20);

    // Encabezado
    doc.text('Informe de Préstamos y Pagos', { align: 'center' });

    // Separador
    doc.moveDown(0.5);
    doc.rect(30, doc.y, 540, 1).fill('#333');
    doc.moveDown(0.5);

    // Título de sección
    doc.fontSize(16).text('Resumen de Préstamos', { align: 'center' });
    doc.moveDown(0.5);

    // Información sobre préstamos
    const prestamosInfo = [
      { label: 'Total de préstamos activos', value: checkEmpty(prestamosActivos.prestamosActivos) },
      { label: 'Total de préstamos completados', value: checkEmpty(prestamosActivos.prestamosCompletados) },
      { label: 'Total de préstamos pendientes', value: checkEmpty(prestamosActivos.prestamosPendientes) },
      { label: 'Total de préstamos rechazados', value: checkEmpty(prestamosActivos.prestamosRechazados) },
      { label: 'Total de préstamos simulados', value: checkEmpty(prestamosActivos.prestamosSimulados) },
      { label: 'Total de préstamos vencidos', value: checkEmpty(prestamosActivos.prestamosVencidos) },
      { label: 'Total prestado', value: `$${checkEmpty(totalPrestado.totalPrestado)}` },
      { label: 'Total de clientes', value: checkEmpty(totalClientes.totalClientes) },
      { label: 'Ganancias del mes', value: `$${checkEmpty(gananciasDelMes.gananciasDelMes)}` },
    ];

    prestamosInfo.forEach((info) => {
      doc.text(`${info.label}:`, { continued: true });
      doc.text(info.value, { align: 'right' });
      doc.moveDown(0.2);
    });

    // Título de sección
    doc.fontSize(16).text('Prestamos por Día', { align: 'left' });
    doc.moveDown(0.5);

    // Verifica si prestamosPorDia contiene datos antes de iterar
    if (prestamosPorDia && prestamosPorDia.length > 0) {
      prestamosPorDia.forEach((row) => {
        doc.text(`${checkEmpty(row.dia)} ${row.fecha}: ${checkEmpty(row.cantidad)}`);
        doc.moveDown(0.2);
      });
    } else {
      doc.text('No hay datos de préstamos por día disponibles.');
      doc.moveDown(0.5);
    }

    // Título de sección
    doc.fontSize(16).text('Pagos por Día', { align: 'left' });
    doc.moveDown(0.5);

    // Verifica si pagosPorDia contiene datos antes de iterar
    if (pagosPorDia && pagosPorDia.length > 0) {
      pagosPorDia.forEach((row) => {
        doc.text(`${checkEmpty(row.dia)} ${row.fecha}: ${checkEmpty(row.cantidad)}`);
        doc.moveDown(0.2);
      });
    } else {
      doc.text('No hay datos de pagos por día disponibles.');
      doc.moveDown(0.5);
    }

    // Título de sección
    doc.fontSize(16).text('Pagos por Fecha', { align: 'left' });
    doc.moveDown(0.5);

    // Verifica si pagosPorFecha contiene datos antes de iterar
    if (pagosPorFecha && pagosPorFecha.length > 0) {
      pagosPorFecha.forEach((row) => {
        doc.text(`${row.fecha}: ${checkEmpty(row.cantidad_pagos)}`);
        doc.moveDown(0.2);
      });
    } else {
      doc.text('No hay datos de pagos por fecha disponibles.');
    }

    // Finaliza y envía el PDF al frontend
    doc.end();
  });
});

module.exports = router;
