// components/Dashboard.tsx
import { Box, Typography } from "@mui/material";
import PatientListContainer from "./PatientListContainer";

const HomePage = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Patient Dashboard
      </Typography>
      <Typography>Welcome to the dashboard!</Typography>
      <Box>
        <PatientListContainer />
      </Box>
    </Box>
  );
};

export default HomePage;
