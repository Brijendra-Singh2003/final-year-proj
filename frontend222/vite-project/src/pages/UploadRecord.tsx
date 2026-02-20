import React from 'react';

export default function UploadRecord() {
  return (
    <div className="card">
      <h3>Upload Medical Record</h3>
      <p className="small">Upload files like lab reports or X-rays (uses multipart upload in integrated app).</p>
      <div style={{marginTop:12}}>
        <label>File</label>
        <input type="file" />
      </div>
      <div style={{marginTop:12}}>
        <button className="btn">Upload</button>
      </div>
    </div>
  );
}
