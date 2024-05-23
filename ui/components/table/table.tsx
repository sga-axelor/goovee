"use client";

import React from "react";
import { TableHeadProps, TableProps } from "./types";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";

export const StyledHead = ({ columns }: TableHeadProps) => {
  
  return (
    <>
      <TableHead className="mb-3 ">
        <TableRow>
          {columns?.map((column: any, index: number) => (
            <TableCell
             
              key={column.key}
              
              className="bg-background text-primary text-base font-semibold"
              style={{
                paddingInline: "24px",
                border: "none",
                borderRadius:
                  index === 0
                    ? "8px 0px 0px 8px"
                    : index === columns.length - 1
                    ? "0 8px 8px 0"
                    : "",
              }}
            >
              {column.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    </>
  );
};

export const StyledTable = ({ columns, children }: TableProps) => {
  return (
    <>
      <Table className="w-full">
        <StyledHead columns={columns} />
        <TableBody>{children}</TableBody>
      </Table>
    </>
  );
};

export default StyledTable;
