// @ts-nocheck 
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

interface Loan {
  id: number;
  // ...
}

interface Pay {
  paymentId: number;
  cuotaNumero: number;
  montoPagado: string;
  loanId: number;
}

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

export default function Payments() {
  const [loan, setLoan] = useState<Pay | null>(null);
  const [borrower, setBorrower] = useState<string>("");
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [allBorrowers, setAllBorrowers] = useState<Borrower[]>([]);
  const [paymentAmmount, setPaymentAmount] = useState("");

  const fetchLoan = async () => {
    try {
      const response = await axios.get<Pay>(
        `http://localhost:3001/api/payments/${borrower}/last-incomplete-payment`
      );
      setLoan(response.data);
    } catch (error) {
      console.error("Error al cargar la lista de préstamos:", error);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loan) {
      toast.error("Por favor, selecciona un préstamo y proporciona el monto del pago.");
      return;
    }

    try {
      const paymentData = {
        loanId: loan.loanId,
        amount: parseFloat(loan.montoPagado),
        paid: parseFloat(paymentAmmount),
        numCuota: loan.cuotaNumero,
      };

      if (paymentData.paid > paymentData.amount) {
        toast.error('Pague el total de una cuota por cuota');
        return;
      }

      const response = await axios.put(
        "http://localhost:3001/api/payments",
        paymentData
      );

      setLoan((prevLoan) => {
        if (prevLoan) {
          const newAmount = prevLoan.montoPagado - paymentData.paid;

          if (newAmount == 0) {
            toast.success('Pago Realizado Con Exito -La cuota completa ha sido pagada');
            return null;
          }

          return {
            
            ...prevLoan,
            montoPagado: newAmount,
          };
        }
        toast.success('Pago Realizado Con Exito');
        return null;
      });

      setPaymentAmount("");

    } catch (error) {
      console.error("Error al registrar el pago:", error);
      toast.error('Error Al Registrar El Pago');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/borrowers");
        const jsonData = await response.json();
        setAllBorrowers(jsonData);
        setBorrowers(jsonData);
        fetchLoan();
      } catch (error) {
        console.error("Error fetching borrowers:", error);
      }
    };

    fetchData();
  }, []);

  const searchBorrower = (query: string) => {
    const filteredBorrowers = allBorrowers.filter((b) =>
      b.FULL_NAME.toLowerCase().includes(query.toLowerCase())
    );
    setBorrowers(filteredBorrowers);
  };

  const [borrowerValue, setBorrowerValue] = useState<string>("");
  const handleborrowerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedClient = e.target.value;

    const selectedBorrower = allBorrowers.find(
      (b) => b.FULL_NAME.toLowerCase() === selectedClient.toLowerCase()
    );

    if (selectedBorrower) {
      setBorrower(selectedClient);
      setBorrowerValue(selectedClient);
      searchBorrower(selectedClient);
      fetchLoan();
    } else {
      setBorrower(selectedClient);
      setBorrowerValue(selectedClient);
      searchBorrower(selectedClient);
      setLoan(null);
    }
  };

  const handleAmmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = parseFloat(e.target.value.replace(/,/g, ""));

    if (!isNaN(formattedValue)) {
      setPaymentAmount(formattedValue.toLocaleString("en-US"));
    } else {
      setPaymentAmount("");
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
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Monto de la cuota:
              </label>
              <input type="text" value={loan ? `Cuota #${loan.cuotaNumero}, Monto de la cuota: ${loan.montoPagado}` : "No Presenta Cuotas"} disabled className="focus:shadow-outline w-full appearance-none	rounded border border-gray-400 px-3 py-2 text-center leading-tight text-gray-700 focus:outline-none"/>
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
                <input
                  type="button"
                  className="focus:shadow-outline w-2/7 text-white text-xl font-bold appearance-none	rounded border border-gray-400 px-3 py-2 text-center leading-tight bg-green-500 disabled:bg-gray-500 active:hover:bg-green-700 focus:outline-none" 
                  disabled={loan === null ? true : false}
                  value="Total"
                  onClick={() => { setPaymentAmount(loan!.montoPagado) }}
                />
              </div>
            </div>

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
      <Toaster/>
    </Layout>
  );
}
