import React from "react";
import { Box, Typography } from "@mui/material";

const ErrorMessage: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        alignSelf: "stretch",
        flex: 1,
        justifyContent: "center",
        padding: "48px 24px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "40px",
          height: "40px",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
          borderRadius: "28px",
          border: "6px solid #FEF3F2",
          background: "#FEE4E2",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <g clipPath="url(#clip0_3465_408495)">
            <path
              d="M10 6.66663V9.99996M10 13.3333H10.0083M18.3333 9.99996C18.3333 14.6023 14.6024 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6023 1.66667 9.99996C1.66667 5.39759 5.39763 1.66663 10 1.66663C14.6024 1.66663 18.3333 5.39759 18.3333 9.99996Z"
              stroke="#D92D20"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_3465_408495">
              <rect width="20" height="20" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </Box>
      <Typography variant="body2">Unable to load table</Typography>
    </Box>
  );
};

export default ErrorMessage;
