// components/content-view/TableView.tsx
import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ColumnDef, PaginatedData } from "./inadex";
import { Card, CardContent } from "../ui/card";
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
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted ">
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  className="!text-start"
                  key={String(col.key)}
                  style={{ width: col.width, textAlign: col.align }}
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:first:w-8">
            {tableData.results.map((item) => (
              <TableRow
                key={item.id}
                className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
              >
                {columns.map((col) => {
                  // If it's our "actions" column, we only run render()
                  if (col.key === "actions") {
                    return (
                      <TableCell
                        key="actions"
                        className={cn(col.width ? `w-[${col.width}px]` : "")}
                        style={{ textAlign: col.align }}
                      >
                        {col.render?.(item)}
                      </TableCell>
                    );
                  }

                  // Otherwise col.key is guaranteed to be keyof T
                  const dataKey = col.key as keyof T;
                  const value = col.render
                    ? col.render(item)
                    : String(item[dataKey] ?? "");

                  return (
                    <TableCell
                      key={String(col.key)}
                      className={cn(col.width ? `w-[${col.width}px]` : "")}
                      style={{ width: col.width, textAlign: col.align }}
                    >
                      {value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
