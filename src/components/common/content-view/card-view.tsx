// components/content-view/CardView.tsx
"use client";
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ColumnDef, PaginatedData } from "./index";
 

export interface CardViewProps<T extends { id: React.Key }> {
  data: PaginatedData<T>;
  columns: ColumnDef<T>[];
}

export default function CardView<T extends { id: React.Key }>({
  data,
  columns,
}: CardViewProps<T>) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {data.results.map((item) => (
        <Card key={item.id} className="p-2">
          <CardContent className="   p-2">
            {columns.map((col) => {
              if (col.key === "actions") return null;

              const dataKey = col.key as keyof T;
              return (
                <div key={String(col.key)}>
                  <span className="font-semibold">{col.label}: </span>
                  <span>
                    {col.render
                      ? col.render(item)
                      : String(item[dataKey] ?? "")}
                  </span>
                </div>
              );
            })}
          </CardContent>

          {/* render the actions footer if defined */}
          {columns.some((c) => c.key === "actions") && (
            <CardFooter className="flex justify-end p-2">
              {columns
                .filter((c) => c.key === "actions" && c.render)
                .map((c) => c.render!(item))}
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}
