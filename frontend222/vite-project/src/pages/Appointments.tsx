import React from 'react';

export default function Appointments() {
  return (
    <div className="card">
      <h3>My Appointments</h3>
      <p className="small">(This page will list user's appointments; integrated app has full features.)</p>
      <table className="table" style={{marginTop:12}}>
        <thead>
          <tr><th>Doctor</th><th>Date</th><th>Status</th></tr>
        </thead>
        <tbody>
          <tr><td>Dr. Jane Doe</td><td>Mar 03, 2026 — 10:30</td><td>Scheduled</td></tr>
        </tbody>
      </table>
    </div>
  );
}
