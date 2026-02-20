import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    withCredentials: true, // send httpOnly cookie
});

// AUTH
export const register = (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    specialty?: string;
    phone?: string;
}) => api.post("/auth/register", data);

export const login = (data: { email: string; password: string }) =>
    api.post("/auth/login", data);

export const logout = () => api.post("/auth/logout");
export const getMe = () => api.get("/auth/me");

// DOCTORS (search public)
export const searchDoctors = (params: { name?: string; specialty?: string }) =>
    api.get("/patients/doctors/search", { params });

// PATIENT
export const bookAppointment = (data: {
    doctor_id: number;
    date: string;
    time_slot: string;
    notes?: string;
}) => api.post("/patients/appointments", data);

export const getMyAppointments = () => api.get("/patients/appointments");
export const cancelAppointment = (id: number) =>
    api.patch(`/patients/appointments/${id}/cancel`);
export const getMyRecords = () => api.get("/patients/records");

// DOCTOR
export const getDoctorAppointments = () => api.get("/doctors/appointments");
export const confirmAppointment = (id: number) =>
    api.patch(`/doctors/appointments/${id}/confirm`);
export const getPatientRecords = (patientId: number) =>
    api.get(`/doctors/patients/${patientId}/records`);
export const appendReport = (
    recordId: number,
    data: { content: string; diagnosis?: string; prescription?: string }
) => api.post(`/doctors/records/${recordId}/reports`, data);
export const getMyPatients = () => api.get("/doctors/patients");

// ADMIN
export const getAllUsers = () => api.get("/admin/users");
export const deleteUser = (id: number) => api.delete(`/admin/users/${id}`);
export const getAllAppointments = () => api.get("/admin/appointments");
