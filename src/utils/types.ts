export const transformFHIRPatients = (fhirPatients: any[]): Patient[] => {
  return fhirPatients.map((entry) => {
    const resource = entry.resource;

    const nameObj = resource.name?.[0] || {};
    const fullName =
      nameObj.text ||
      `${nameObj.given?.join(" ") || ""} ${nameObj.family || ""}`.trim();

    const officialIdentifier = resource.identifier?.find(
      (id: any) => id.use === "official"
    )?.value;
    const usualIdentifier = resource.identifier?.find(
      (id: any) => id.use === "usual"
    )?.value;

    const addresses = (resource.address || []).map((addr: any) => ({
      use: addr.use,
      type: addr.type,
      line: (addr.line || []).join(", "),
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
    }));

    return {
      id: resource.id,
      name: fullName,
      officialIdentifier,
      usualIdentifier,
      addresses,
    };
  });
};

export interface Patient {
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

export interface PatientTableProps {
  patients: Patient[];
  onRowClick?: (row: PatientRow) => void;
}

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  align?: "left" | "right" | "center";
}

export interface GenericTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowsPerPageOptions?: number[];
  initialRowsPerPage?: number;
  onRowClick?: (row: T) => void;
}

export interface Address {
  use: string;
  type: string;
  line: string;
  city: string;
  state?: string;
  postalCode: string;
  country?: string;
}

export interface PatientRow {
  id: string;
  name: string;
  officialIdentifier?: string;
  usualIdentifier?: string;
  addresses: Address[];
}
