export interface FHIRPatientResource {
  id: string;
  name?: Array<{
    text?: string;
    given?: string[];
    family?: string;
  }>;
  identifier?: Array<{
    use: string;
    value: string;
  }>;
  address?: Array<{
    use: string;
    type: string;
    line?: string[];
    city: string;
    state?: string;
    postalCode: string;
    country?: string;
  }>;
}

export const transformFHIRPatients = (
  fhirPatients: Array<{ resource: FHIRPatientResource }>
): Patient[] => {
  return fhirPatients.map((entry) => {
    const resource = entry.resource;

    const nameObj = resource.name?.[0] || {};

    // Handle different name formats
    let fullName = "";
    if (nameObj.text) {
      fullName = nameObj.text;
    } else {
      const given = nameObj.given?.filter(Boolean).join(" ") || "";
      const family = nameObj.family || "";
      fullName = `${given} ${family}`.trim();
    }

    // If still no name, try to create one from available data
    if (!fullName) {
      const given = nameObj.given?.filter(Boolean).join(" ") || "";
      const family = nameObj.family || "";
      fullName = `${given} ${family}`.trim();
    }

    const officialIdentifier = resource.identifier?.find(
      (id) => id.use === "official"
    )?.value;
    const usualIdentifier = resource.identifier?.find(
      (id) => id.use === "usual"
    )?.value;

    const addresses = (resource.address || []).map((addr) => ({
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
      name: fullName || "Unknown Patient", // Fallback name
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

export interface Column<T, V = any> {
  key: keyof T | string;
  label: string;
  render?: (value: V, row: T, index: number) => React.ReactNode;
  align?: "left" | "right" | "center";
}

export interface GenericTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowsPerPageOptions?: number[];
  initialRowsPerPage?: number;
  onRowClick?: (row: T) => void;
  stickyHeader?: boolean;
  maxHeight?: string;
  showPagination?: boolean;
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
