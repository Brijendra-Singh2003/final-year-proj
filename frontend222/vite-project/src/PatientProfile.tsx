import React from 'react'

type Prescription = { id: string; medication: string; dosage: string; date: string }
type Report = { id: string; title: string; date: string; url?: string }

const prescriptions: Prescription[] = [
  { id: 'P-1001', medication: 'Atorvastatin 20mg', dosage: 'Once daily', date: '2025-12-01' },
  { id: 'P-1002', medication: 'Lisinopril 10mg', dosage: 'Once daily', date: '2026-01-15' },
]

const reports: Report[] = [
  { id: 'R-2001', title: 'CBC — Complete Blood Count', date: '2026-02-10', url: '#' },
  { id: 'R-2002', title: 'Chest X-ray', date: '2026-01-20', url: '#' },
]

const PatientProfile: React.FC = () => {
  const patient = {
    name: 'Emily Stone',
    dob: '1990-04-12',
    gender: 'Female',
    patientId: 'PT-4521',
    phone: '+1 (555) 123-4567',
    email: 'emily.stone@example.com',
    bloodType: 'A+',
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow p-6">
          <div className="flex flex-col items-center text-center">
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=ffffff&color=2b6cb0&size=128`} alt={patient.name} className="w-28 h-28 rounded-full border object-cover" />
            <h2 className="mt-4 text-xl font-semibold text-slate-800">{patient.name}</h2>
            <div className="text-sm text-slate-500 mt-1">Patient ID: <span className="font-medium text-slate-700">{patient.patientId}</span></div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="text-sm text-slate-600"><strong>DOB:</strong> {patient.dob}</div>
            <div className="text-sm text-slate-600"><strong>Gender:</strong> {patient.gender}</div>
            <div className="text-sm text-slate-600"><strong>Blood Type:</strong> {patient.bloodType}</div>
            <div className="text-sm text-slate-600"><strong>Phone:</strong> {patient.phone}</div>
            <div className="text-sm text-slate-600"><strong>Email:</strong> {patient.email}</div>
          </div>

          <div className="mt-6">
            <button className="w-full py-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold">Edit Profile</button>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic details / vitals */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-slate-800">Basic Details</h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-slate-500">Primary Care Physician</div>
                <div className="text-sm font-medium text-slate-700 mt-1">Dr. Sarah Lee</div>
              </div>

              <div>
                <div className="text-sm text-slate-500">Allergies</div>
                <div className="text-sm font-medium text-slate-700 mt-1">Penicillin</div>
              </div>
            </div>
          </div>

          {/* Medical history */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-slate-800">Medical History</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <div>
                    <div className="font-medium">Hypertension</div>
                    <div className="text-slate-500">Diagnosed 2019 — managed with medication</div>
                  </div>
                </div>
              </li>

              <li>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
                  <div>
                    <div className="font-medium">Knee arthroscopy</div>
                    <div className="text-slate-500">Surgery in 2021 — recovered</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Prescriptions */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Prescriptions</h3>
              <a href="#" className="text-sm text-blue-600">View all</a>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prescriptions.map(p => (
                <div key={p.id} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-800">{p.medication}</div>
                      <div className="text-sm text-slate-500">{p.dosage}</div>
                    </div>
                    <div className="text-sm text-slate-500">{p.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lab reports */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Lab Reports</h3>
              <a href="#" className="text-sm text-blue-600">Upload report</a>
            </div>

            <div className="mt-4 space-y-3">
              {reports.map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium text-slate-800">{r.title}</div>
                    <div className="text-sm text-slate-500">{r.date}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={r.url} download className="px-3 py-1 rounded-lg bg-white border text-sm">Download</a>
                    <a href={r.url} className="px-3 py-1 rounded-lg bg-green-500 text-white text-sm">View</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientProfile
