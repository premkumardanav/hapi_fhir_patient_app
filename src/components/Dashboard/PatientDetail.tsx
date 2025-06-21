import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import fhirApi from "../../middleware/fhirApi";
import EditPatientModal from "./EditPatientModal";

interface PatientDetailData {
  id: string;
  name: string;
  gender?: string;
  birthDate?: string;
  identifiers?: Array<{
    use: string;
    value: string;
  }>;
  addresses?: Array<{
    use: string;
    type: string;
    line: string[];
    city: string;
    state?: string;
    postalCode: string;
    country?: string;
  }>;
  telecom?: Array<{
    system: string;
    value: string;
    use?: string;
  }>;
  maritalStatus?: {
    text: string;
  };
  contact?: Array<{
    relationship?: Array<{
      text: string;
    }>;
    name?: {
      given: string[];
      family: string;
    };
    telecom?: Array<{
      system: string;
      value: string;
    }>;
  }>;
}

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PatientDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchPatientDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await fhirApi.get(`/Patient/${id}`);
      setPatient(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.issue?.[0]?.diagnostics ||
          "Failed to fetch patient details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientDetails();
  }, [id]);

  const handleBackToList = () => {
    navigate("/dashboard");
  };

  const handleEditPatient = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    // Refresh patient details
    fetchPatientDetails();
  };

  const formatName = (name: any) => {
    if (!name || !name.length) return "N/A";
    const nameObj = name[0];
    if (nameObj.text) return nameObj.text;
    const given = nameObj.given?.join(" ") || "";
    const family = nameObj.family || "";
    return `${given} ${family}`.trim() || "N/A";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={handleBackToList}>
          Back to Patient List
        </Button>
      </Box>
    );
  }

  if (!patient) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          Patient not found
        </Typography>
        <Button variant="contained" onClick={handleBackToList} sx={{ mt: 2 }}>
          Back to Patient List
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Button variant="outlined" onClick={handleBackToList}>
          ← Back to Patient List
        </Button>
        <Typography variant="h4">Patient Details</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleEditPatient}
          sx={{ ml: "auto" }}
        >
          Edit Patient
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Patient ID
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {patient.id}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Full Name
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {formatName(patient.name)}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Gender
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {patient.gender
                      ? patient.gender.charAt(0).toUpperCase() +
                        patient.gender.slice(1)
                      : "N/A"}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Birth Date
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {formatDate(patient.birthDate || "")}
                  </Typography>
                </Box>
                {patient.maritalStatus && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Marital Status
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {patient.maritalStatus.text}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Identifiers */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Identifiers
                </Typography>
                {patient.identifiers && patient.identifiers.length > 0 ? (
                  patient.identifiers.map((identifier, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Chip
                        label={identifier.use}
                        size="small"
                        color="primary"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body1">
                        {identifier.value}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No identifiers available
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Contact Information */}
          {patient.telecom && patient.telecom.length > 0 && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Contact Information
                  </Typography>
                  {patient.telecom.map((contact, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Chip
                        label={contact.system}
                        size="small"
                        color="secondary"
                        sx={{ mr: 1 }}
                      />
                      {contact.use && (
                        <Chip
                          label={contact.use}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 1 }}
                        />
                      )}
                      <Typography variant="body1">{contact.value}</Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Addresses */}
          {patient.addresses && patient.addresses.length > 0 && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Addresses
                  </Typography>
                  {patient.addresses.map((address, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Box sx={{ mb: 1 }}>
                        <Chip
                          label={address.use}
                          size="small"
                          color="primary"
                          sx={{ mr: 1 }}
                        />
                        <Chip
                          label={address.type}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="body1">
                        {address.line?.join(", ")}
                      </Typography>
                      <Typography variant="body1">
                        {[
                          address.city,
                          address.state,
                          address.postalCode,
                          address.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Emergency Contacts */}
          {patient.contact && patient.contact.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Emergency Contacts
                  </Typography>
                  {patient.contact.map((contact, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      {contact.relationship && (
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Relationship
                          </Typography>
                          <Typography variant="body1">
                            {contact.relationship[0]?.text}
                          </Typography>
                        </Box>
                      )}
                      {contact.name && (
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Contact Name
                          </Typography>
                          <Typography variant="body1">
                            {formatName([contact.name])}
                          </Typography>
                        </Box>
                      )}
                      {contact.telecom && contact.telecom.length > 0 && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Contact Information
                          </Typography>
                          {contact.telecom.map((telecom, telecomIndex) => (
                            <Typography key={telecomIndex} variant="body1">
                              {telecom.system}: {telecom.value}
                            </Typography>
                          ))}
                        </Box>
                      )}
                      {index < patient.contact.length - 1 && (
                        <Divider sx={{ mt: 2 }} />
                      )}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Paper>

      <EditPatientModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
        patient={patient}
      />
    </Box>
  );
};

export default PatientDetail;
