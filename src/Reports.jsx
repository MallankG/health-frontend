// src/Reports.jsx
import React, { useEffect, useState } from 'react';
import api from './api';
import DashboardLayout from './DashboardLayout';

export default function Reports() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [reports, setReports] = useState([]);
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchReports = async () => {
    try {
      const res = await api.get(`/reports?patient=${user.id}`);
      setReports(res.data);
    } catch {
      setError('Failed to fetch reports');
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!file) return setError('Please select a file');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('tags', tags);
    formData.append('patient', user.id);
    try {
      await api.post('/reports/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('Report uploaded!');
      setFile(null); setCategory(''); setTags('');
      fetchReports();
    } catch {
      setError('Upload failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h2 className="fw-bold mb-0"><i className="bi bi-file-earmark-medical me-2 text-primary"></i>Your Reports</h2>
            <form onSubmit={handleUpload} className="d-flex flex-wrap gap-2 align-items-center" style={{maxWidth: 600}}>
              <input type="file" accept=".pdf,image/*" className="form-control" onChange={e => setFile(e.target.files[0])} />
              <input type="text" placeholder="Category" className="form-control" value={category} onChange={e => setCategory(e.target.value)} />
              <input type="text" placeholder="Tags (comma separated)" className="form-control" value={tags} onChange={e => setTags(e.target.value)} />
              <button type="submit" className="btn btn-success"><i className="bi bi-upload me-1"></i>Upload</button>
            </form>
          </div>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <div className="row g-4">
          {reports.length === 0 && <div className="col-12 text-center text-muted">No reports found. Upload your first report!</div>}
          {reports.map(r => (
            <div className="col-md-6 col-lg-4" key={r._id}>
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title mb-2">{r.fileUrl.split('/').pop()}</h5>
                  <div className="mb-2"><span className="badge bg-primary me-2">{r.category || 'General'}</span>{r.tags && r.tags.length > 0 && r.tags.map(tag => <span key={tag} className="badge bg-secondary me-1">{tag}</span>)}</div>
                  <a href={`${BACKEND_URL}${r.fileUrl}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm mt-auto"><i className="bi bi-eye me-1"></i>View</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
