import { useEffect, useState } from "react";
import PatientTable from "./PatientTable";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { transformFHIRPatients } from "../../utils/types";
import fhirApi from "../../middleware/fhirApi";

interface Patient {
  id: string;
  name: string;
  officialIdentifier?: string;
  usualIdentifier?: string;
  addresses: {
    use: string;
    type: string;
    line: string;
    city: string;
    state?: string;
    postalCode: string;
    country?: string;
  }[];
}

interface PatientListContainerProps {
  searchParams?: string;
}

const PatientListContainer = ({ searchParams }: PatientListContainerProps) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const navigate = useNavigate();

  const fetchPatients = async () => {
    try {
      const url = searchParams ? `/Patient?${searchParams}` : "/Patient";
      const response = await fhirApi.get(url);
      console.log("Raw FHIR response:", response.data.entry);
      const transformed = transformFHIRPatients(response.data.entry || []);
      console.log("Transformed patients:", transformed);
      setPatients(transformed);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [searchParams]);

  const handleRowClick = (patient: Patient) => {
    navigate(`/patient/${patient.id}`);
  };

  const handleDeletePatient = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    if (patient) {
      setPatientToDelete(patient);
      setDeleteDialogOpen(true);
      setDeleteError("");
    }
  };

  const handleConfirmDelete = async () => {
    if (!patientToDelete) return;

    setDeleteLoading(true);
    setDeleteError("");

    try {
      await fhirApi.delete(`/Patient/${patientToDelete.id}`);
      setDeleteDialogOpen(false);
      setPatientToDelete(null);
      // Refresh the patient list
      fetchPatients();
    } catch (error: any) {
      setDeleteError(
        error.response?.data?.issue?.[0]?.diagnostics ||
          "Failed to delete patient"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setPatientToDelete(null);
    setDeleteError("");
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <PatientTable
        patients={patients}
        onRowClick={handleRowClick}
        onDeletePatient={handleDeletePatient}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Patient</DialogTitle>
        <DialogContent>
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}
          <Typography>
            Are you sure you want to delete the patient{" "}
            <strong>{patientToDelete?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone. The patient will be permanently
            removed from the system.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Delete Patient"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientListContainer;
