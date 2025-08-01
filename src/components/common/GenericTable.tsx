import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import type { GenericTableProps } from "../../utils/types";

const GenericTable = <T extends { id?: string | number }>({
  data,
  columns,
  rowsPerPageOptions = [10, 15, 20],
  initialRowsPerPage = 10,
  onRowClick,
  stickyHeader = false,
  maxHeight,
  showPagination = true,
}: GenericTableProps<T>) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // If pagination is disabled, show all data
  const tableData = showPagination
    ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : data;

  return (
    <Paper
      sx={{
        height: maxHeight || "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TableContainer sx={{ flex: 1, maxHeight: maxHeight || "none" }}>
        <Table stickyHeader={stickyHeader}>
          <TableHead>
            <TableRow>
              {columns?.map((col) => (
                <TableCell
                  key={col.key.toString()}
                  align={col.align || "left"}
                  sx={{
                    backgroundColor: stickyHeader
                      ? "background.paper"
                      : "inherit",
                    position: stickyHeader ? "sticky" : "static",
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <b>{col.label}</b>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData?.map((row, rowIndex) => (
              <TableRow
                key={row.id || rowIndex}
                hover
                onClick={() => onRowClick?.(row)}
                style={{ cursor: onRowClick ? "pointer" : "default" }}
              >
                {columns.map((col, colIndex) => {
                  const value = (row as any)[col.key];
                  return (
                    <TableCell key={colIndex} align={col.align || "left"}>
                      {col.render ? col.render(value, row, rowIndex) : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {showPagination && (
        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      )}
    </Paper>
  );
};

export default GenericTable;
