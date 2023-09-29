// @ts-nocheck 
import Layout from '@components/Layout'
import { Rating } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Generatepdf from "@utils/Generatepdf";
import { saveAs } from "file-saver";
import { addDays, addWeeks, addMonths } from 'date-fns';

interface LoanData {
    borrower: string;
    cuotasSegunModalidad: number;
    fecha: Date;
    importeCredito: number;
    importeCuotas: number;
    interes: number;
    modalidad: string;
    numCuotas: number;
    tasa: number;
    totalAPagar: number;
  }

  interface CustomerData {
    borrower: {
      id: number;
      FULL_NAME: string;
      IDENTIFICATION_NUMBER: string;
      PHONE: string;
      AGE: string;
      ADDRESS: string;
      WORKPLACE: string;
      WORKING_TIME: string;
      type?: string | null;
      // Agrega aquí otros campos necesarios
    };
    ranking: {
      id: number;
      borrower_id: number;
      ranking_level: any; // Tipo number para campos decimales
      notes: string;
      activeLoans: number;
    };
    lastLoan: {
      id: number;
      importeCredito: number;
      // Agrega aquí otros campos necesarios
    };
    totalDebt: number;
    remainingPayments: number;
    canBorrow: boolean;
  }
export default function CustomersById() {

    const [isLoading, setIsLoading] = useState<boolean>(true);
const [dataReceived, setDataReceived] = useState(false);
const dataRef = useRef<LoanData | null>(null);
const [customerData, setCustomerData] = useState<CustomerData | null>(null);
const [paymentStartDate, setPaymentStartDate] = useState<Date | null>(null);
const [paymentEndDate, setPaymentEndDate] = useState<Date | null>(null);
const [secretPassword, setSecretPassword] = useState<string | null>(null);
const [iniciales, setIniciales] = useState<string>();
const [showClaveInput, setShowClaveInput] = useState<boolean>(false);
const [clave, setClave] = useState<string>("");
const [autorizationError, setAutorizationError] = useState<string | null>(null);
const [autorizing, setAutorizing] = useState<boolean>(false);
const [autorized, setAutorized] = useState<boolean>(false);
const [checkboxesChecked, setCheckboxesChecked] = useState<{
  pagareNotarial: boolean;
  pagare: boolean;
}>({
  pagareNotarial: false,
  pagare: false,
});
const [isFinishingLoan, setIsFinishingLoan] = useState(false);

// Declaración de funciones
const getInitials = (name: any) => {
  let initials = name.match(/\b\w/g) || [];
  initials = (
    (initials.shift() || "") + (initials.pop() || "")
  ).toUpperCase();
  return initials;
};

const getDates = async (modal: any, date: any, numCuotas: any) => {
  try {
    const response = await fetch("http://localhost:3001/api/loans/date", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        modal,
        date,
        numCuotas,
      }),
    });

    if (response.ok) {
      const responseData = await response.json();
      setPaymentStartDate(responseData.startDay);
      setPaymentEndDate(responseData.endDay);
    } else {
      console.error("Error fetching dates:", response.status);
    }
  } catch (error) {
    console.error("Error fetching dates:", error);
  }
};

const fetchSecretPassword = async () => {
  try {
    const response = await axios.get<{ secretPassword: string }>(
      "http://localhost:3001/api/borrowers/secretPassword"
    );
    console.log(response.data);
    setSecretPassword(String(response.data));
  } catch (error) {
    console.error("Error fetching secret password:", error);
  }
};

const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const checkboxName = e.target.name;
  setCheckboxesChecked((prevChecked) => ({
    ...prevChecked,
    [checkboxName]: e.target.checked,
  }));
};

const handleAutorize = () => {
  setShowClaveInput(true);
};

const handleClaveSubmit = async () => {
  if (!checkboxesChecked.pagareNotarial || !checkboxesChecked.pagare) {
    setAutorizationError("Debe marcar ambos checkboxes para autorizar.");
    return;
  }

  if (clave === secretPassword) {
    setAutorizationError(null);
    setAutorizing(true);

    try {
      // Realizar las acciones de autorización aquí

      // Una vez autorizado, actualizar el estado
      setAutorized(true);
    } catch (error) {
      console.error("Error al autorizar el préstamo:", error);
    } finally {
      setAutorizing(false);
    }
  } else {
    setAutorizationError(
      "Clave incorrecta. Por favor, ingrese la clave correcta."
    );
  }
};

const handleFinishLoan = async () => {
  if (!autorized) {
    console.error("No se puede finalizar el préstamo sin autorización.");
    return;
  }

  setIsFinishingLoan(true);

  try {
    const importeCreditoFormatted = String(dataRef.current?.importeCredito).replace(
      ",",
      ""
    );
    const importeCuotasFormatted = String(dataRef.current?.importeCuotas).replace(
      ",",
      ""
    );
    const totalAPagarFormatted = String(dataRef.current?.totalAPagar).replace(
      ",",
      ""
    );

    // Realiza las acciones necesarias para finalizar el préstamo
    console.log("Before making Axios request");
    const response = await fetch("http://localhost:3001/api/loans/loan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...dataRef.current,
        importeCredito: importeCreditoFormatted,
        importeCuotas: importeCuotasFormatted,
        totalAPagar: totalAPagarFormatted,
      }),
    });
    console.log(
      JSON.stringify({
        ...dataRef.current,
        importeCredito: importeCreditoFormatted,
      })
    );
    console.log("After Axios request, before handling response");

    if (response.status === 201) {
      console.log("Préstamo finalizado exitosamente");
      // Realiza otras acciones necesarias (por ejemplo, mostrar una notificación)
    } else {
      console.error("Error al finalizar el préstamo");
      // Maneja el error de manera adecuada (por ejemplo, mostrando un mensaje de error)
    }
  } catch (error) {
    console.error("Error al finalizar el préstamo:", error);
    // Maneja el error de manera adecuada (por ejemplo, mostrando un mensaje de error)
  } finally {
    setIsFinishingLoan(false);
  }
};
  return (
    <Layout>
        <div className='w-full h-full grid-cols-2 grid-rows-4'>
        <div className="flex h-full w-1/3 flex-col items-center justify-center gap-4 rounded bg-white">
  <div
    className={`flex h-40 w-40  items-center justify-center rounded-[100%] bg-blue-200  `}
  >
    <span className="text-center font-serif text-8xl ">
      {" "}
      {iniciales}{" "}
    </span>
  </div>
  <div className="flex flex-col gap-2  text-center">
    <p className=" text-2xl font-bold   ">
      {" "}
      {customerData?.borrower.FULL_NAME}
    </p>
    <p className=" text-2xl font-medium ">
      {" "}
      {customerData?.borrower.IDENTIFICATION_NUMBER}
    </p>
    <p className=" text-2xl font-medium ">
      {" "}
      {customerData?.borrower.PHONE}
    </p>
  </div>
  <Rating
    name="size-large"
    value={parseFloat(customerData?.ranking.ranking_level)} // Utilizar parseFloat o parseInt según corresponda
    precision={0.5}
    size="large"
    readOnly
  />
  {customerData?.canBorrow ? (
    <div className="flex h-8 items-center justify-center rounded bg-green-500 px-4">
      <span className="font-bold">Autorizado</span>{" "}
    </div>
  ) : (
    <div className="flex h-8 items-center justify-center rounded bg-red-500 px-4">
      <span className="font-bold">Denegado</span>{" "}
    </div>
  )}
  <div className="flex flex-col gap-2  text-justify">
    <p className=" text-xl font-medium   ">
      {" "}
      Ultimo Prestamo: {customerData?.lastLoan.importeCredito}
    </p>
    <p className=" text-xl font-medium ">
      {" "}
      Total Deuda:{" "}
      {customerData?.totalDebt ? customerData?.totalDebt : "00.00"}
    </p>
  </div>
  <p className="text-xl font-medium ">{`Nota:
    ${customerData?.ranking.notes}`}</p>
</div>

        </div>
    </Layout>
  )
}
