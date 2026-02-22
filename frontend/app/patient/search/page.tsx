"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { searchDoctors, bookAppointment } from "@/lib/api";
import { Search, Stethoscope, CalendarPlus, X } from "lucide-react";

const SPECIALTIES = [
  "All", "General Practitioner", "Cardiologist", "Dermatologist",
  "Neurologist", "Orthopedist", "Pediatrician", "Psychiatrist",
  "Oncologist", "Gynecologist", "Ophthalmologist", "ENT Specialist",
];

const TIME_SLOTS = [
  "09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
  "02:00 PM","02:30 PM","03:00 PM","03:30 PM","04:00 PM","04:30 PM",
];

interface Doctor {
  id: number; name: string; specialty?: string; phone?: string; email: string;
}

interface BookingModal {
  doctor: Doctor;
  date: string;
  time_slot: string;
  notes: string;
}

export default function SearchPage() {
  const [nameQ, setNameQ] = useState("");
  const [specialtyQ, setSpecialtyQ] = useState("All");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<BookingModal | null>(null);
  const [bookLoading, setBookLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const res = await searchDoctors({
        name: nameQ || undefined,
        specialty: specialtyQ !== "All" ? specialtyQ : undefined,
      });
      setDoctors(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!modal) return;
    setBookLoading(true);
    try {
      await bookAppointment({
        doctor_id: modal.doctor.id,
        date: modal.date,
        time_slot: modal.time_slot,
        notes: modal.notes,
      });
      setSuccess(`Appointment booked with Dr. ${modal.doctor.name} on ${modal.date}!`);
      setModal(null);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      alert(e?.response?.data?.detail || "Booking failed");
    } finally {
      setBookLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Find a <span className="gradient-text">Doctor</span></h1>
        <p className="mb-8" style={{ color: "var(--text-secondary)" }}>Search by name or specialty and book instantly</p>

        {success && (
          <div className="mb-6 p-4 rounded-xl flex items-center gap-3"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399" }}>
            ✅ {success}
          </div>
        )}

        {/* Search Form */}
        <form onSubmit={handleSearch} className="glass p-5 mb-8 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-48">
            <label>Doctor Name</label>
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-secondary)" }} />
              <input id="search-name" type="text" className="input" style={{ paddingLeft: "2.25rem" }}
                placeholder="e.g. Dr. Smith" value={nameQ} onChange={(e) => setNameQ(e.target.value)} />
            </div>
          </div>
          <div className="flex-1 min-w-48">
            <label>Specialty</label>
            <div className="relative">
              <Stethoscope size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-secondary)" }} />
              <select id="search-specialty" className="input" style={{ paddingLeft: "2.25rem" }}
                value={specialtyQ} onChange={(e) => setSpecialtyQ(e.target.value)}>
                {SPECIALTIES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <button id="search-btn" type="submit" className="btn-primary" disabled={loading}>
            <Search size={16} /> {loading ? "Searching…" : "Search"}
          </button>
        </form>

        {/* Results */}
        {searched && (
          <>
            <p className="mb-4 text-sm" style={{ color: "var(--text-secondary)" }}>
              {doctors.length} doctor{doctors.length !== 1 ? "s" : ""} found
            </p>
            {doctors.length === 0 ? (
              <div className="glass p-12 text-center">
                <Stethoscope size={40} style={{ color: "var(--text-secondary)", margin: "0 auto 1rem" }} />
                <p style={{ color: "var(--text-secondary)" }}>No doctors found. Try a different search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {doctors.map((doc) => (
                  <div key={doc.id} className="glass p-5 flex flex-col gap-3 hover:border-blue-500/50 transition-all"
                    style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                        style={{ background: "linear-gradient(135deg,#3b82f6,#6366f1)", color: "white" }}>
                        {doc.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold">Dr. {doc.name}</p>
                        <span className="badge badge-doctor">{doc.specialty || "General"}</span>
                      </div>
                    </div>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{doc.email}</p>
                    <button id={`book-${doc.id}`} className="btn-primary w-full justify-center mt-auto"
                      onClick={() => setModal({ doctor: doc, date: "", time_slot: "", notes: "" })}>
                      <CalendarPlus size={15} /> Book Appointment
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Booking Modal */}
        {modal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
            <div className="glass p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Book Appointment</h3>
                <button onClick={() => setModal(null)} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
                  <X size={20} />
                </button>
              </div>
              <p className="mb-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                with <strong style={{ color: "var(--text-primary)" }}>Dr. {modal.doctor.name}</strong> – {modal.doctor.specialty}
              </p>
              <div className="space-y-4">
                <div>
                  <label>Date</label>
                  <input id="book-date" type="date" className="input"
                    min={new Date().toISOString().split("T")[0]}
                    value={modal.date}
                    onChange={(e) => setModal({ ...modal, date: e.target.value })} />
                </div>
                <div>
                  <label>Time Slot</label>
                  <select id="book-time" className="input" value={modal.time_slot}
                    onChange={(e) => setModal({ ...modal, time_slot: e.target.value })}>
                    <option value="">Select a time</option>
                    {TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label>Notes (optional)</label>
                  <textarea id="book-notes" className="input" rows={3} style={{ resize: "none" }}
                    placeholder="Describe your symptoms…"
                    value={modal.notes}
                    onChange={(e) => setModal({ ...modal, notes: e.target.value })} />
                </div>
                <button id="confirm-book-btn" className="btn-primary w-full justify-center"
                  disabled={!modal.date || !modal.time_slot || bookLoading}
                  onClick={handleBook}>
                  {bookLoading ? "Booking…" : "Confirm Booking"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
