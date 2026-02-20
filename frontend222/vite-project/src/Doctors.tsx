import React, { useMemo, useState } from 'react'
import DoctorCard from './components/DoctorCard'

type Doctor = {
  id: string
  name: string
  specialization: string
  experience: number
  rating: number
  image?: string
}

const doctorsMock: Doctor[] = [
  { id: 'D-001', name: 'Dr. Sarah Lee', specialization: 'Cardiology', experience: 12, rating: 4.7 },
  { id: 'D-002', name: 'Dr. Raj Patel', specialization: 'General Surgery', experience: 9, rating: 4.5 },
  { id: 'D-003', name: 'Dr. Anna Kim', specialization: 'Pediatrics', experience: 6, rating: 4.8 },
  { id: 'D-004', name: 'Dr. Michael Brown', specialization: 'Orthopedics', experience: 15, rating: 4.6 },
  { id: 'D-005', name: 'Dr. Laura Green', specialization: 'Dermatology', experience: 8, rating: 4.3 },
  { id: 'D-006', name: 'Dr. David Wilson', specialization: 'Neurology', experience: 11, rating: 4.4 },
]

const specializations = Array.from(new Set(doctorsMock.map(d => d.specialization)))

const Doctors: React.FC = () => {
  const [query, setQuery] = useState('')
  const [spec, setSpec] = useState('All')

  const filtered = useMemo(() => {
    return doctorsMock.filter(d => {
      if (spec !== 'All' && d.specialization !== spec) return false
      if (query.trim() === '') return true
      const q = query.toLowerCase()
      return d.name.toLowerCase().includes(q) || d.specialization.toLowerCase().includes(q)
    })
  }, [query, spec])

  const handleBook = (id: string) => {
    // in a real app we'd open a booking modal or navigate to booking page
    alert('Book appointment for ' + id)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Find a Doctor</h1>
            <p className="text-sm text-slate-500 mt-1">Search and filter specialists available at our hospitals.</p>
          </div>

          <div className="flex items-center gap-3">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or specialty" className="px-4 py-2 rounded-lg border w-72 focus:outline-none" />
            <select value={spec} onChange={(e) => setSpec(e.target.value)} className="px-3 py-2 rounded-lg border bg-white">
              <option>All</option>
              {specializations.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(d => (
            <DoctorCard key={d.id} doc={d} onBook={handleBook} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Doctors
