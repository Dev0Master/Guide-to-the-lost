// components/content-view/TableView.tsx
import React from "react";
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableHead,
//   TableCell,
// } from "@/components/ui/table";
import { ColumnDef, PaginatedData } from "./index";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface TableViewProps<T extends { id: React.Key }> {
  tableData: PaginatedData<T>;
  columns: ColumnDef<T>[];
}

export default function TableView<T extends { id: React.Key }>({
  tableData,
  columns,
}: TableViewProps<T>) {
  return (
    <Card className="p-2">
      <CardContent className="p-2 ">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  className="text-start p-2 border-b"
                  key={String(col.key)}
                  style={{ width: col.width, textAlign: col.align }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.results.map((item) => (
              <tr
                key={item.id}
                className="relative z-0 hover:bg-gray-50"
              >
                {columns.map((col) => {
                  // If it's our "actions" column, we only run render()
                  if (col.key === "actions") {
                    return (
                      <td
                        key="actions"
                        className={cn(col.width ? `w-[${col.width}px]` : "", "p-2 border-b")}
                        style={{ textAlign: col.align }}
                      >
                        {col.render?.(item)}
                      </td>
                    );
                  }

                  // Otherwise col.key is guaranteed to be keyof T
                  const dataKey = col.key as keyof T;
                  const value = col.render
                    ? col.render(item)
                    : String(item[dataKey] ?? "");

                  return (
                    <td
                      key={String(col.key)}
                      className={cn(col.width ? `w-[${col.width}px]` : "", "p-2 border-b")}
                      style={{ width: col.width, textAlign: col.align }}
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
