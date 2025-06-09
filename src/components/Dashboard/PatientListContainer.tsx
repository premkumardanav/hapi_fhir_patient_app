import { useEffect, useState } from "react";
import PatientTable from "./PatientTable";
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

const PatientListContainer = () => {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fhirApi.get("/Patient");
        const transformed = transformFHIRPatients(response.data.entry || []);
        setPatients(transformed);
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <PatientTable
      patients={patients}
      onRowClick={(row) => console.log("Row clicked:", row)}
    />
  );
};

export default PatientListContainer;
