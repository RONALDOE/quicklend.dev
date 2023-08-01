import Layout from "../components/Layout";
import axios from "axios";
import { useState } from "react";
import Draggable from 'react-draggable';

interface FormData {
  cliente: string;
  importeCredito: string;
  modalidad: string;
  tasa: string;
  numCuotas: string;
  importeCuotas: string;
  totalAPagar: string;
  fecha: string;
  cuotasSegunModalidad: string;
}

interface Client {
  id: number;
  name: string;
}

interface FormProps {
  onSubmit: (data: FormData) => void;
}
export default function LoanCalculator() {
  const [formData, setFormData] = useState<FormData>({
    cliente: "",
    importeCredito: "",
    modalidad: "",
    tasa: "",
    numCuotas: "",
    importeCuotas: "",
    totalAPagar: "",
    fecha: "",
    cuotasSegunModalidad: "",
  });

  const [cliente, setCliente] = useState<string>("");
  const [clientes, setClientes] = useState<Client[]>([]);

  // Simulación de búsqueda de clientes
  const buscarClientes = (query: string) => {
    // Aquí podrías realizar una solicitud a tu backend para obtener los clientes que coincidan con el query
    // Por simplicidad, aquí solo se simula una búsqueda con datos estáticos.
    const mockClientes: Client[] = [
      { id: 1, name: "Cliente 1" },
      { id: 2, name: "Cliente 2" },
      { id: 3, name: "Cliente 3" },
      { id: 4, name: "Cliente 4" },
      { id: 5, name: "Cliente 5" },
      { id: 6, name: "Cliente 6" },
    ];

    const filteredClientes = mockClientes.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase()),
    );
    setClientes(filteredClientes);
  };
  const handleClienteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCliente(e.target.value);
    buscarClientes(e.target.value);
  };

  const handleClienteSelect = (selectedClient: string) => {
    setCliente(selectedClient);
    setClientes([]); // Cerrar la lista de sugerencias después de seleccionar un cliente
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Enviamos los datos al backend
      const response = await axios.post("URL_DEL_BACKEND", formData);

      // Procesamos la respuesta del backend si es necesario
      console.log(response.data);

      // Limpiamos el formulario
      setFormData({
        cliente: "",
        importeCredito: "",
        modalidad: "",
        tasa: "",
        numCuotas: "",
        importeCuotas: "",
        totalAPagar: "",
        fecha: "",
        cuotasSegunModalidad: "",
      });
    } catch (error) {
      console.error("Error al enviar los datos al backend:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Layout>
      <div className=" mt-4 flex h-full items-center justify-center ">
        <form
          onSubmit={handleSubmit}
          className="mb-4 grid w-full grid-flow-dense md:grid-cols-2 grid-cols-1 gap-3 rounded bg-white px-8 pb-8 pt-6 shadow-md relative"
        >
          <div className=" mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">
              Cliente:
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
              type="text"
              placeholder="Cliente"
              value={cliente}
              onChange={handleClienteChange}
            />
            {/* <button
          type="button"
          className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
        >
          Buscar
        </button> */}
          </div>
          {/* Lista de sugerencias de clientes */}
          {clientes.length > 0 && (
            <Draggable handle=".handle" bounds="parent">

            <div className="   z-50 handle border-t-[1.5rem]	">

            <ul className="absolute   bg-white border border-gray-300 rounded w-full">
              {clientes.map((c) => (
                  <li
                  key={c.id}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 "
                  onClick={() => handleClienteSelect(c.name)}
                  >
                  {c.name}
                </li>
              ))}
            </ul>
              </div>
              </Draggable>
          )}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Importe de Crédito:
            </label>
            <input
              name="importeCredito"
              value={formData.importeCredito}
              onChange={handleChange}
              type="number" 
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Modalidad:
            </label>
            <input
              type="text"
              name="modalidad"
              value={formData.modalidad}
              onChange={handleChange}
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
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
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              No. Cuotas:
            </label>
            <input
              type="number" 
              name="numCuotas"
              value={formData.numCuotas}
              onChange={handleChange}
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Importe Cuotas:
            </label>
            <input
              type="number" 
              name="importeCuotas"
              value={formData.importeCuotas}
              onChange={handleChange}
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Total a Pagar:
            </label>
            <input
              type="number" 
              name="totalAPagar"
              value={formData.totalAPagar}
              min={0}
              onChange={handleChange}
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Fecha:
            </label>
            <input
              type="text"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Cuotas Según Modalidad:
            </label>
            <input
              type="text"
              name="cuotasSegunModalidad"
              value={formData.cuotasSegunModalidad}
              onChange={handleChange}
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none  "
          >
            Enviar
          </button>
        </form>
      </div>
    </Layout>
  );
}
