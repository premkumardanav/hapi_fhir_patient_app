import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import PatientListContainer from "./PatientListContainer";
import { useState } from "react";
import CreatePatientModal from "./CreatePatientModal";

const HomePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filterOptions = [
    { value: "", label: "All Patients" },
    { value: "_language=English", label: "English Language" },
    { value: "identifier=MR", label: "Medical Record Number" },
    { value: "_language=English&identifier=MR", label: "English + MR Number" },
    { value: "gender=male", label: "Male Patients" },
    { value: "gender=female", label: "Female Patients" },
    { value: "active=true", label: "Active Patients" },
  ];

  const handleCreatePatient = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleFilterChange = (event: any) => {
    setSelectedFilter(event.target.value);
  };

  const handleSearchChange = (event: any) => {
    setSearchQuery(event.target.value);
  };

  const getSearchParams = () => {
    const params = [];

    if (searchQuery.trim()) {
      params.push(`name=${encodeURIComponent(searchQuery.trim())}`);
    }

    if (selectedFilter) {
      params.push(selectedFilter);
    }

    return params.join("&");
  };

  return (
    <Box sx={{ height: "80vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h5">Patient Management</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Search by Name"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Enter patient name..."
              sx={{ minWidth: 200 }}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filter Patients</InputLabel>
              <Select
                value={selectedFilter}
                label="Filter Patients"
                onChange={handleFilterChange}
              >
                {filterOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreatePatient}
            >
              Create Patient
            </Button>
          </Stack>
        </Stack>
      </Box>
      <Box sx={{ flex: 1, px: 2, pb: 3, overflow: "hidden" }}>
        <PatientListContainer searchParams={getSearchParams()} />
      </Box>
      <CreatePatientModal
        open={isCreateModalOpen}
        onClose={handleCloseModal}
        onSuccess={() => {
          handleCloseModal();
        }}
      />
    </Box>
  );
};

export default HomePage;
