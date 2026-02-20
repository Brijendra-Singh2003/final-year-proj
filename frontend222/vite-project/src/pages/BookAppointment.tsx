import React from 'react';

export default function BookAppointment() {
  return (
    <div className="card">
      <h3>Book Appointment</h3>
      <p className="small">Use the booking form (connected to backend in integrated frontend).</p>
      <div style={{marginTop:12}}>
        <label>Doctor</label>
        <select><option>Dr. Jane Doe</option></select>
      </div>
      <div style={{marginTop:8}}>
        <label>Date & Time</label>
        <input type="datetime-local" />
      </div>
      <div style={{marginTop:12}}>
        <button className="btn">Book</button>
      </div>
    </div>
  );
}
