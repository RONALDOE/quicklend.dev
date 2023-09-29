// @ts-nocheck 
import Layout from "@components/Layout";
import axios from "axios";
import useSound from "use-sound";
import { useNavigate } from "react-router-dom";
import sucessSFX from "@assets/sounds/sucess.mp3";
import errorSFX from "@assets/sounds/error.mp3";
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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import RecommendIcon from "@mui/icons-material/Recommend";
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

interface Loan {
  id: number;
  borrowerName: string;
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

export default function Customers() {
  // Estado para el modal de creación
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [errorPopup, setErrorPopup] = useState<string | null>(null);
  const [successPopup, setSuccessPopup] = useState<string | null>(null);
  // Estado para los datos de la tabla
  const [data, setData] = useState<Loan[]>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefetching, setIsRefetching] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  // Estado para el filtrado y ordenamiento de la tabla
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Handler para crear una nueva fila en la tabla

  // Handler para guardar una fila editada en la tabla

  // Obtén los datos de los prestatarios desde una API al montar el componente

  let r = 0;
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3001/api/loans");
        const jsonData = await response.json();
        setData(jsonData);
        setIsLoading(false);
        r++;
        console.log(r);
      } catch (error) {
        setErrorPopup(
          `Los datos no se pudieron cargar correctamente \n\n ${error}`,
        );
        setIsLoading(false);

        console.error("Error fetching borrowers:", error);
      }
    };

    fetchData();
  }, []);

  const columns = useMemo<MRT_ColumnDef<Loan>[]>(
    () => [
      {
        header: "ID",
        accessorKey: "id",
        enableColumnOrdering: false,
        enableSorting: false,
        size: 5,
        align: "center",
      },
      {
        header: "Nombre Cliente",
        accessorKey: "borrowerName",
        size: 180,
      },
      {
        header: "Prestado",
        accessorKey: "importeCredito",
        size: 136,
      },
      {
        header: "Modalidad",
        accessorKey: "modalidad",
        size: 146,
      },
      {
        header: "Tasa",
        accessorKey: "tasa",
        size: 107,
      },
      {
        header: "N. Cuotas",
        accessorKey: "numCuotas",
        size: 145,
      },
      {
        header: "C. Modalidad",
        accessorKey: "cuotasSegunModalidad",
        size: 145,
      },
      {
        header: "Importe Cuota",
        accessorKey: "importeCuotas",
        size: 180,
      },
      {
        header: "Total A Pagar",
        accessorKey: "totalAPagar",
        size: 180,
      },

      {
        header: "Fecha",
        accessorKey: "fecha",
      },

      {
        header: "Pagos Hechos",
        accessorKey: "paymentsMade",
      },
      {
        header: "Pagos Pendientes",
        accessorKey: "remainingPayments",
      },
      {
        header: "Estado",
        accessorKey: "loanStatus",
      },
    ],
    [],
  );

  return (
    <Layout>
      {!isLoading && (
        <div className="h-full rounded-lg bg-white shadow ">
          <MaterialReactTable
            enableRowActions
            columns={columns}
            data={data}
            //optionally override the default column widths
            defaultColumn={{
              maxSize: 400,
              minSize: 80,
              size: 150, //default size is usually 180
            }}
            enableColumnResizing
            columnResizeMode="onChange" //default
            localization={MRT_Localization_ES}
            renderRowActions={({ row, table }) => (
              <Box sx={{ display: "flex", gap: "1rem" }}>
                <Tooltip
                  arrow
                  placement="right"
                  title={row.getValue("loanStatus")}
                >
                  <IconButton
                    color={
                      row.getValue("loanStatus") === "Completed"
                        ? "primary" // Cambia el color a 'primary' cuando 'loanStatus' es 'Completed'
                        : row.getValue("loanStatus") === "Pending"
                        ? "secondary" // Cambia el color a 'secondary' cuando 'loanStatus' es 'Pending'
                        : row.getValue("loanStatus") === "Rejected"
                        ? "error" // Cambia el color a 'error' cuando 'loanStatus' es 'Rejected'
                        : row.getValue("loanStatus") === "Approved"
                        ? "success" // Cambia el color a 'success' cuando 'loanStatus' es 'Approved'
                        : "default" // Cambia a otro color predeterminado si no coincide con ninguno de los casos anteriores
                    }
                  >
                    {row.getValue("loanStatus") === "Completed" ? (
                      <CheckCircleIcon />
                    ) : row.getValue("loanStatus") === "Pending" ? (
                      <PendingIcon />
                    ) : row.getValue("loanStatus") === "Rejected" ? (
                      <CancelIcon />
                    ) : row.getValue("loanStatus") === "Approved" ? (
                      <RecommendIcon />
                    ) : (
                      "No icon"
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          />
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
