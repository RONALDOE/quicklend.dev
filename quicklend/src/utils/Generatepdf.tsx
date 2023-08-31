import React from "react";
import fs from "fs";
import PDFDocument from "pdfkit";
import * as download from "downloadjs";

function GeneratePdf() {
    const formattedText = `
    Acto Número: ________. - En el municipio de Santo Domingo Este, Provincia
    Santo Domingo, República Dominicana, a los doce (12) días del mes de octubre
    del año Dos Mil Veintidós (2022). Por ante mí, LIC. DIOQUE PORFIRIO JAVIER
    ALCANTARA, Abogado Notario Público, de los del Número del Distrito Nacional,
    matrícula No. 5467, titular de la cédula de identidad y electoral No.
    074-0002130-4, con estudio profesional abierto en la casa No. 34-B, de la
    calle Fausto Cejas Rodríguez, del sector San Bartolo, Los Frailes II, Santo
    Domingo Este, Provincia Santo Domingo, República Dominicana, asistido de los
    testigos instrumentales que al final serán nombrados, COMPARECIÓ libre y
    voluntariamente el Sr. FRANCIS ERNESTO DE OLEO CONTRERAS, de nacionalidad
    dominicana, mayor de edad, casado, Cédula de Identidad y Electoral No.
    001-1947129-0, domiciliado y residente en la calle Q No. 05, sector arroyo
    hondo, Distrito nacional, República Dominicana, quién para los fines del
    presente Acto se constituye en EL DEUDOR de la Sra. Mariannys Marilynes
    Gomera Cuevas, dominicana, mayor de edad, titular de la cédula de identidad y
    electoral No. 223-0027375-6, domiciliada y residente en la calle Patria
    Mirabal, No. 83, del Sector Res. Amanda II, Municipio Santo Domingo Este,
    Provincia Santo Domingo, DECLARÁNDOME QUE DEBE Y PAGARÁ la suma de VEINTE
    CINCO MIL QUINIENTOS SESENTA PESOS DOMINCANOS (RD$25,560.00). Por el recibo de
    la expresada cantidad de dinero, a su entera satisfacción, declarando
    formalmente que se compromete a pagar la indicada suma que en calidad de
    préstamo personal se la ha hecho y que la pagará de la manera siguiente: DOCE
    (12) cuotas quincenales que el deudor se compromete a pagar de la siguiente
    forma y fecha: La primera cuota en fecha del treinta (30) de octubre del año
    Dos Mil Veintidós (2022), por el valor de DOS MIL CIENTOS TREINTA PESOS
    DOMINICANOS (RD$2,130.00) y finalizando el 15 de enero del año Dos Mil
    Veintitrés (2023), estableciéndose en consecuencia la fecha antes señalada como
    el término del presente Pagaré Notarial; cosa que se comprobará con el recibo
    de descargo por haber hecho el pago correspondiente.  En caso de la llegada al
    término y FRANCIS ERNESTO DE OLEO CONTRERAS no haya satisfecho las cuotas
    indicadas a más tardar veinticuatro (24) horas del término o del incumplimiento
    de una de las cuotas, el acreedor podrá hacer exigible judicial y
    extrajudicialmente dichos valores; pudiendo el acreedor perseguir los montos
    totales adeudados y por cobrar tanto judicial como extrajudicialmente.  En caso
    de no cumplir con lo anteriormente acordado, quedan afectados todos los bienes
    presentes y futuros de su patrimonio, y para el fiel cumplimiento de las
    obligaciones de pagar la expresada cantidad de dinero. Declaran también que da a
    este Acto carácter de Cosa Juzgada y eligen domicilio en su propia casa antes
    mencionada.  Queda entendido que, si EL DEUDOR FRANCIS ERNESTO DE OLEO
    CONTRERAS, dejara de pagar al menos una (01) de las cuotas consignadas en el
    presente acto; LA ACREEDORA la Sra. Mariannys Marilynes Gomera Cuevas, podrá
    ejecutar el embargo sin necesidad de esperar para ello la llegada del término
    y/o del tiempo acordado en este Pagaré Notarial.  De todo lo cual se ha
    redactado el presente acto que he leído en presencia de los señores RONALD
    RODRIGUEZ y GELERCIO HERNANDEZ BATISTA, ambos dominicanos, mayores de edad,
    titulares de las cédulas de identidad Nos. 001-1374378-5 y 001-1576685-9,
    ambos domiciliados y residentes en el Sector Los Frailes de esta ciudad de
    Santo Domingo Este, Provincia Santo Domingo, República Dominicana, ambos
    testigos libres de tachas y excepciones que establecen las normas vigentes; los
    cuales lo encontraron conforme a su decir, y han procedido conjuntamente con
    los comparecientes y por ante mí a firmarlo. Notario Público que DOY FE Y
    CERTIFICO.
    `;


  const createPdf = () => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream("pagare_notarial.pdf");

    doc.pipe(stream);

    doc.fontSize(14).text("PAGARE NOTARIAL", { align: "center" });

    const chunkSize = 100;
    for (let i = 0; i < formattedText.length; i += chunkSize) {
      const chunk = formattedText.substring(i, i + chunkSize);
      doc.fontSize(11).text(chunk, { align: "justify" });
    }

    doc.end();

    stream.on("finish", () => {
      const pdfBytes = fs.readFileSync("pagare_notarial.pdf");
      download(pdfBytes, "pagare_notarial.pdf", "application/pdf");
    });
  };

  return (
    <button
      className="rounded bg-slate-500 px-4 py-2 hover:cursor-pointer active:bg-slate-300 "
      onClick={createPdf}
    >
      PAGARE
    </button>
  );
}

export default GeneratePdf;
