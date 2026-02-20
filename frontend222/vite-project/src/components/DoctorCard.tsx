import React from 'react'

type Doctor = {
  id: string
  name: string
  specialization: string
  experience: number
  rating: number
  image?: string
}

const DoctorCard: React.FC<{ doc: Doctor; onBook?: (id: string) => void }> = ({ doc, onBook }) => {
  const stars = Array.from({ length: 5 }).map((_, i) => i < Math.round(doc.rating))

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col">
      <div className="flex items-center gap-4">
        <img src={doc.image || 'https://ui-avatars.com/api/?name='+encodeURIComponent(doc.name)+'&background=ffffff&color=2b6cb0'} alt={doc.name} className="w-16 h-16 rounded-full object-cover border" />

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-slate-800">{doc.name}</h4>
            <div className="text-sm text-slate-500">{doc.experience} yrs</div>
          </div>
          <div className="text-sm text-green-600 mt-1">{doc.specialization}</div>

          <div className="mt-2 flex items-center gap-1">
            {stars.map((filled, idx) => (
              <svg key={idx} className={`w-4 h-4 ${filled ? 'text-yellow-400' : 'text-slate-300'}`} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" d="M12 .587l3.668 7.431L24 9.753l-6 5.847L19.335 24 12 19.897 4.665 24 6 15.6 0 9.753l8.332-1.735z"/></svg>
            ))}
            <div className="text-xs text-slate-500 ml-2">{doc.rating.toFixed(1)}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button onClick={() => onBook?.(doc.id)} className="ml-auto px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm shadow hover:opacity-95">Book Appointment</button>
      </div>
    </div>
  )
}

export default DoctorCard
