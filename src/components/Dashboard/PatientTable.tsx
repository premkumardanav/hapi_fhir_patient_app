// components/patient/PatientTable.tsx
import React from "react";
import GenericTable from "../common/GenericTable";
import type { Column, PatientRow } from "../../utils/types";
import { Typography } from "@mui/material";

interface PatientTableProps {
  patients: PatientRow[];
  onRowClick?: (row: PatientRow) => void;
}

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
    key: "officialIdentifier",
    label: "Official Identifier",
  },
  {
    key: "usualIdentifier",
    label: "Usual Identifier",
  },
  {
    key: "addresses",
    label: "Addresses",
    render: (addresses) =>
      addresses.map((addr: any, idx: number) => (
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
];

const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  onRowClick,
}) => {
  const defaultRowClick = (patient: PatientRow) => {
    console.log("Clicked patient:", patient);
    // Navigate or open modal here
  };

  return (
    <GenericTable
      data={patients}
      columns={columns}
      onRowClick={onRowClick || defaultRowClick}
      rowsPerPageOptions={[6, 12, 18]}
    />
  );
};

export default PatientTable;
