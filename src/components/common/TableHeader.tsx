import React, { type ReactNode } from "react";
import { Box, Chip, Typography } from "@mui/material";

interface CountLabel {
  singular: string;
  plural: string;
}

interface TableHeaderProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  showCount?: boolean;
  countLabel?: CountLabel;
  sortComponent?: ReactNode;
  filterComponent?: ReactNode;
  rowCount?: number;
  searchComponent?: ReactNode;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  title,
  description,
  icon,
  showCount = false,
  countLabel = { singular: "", plural: "" },
  sortComponent,
  filterComponent,
  rowCount = 0,
  searchComponent,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        padding: "20px 24px",
        alignItems: "flex-start",
        gap: "16px",
        alignSelf: "stretch",
        borderBottom: "1px solid var(--gray-200, #EAECF0)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: "16px",
          }}
        >
          {icon}
          <Typography variant="h6">{title}</Typography>
          {showCount && (
            <Chip
              variant="outlined"
              label={
                rowCount > 1 || rowCount <= 0
                  ? `${rowCount <= 0 ? "0" : rowCount} ${countLabel?.plural}`
                  : `1 ${countLabel?.singular}`
              }
            />
          )}
        </Box>
        {description && <Typography variant="body2">{description}</Typography>}
      </Box>

      {(sortComponent || filterComponent || searchComponent) && (
        <Box
          sx={{
            display: "flex",
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 2,
          }}
        >
          {searchComponent}
          {sortComponent}
          {filterComponent}
        </Box>
      )}
    </Box>
  );
};

export default TableHeader;
