import React from 'react';

export default function Billing() {
  return (
    <div className="card">
      <h3>Billing</h3>
      <p className="small">List invoices and pay (integration available in integrated frontend).</p>
      <ul>
        <li>Invoice #101 — $120.00 — <button className="btn secondary">Pay</button></li>
      </ul>
    </div>
  );
}
