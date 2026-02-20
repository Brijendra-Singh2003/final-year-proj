import api from "./api";

export const getMyInvoices = async () => {
  const res = await api.get("/api/billing/patient/invoice");
  return res.data;
};

export const getBilling = async (id) => {
  const res = await api.get(`/api/billing/${id}`);
  return res.data;
};

export const payInvoice = async (id, amount, payment_method = "card") => {
  const res = await api.post(`/api/billing/${id}/pay`, { amount, payment_method });
  return res.data;
};
