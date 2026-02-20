import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { uploadRecord } from "../services/medicalRecordService";

export default function UploadRecord() {
  const [file, setFile] = useState(null);
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setMessage({ type: "error", text: "Choose a file" });

    const fd = new FormData();
    fd.append("file", file);
    fd.append("record_type", type);
    fd.append("description", description);

    try {
      await uploadRecord(fd);
      setMessage({ type: "success", text: "Uploaded successfully" });
      setFile(null);
      setType("");
      setDescription("");
    } catch (e) {
      setMessage({ type: "error", text: e?.response?.data?.detail || "Upload failed" });
    }
  };

  return (
    <DashboardLayout title="Upload Medical Record">
      <div className="max-w-xl bg-white p-6 rounded shadow">
        {message && (
          <div className={`mb-4 p-3 rounded ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Record Type</label>
            <input value={type} onChange={(e) => setType(e.target.value)} className="w-full mt-1 p-2 border rounded" placeholder="e.g. X-Ray, Lab Report" />
          </div>

          <div>
            <label className="block text-sm text-gray-600">File</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full mt-1" />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 p-2 border rounded" />
          </div>

          <div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded">Upload</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
