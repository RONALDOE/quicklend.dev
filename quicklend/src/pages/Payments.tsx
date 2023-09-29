// @ts-nocheck 
import React, { useState, useEffect, useMemo } from "react";
import Layout from "../components/Layout";
import axios from "axios";

// Tipo para un préstamo
interface Loan {
  id: number;
  borrower_id: number;
  importeCredito: number;
  modalidad: "Mensual" | "Semanal" | "Quincenal" | "Diario";
  tasa: number;
  numCuotas: number;
  importeCuotas: number;
  totalAPagar: number;
  fecha: string; // Deberías convertir esto al formato adecuado
  cuotasSegunModalidad: string;
  paymentsMade: number;
  loanStatus: "Pending" | "Approved" | "Rejected" | "Completed";
  remainingPayments: number;
}

// Tipo para un pago
// interface Payment {
//   id: number;
//   loan_id: number;
//   cuotaNumero: number;
//   fechaPago: string | null; // Deberías convertir esto al formato adecuado
//   montoPagado: number;
//   status: "Pagado" | "No Pagado" | "Vencido";
//   fechaAPagar: string; // Deberías convertir esto al formato adecuado
// }
interface Pay
{paymentId: number, 
  cuotaNumero: number, 
  montoPagado: string, 
  loanId: number}

interface Borrower {
  id: number;
  FULL_NAME: string;
  IDENTIFICATION_NUMBER: string;
  PHONE: string;
  AGE: string;
  ADDRESS: string;
  WORKPLACE: string;
  WORKING_TIME: string;
  type?: string | null;
}

// Componente para mostrar la página de administración de pagos
export default function Payments() {
  const defaultData = {
    id: 0,
    borrower_id: 0,
    importeCredito: 0,
    modalidad: "Diario",
    tasa: 0,
    numCuotas: 0,
    importeCuotas: 0,
    totalAPagar: 0,
    fecha: "",// Deberías convertir esto al formato adecuado
    cuotasSegunModalidad: "",
    paymentsMade: 0,
    loanStatus: "Pending" ,
    remainingPayments: 0}
  const [loan, setLoan] = useState<Pay | null>(null); // Estado para almacenar la lista de préstamos
  // const [selectedLoan, setSelectedLoan] = useState<Loan | "">(""); // Estado para el préstamo seleccionado
  const [borrower, setBorrower] = useState<string>("");
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [allBorrowers, setAllBorrowers] = useState<Borrower[]>([]);
  const [paymentAmmount, setPaymentAmount] = useState("")

    // Cargar la lista de préstamos desde tu API
    const fetchLoan = async () => {
      try {
        const response = await axios.get<Pay>(
          `http://localhost:3001/api/payments/${borrower}/last-incomplete-payment`,
        );
        console.log( response.status)
        setLoan(response.data); 
        console.log(loan)// Suponiendo que la respuesta es un array de préstamos
      } catch (error) {
        console.error("Error al cargar la lista de préstamos:", error);
      }
    };


  // Función para manejar el envío del formulario de pago
  const handlePaymentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loan) {
      alert(
        "Por favor, selecciona un préstamo y proporciona el monto del pago.",
      );
      return;
    }

    try {
      // Enviar el pago a tu API
        const paymentData = {
          loanId: loan.loanId,
          amount: parseFloat(loan.montoPagado),
          paid: parseFloat(paymentAmmount),
          numCuota: loan.cuotaNumero
        };

        if(paymentData.paid > paymentData.amount) 
        {
          alert("Pague Una Cuota A La Vez")
          return;
        }
      const response = await axios.put(
        "http://localhost:3001/api/payments",
        paymentData,
      );
      alert("Pago registrado con éxito.");
        window.location.reload()
      // Limpiar los campos después de registrar el pago
      //   setPaymentAmount("");
    } catch (error) {
      console.error("Error al registrar el pago:", error);
      alert(
        "Hubo un error al registrar el pago. Por favor, inténtalo nuevamente.",
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/borrowers");
        const jsonData = await response.json();
        setAllBorrowers(jsonData);
        setBorrowers(jsonData);
      } catch (error) {
        console.error("Error fetching borrowers:", error);
      }
    };

    fetchData();
  }, []);

  const searchBorrower = (query: string) => {
    const filteredBorrowers = allBorrowers.filter((b) =>
      b.FULL_NAME.toLowerCase().includes(query.toLowerCase()),
      
      );
    setBorrowers(filteredBorrowers);
  };

  const [borrowerValue, setBorrowerValue] = useState<string>("");
  const handleborrowerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedClient = e.target.value;
  
    // Busca el cliente en la lista de borrowers
    const selectedBorrower = allBorrowers.find(
      (b) => b.FULL_NAME.toLowerCase() === selectedClient.toLowerCase()
    );
  
    // Si se encuentra un cliente, actualiza el estado de borrower
    if (selectedBorrower) {
      setBorrower(selectedClient);
      setBorrowerValue(selectedClient);
      searchBorrower(selectedClient);
  
      // Luego, intenta cargar las cuotas del cliente seleccionado
      fetchLoan(); // Puedes pasar el ID del cliente aquí
    } else {
      // Si no se encuentra el cliente, restablece los estados y muestra "No Presenta Cuotas"
      setBorrower(selectedClient);
      setBorrowerValue(selectedClient);
      searchBorrower(selectedClient);
      setLoan(null); // O establece el valor de loan como null u otro valor apropiado
    }
  };

  const handleAmmountChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
       const formattedValue = parseFloat(e.target.value.replace(/,/g, ""));

    if (!isNaN(formattedValue)) {
      setPaymentAmount(formattedValue.toLocaleString("en-US"));
    } else {
      setPaymentAmount(""+""); // O cualquier otro valor predeterminado que desees cuando no se puede analizar como número.
    }
  }

  useEffect(() => {
    fetchLoan();
  }, [borrower]);
  
  const handleborrowerSelect = (selectedClient: string) => {
    setBorrower(selectedClient);
    setBorrowerValue(selectedClient);
    
    setBorrowers([]);
  };

  return (
    <Layout>
      <div className="flex h-full items-center justify-center">
        <div className="-white flex w-[40%] flex-col items-center justify-center gap-4 rounded bg-white  pb-8 pt-6 shadow-md ">
          <div className="flex h-[7rem] w-[7rem] items-center justify-center rounded-full bg-blue-500 ">
            <div className="flex h-[6rem] w-[6rem] select-none items-center justify-center rounded-full border-2 border-white bg-transparent text-center  text-[4rem] font-extrabold text-white">
              <span>$</span>
            </div>
          </div>

          <form onSubmit={handlePaymentSubmit} className=" w-full px-[7rem]">
            {/* <h2 className="mb-4 text-center text-2xl font-semibold">
              Administrar Pagos
            </h2> */}

            {/* Selección de préstamo */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Selecciona un Cliente:
              </label>
              <input
                type="text"
                className="focus:shadow-outline w-full appearance-none	rounded border border-gray-400 px-3 py-2 text-center leading-tight text-gray-700 focus:outline-none"
                name=""
                id=""
                value={borrower}
                onChange={handleborrowerChange}
              />
              {/* <select
                value={`Préstamo #${
                  selectedLoan ? selectedLoan.id : " "
                } - Valor: ${selectedLoan ? selectedLoan.importeCredito : " "}`}
                onChange={(e) => {
                  const selectedId = parseInt(e.target.value, 10);
                  const selected = loans.find((loan) => loan.id === selectedId);
                  setSelectedLoan(selected || ""); // Asigna el préstamo seleccionado o una cadena vacía
                }}
                className="w-full rounded border border-gray-300 bg-white px-3 py-2"
              > */}
                {/* <option value="" disabled>
                  Selecciona un préstamo
                </option>
                {loans.map((loan) => (
                  <option key={loan.id} value={loan.id.toString()}>
                    Préstamo #{loan.id} - Valor: ${loan.importeCredito}
                  </option>
                ))}
              </select>*/}
            </div> 

            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Monto de la cuota:
              </label>
              <input type="text" value={ loan? `Cuota #${loan.cuotaNumero}, Monto de la cuota: ${loan.montoPagado}`: "No Presenta Cuotas"} disabled className="focus:shadow-outline w-full appearance-none	rounded border border-gray-400 px-3 py-2 text-center leading-tight text-gray-700 focus:outline-none"/>
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Monto a Pagar:
              </label>
              <div className="flex flex-row items-center justify-around ">

              <input
                type="text"
                className="focus:shadow-outline w-4/7 appearance-none	rounded border border-gray-400 px-3 py-2 text-center leading-tight text-gray-700 focus:outline-none"
                name=""
                id=""
                value={paymentAmmount}
                onChange={handleAmmountChange}
                />
                <input type="button"
                className="focus:shadow-outline w-2/7 text-white text-xl font-bold appearance-none	rounded border border-gray-400 px-3 py-2 text-center leading-tight bg-green-500 disabled:bg-gray-500 active:hover:bg-green-700 focus:outline-none" 
                disabled={loan === null ? true : false}
                value="Total"
                onClick={()=>{setPaymentAmount(loan!.montoPagado)}} />
                </div>
            </div>

            {/* Botón para registrar el pago */}
            <div className="text-center">
              <button
                type="submit"
                className="rounded-sm bg-blue-500 px-4 py-2 font-bold text-white enabled:hover:cursor-pointer disabled:bg-gray-500 hover:bg-blue-700 focus:outline-none"
                disabled={loan === null ? true : false}
                >
                Registrar Pago
              </button>
            </div>
          </form>
          {borrowers.length > 0 && (
            <div className="absolute mt-[18rem]">
              <ul className="h-36 w-96  overflow-auto rounded border border-gray-300 bg-white">
                {borrowers.map((c) => (
                  <li
                    key={c.id}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100 "
                    onClick={() => handleborrowerSelect(c.FULL_NAME)}
                  >
                    {c.FULL_NAME}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
