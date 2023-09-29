// @ts-nocheck 
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  ColumnResizeMode,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import React from 'react'

interface ReactTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
}


export const Table = <T extends object>({
  data,
  columns,
}: ReactTableProps<T>) => {
  

  const [columnResizeMode, setColumnResizeMode] =
    React.useState<ColumnResizeMode>('onChange')

    const table = useReactTable({
      data,
      columns,
      columnResizeMode,
      getCoreRowModel: getCoreRowModel(),
    });
  return (
    <div className=" h-96 overflow-scroll ">
      <table className="h-96 max-h-96 min-w-full text-center ">
        <thead className="sticky top-0 border-b bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-4 text-sm font-medium text-gray-900"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className=" ">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b bg-white">
              {row.getVisibleCells().map((cell) => (
                <td
                  className="whitespace-nowrap px-6 py-4 text-sm font-light text-gray-900"
                  key={cell.id}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
