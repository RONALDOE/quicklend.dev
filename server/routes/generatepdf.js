const express = require("express");
const PDFDocument = require("pdfkit");
const router = express.Router();


router.get("/generate-pdf", (req, res) => {
    // Creating a new instance of PDFDocument class
    const doc = new PDFDocument();

    // Piping the output stream to the response object
    res.setHeader("Content-Disposition", "attachment; filename=output.pdf");
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    // Setting the fill color to green and font size to 30
    doc.fontSize(11);
// doc.text(`PAGARE NOTARIAL`, {
//       align: 'center'
//     }
//     );
//     doc.moveDown()
//     doc.text(`Acto Número: ________. - En el municipio de Santo Domingo Este, Provincia Santo Domingo, República Dominicana, a los doce (12) días del mes de octubre del año Dos Mil Veintidós (2022). Por ante mí, LIC. DIOQUE PORFIRIO JAVIER ALCANTARA, Abogado Notario Público, de los del Número del Distrito Nacional, matrícula No. 5467, titular de la cédula de identidad y electoral No. 074-0002130-4, con estudio profesional abierto en la casa No. 34-B,  de la calle Fausto Cejas Rodríguez, del sector San Bartolo, Los Frailes II, Santo Domingo Este, Provincia Santo Domingo, República Dominicana, asistido de los testigos instrumentales que al final serán nombrados, COMPARECIÓ libre y voluntariamente el Sr. FRANCIS ERNESTO DE OLEO CONTRERAS, de nacionalidad dominicana, mayor de edad, casado, Cédula de Identidad y Electoral No. 001-1947129-0, domiciliado y residente en la calle Q No. 05, sector arroyo hondo, Distrito nacional, República Dominicana, quién para los fines del presente Acto se constituye en EL DEUDOR de la Sra. Mariannys Marilynes Gomera Cuevas, dominicana, mayor de edad, titular de la cédula de identidad y electoral No. 223-0027375-6, domiciliada y residente en la calle Patria Mirabal, No. 83, del Sector Res. Amanda II, Municipio Santo Domingo Este, Provincia Santo Domingo, DECLARÁNDOME QUE DEBE Y PAGARÁ la suma de VEINTE CINCO MIL QUINIENTOS SESENTA PESOS DOMINCANOS (RD$25,560.00). Por el recibo de la expresada cantidad de dinero, a su entera satisfacción, declarando formalmente que se compromete a pagar la indicada suma que en calidad de préstamo personal se la ha hecho y que la pagará de la manera siguiente: DOCE (12) cuotas quincenales que el deudor se compromete a pagar de la siguiente forma y fecha: La primera cuota en fecha del treinta (30) de octubre del año Dos Mil Veintidós (2022), por el valor de DOS MIL CIENTOS TREINTA PESOS DOMINICANOS (RD$2,130.00) y finalizando el 15 de enero del año Dos Mil Veintitrés (2023),  estableciéndose en consecuencia la fecha antes señalada como el término del presente Pagaré Notarial; cosa que se comprobará con el recibo de descargo por haber hecho el pago correspondiente.  En caso de la llegada al término y FRANCIS ERNESTO DE OLEO CONTRERAS no haya satisfecho las cuotas indicadas a más tardar veinticuatro (24) horas del término o del incumplimiento de una de las cuotas, el acreedor podrá hacer exigible judicial y extrajudicialmente dichos valores; pudiendo el acreedor perseguir los montos totales adeudados y por cobrar tanto judicial como extrajudicialmente.  En caso de no cumplir con lo anteriormente acordado, quedan afectados todos los bienes presentes y futuros de su patrimonio, y para el fiel cumplimiento de las obligaciones de pagar la expresada cantidad de dinero. Declaran también que da a este Acto carácter de Cosa Juzgada y eligen domicilio en su propia casa antes mencionada.  Queda entendido que, si EL DEUDOR FRANCIS ERNESTO DE OLEO CONTRERAS, dejara de pagar al menos una (01) de las cuotas consignadas en el presente acto; LA ACREEDORA la Sra. Mariannys Marilynes Gomera Cuevas, podrá ejecutar el embargo sin necesidad de esperar para ello la llegada del término y/o del tiempo acordado en este Pagaré Notarial.  De todo lo cual se ha redactado el presente acto que he leído en presencia de los señores RONALD RODRIGUEZ y GELERCIO HERNANDEZ BATISTA, ambos dominicanos, mayores de edad, titulares de las cédulas de identidad Nos. 001-1374378-5 y 001-1576685-9, ambos domiciliados y residentes en el Sector Los Frailes de esta ciudad de Santo Domingo Este, Provincia Santo Domingo, República Dominicana, ambos testigos libres de tachas y excepciones que establecen las normas vigentes; los cuales lo encontraron conforme a su decir, y han procedido conjuntamente con los comparecientes y por ante mí a firmarlo. Notario Público que DOY FE Y CERTIFICO. `, {
//       width: 480,
//       align: 'justify'
//     }
//     );
const palabrasNegrita = [
     'DECLARÁNDOME QUE DEBE Y PAGARÁ',  
    // ... Lista completa de palabras en negrita
  ];
  
  
  let remainingText = "Acto Número: ________. - En el municipio de Santo Domingo Este, Provincia Santo Domingo, República Dominicana, a los doce (12) días del mes de octubre del año Dos Mil Veintidós (2022). Por ante mí, LIC. DIOQUE PORFIRIO JAVIER ALCANTARA, Abogado Notario Público, de los del Número del Distrito Nacional, matrícula No. 5467, titular de la cédula de identidad y electoral No. 074-0002130-4, con estudio profesional abierto en la casa No. 34-B,  de la calle Fausto Cejas Rodríguez, del sector San Bartolo, Los Frailes II, Santo Domingo Este, Provincia Santo Domingo, República Dominicana, asistido de los testigos instrumentales que al final serán nombrados, COMPARECIÓ libre y voluntariamente el Sr. FRANCIS ERNESTO DE OLEO CONTRERAS, de nacionalidad dominicana, mayor de edad, casado, Cédula de Identidad y Electoral No. 001-1947129-0, domiciliado y residente en la calle Q No. 05, sector arroyo hondo, Distrito nacional, República Dominicana, quién para los fines del presente Acto se constituye en EL DEUDOR de la Sra. Mariannys Marilynes Gomera Cuevas, dominicana, mayor de edad, titular de la cédula de identidad y electoral No. 223-0027375-6, domiciliada y residente en la calle Patria Mirabal, No. 83, del Sector Res. Amanda II, Municipio Santo Domingo Este, Provincia Santo Domingo, DECLARÁNDOME QUE DEBE Y PAGARÁ la suma de VEINTE CINCO MIL QUINIENTOS SESENTA PESOS DOMINCANOS (RD$25,560.00). Por el recibo de la expresada cantidad de dinero, a su entera satisfacción, declarando formalmente que se compromete a pagar la indicada suma que en calidad de préstamo personal se la ha hecho y que la pagará de la manera siguiente: DOCE (12) cuotas quincenales que el deudor se compromete a pagar de la siguiente forma y fecha: La primera cuota en fecha del treinta (30) de octubre del año Dos Mil Veintidós (2022), por el valor de DOS MIL CIENTOS TREINTA PESOS DOMINICANOS (RD$2,130.00) y finalizando el 15 de enero del año Dos Mil Veintitrés (2023),  estableciéndose en consecuencia la fecha antes señalada como el término del presente Pagaré Notarial; cosa que se comprobará con el recibo de descargo por haber hecho el pago correspondiente.  En caso de la llegada al término y FRANCIS ERNESTO DE OLEO CONTRERAS no haya satisfecho las cuotas indicadas a más tardar veinticuatro (24) horas del término o del incumplimiento de una de las cuotas, el acreedor podrá hacer exigible judicial y extrajudicialmente dichos valores; pudiendo el acreedor perseguir los montos totales adeudados y por cobrar tanto judicial como extrajudicialmente.  En caso de no cumplir con lo anteriormente acordado, quedan afectados todos los bienes presentes y futuros de su patrimonio, y para el fiel cumplimiento de las obligaciones de pagar la expresada cantidad de dinero. Declaran también que da a este Acto carácter de Cosa Juzgada y eligen domicilio en su propia casa antes mencionada.  Queda entendido que, si EL DEUDOR FRANCIS ERNESTO DE OLEO CONTRERAS, dejara de pagar al menos una (01) de las cuotas consignadas en el presente acto; LA ACREEDORA la Sra. Mariannys Marilynes Gomera Cuevas, podrá ejecutar el embargo sin necesidad de esperar para ello la llegada del término y/o del tiempo acordado en este Pagaré Notarial.  De todo lo cual se ha redactado el presente acto que he leído en presencia de los señores RONALD RODRIGUEZ y GELERCIO HERNANDEZ BATISTA, ambos dominicanos, mayores de edad, titulares de las cédulas de identidad Nos. 001-1374378-5 y 001-1576685-9, ambos domiciliados y residentes en el Sector Los Frailes de esta ciudad de Santo Domingo Este, Provincia Santo Domingo, República Dominicana, ambos testigos libres de tachas y excepciones que establecen las normas vigentes; los cuales lo encontraron conforme a su decir, y han procedido conjuntamente con los comparecientes y por ante mí a firmarlo. Notario Público que DOY FE Y CERTIFICO. ";
  
  for (const palabra of palabrasNegrita) {
    const index = remainingText.indexOf(palabra);
  
    if (index !== -1) {
      doc.font('fonts/Calibri Regular.ttf')
         .text(remainingText.slice(0, index), {
            width: 480,
            align: 'justify',
           continued: true
         }).font('fonts/Calibri Bold.TTF')
         .text(palabra,{width: 480,
            align: 'justify',
           continued: true});
  
      remainingText = remainingText.slice(index + palabra.length);
    }
  }
//   doc.registerFont('Calibri-Bold', '../fonts/Calibri Bold.TTF', 'Calibri-Bold');
//   doc.registerFont('Calibri', '../fonts/Calibri Regular.TTF', 'Calibri-Regular');


  // Agregar el resto del texto en color verde
  doc.font('fonts/Calibri Regular.ttf')
     .text(remainingText, {
       width: 465,
       continued: true
     });
  

    // Ending the document and sending the PDF to the client
    doc.end();
});

module.exports = router
