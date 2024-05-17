"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@axelor/ui";
import { TableHeadProps, TableProps } from "./types";

export const StyledHead = ({ columns }: TableHeadProps) => {
  return (
    <>
      <TableHead mb={3}>
        <TableRow>
          {columns?.map((column: any, index: number) => (
            <TableCell
              as="th"
              key={column.key}
              bgColor="dark"
              color="light"
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
      <Table>
        <StyledHead columns={columns} />
        <TableBody>{children}</TableBody>
      </Table>
    </>
  );
};

export default StyledTable;
