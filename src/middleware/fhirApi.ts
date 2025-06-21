import axios from "axios";

const fhirApi = axios.create({
  baseURL: "https://hapi.fhir.org/baseR4",
  headers: {
    "Content-Type": "application/fhir+json",
  },
});

fhirApi.interceptors.request.use(
  (config) => {
    // Add auth headers here if using SMART on FHIR (e.g., access_token)
    // config.headers.Authorization = `Bearer ${accessToken}`;
    console.log("[FHIR API Request]", config.url);
    return config;
  },
  (error) => {
    console.error("[FHIR API Request Error]", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
fhirApi.interceptors.response.use(
  (response) => {
    console.log("[FHIR API Response]", response.status);
    return response;
  },
  (error) => {
    console.error(
      "[FHIR API Response Error]",
      error.response?.status,
      error.message
    );
    return Promise.reject(error);
  }
);

export default fhirApi;
