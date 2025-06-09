import React from "react";
import {
  Box,
  Button,
  useTheme,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid";

interface PaginationUIProps {
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  pageSizeOptions?: number[];
  pageSize?: number;
  borderNone?: boolean;
}

export const PaginationUI: React.FC<PaginationUIProps> = ({
  setPage,
  setPageSize,
  pageSizeOptions = [],
  pageSize = 10,
  borderNone = false,
}) => {
  const apiRef = useGridApiContext();
  const theme = useTheme();
  const paginationState = apiRef.current.state.pagination.paginationModel;
  const totalRowCount = apiRef.current.state.rows.totalRowCount;
  const pageCount = Math.ceil(totalRowCount / paginationState.pageSize);
  const currentPage = paginationState.page;

  let adjustedPageSizeOptions = [...pageSizeOptions];
  let adjustedPageSize = pageSize;

  if (pageCount < pageSize) {
    adjustedPageSizeOptions = [10];
    adjustedPageSize = 10;
  }

  const handleChangePage = (_event: React.MouseEvent | null, value: number) => {
    apiRef.current.setPage(value);
    setPage(value);
  };

  const handleChangePageSize = (e: SelectChangeEvent<string | number>) => {
    const newPageSize = parseInt(e.target.value as string);
    setPageSize(newPageSize);
    setPage(currentPage);
  };

  const getPaginationRange = () => {
    const totalPages = Math.ceil(totalRowCount / pageSize);
    const siblingCount = 1;
    const totalDisplayedPages = 6;

    const range: (number | "ellipsis")[] = [];

    if (totalPages <= totalDisplayedPages) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
      return range;
    }

    const left = Math.max(2, currentPage + 1 - siblingCount);
    const right = Math.min(totalPages - 1, currentPage + 1 + siblingCount);

    range.push(1);
    if (left > 2) range.push("ellipsis");

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < totalPages - 1) range.push("ellipsis");
    range.push(totalPages);

    return range;
  };

  const pages = getPaginationRange();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flex: 1,
        justifyContent: "space-between",
      }}
    >
      <Button
        onClick={() => handleChangePage(null, currentPage - 1)}
        disabled={currentPage === 0}
        variant="contained" // Use a standard MUI variant
        color="primary" // Use a standard MUI color
        sx={{
          // Add custom styles to mimic your design
          backgroundColor: "#your-custom-color",
          color: "#your-text-color",
          // other custom styles
        }}
        startIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M15.8334 9.99996H4.16675M4.16675 9.99996L10.0001 15.8333M4.16675 9.99996L10.0001 4.16663"
              stroke="#344054"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      >
        Previous
      </Button>

      <Box sx={{ display: "flex", alignItems: "center", gap: "2px" }}>
        {adjustedPageSizeOptions.length > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", mr: "20px" }}>
            <InputLabel id="page-size">
              <Typography>Rows per page :</Typography>
            </InputLabel>

            <Select
              labelId="page-size"
              id="page-size-select"
              label="pageSize"
              value={adjustedPageSize}
              onChange={handleChangePageSize}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  border: borderNone ? "none" : undefined,
                },
              }}
            >
              {adjustedPageSizeOptions.map((value) => (
                <MenuItem key={value} value={value}>
                  <Typography>{value}</Typography>
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}

        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <Box key={`ellipsis_${index}`} sx={{ alignSelf: "center", px: 1 }}>
              …
            </Box>
          ) : (
            <Button
              key={`page_${page}_${index}`}
              onClick={() => handleChangePage(null, page - 1)}
              variant="contained"
              color={currentPage === page - 1 ? "primary" : "secondary"}
              sx={{
                height: "40px",
                width: "40px",
              }}
            >
              {page}
            </Button>
          )
        )}
      </Box>

      <Button
        onClick={() => handleChangePage(null, currentPage + 1)}
        disabled={currentPage === pageCount - 1}
        variant="contained"
        color="primary"
        endIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M4.16675 9.99996H15.8334M15.8334 9.99996L10.0001 4.16663M15.8334 9.99996L10.0001 15.8333"
              stroke="#344054"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      >
        Next
      </Button>
    </Box>
  );
};
