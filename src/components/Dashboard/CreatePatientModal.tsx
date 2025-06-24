import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import fhirApi from "../../middleware/fhirApi";

interface CreatePatientModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface PatientFormData {
  givenName: string;
  familyName: string;
  gender: string;
  birthDate: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const CreatePatientModal: React.FC<CreatePatientModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PatientFormData>({
    givenName: "",
    familyName: "",
    gender: "",
    birthDate: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: keyof PatientFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const patientResource = {
        resourceType: "Patient",
        text: {
          status: "generated",
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><table class="hapiPropertyTable"><tbody/></table></div>',
        },
        name: [
          {
            use: "official",
            given: [formData.givenName],
            family: formData.familyName,
          },
        ],
        gender: formData.gender,
        birthDate: formData.birthDate,
        address: formData.addressLine
          ? [
              {
                use: "home",
                type: "physical",
                line: [formData.addressLine],
                city: formData.city,
                state: formData.state,
                postalCode: formData.postalCode,
                country: formData.country,
              },
            ]
          : undefined,
      };

      const response = await fhirApi.post("/Patient", patientResource);
      onSuccess();
      navigate(`/patient/${response.data.id}`);
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { issue?: Array<{ diagnostics?: string }> } };
      };
      setError(
        error.response?.data?.issue?.[0]?.diagnostics ||
          "Failed to create patient"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      givenName: "",
      familyName: "",
      gender: "",
      birthDate: "",
      addressLine: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    });
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Patient</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Given Name"
                value={formData.givenName}
                onChange={(e) => handleInputChange("givenName", e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Family Name"
                value={formData.familyName}
                onChange={(e) =>
                  handleInputChange("familyName", e.target.value)
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.gender}
                  label="Gender"
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                  <MenuItem value="unknown">Unknown</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Birth Date"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange("birthDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Address (Optional)
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line"
                value={formData.addressLine}
                onChange={(e) =>
                  handleInputChange("addressLine", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Postal Code"
                value={formData.postalCode}
                onChange={(e) =>
                  handleInputChange("postalCode", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={
            loading ||
            !formData.givenName ||
            !formData.familyName ||
            !formData.gender
          }
        >
          {loading ? "Creating..." : "Create Patient"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePatientModal;
