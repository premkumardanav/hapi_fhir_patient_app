import React, { useEffect, useState, type ReactElement } from "react";
import {
  DataGrid,
  type GridColDef,
  type GridEventListener,
  GridOverlay,
  type DataGridProps,
} from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { PaginationUI } from "./PaginationUI";
import { ErrorBoundary } from "react-error-boundary";
import TableHeader from "./TableHeader";
import ErrorMessage from "./ErrorMessage";

interface CountLabel {
  singular: string;
  plural: string;
}

interface RequestResult<T> {
  data: {
    models: T[];
    totalElements: number;
  };
}

interface TableControllerProps<T> {
  requestData: (
    page: number,
    pageSize: number,
    searchText?: string
  ) => Promise<RequestResult<T>>;
  columnDefs: GridColDef[];
  pageLength?: number;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  showCount?: boolean;
  countLabel?: CountLabel;
  dataGridProps?: Partial<DataGridProps>;
  noResultsMessage?: React.ReactNode;
  onRowClick?: GridEventListener<"rowClick">;
  onCellClick?: GridEventListener<"cellClick">;
  sortComponent?: React.ReactNode;
  searchComponent?: React.ReactNode;
  filterComponent?: React.ReactNode;
  contextKey?: string;
  searchText?: string;
  autoHeight?: boolean;
}

export function TableController<T>({
  requestData,
  columnDefs,
  pageLength = 10,
  title,
  description,
  icon,
  showCount,
  countLabel = { singular: "", plural: "" },
  dataGridProps,
  noResultsMessage,
  onRowClick,
  onCellClick,
  sortComponent,
  searchComponent,
  filterComponent,
  contextKey = "",
  searchText = "",
  autoHeight = true,
}: TableControllerProps<T>): ReactElement {
  const {
    columns: _ignoredColumns,
    rows: _ignoredRows,
    ...cleanedDataGridProps
  } = dataGridProps || {};

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(pageLength);
  const [rowCount, setRowCount] = useState(0);

  const fetchData = async (currentPage: number) => {
    setLoading(true);
    try {
      const result = await requestData(currentPage, pageSize, searchText);
      setData(result.data.models);
      setRowCount(result.data.totalElements);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(page);
  }, [page, contextKey, pageSize]);

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: "12px",
        border: "1px solid var(--gray-200, #EAECF0)",
        background: "var(--base-white, #FFF)",
        boxShadow:
          "0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)",
      }}
    >
      <TableHeader
        title={title}
        description={description}
        showCount={showCount}
        countLabel={countLabel}
        icon={icon}
        sortComponent={sortComponent}
        filterComponent={filterComponent}
        searchComponent={searchComponent}
        rowCount={rowCount}
      />

      <ErrorBoundary fallback={<ErrorMessage />}>
        <DataGrid
          disableRowSelectionOnClick
          pagination
          paginationMode="server"
          rows={data}
          columns={columnDefs} // safe now
          rowCount={rowCount}
          loading={loading}
          getRowHeight={() => "auto"}
          autoHeight={autoHeight}
          pageSizeOptions={[pageSize]}
          onRowClick={(params, event, details) =>
            typeof onRowClick === "function"
              ? onRowClick(params, event, details)
              : undefined
          }
          onCellClick={(params, event, details) =>
            typeof onCellClick === "function"
              ? onCellClick(params, event, details)
              : undefined
          }
          initialState={{
            pagination: {
              paginationModel: {
                page: 0,
                pageSize: pageSize,
              },
            },
          }}
          slots={{
            noRowsOverlay: () => <GridOverlay>{noResultsMessage}</GridOverlay>,
            noResultsOverlay: () => (
              <GridOverlay>{noResultsMessage}</GridOverlay>
            ),
            pagination: () => (
              <PaginationUI
                setPage={setPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
                pageSizeOptions={[10, 50, 100]}
                borderNone={true}
              />
            ),
          }}
          sx={{
            border: "none",
            maxHeight: "780px",
            height: data?.length > 0 ? "auto" : "400px",
            "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus-within":
              {
                outline: "none",
              },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: "1px solid var(--gray-200, #EAECF0)",
              background: "#F9FAFB",
              display: "flex",
              height: "44px",
              padding: "12px 24px",
              gap: "12px",
              alignSelf: "stretch",
            },
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-row": {
              px: "24px",
              cursor: "pointer",
            },
            "& .MuiDataGrid-cell": {
              display: "inline-flex",
              padding: "8px",
              alignItems: "center",
              gap: "8px",
            },
            "& .MuiDataGrid-footerContainer": {
              padding: "12px 24px 16px 24px",
              justifyContent: "unset",
            },
            "& .MuiDataGrid-virtualScroller": {
              "&::-webkit-scrollbar": {
                width: "8px",
                height: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: (theme) => theme?.palette?.primary?.main,
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: (theme) => theme?.palette?.primary?.light,
              },
            },
          }}
          {...cleanedDataGridProps}
        />
      </ErrorBoundary>
    </Box>
  );
}
