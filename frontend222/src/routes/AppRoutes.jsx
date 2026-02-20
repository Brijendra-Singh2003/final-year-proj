import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import AdminPanel from "../pages/AdminPanel";
import DoctorPanel from "../pages/DoctorPanel";
import PatientPanel from "../pages/PatientPanel";
import PatientDashboard from "../pages/PatientDashboard";
import DoctorDashboard from "../pages/DoctorDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import Appointments from "../pages/Appointments";
import BookAppointment from "../pages/BookAppointment";
import Billing from "../pages/Billing";
import UploadRecord from "../pages/UploadRecord";
import Unauthorized from "../pages/Unauthorized";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected routes: use nested routes + ProtectedRoute with roles */}
        <Route element={<ProtectedRoute />}> 
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/patient" element={<PatientDashboard />} />
          <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/appointments/book" element={<BookAppointment />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/records/upload" element={<UploadRecord />} />
        </Route>

        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="/admin" element={<AdminPanel />} />
        </Route>

        <Route element={<ProtectedRoute roles={["doctor"]} />}>
          <Route path="/doctor" element={<DoctorPanel />} />
        </Route>

        <Route element={<ProtectedRoute roles={["patient"]} />}>
          <Route path="/patient" element={<PatientPanel />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
