import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { getMyAppointments, cancelAppointment } from "../services/appointmentService";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getMyAppointments();
      setAppointments(data || []);
    } catch (e) {
      setError(e?.response?.data?.detail || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await cancelAppointment(id);
      setAppointments((s) => s.filter((a) => a.id !== id));
    } catch (e) {
      alert(e?.response?.data?.detail || "Cancel failed");
    }
  };

  return (
    <DashboardLayout title="My Appointments">
      <div className="bg-white p-4 rounded shadow">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : appointments.length === 0 ? (
          <div className="text-gray-600">No appointments found.</div>
        ) : (
          <ul className="space-y-3">
            {appointments.map((a) => (
              <li key={a.id} className="p-3 border rounded flex justify-between items-center">
                <div>
                  <div className="font-semibold">{a.doctor?.user?.full_name || "Doctor"}</div>
                  <div className="text-sm text-gray-500">{new Date(a.date_time).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-600">{a.status}</div>
                  {a.status === "SCHEDULED" && (
                    <button onClick={() => handleCancel(a.id)} className="text-sm text-red-600">Cancel</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
}
