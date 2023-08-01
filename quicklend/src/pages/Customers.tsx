import Layout from "@components/Layout";
import axios from "axios";
import React, { useMemo, useState, useEffect } from "react";
import { Column } from "react-table"; // Import the Column type from react-table
import { ColumnDef } from '@tanstack/react-table';

import {Table} from "@components/React-Table";

interface ShowData {
  show: {
    name: string;
    type: string;
    language: string;
    genres: string[];
    runtime: number;
    status: string;
  };
}
type Item = {
  name: string;
  price: number;
  quantity: number;
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
}



export default function Customers() {
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);

  // Obtén los datos de los prestatarios desde una API al montar el componente
  useEffect(() => {
    const fetchBorrowers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/customers"); // Supongamos que la API devuelve un array de objetos con la estructura de Borrower
        setBorrowers(response.data);
      } catch (error) {
        console.error("Error fetching borrowers:", error);
      }
    };

    fetchBorrowers();
  }, []);
    
  const cols = useMemo<ColumnDef<Borrower>[]>(
    () => [
    {
      // First group - Borrower Information
      header: "Borrower Information",
      columns: [
        {
          header: "ID",
          cell: (row) => row.renderValue(),
          accessorKeyKey: "id",
        },
        {
          header: "Full Name",
          cell: (row) => row.renderValue(),
          accessorKey: "FULL_NAME",
        },
        {
          header: "Identification Number",
          cell: (row) => row.renderValue(),
          accessorKey: "IDENTIFICATION_NUMBER",
        },
        {
          header: "Phone",
          cell: (row) => row.renderValue(),
          accessorKey: "PHONE",
        },
        {
          header: "Age",
          cell: (row) => row.renderValue(),
          accessorKey: "AGE",
        },
        {
          header: "Address",
          cell: (row) => row.renderValue(),
          accessorKey: "ADDRESS",
        },
        {
          header: "Workplace",
          cell: (row) => row.renderValue(),
          accessorKey: "WORKPLACE",
        },
        {
          header: "Working Time",
          cell: (row) => row.renderValue(),
          accessorKey: "WORKING_TIME",
        },
      ],
    },
  ],
  []
 );

      const [data, setData] = useState([]);

      // Using useEffect to call the API once mounted and set the data
      useEffect(() => {
        (async () => {
          const result = await axios.get(
            "http://localhost:3001/api/customers"
          );
          setData(result.data);
        })();
      }, []);
  return (
    <Layout>
        <div className="col-span-full h-96 w-full rounded-lg bg-white px-4 py-5 shadow overflow-auto">      
        <Table columns={cols} data={borrowers} />
</div> 
    </Layout>
  )
}




