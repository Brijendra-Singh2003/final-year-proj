import api from "./api";

// Upload a medical record (multipart/form-data). Backend endpoint may be /api/medical_records
export const uploadRecord = async (formData) => {
  const res = await api.post("/api/medical_records", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getMyRecords = async () => {
  // best-effort endpoint; backend may expose different path
  const res = await api.get("/api/medical_records");
  return res.data;
};
