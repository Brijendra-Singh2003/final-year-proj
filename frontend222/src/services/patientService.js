import api from "./api";

export const getMyPatient = async () => {
  const res = await api.get("/api/patients/me");
  return res.data;
};
