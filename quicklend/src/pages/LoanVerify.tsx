import Layout from "@components/Layout";
import { Rating } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import Generatepdf from "@utils/Generatepdf";
import { saveAs } from "file-saver";
import { addDays, addWeeks, addMonths } from "date-fns";

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

export default function LoanVerify() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataReceived, setDataReceived] = useState(false);
  const dataRef = useRef<LoanData | null>(null);

  useEffect(() => {
    if (!dataReceived) {
      const parsedData = JSON.parse(queryParams.get("data")!);
      dataRef.current = parsedData;
      setDataReceived(true);
    }
  }, [dataReceived, queryParams]);

  const [customerData, setCustomerData] = useState<CustomerData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<CustomerData>(
          `http://localhost:3001/api/borrowers/${dataRef.current?.borrower}`,
        );
        setCustomerData(response.data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };
    setIsLoading(false);
    console.log(
      "CALLING_DATE",
      dataRef.current?.modalidad,
      dataRef.current?.fecha,
      dataRef.current?.numCuotas,
    );
    getDates(
      dataRef.current?.modalidad,
      dataRef.current?.fecha,
      dataRef.current?.numCuotas,
    );

    fetchData();
  }, [dataRef.current]);

  function getInitials(name: any) {
    let initials = name.match(/\b\w/g) || [];
    initials = (
      (initials.shift() || "") + (initials.pop() || "")
    ).toUpperCase();
    return initials;
  }

  const initialPerson = {
    numero: "John",
    cliente: "Doe",
    total: 10,
  };
  const [paymentStartDate, setPaymentStartDate] = useState<Date | null>(null);
  const [paymentEndDate, setPaymentEndDate] = useState<Date | null>(null);

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
        const responseData = await response.json(); // Parsea la respuesta JSON
        console.log(responseData);
        setPaymentStartDate(responseData.startDay); // Utiliza la propiedad startDay de la respuesta
        setPaymentEndDate(responseData.endDay); // Utiliza la propiedad endDay de la respuesta
      } else {
        console.error("Error fetching dates:", response.status);
      }
    } catch (error) {
      console.error("Error fetching dates:", error);
    }
  };

  const [secretPassword, setSecretPassword] = useState<string | null>(null);

  useEffect(() => {
    const fetchSecretPassword = async () => {
      try {
        const response = await axios.get<{ secretPassword: string }>(
          "http://localhost:3001/api/borrowers/secretPassword",
        );
        console.log(response.data);
        setSecretPassword(String(response.data));
      } catch (error) {
        console.error("Error fetching secret password:", error);
      }
    };

    fetchSecretPassword();
  }, []);
  const [iniciales, setIniciales] = useState<string>();

  useEffect(() => {
    if (dataRef.current) {
      const nombreCompleto = dataRef.current.borrower;
      setIniciales(getInitials(nombreCompleto));
    }
  }, [dataRef.current]);

  const [showClaveInput, setShowClaveInput] = useState<boolean>(false);
  const [clave, setClave] = useState<string>("");
  const [autorizationError, setAutorizationError] = useState<string | null>(
    null,
  );
  const [autorizing, setAutorizing] = useState<boolean>(false);
  const [autorized, setAutorized] = useState<boolean>(false);
  const [checkboxesChecked, setCheckboxesChecked] = useState<{
    pagareNotarial: boolean;
    pagare: boolean;
  }>({
    pagareNotarial: false,
    pagare: false,
  });

  useEffect(() => {
    setCheckboxesChecked({
      pagareNotarial: false,
      pagare: false,
    });
  }, []);

  const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checkboxName = e.target.name;
    setCheckboxesChecked((prevChecked) => ({
      ...prevChecked,
      [checkboxName]: e.target.checked,
    }));
  };

  const handleAutorize = () => {
    if (!customerData?.canBorrow) {
      toast((t) => (
        <span
          style={{
            display: "block",
            padding: "10px",
            backgroundColor: "#f2f2f2",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          Este cliente parece tener situaciones con préstamos anteriores.
          ¿Deseas continuar con el préstamo?
          <button
            style={{
              marginLeft: "10px",
              padding: "5px 10px",
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
            }}
            onClick={() => {
              toast.dismiss(t.id);
              setShowClaveInput(true);
            }}
          >
            Sí
          </button>
          <button
            style={{
              marginLeft: "10px",
              padding: "5px 10px",
              backgroundColor: "red",
              color: "white",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
            }}
            onClick={() => {
              toast.dismiss(t.id);
            }}
          >
            No
          </button>
        </span>
      ));
    } else if (customerData?.canBorrow) {
      setShowClaveInput(true);
    }
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
        "Clave incorrecta. Por favor, ingrese la clave correcta.",
      );
    }
  };
  const history = useNavigate();
  const [isFinishingLoan, setIsFinishingLoan] = useState(false);

  const handleFinishLoan = async () => {
    if (!autorized) {
      console.error("No se puede finalizar el préstamo sin autorización.");
      return;
    }

    const confirmMessage = "¿Estás seguro de que deseas finalizar el préstamo?";

    try {
      const importeCreditoFormatted = String(
        dataRef.current?.importeCredito,
      ).replace(",", "");
      const importeCuotasFormatted = String(
        dataRef.current?.importeCuotas,
      ).replace(",", "");
      const totalAPagarFormatted = String(dataRef.current?.totalAPagar).replace(
        ",",
        "",
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
        }),
      );
      console.log("After Axios request, before handling response");

      if (response.status === 201) {
        console.log("Préstamo finalizado exitosamente");
        history("/home");
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


      
  const handleCancel = async () => {
    

    try {
      const importeCreditoFormatted = String(
        dataRef.current?.importeCredito,
      ).replace(",", "");
      const importeCuotasFormatted = String(
        dataRef.current?.importeCuotas,
      ).replace(",", "");
      const totalAPagarFormatted = String(dataRef.current?.totalAPagar).replace(
        ",",
        "",
      );

      // Realiza las acciones necesarias para finalizar el préstamo
      console.log("Before making Axios request");
      const response = await fetch("http://localhost:3001/api/loans/declined  ", {
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
          importeCuotas: importeCuotasFormatted,
          totalAPagar: totalAPagarFormatted,
        }),
      );
      console.log("After Axios request, before handling response");

      if (response.status === 201) {
        console.log("Préstamo finalizado exitosamente");
        history("/home");
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
      {!isLoading && (
        <div className="flex h-full w-full flex-row gap-4">
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
          <div className="grid h-full w-2/3 grid-cols-2   grid-rows-2  gap-4">
            <div className="row-span-2 flex  flex-col items-center justify-center gap-4 whitespace-normal rounded bg-white text-center">
              <h1 className="pb-8 text-2xl font-bold "> Datos del préstamo</h1>
              <div className="grid w-full grid-cols-1 gap-4 px-8 text-left text-lg  ">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    Importe De Crédito: <br />
                  </span>
                  <span className="italic">
                    {dataRef.current?.importeCredito}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Interés:</span>
                  <span className="italic">{dataRef.current?.interes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Importe Cuotas:</span>
                  <span className="italic">
                    {dataRef.current?.importeCuotas}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Modalidad:</span>
                  <span className="italic">{dataRef.current?.modalidad}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Número De Cuotas: </span>
                  <span className="italic">{dataRef.current?.numCuotas}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Cuotas Según Modalidad:</span>
                  <span className="italic">
                    {dataRef.current?.cuotasSegunModalidad}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total A Pagar:</span>
                  <span className="italic">{dataRef.current?.totalAPagar}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    Fecha de Inicio de Pagos:
                  </span>
                  <span className="italic">{paymentStartDate?.toString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    Fecha de Término de Pagos:
                  </span>
                  <span className="italic">{paymentEndDate?.toString()}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 rounded bg-white">
              <div className="mb-4 flex items-start items-center">
                <input
                  type="checkbox"
                  name="pagareNotarial"
                  className="h-7 w-7 rounded bg-gray-500 hover:cursor-pointer active:bg-gray-300"
                  value={"Pagare Notarial"}
                  onChange={handleCheckChange}
                  checked={checkboxesChecked.pagareNotarial}
                />
                <label
                  htmlFor="pagareNotarial"
                  className="ml-2 text-xl font-bold text-gray-900"
                >
                  Pagare Notarial
                </label>
              </div>
              <div className="mb-4 flex  w-[11.39rem] items-start">
                <input
                  type="checkbox"
                  name="pagare"
                  className="h-7 w-7 rounded bg-gray-500 hover:cursor-pointer active:bg-gray-300"
                  value={"Pagare"}
                  checked={checkboxesChecked.pagare}
                  onChange={handleCheckChange}
                />
                <label
                  htmlFor="pagare"
                  className="ml-2 text-xl font-bold text-gray-900"
                >
                  Pagare
                </label>
              </div>

              <div className="mb-4 flex items-center justify-between">
                {!autorized && (
                  <div className="mb-4">
                    <button
                      className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:text-black"
                      onClick={handleAutorize}
                      disabled={
                        !checkboxesChecked.pagareNotarial &&
                        !checkboxesChecked.pagare
                      }
                    >
                      Autorizar Préstamo
                    </button>
                    {showClaveInput && (
                      <div className=" fixed bottom-0 left-0 right-0 top-0 flex  items-center justify-center bg-black bg-opacity-50">
                        <div className="flex w-96 flex-col items-center justify-center gap-4 rounded bg-white px-2 py-2">
                          <p className="text-2xl font-bold">
                            Ingrese su codigo secreto
                          </p>
                          <input
                            type="password"
                            name="clave"
                            className="w-40 rounded border p-1 "
                            placeholder="Ingrese su clave"
                            value={clave}
                            onChange={(e) => setClave(e.target.value)}
                          />
                          <button
                            className="ml-2 rounded bg-green-500 px-3 py-1  text-xl font-bold text-white hover:bg-green-600"
                            onClick={handleClaveSubmit}
                          >
                            Autorizar
                          </button>
                          {autorizationError && (
                            <p className="text-red-500">{autorizationError}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {autorized && (
                  <button
                    className="rounded bg-green-500 px-4 py-2 font-semibold text-black  "
                    disabled
                  >
                    Autorizado
                  </button>
                )}
              </div>
            </div>
            <div className=" flex h-full flex-col items-center justify-center gap-4 rounded bg-white ">
              <button
                className="rounded bg-green-500 px-4 py-2 font-bold text-black disabled:bg-gray-400 "
                disabled={!autorized || isFinishingLoan}
                onClick={handleFinishLoan}
              >
                Finalizar Prestamo
              </button>
              <button
                className="rounded bg-red-500  px-4 py-2 font-bold text-black  hover:bg-red-600  "
                onClick={handleCancel}
              >
                Cancelar Prestamo
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </Layout>
  );
}
