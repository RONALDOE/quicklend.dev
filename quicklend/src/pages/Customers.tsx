import Layout from "@components/Layout";
import axios from "axios";
import useSound from 'use-sound';
import { useNavigate } from 'react-router-dom';
import sucessSFX from '@assets/sounds/sucess.mp3';
import errorSFX from '@assets/sounds/error.mp3';
import React, { useCallback, useMemo, useState, useEffect } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
  type MRT_Row,
  type MRT_SortingState,
  type MRT_ColumnFiltersState,
} from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
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

// Definición de la interfaz Borrower
interface Borrower {
  id: number;
  FULL_NAME: string;
  IDENTIFICATION_NUMBER: string;
  PHONE: string;
  AGE: string;
  SEX: string;
  ADDRESS: string;
  WORKPLACE: string;
  WORKING_TIME: string;
  STATUS: string | null;
}

export default function Customers() {
  // Estado para el modal de creación
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [errorPopup, setErrorPopup] = useState<string | null>(null);
  const [successPopup, setSuccessPopup] = useState<string | null>(null);

  // Estado para los datos de la tabla
  const [data, setData] = useState<Borrower[]>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefetching, setIsRefetching] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  // Estado para el filtrado y ordenamiento de la tabla
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const suenalo = useSound();

  // Funciones de validación para el formulario
  const validateRequired = (value: string) => !!value.length;
  const validateEmail = (email: string) =>
    !!email.length &&
    email.toLowerCase().match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
  const validateAge = (age: number) => age >= 18 && age <= 50;
  const [playSuccessSound] = useSound(sucessSFX);

  // Handler para crear una nueva fila en la tabla
  const handleCreateNewRow = async (values: Borrower) => {
    try {
      // Send a POST request to create the new user
      const response = await axios.post(
        `http://localhost:3001/api/borrowers`,
        values
      );

      const existingCustomerCount = data.length;

      // Calculate the next ID by adding 1 to the highest existing ID
      const nextId = existingCustomerCount > 0 ? Math.max(...data.map(customer => customer.id)) + 1 : 1;

      // Set the calculated ID for the new customer
      const newCustomer = {
        ...values,
        id: nextId
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

  // Handler para guardar una fila editada en la tabla
  const handleSaveRow = async ({
    exitEditingMode,
    row,
    values,
  }: {
    exitEditingMode: () => void;
    row: MRT_Row<Borrower>;
    values: any; // Asegúrate de utilizar el tipo correcto para 'values'
  }) => {
    setIsLoading(true);
    // Modify this function to send the updated data to the API
    try {
      // Assuming you have an API endpoint to update the data, you can use axios or fetch to make the API call.
      // For example, if you have an API endpoint like 'http://localhost:3001/api/person/:id' to update a single person by id:
      await axios.put(
        `http://localhost:3001/api/borrowers/${row.original.id}`,
        values,
      );
      setIsLoading(true);

      // Update the state with the updated person data (optional, depending on your needs)
      setData((prevData) => {
        const newData = [...prevData];
        newData[row.index] = values;
        return newData;
      });

      playSuccessSound();
      setSuccessPopup("Usuario Editado Correctamente");
      setIsLoading(false);

      exitEditingMode();

    } catch (error) {
      console.error("Error updating person:", error);
      setErrorPopup("No se pudo editar el usuario, intentelo mas tarde");
      // Handle error if needed
    }
  };

  // Handler para eliminar una fila de la tabla
  const handleDeleteRow = useCallback(
    (row: MRT_Row<Borrower>) => {
      if (!window.confirm(`Seguro que quieres Desactvar el cliente: ${row.getValue("FULL_NAME")}?`)) {
        return;
      }
      try {
        setIsLoading(true);

        if (row.getValue("STATUS") !== 'Activo') {
          axios.put(`http://localhost:3001/api/borrowers/${row.original.id}/active`);
        } else {
          axios.put(`http://localhost:3001/api/borrowers/${row.original.id}/inactive`);
        }
        setData([...data]);
        playSuccessSound();
        setSuccessPopup("Estatus Cambiado Correctamente");

      } catch (error) {
        setErrorPopup(`No se pudo cambiar el estado del usuario, intente de nuevo mas tarde \n\n ${error}}`);
        console.error("Error updating person:", error);
        // Handle error if needed
      }
    },
    [data],
  );

  const history = useNavigate();

  // Obtén los datos de los prestatarios desde una API al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3001/api/borrowers");
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        setErrorPopup(`Los datos no se pudieron cargar correctamente \n\n ${error}`);
        console.error("Error fetching borrowers:", error);

      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isLoading]);

  // Columnas de la tabla
  const columns = useMemo<MRT_ColumnDef<Borrower>[]>(
    () => [
      {
        header: "ID",
        accessorKey: "id",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
      },
      {
        header: "Nombre Completo",
        accessorKey: "FULL_NAME",
      },
      {
        header: "Cedula",
        accessorKey: "IDENTIFICATION_NUMBER",
      },
      {
        header: "Telefono",
        accessorKey: "PHONE",
      },
      {
        header: "Edad",
        accessorKey: "AGE",
      },
      {
        header: "Direccion",
        accessorKey: "ADDRESS",
      },
      {
        header: "Lugar de trabajo",
        accessorKey: "WORKPLACE",
      },
      {
        header: "Tiempo Trabajando",
        accessorKey: "WORKING_TIME",
      }, {
        header: "Estado",
        accessorKey: "STATUS",
      },
    ],
    [],
  );

  return (
    <Layout>
      {!isLoading && (
        <div className="h-full rounded-lg bg-white shadow">
          <MaterialReactTable
            displayColumnDefOptions={{
              "mrt-row-actions": {
                muiTableHeadCellProps: {
                  align: "center",
                },
                size: 120,
              },
            }}
            columns={columns}
            data={data}
            //optionally override the default column widths
            defaultColumn={{
              maxSize: 400,
              minSize: 80,
              size: 150, //default size is usually 180
            }}

            muiTableBodyRowProps={({ row }) => ({
              onClick: () => {
                history(`/customers/${row.getValue("id")}`);
              },
              sx: {
                cursor: 'pointer', //you might want to change the cursor too when adding an onClick
              },
            })}

            enableColumnResizing
            columnResizeMode="onChange" //default
            enableEditing={true}

            localization={MRT_Localization_ES}
            onEditingRowSave={handleSaveRow}
            renderRowActions={({ row, table }) => (
              <Box sx={{ display: "flex", gap: "1rem" }}>
                <Tooltip arrow placement="left" title="Edit">
                  <IconButton onClick={() => table.setEditingRow(row)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow placement="right" title={row.getValue("STATUS")}>
                  <IconButton color={row.getValue("STATUS") === "Activo" ? "success" : "error"} onClick={() => handleDeleteRow(row)}>
                    {row.getValue("STATUS") === "Activo" ? <CheckCircleIcon /> : <CancelIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
            )}
            renderTopToolbarCustomActions={() => (
              <Button
                color="secondary"
                onClick={() => setCreateModalOpen(true)}
                variant="contained"
              >
                Crear Nuevo Cliente
              </Button>
            )}
          />
          <CreateNewAccountModal
            columns={columns}
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onSubmit={handleCreateNewRow}
          />
        </div>
      )}
      {errorPopup && (
        <div className="fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded bg-white w-96 px-2 py-2 shadow-md flex flex-col">
            <p className="text-center text-xl font-bold mt-4 mb-10">{errorPopup}</p>

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
        <div className="fixed bottom-0 z-50 left-0 right-0 top-0 flex  items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-96 px-2 py-2 rounded flex flex-col">
            <p className="text-center text-xl font-bold mt-4 mb-10">{successPopup}</p>
            <div className="o-circle c-container__circle o-circle__sign--success">
              <div className="o-circle__sign"></div>
            </div>
            <button
              className="rounded bg-green-600 px-3 py-1 -mt-10 text-white hover:bg-green-700 focus:outline-none"
              onClick={() => {
                setSuccessPopup(null);
              }}
            >
              Continuar
            </button>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="fixed bottom-0 left-0 right-0 top-0 flex  items-center justify-center bg-black bg-opacity-50">
          <div className="lds-dual-ring"></div>
        </div>
      )}
    </Layout>
  );
}

// ... Resto del código ...

interface CreateModalProps {
  columns: MRT_ColumnDef<Borrower>[];
  onClose: () => void;
  onSubmit: (values: Borrower) => void;
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
      <DialogTitle textAlign="center">Crear Nuevo Cliente</DialogTitle>
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
                type={column.accessorKey === "AGE" ? "number" : "text" } 
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

const validateRequired = (value: string) => !!value.length;
const validateEmail = (email: string) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
const validateAge = (age: number) => age >= 18 && age <= 50;