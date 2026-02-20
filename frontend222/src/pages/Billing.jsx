import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { getMyInvoices, payInvoice } from "../services/billingService";

export default function Billing() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getMyInvoices();
      setInvoices(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handlePay = async (id) => {
    const amount = prompt("Amount to pay:", "0");
    if (!amount) return;
    try {
      const updated = await payInvoice(id, parseInt(amount, 10), "card");
      setInvoices((s) => s.map((inv) => (inv.id === id ? updated : inv)));
      alert("Payment successful");
    } catch (e) {
      alert(e?.response?.data?.detail || "Payment failed");
    }
  };

  return (
    <DashboardLayout title="Billing & Invoices">
      <div className="bg-white p-4 rounded shadow">
        {loading ? (
          <div>Loading...</div>
        ) : invoices.length === 0 ? (
          <div className="text-gray-600">No invoices found.</div>
        ) : (
          <ul className="space-y-3">
            {invoices.map((inv) => (
              <li key={inv.id} className="p-3 border rounded flex justify-between items-center">
                <div>
                  <div className="font-semibold">Invoice #{inv.id}</div>
                  <div className="text-sm text-gray-500">Amount: ${inv.amount / 100}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-600">{inv.status}</div>
                  {inv.status !== "PAID" && (
                    <button onClick={() => handlePay(inv.id)} className="text-sm text-indigo-600">Pay</button>
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
