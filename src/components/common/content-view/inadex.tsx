// components/content-view/ContentView.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid, List } from "lucide-react";
// import Dropdowns from "@/components/dropdowns";

import { useTableIsCardContext } from "@/context/table-view-context";
import CardView from "./card-view";
import TableView from "./table-view";
import CustomPagination from "./custom-pagination";
import { Card, CardContent } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export interface ColumnDef<T> {
  key: keyof T | String;
  label: string;
  width?: number;
  align?: "start" | "center" | "end";
  render?: (item: T) => React.ReactNode;
}

export interface PaginatedData<T> {
  results: T[];
  total_pages: number;
}
export interface ContentViewProps<T extends { id: React.Key }> {
  data?: PaginatedData<T>;
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  onSearch: (q: string) => void;
  onCategory?: (cat: string) => void;
  onPageSelect: (page: number) => void;
  page: number;
  SwitchView?: boolean;
  columns: ColumnDef<T>[];
}

export default function ContentView<T extends { id: React.Key }>({
  data,
  isLoading,
  isError,
  error,
  onSearch,
  onCategory,

  onPageSelect,
  page,
  SwitchView = false,

  columns,
}: ContentViewProps<T>) {
  const [inputValue, setInputValue] = useState("");
  const { IsCard, setIsCard } = useTableIsCardContext();
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (data) setTotalPages(data.total_pages);
  }, [data]);

  const handleSearch = (val: string) => {
    setInputValue(val);
    onSearch(val);
  };

  return (
    <>
      <div className="flex justify-between max-md:flex-col max-md:flex-col-reverse pb-5">
        <div className="flex items-center gap-4">
          <Input
            placeholder="ابحث هنا"
            value={inputValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-80"
            // icon={<Search size={16} />}
            // clearable
          />
          {/* {onCategory && (
            <Dropdowns
              title="كل التصنيفات"
              endpoint={`${endpoint}categories`}
              onSelectionChange={onCategory}
            />
          )} */}
        <Select direction={"rtl"}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup> 
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        </div>
        {SwitchView && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsCard(!IsCard)}
          >
            {IsCard ? <Grid size={16} /> : <List size={16} />}
          </Button>
        )}
      </div>

      {/* <hr className="border-border mt-2" /> */}

      {isLoading && !data && <div>Loading…</div>}
      {isError && !data && (
        <div>
          <p>حدث خطأ</p>
        </div>
      )}

      {data && (
        <>
          {data.results.length === 0 ? (
            <p className="py-6 text-center">لا توجد بيانات</p>
          ) : SwitchView && IsCard ? (
            <CardView<T> data={data} columns={columns} />
          ) : (
            <TableView<T> tableData={data} columns={columns} />
          )}
        </>
      )}

      {totalPages > 1 && (
        <CustomPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => {
            onPageSelect(p);
          }}
        />
      )}
    </>
  );
}
