import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import DataObjectIcon from "@mui/icons-material/DataObject";
import AdfScannerIcon from "@mui/icons-material/AdfScanner";
import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
  type MRT_Row,
  type MRT_SortingState,
  type MRT_ColumnFiltersState,
} from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";

import Layout from "@components/Layout";
import axios from "axios";
import useSound from "use-sound";
import { useNavigate } from "react-router-dom";
import sucessSFX from "@assets/sounds/sucess.mp3";
import errorSFX from "@assets/sounds/error.mp3";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
interface User {
  id: number;
  username: string;
  email: string;
  admin_level: number;
}

export default function Settings() {
  const [userShowing, setUserShowing] = useState(false);
  const [reportsShowing, setReportsShowing] = useState(false);
  const [queryShowing, setQueryShowing] = useState(false);

  function Sidebar() {
    return (
      <div className=" -ml-2 w-1/4 flex-col rounded bg-white p-3 text-2xl shadow">
        <div className="space-y-3">
          <div className="flex items-center">
            <h2 className="w-full text-center text-2xl font-semibold">
              Ajustes
            </h2>
          </div>
          <div className="flex-1">
            <ul className="space-y-1 pb-4 pt-2 text-sm">
              <li className="rounded-sm">
                <p
                  className="flex cursor-pointer items-center space-x-3 rounded-md p-2"
                  onClick={() => {
                    setUserShowing(true);
                    setReportsShowing(false);
                    setQueryShowing(false);
                  }}
                >
                  <SupervisedUserCircleIcon fontSize="large" />
                  <span className="text-xl font-bold">Usuarios</span>
                </p>
              </li>
              <li className="rounded-sm">
                <p
                  className="flex cursor-pointer items-center space-x-3 rounded-md p-2"
                  onClick={() => {
                    setUserShowing(false);
                    setReportsShowing(true);
                    setQueryShowing(false);
                  }}
                >
                  <AdfScannerIcon fontSize="large" />
                  <span className="text-2xl">Reportes</span>
                </p>
              </li>
              <li className="rounded-sm">
                <p
                  className="flex cursor-pointer items-center space-x-3 rounded-md p-2"
                  onClick={() => {
                    setUserShowing(false);
                    setReportsShowing(false);
                    setQueryShowing(true);
                  }}
                >
                  <DataObjectIcon fontSize="large" />
                  <span className="text-2xl">Consultas</span>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  return (
    <Layout>
      <div className="flex h-full w-full">

          <UsersTable />
       
      </div>
    </Layout>
  );
}

const UsersTable = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [errorPopup, setErrorPopup] = useState<string | null>(null);
  const [successPopup, setSuccessPopup] = useState<string | null>(null);
  // State for table data
  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch user data from an API endpoint
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:3001/api/users"); // Replace with your API endpoint
        const usersData = response.data;
        console.log(usersData);
        setData(usersData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        header: "ID",
        accessorKey: "id",
        size: 50,
        enableColumnOrdering: false,
        enableSorting: false,
      },
      {
        header: "User Name",
        accessorKey: "username",
        size: 150,
      },
      {
        header: "Email",
        accessorKey: "email",
        size: 250,
      },
      {
        header: "Admin Level",
        accessorKey: "admin_level",
        size: 100,
      },
    ],
    [],
  );

  const handleCreateNewRow = async (values: User) => {
    try {
      // Send a POST request to create the new user
      const response = await axios.post(
        `http://localhost:3001/api/users`,
        values,
      );

      const existingCustomerCount = data.length;

      // Calculate the next ID by adding 1 to the highest existing ID
      const nextId =
        existingCustomerCount > 0
          ? Math.max(...data.map((customer) => customer.id)) + 1
          : 1;

      // Set the calculated ID for the new customer
      const newCustomer = {
        ...values,
        id: nextId,
      };

      // Update the local state to include the newly created customer
      setData((prevData) => [...prevData, newCustomer]);

      // Close the modal or perform any other necessary actions
      setSuccessPopup("Usuario Creado Correctamente");
    } catch (error) {
      console.error("Error creating user:", error);
      setErrorPopup("No se pudo crear el usuario, intentelo mas tarde");
      // Handle error if needed
    }
  };
  return (
    <div >
      {!isLoading && (
        <div
          className=" mx-8 my-4 h-full  rounded-lg bg-white shadow"
          id="userTableWrapper"
        >
          <MaterialReactTable
            columns={columns}
            data={data}
            defaultColumn={{
              maxSize: 100,
              minSize: 80,
              size: 100,
            }}
            muiTableProps={{
              sx: {},
            }}
            muiTableBodyProps={{}}
            enableColumnResizing
            columnResizeMode="onChange"
            localization={MRT_Localization_ES}
            renderTopToolbarCustomActions={() => (
              <Button
                color="secondary"
                onClick={() => setCreateModalOpen(true)}
                variant="contained"
              >
                Crear Nuevo Usuario
              </Button>
            )}
          />
          {isLoading && (
            <div className="fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="lds-dual-ring"></div>
            </div>
          )}
          <CreateNewAccountModal
            columns={columns}
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onSubmit={handleCreateNewRow}
          />
        </div>
      )}

     
            
    </div>
  );
};

interface CreateModalProps {
  columns: MRT_ColumnDef<User>[];
  onClose: () => void;
  onSubmit: (values: User) => void;
  open: boolean;
}

//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({
  open,
  columns,
  onClose,
  onSubmit,
}: CreateModalProps) => {
  const [values, setValues] = useState<any>(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {} as any),
  );

  const newColumns = columns.slice(1); //All the columns except the ID
  const indexNew = columns.length + 1; //ID of the new borrower

  const handleSubmit = () => {
    //put your validation logic here
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Crear Nuevo Usuario</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            {newColumns.map((column) => (
              <TextField
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Crear Nuevo Cliente
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// const Reports = () => {
//   const [isLoading, setIsLoading] = useState(false);

//   const handleReports = async () => {
//     console.log("yeu");
//     setIsLoading(true);
//     try {
//       const response = await axios.get("http://localhost:3001/api/reports/email-pdf"); // Replace with your API endpoint
//       console.log(response.data);
//       const blob = new Blob([response.data], { type: "application/pdf" });
//       const url = window.URL.createObjectURL(blob);

//       // Abre una nueva ventana/tab con el PDF
//       window.open(url);
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="ml-8 h-full w-3/4 rounded-lg bg-white shadow">
//       <button
//         className="-mt-10 rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700 focus:outline-none"
//   onClick={ handleReports} // Llama a la función handleReports con ()
//       >
//         Hacer Reporte e Imprimirlo
//       </button>
//       {isLoading && (
//         <div className="fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="lds-dual-ring"></div>
//         </div>
//       )}
//     </div>
//   );
// };

// const QueryComponent: React.FC = () => {
//   const [query, setQuery] = useState<string>("");
//   const [result, setResult] = useState();

//   const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setQuery(e.target.value);
//   };

//   const executeQuery = async () => {
//     try {
//       // Simulación de una llamada a una API en el servidor Node.js
//       console.log(query)
//       const response = await fetch("http://localhost:3001/query", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ query }), // Enviar la consulta al servidor
//       });
      
      
//       if (!response.ok) {
//         throw new Error("Error al ejecutar la consulta.");
//       }
      
//       // Obtener el resultado de la respuesta JSON
//       const data = await response.json();
//       console.log(typeof(data))

//       // Actualizar el estado result con el resultado de la consulta
//       setResult(data.result);
//     } catch (error) {
//       console.error("Error al ejecutar la consulta:", error);
//       setResult("Error: No se pudo ejecutar la consulta.");
//     }
//   };

//   return (
//     <div>
//       <h1>Consulta</h1>
//       <div>
//         <input
//           type="text"
//           placeholder="Escribe tu consulta..."
//           value={query}
//           onChange={handleQueryChange}
//         />
//       </div>
//       <button onClick={executeQuery}>Ejecutar Consulta</button>
//       <h2>Resultado</h2>
//       <div>
//       <ul>
//     {result.map((item, index) => (
//       <li key={index}>{JSON.stringify(item)}</li>
//     ))}
//   </ul>      </div>
//     </div>
//   );
// };
