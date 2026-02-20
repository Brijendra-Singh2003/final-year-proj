import React from 'react'

type Appointment = {
  id: string
  patient: string
  doctor: string
  date: string
  time: string
  status: string
}

const mock: Appointment[] = [
  { id: 'A-1001', patient: 'Emily Stone', doctor: 'Dr. Sarah Lee', date: '2026-02-21', time: '09:30', status: 'Confirmed' },
  { id: 'A-1002', patient: 'Michael Chen', doctor: 'Dr. Raj Patel', date: '2026-02-22', time: '11:00', status: 'Pending' },
  { id: 'A-1003', patient: 'Olivia Brown', doctor: 'Dr. Anna Kim', date: '2026-02-23', time: '14:15', status: 'Cancelled' },
  { id: 'A-1004', patient: 'Liam Smith', doctor: 'Dr. Sarah Lee', date: '2026-02-24', time: '08:45', status: 'Confirmed' },
  { id: 'A-1005', patient: 'Sophia Davis', doctor: 'Dr. Raj Patel', date: '2026-02-25', time: '10:30', status: 'Confirmed' },
]

const RecentAppointments: React.FC = () => {
  const rows = mock

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Recent Appointments</h3>
        <a href="/appointments" className="text-sm text-blue-600 hover:underline">View all</a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left py-2">ID</th>
              <th className="text-left py-2">Patient</th>
              <th className="text-left py-2">Doctor</th>
              <th className="text-left py-2">Date</th>
              <th className="text-left py-2">Time</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="py-3">{r.id}</td>
                <td className="py-3">{r.patient}</td>
                <td className="py-3">{r.doctor}</td>
                <td className="py-3">{new Date(r.date).toLocaleDateString()}</td>
                <td className="py-3">{r.time}</td>
                <td className="py-3">
                  <span className={`px-3 py-1 rounded-full text-xs ${r.status === 'Confirmed' ? 'bg-green-100 text-green-700' : r.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecentAppointments
