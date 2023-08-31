import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import Draggable from "react-draggable";
import { useNavigate } from 'react-router-dom';


interface FormData {
  borrower: string;
  importeCredito: string;
  modalidad: string;
  tasa: string;
  numCuotas: string;
  importeCuotas: string;
  totalAPagar: string;
  fecha: string;
  cuotasSegunModalidad: string;
  interes: string;
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

export default function LoanCalculator() {
  const history = useNavigate();

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const defaultDate = `${year}-${month}-${day}`;

  const [formData, setFormData] = useState<FormData>({
    borrower: "",
    importeCredito: "",
    modalidad: "",
    tasa: "7.00",
    numCuotas: "",
    importeCuotas: "",
    totalAPagar: "",
    fecha: defaultDate,
    cuotasSegunModalidad: "",
    interes: "",
  });

  const [borrower, setBorrower] = useState<string>("");
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [allBorrowers, setAllBorrowers] = useState<Borrower[]>([]);

  const [errorPopup, setErrorPopup] = useState<string | null>(null);
  const [successPopup, setSuccessPopup] = useState<string | null>(null);

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

  const handleborrowerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      borrower: e.target.value,
    }));
    setBorrower(e.target.value);
    searchBorrower(e.target.value);
  };

  const handleborrowerSelect = (selectedClient: string) => {
    setBorrower(selectedClient);
    setFormData((prevFormData) => ({
      ...prevFormData,
      borrower: selectedClient,
    }));
    setBorrowers([]);
  };

  const calculateNewDate = (startDate: any, interval: any, modalidad: any) => {
    const newDate = new Date(startDate);

    if (modalidad === "Mensual") {
      newDate.setMonth(newDate.getMonth() + interval);
    } else if (modalidad === "Quincenal") {
      newDate.setDate(newDate.getDate() + 15 * interval);
    } else if (modalidad === "Semanal") {
      newDate.setDate(newDate.getDate() + 7 * interval);
    } else if (modalidad === "Diario") {
      newDate.setDate(newDate.getDate() + interval);
    }

    return newDate;
  };

  // const calcular = async () => {
  //   const cliente = formData.borrower;
  //   const importe = formData.importeCredito;
  //   const modalidad = formData.modalidad;
  //   const tasa = formData.tasa;
  //   const cuotas = formData.numCuotas;
  //   const importe_cuotas = formData.importeCuotas;
  //   const total_pagar = formData.totalAPagar;
  //   const interes = formData.interes;
  //   const fecha = formData.fecha;
  //   const no_prestamo = "123"; // Reemplaza esto con la lógica adecuada para obtener el número de préstamo

  //   for (let i = 1; i <= +cuotas; i++) {
  //     // Agregar la fila en la hoja "ESTADOS"
  //     const newRow = {
  //       no_prestamo,
  //       cliente,
  //       cuota: `Cuota-${i}`,
  //       modalidad,
  //       importe_cuotas,
  //       fecha: calculateNewDate(fecha, i, modalidad),
  //     };
  //     // Agregar lógica para calcular la fecha según la modalidad

  //     // Agregar newRow a la hoja "ESTADOS"
  //   }

  //   // Agregar la fila en la hoja "RESUMEN"
  //   const resumenRow = {
  //     no_prestamo,
  //     cliente,
  //     fecha,
  //     importe,
  //     modalidad,
  //     tasa,
  //   };
  //   // Agregar resumenRow a la hoja "RESUMEN"
  // };

  const handleModalidadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const formatNumberWithCommas = (number: any) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name + ":", value);

    if (name === "importeCredito") {
      const formattedValue = parseFloat(value.replace(/,/g, ""));
      if (!isNaN(formattedValue)) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: formattedValue.toLocaleString("en-US"),
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: "",
        }));
      }
    } else if (name === "importeCredito" || (name === "tasa" && value !== "")) {
      const formattedValue = parseFloat(value.replace(/,/g, ""));
      const formattedNumber = formatNumberWithCommas(formattedValue);

      setFormData((prevData) => ({
        ...prevData,
        [name]: formattedNumber,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const modalidadOptions = ["Mensual", "Quincenal", "Semanal", "Diario"];

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   if (
  //     !formData.borrower ||
  //     !formData.importeCredito ||
  //     !formData.modalidad ||
  //     !formData.tasa ||
  //     !formData.numCuotas ||
  //     !formData.cuotasSegunModalidad
  //   ) {
  //     setErrorPopup("Por favor, completa todos los campos.");
  //     return;
  //   }

  //   try {
  //     console.log(formData);
  //     // calcular();
  //     const response = await axios.post(
  //       "http://localhost:3001/api/loans",
  //       formData,
  //     );

  //     console.log(response.data);
  //     setSuccessPopup(true);

  //     setFormData({
  //       borrower: "",
  //       importeCredito: "",
  //       modalidad: "",
  //       tasa: "",
  //       numCuotas: "",
  //       importeCuotas: "",
  //       totalAPagar: "",
  //       fecha: "",
  //       cuotasSegunModalidad: "",
  //       interes: "",
  //     });
  //   } catch (error) {
  //     console.error("Error al enviar los datos al backend:", error);
  //     setErrorPopup(
  //       "Hubo un error al enviar los datos. Por favor, intenta nuevamente.",
  //     );
  //   }
  // };

  const handleContinue = () =>{
    // history.push("/dashboard");
  }

  const handleSaveDraft = async () => {
    // Validar los campos aquí antes de enviar

    if (
      !formData.borrower ||
      !formData.importeCredito ||
      !formData.modalidad ||
      !formData.tasa ||
      !formData.numCuotas ||
      !formData.cuotasSegunModalidad
    ) {
      setErrorPopup("Por favor, completa todos los campos.");
      return;
    }

    // Convertir valores formateados a valores numéricos
    const importeCredito = parseFloat(
      formData.importeCredito.replace(/,/g, ""),
    );
    const tasa = parseFloat(formData.tasa);
    const numCuotas = parseInt(formData.numCuotas);
    const cuotasSegunModalidad = parseInt(formData.cuotasSegunModalidad);

    // Crear el objeto con los valores numéricos para enviar a la API
    const requestData = {
      borrower: formData.borrower,
      importeCredito,
      modalidad: formData.modalidad,
      tasa,
      numCuotas,
      cuotasSegunModalidad,
      // ... otros campos
    };

    try {
      const response = await axios.post(
        "http://localhost:3001/api/loans/draft",
        requestData,
      );

      console.log(response.data);

      setFormData({
        borrower: "",
        importeCredito: "",
        modalidad: "",
        tasa: "",
        numCuotas: "",
        importeCuotas: "",
        totalAPagar: "",
        fecha: "",
        cuotasSegunModalidad: "",
        interes: "",
      });

      setSuccessPopup("Borrador Guardado Con Exito");
    } catch (error) {
      console.error("Error al enviar los datos al backend:", error);
      setErrorPopup(
        "Hubo un error al enviar los datos. Por favor, intenta nuevamente.",
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar los campos aquí antes de enviar

    if (
      !formData.borrower ||
      !formData.importeCredito ||
      !formData.modalidad ||
      !formData.tasa ||
      !formData.numCuotas ||
      !formData.cuotasSegunModalidad
    ) {
      setErrorPopup("Por favor, completa todos los campos.");
      return;
    }

    // Convertir valores formateados a valores numéricos
    const importeCredito = parseFloat(
      formData.importeCredito.replace(/,/g, ""),
    );
    const tasa = parseFloat(formData.tasa);
    const numCuotas = parseInt(formData.numCuotas);
    const cuotasSegunModalidad = parseInt(formData.cuotasSegunModalidad);

    // Crear el objeto con los valores numéricos para enviar a la API
    const requestData = {
      borrower: formData.borrower,
      importeCredito,
      modalidad: formData.modalidad,
      tasa,
      numCuotas,
      cuotasSegunModalidad,
      // ... otros campos
    };

    try {
      // const response = await axios.post(
      //   "http://localhost:3001/api/loans",
      //   requestData,
      // );
      history(`/loan?data=${JSON.stringify(formData)}`);


      // console.log(response.data);

      setFormData({
        borrower: "",
        importeCredito: "",
        modalidad: "",
        tasa: "",
        numCuotas: "",
        importeCuotas: "",
        totalAPagar: "",
        fecha: "",
        cuotasSegunModalidad: "",
        interes: "",
      });

    } catch (error) {
      console.error("Error al enviar los datos al backend:", error);
      setErrorPopup(
        "Hubo un error al enviar los datos. Por favor, intenta nuevamente.",
      );
    }
  };

  useEffect(() => {
    // Función para calcular los valores automáticamente
    const calculateValues = () => {
      let importeCredito = parseFloat(
        formData.importeCredito.replace(/,/g, ""),
      );
      if (isNaN(importeCredito)) {
        importeCredito = 0;
      }

      const tasa = parseFloat(formData.tasa);
      const numCuotas = parseInt(formData.numCuotas);
      const cuotasSegunModalidad = parseInt(formData.cuotasSegunModalidad);

      if (isNaN(tasa) || isNaN(numCuotas) || isNaN(cuotasSegunModalidad)) {
        setFormData((prevData) => ({
          ...prevData,
          interes: "0.00",
          importeCuotas: "0.00",
          totalAPagar: "0.00",
        }));
        return;
      }

      const interes =
        importeCredito * (tasa / 100) * (numCuotas / cuotasSegunModalidad);
      const importeCuotas = (importeCredito + interes) / numCuotas;
      const totalAPagar = importeCuotas * numCuotas;

      setFormData((prevData) => ({
        ...prevData,
        importeCredito: formatNumberWithCommas(importeCredito.toFixed(2)),
        interes: formatNumberWithCommas(interes.toFixed(2)),
        importeCuotas: formatNumberWithCommas(importeCuotas.toFixed(2)),
        totalAPagar: formatNumberWithCommas(totalAPagar.toFixed(2)),
      }));
    };

    calculateValues();
  }, [
    formData.importeCredito,
    formData.tasa,
    formData.numCuotas,
    formData.cuotasSegunModalidad,
  ]);

  return (
    <Layout>
      <div className=" mt-4 flex h-full items-center justify-center ">
        <form
          onSubmit={handleSubmit}
          className="relative mb-4 grid w-full grid-flow-dense grid-cols-1 gap-3 rounded bg-white px-8 pb-8 pt-6 shadow-md md:grid-cols-2"
        >
          <div className=" mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Cliente:
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none	 rounded border border-gray-400 px-3 py-2 leading-tight text-gray-700 focus:outline-none"
              type="text"
              value={borrower}
              onChange={handleborrowerChange}
            />
          </div>
          {borrowers.length > 0 && (
            <Draggable
              handle=".handle"
              bounds="parent"
              defaultPosition={{ x: 600, y: 50 }}
            >
              <div className="handle absolute top-0 z-50 w-96 border-t-[1.5rem]">
                {" "}
                {/* Agrega la clase 'absolute top-0 w-full' */}
                <ul className="h-36 w-96 overflow-auto rounded border border-gray-300 bg-white">
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
            </Draggable>
          )}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Fecha:
            </label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              min={defaultDate}
              max={`${year}-12-31`}
              className="focus:shadow-outline w-full  appearance-none rounded border border-gray-400 px-3 py-2 leading-tight text-gray-700 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Importe de Crédito:
            </label>
            <input
              name="importeCredito"
              value={formData.importeCredito}
              onChange={handleChange}
              type="text"
              className="focus:shadow-outline w-full appearance-none rounded border border-gray-400 px-3 py-2 leading-tight text-gray-700 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Tasa %:
            </label>
            <input
              type="number"
              name="tasa"
              value={formData.tasa}
              onChange={handleChange}
              step="0.01"
              className="focus:shadow-outline w-full appearance-none rounded border border-gray-400 px-3 py-2 leading-tight text-gray-700 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Modalidad:
            </label>
            <select
              name="modalidad"
              value={formData.modalidad}
              onChange={handleModalidadChange}
              className="focus:shadow-outline w-full appearance-none rounded border border-gray-400 px-3 py-2 leading-tight text-gray-700 focus:outline-none"
            >
              <option value="" disabled>
                Selecciona una modalidad
              </option>
              {modalidadOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-1 mb-4 flex flex-row gap-2">
            <div className="w-1/2">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                No. Cuotas:
              </label>
              <input
                type="number"
                name="numCuotas"
                value={formData.numCuotas}
                onChange={handleChange}
                className="focus:shadow-outline w-full appearance-none rounded border border-gray-400 px-3 py-2 leading-tight text-gray-700 focus:outline-none"
              />
            </div>
            <div className="w-1/2">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Cuotas Según Modalidad:
              </label>
              <input
                type="text"
                name="cuotasSegunModalidad"
                value={formData.cuotasSegunModalidad}
                onChange={handleChange}
                className="focus:shadow-outline w-full appearance-none rounded border border-gray-400 px-3 py-2 leading-tight text-gray-700 focus:outline-none"
              />
            </div>
          </div>
          <div className="col-span-full mb-4 flex flex-row gap-2">
            <div className="w-1/3">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Total a Pagar:
              </label>
              <input
                type="text"
                name="totalAPagar"
                value={formData.totalAPagar}
                onChange={handleChange}
                readOnly
                className="focus:shadow-outline w-full appearance-none  rounded border border-gray-400 px-3 py-2 leading-tight text-gray-700 focus:outline-none"
              />
            </div>
            <div className="w-1/3">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Importe Cuotas:
              </label>
              <input
                type="text"
                name="importeCuotas"
                value={formData.importeCuotas}
                readOnly
                onChange={handleChange}
                className="focus:shadow-outline w-full appearance-none rounded border border-gray-400 px-3 py-2 leading-tight text-gray-700 focus:outline-none"
              />
            </div>
            <div className="w-1/3">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Interes:
              </label>
              <input
                type="text"
                name="interes"
                value={formData.interes}
                readOnly
                onChange={handleChange}
                className="focus:shadow-outline w-full appearance-none rounded border border-gray-400 px-3 py-2 leading-tight text-gray-700 focus:outline-none"
              />
            </div>
          </div>
          <div className="col-span-2 mb-4 flex flex-row justify-between gap-4">
            <button
              type="submit"
              className="focus:shadow-outline col-span-2 w-1/2 rounded  bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
            > Continuar</button>
            <input
              type="button"
              className="focus:shadow-outline col-span-2 w-1/2 rounded  bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700 focus:outline-none"
              // disabled={isSubmitting || isSavedDraftLoading }
              onClick={handleSaveDraft}
              value={"Guardar Borrador"}
            />
          </div>
        </form>
      </div>
      {errorPopup && (
        <div className="fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex w-96 flex-col rounded bg-white px-2 py-2 shadow-md">
            <p className="mb-10 mt-4 text-center text-xl font-bold">
              {" "}
              {errorPopup}
            </p>

            <div className="o-circle c-container__circle o-circle__sign--failure">
              <div className="o-circle__sign"></div>
            </div>
            <button
              className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 focus:outline-none"
              onClick={() => setErrorPopup(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      {successPopup && (
        <div className="fixed bottom-0 left-0 right-0 top-0 flex  items-center justify-center bg-black bg-opacity-50">
          <div className="flex w-96 flex-col rounded bg-white px-2 py-2">
            <p className="mb-10 mt-4 text-center text-xl font-bold">
              {successPopup}
            </p>
            <div className="o-circle c-container__circle o-circle__sign--success">
              <div className="o-circle__sign"></div>
            </div>

            <button
              className="-mt-10 rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700 focus:outline-none"
              onClick={() => setSuccessPopup(null)}
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
