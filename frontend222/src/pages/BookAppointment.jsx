import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { listDoctors, bookAppointment } from "../services/appointmentService";

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ doctor_id: "", date_time: "", reason: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await listDoctors();
        setDoctors(data || []);
        // try to fetch patient profile for patient_id
        try {
          const { getMyPatient } = await import("../services/patientService");
          const p = await getMyPatient();
          if (p && p.id) setForm((f) => ({ ...f, patient_id: p.id }));
        } catch (e) {
          // ignore
        }
      } catch (e) {
        setDoctors([]);
      }
    };
    load();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      // map date_time -> scheduled_time expected by backend
      const payload = {
        ...form,
        scheduled_time: form.date_time,
      };
      await bookAppointment(payload);
      setMessage({ type: "success", text: "Appointment booked." });
      setForm({ doctor_id: "", date_time: "", reason: "" });
    } catch (err) {
      setMessage({ type: "error", text: err?.response?.data?.detail || "Booking failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Book Appointment">
      <div className="max-w-xl bg-white p-6 rounded shadow">
        {message && (
          <div className={`mb-4 p-3 rounded ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Doctor</label>
            <select name="doctor_id" value={form.doctor_id} onChange={handleChange} className="w-full mt-1 p-2 border rounded">
              <option value="">— Select —</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>{`${d.user.full_name} — ${d.specialty || "General"}`}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600">Date & Time</label>
            <input name="date_time" value={form.date_time} onChange={handleChange} type="datetime-local" className="w-full mt-1 p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Reason</label>
            <textarea name="reason" value={form.reason} onChange={handleChange} className="w-full mt-1 p-2 border rounded" />
          </div>

          <div>
            <button disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              {loading ? "Booking..." : "Book Appointment"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
