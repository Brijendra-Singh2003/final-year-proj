import api from "./api";

export const bookAppointment = async (payload) => {
  // backend expects AppointmentCreate schema: appointment_type, scheduled_time, duration_minutes, reason, patient_id, doctor_id
  const body = {
    appointment_type: payload.appointment_type || "in_person",
    scheduled_time: payload.scheduled_time || payload.date_time,
    duration_minutes: payload.duration_minutes || 30,
    reason: payload.reason,
    patient_id: payload.patient_id,
    doctor_id: payload.doctor_id,
  };
  const res = await api.post("/api/appointments", body);
  return res.data;
};

export const getMyAppointments = async () => {
  const res = await api.get("/api/appointments/my/appointments");
  return res.data;
};

export const getAppointment = async (id) => {
  const res = await api.get(`/api/appointments/${id}`);
  return res.data;
};

export const cancelAppointment = async (id) => {
  // backend expects AppointmentCancel body with cancelled_by
  const res = await api.post(`/api/appointments/${id}/cancel`, { cancelled_by: "patient" });
  return res.data;
};

export const listDoctors = async (params = {}) => {
  const res = await api.get("/api/doctors", { params });
  return res.data;
};
