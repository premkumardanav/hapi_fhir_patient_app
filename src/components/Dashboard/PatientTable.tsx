// components/patient/PatientTable.tsx
import React from "react";
import GenericTable from "../common/GenericTable";
import type { Column, PatientRow, Address } from "../../utils/types";
import { Typography, Button, Stack, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface PatientTableProps {
  patients: PatientRow[];
  onRowClick?: (row: PatientRow) => void;
  onDeletePatient?: (patientId: string) => void;
}

const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  onRowClick,
  onDeletePatient,
}) => {
  const navigate = useNavigate();

  const defaultRowClick = (patient: PatientRow) => {
    console.log("Clicked patient:", patient);
    // Navigate or open modal here
  };

  const handleEditClick = (e: React.MouseEvent, patient: PatientRow) => {
    e.stopPropagation(); // Prevent row click
    navigate(`/patient/${patient.id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent, patient: PatientRow) => {
    e.stopPropagation(); // Prevent row click
    if (onDeletePatient) {
      onDeletePatient(patient.id);
    }
  };

  // Check if patient is editable (has required fields)
  const isPatientEditable = (patient: PatientRow) => {
    return patient.name && patient.name.trim() !== "";
  };

  // Check if patient is deletable (has an ID and is not a system patient)
  const isPatientDeletable = (patient: PatientRow) => {
    return (
      patient.id && !patient.id.startsWith("system-") && patient.id.length > 0
    );
  };

  // Filter patients to show only those with names
  const patientsWithNames = patients.filter(
    (patient) => patient.name && patient.name.trim() !== ""
  );

  const columns: Column<PatientRow>[] = [
    {
      key: "srNo",
      label: "Sr No",
      render: (_value, _row, index) => index + 1,
    },
    {
      key: "name",
      label: "Full Name",
    },
    {
      key: "addresses",
      label: "Addresses",
      render: (addresses) =>
        addresses.map((addr: Address, idx: number) => (
          <div key={idx} style={{ marginBottom: 8 }}>
            <Typography variant="body2">
              <b>Use:</b> {addr.use}, <b>Type:</b> {addr.type}
            </Typography>
            <Typography variant="body2">
              {addr.line}, {addr.city}, {addr.state || ""} {addr.postalCode},{" "}
              {addr.country || ""}
            </Typography>
          </div>
        )),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_value, patient) => (
        <Stack direction="row" spacing={1}>
          {isPatientEditable(patient) && (
            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={(e) => handleEditClick(e, patient)}
              sx={{ minWidth: "auto", px: 1 }}
            >
              Edit
            </Button>
          )}
          {isPatientDeletable(patient) && (
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={(e) => handleDeleteClick(e, patient)}
              sx={{ minWidth: "auto", px: 1 }}
            >
              Delete
            </Button>
          )}
          {!isPatientEditable(patient) && !isPatientDeletable(patient) && (
            <Chip
              label="Read Only"
              size="small"
              color="default"
              variant="outlined"
            />
          )}
        </Stack>
      ),
    },
  ];

  return (
    <GenericTable
      data={patientsWithNames}
      columns={columns}
      onRowClick={onRowClick || defaultRowClick}
      rowsPerPageOptions={[10, 20]}
      initialRowsPerPage={10}
      stickyHeader={true}
      maxHeight="100%"
    />
  );
};

export default PatientTable;
