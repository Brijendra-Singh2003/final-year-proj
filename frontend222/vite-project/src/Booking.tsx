import React, { useMemo, useState } from 'react'

type Doctor = { id: string; name: string; specialization: string }

const doctors: Doctor[] = [
  { id: 'D-001', name: 'Dr. Sarah Lee', specialization: 'Cardiology' },
  { id: 'D-002', name: 'Dr. Raj Patel', specialization: 'General Surgery' },
  { id: 'D-003', name: 'Dr. Anna Kim', specialization: 'Pediatrics' },
]

const generateTimeSlots = (start = 9, end = 17, interval = 30) => {
  const slots: string[] = []
  for (let h = start; h < end; h++) {
    for (let m = 0; m < 60; m += interval) {
      const hh = String(h).padStart(2, '0')
      const mm = String(m).padStart(2, '0')
      slots.push(`${hh}:${mm}`)
    }
  }
  return slots
}

const Booking: React.FC = () => {
  const [doctorId, setDoctorId] = useState(doctors[0].id)
  const [date, setDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().slice(0, 10)
  })
  const [slot, setSlot] = useState<string | null>(null)
  const [reason, setReason] = useState('')

  const slots = useMemo(() => generateTimeSlots(8, 18, 30), [])

  const handleBook = () => {
    if (!slot) return alert('Please select a time slot')
    const selectedDoctor = doctors.find(d => d.id === doctorId)
    const payload = { doctorId, doctorName: selectedDoctor?.name, date, time: slot, reason }
    // In a real app, POST to /api/appointments
    console.log('Booking payload', payload)
    alert(`Appointment booked with ${selectedDoctor?.name} on ${date} at ${slot}`)
    // Reset
    setSlot(null)
    setReason('')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-slate-800">Book an Appointment</h2>
          <p className="text-sm text-slate-500 mt-1">Select a doctor, choose a date and time, and tell us the reason for your visit.</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-600">Select doctor</label>
              <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} className="mt-1 block w-full rounded-lg border px-3 py-2">
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-600">Choose date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full rounded-lg border px-3 py-2" />
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm text-slate-600">Available time slots</label>
            <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map(s => (
                <button key={s} type="button" onClick={() => setSlot(s)} className={`px-3 py-2 rounded-lg border text-sm text-slate-700 ${slot === s ? 'bg-green-500 text-white border-green-500' : 'bg-white hover:bg-slate-50'}`}>
                  {s}
                </button>
              ))}
            </div>
            <div className="text-sm text-slate-500 mt-2">Selected: <span className="font-medium text-slate-700">{slot || 'none'}</span></div>
          </div>

          <div className="mt-6">
            <label className="text-sm text-slate-600">Reason for visit</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={4} placeholder="Describe symptoms or reason for appointment" className="mt-1 w-full rounded-lg border p-3" />
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button onClick={() => { setReason(''); setSlot(null) }} className="px-4 py-2 rounded-lg bg-white border text-slate-700">Reset</button>
            <button onClick={handleBook} className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold">Book Appointment</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Booking
