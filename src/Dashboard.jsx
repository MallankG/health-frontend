import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import api from './api';
import DashboardLayout from './DashboardLayout';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [vitals, setVitals] = useState([]);
  const [reports, setReports] = useState([]);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('user', user);
        const vitalsRes = await api.get(`/vitals?patient=${user._id || user.id}`);
        console.log('vitalsRes', vitalsRes.data);
        setVitals(vitalsRes.data);
        const reportsRes = await api.get(`/reports?patient=${user._id || user.id}`);
        console.log('reportsRes', reportsRes.data);
        setReports(reportsRes.data.slice(-5).reverse()); // 5 most recent
      } catch (e) {
        console.log('error', e);
      }
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  // Prepare chart data
  const chartData = (type, label) => {
    const filtered = vitals.filter(v => v.type === type);
    return {
      labels: filtered.map(v => new Date(v.date).toLocaleDateString()),
      datasets: [
        {
          label,
          data: filtered.map(v => parseFloat(v.value.split(/[ /]/)[0]) || 0),
          borderColor: type === 'bp' ? '#2563eb' : type === 'hr' ? '#22c55e' : '#f59e42',
          backgroundColor: 'rgba(37,99,235,0.1)',
          tension: 0.3,
        },
      ],
    };
  };

  return (
    <DashboardLayout>
      <div className="container-fluid">
        <div className="row g-4 mb-4">
          <div className="col-12 col-lg-8">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h4 className="card-title mb-4"><i className="bi bi-activity me-2 text-primary"></i>Vitals Overview</h4>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div style={{ height: 220 }}>
                      <Line data={chartData('bp', 'Blood Pressure')} options={{ plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }} />
                    </div>
                    <div className="text-center mt-2 small text-secondary">Blood Pressure</div>
                  </div>
                  <div className="col-md-6">
                    <div style={{ height: 220 }}>
                      <Line data={chartData('hr', 'Heart Rate')} options={{ plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }} />
                    </div>
                    <div className="text-center mt-2 small text-secondary">Heart Rate</div>
                  </div>
                  <div className="col-md-6">
                    <div style={{ height: 220 }}>
                      <Line data={chartData('glucose', 'Glucose')} options={{ plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }} />
                    </div>
                    <div className="text-center mt-2 small text-secondary">Glucose</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h4 className="card-title mb-4"><i className="bi bi-file-earmark-medical me-2 text-primary"></i>Recent Reports</h4>
                {reports.length === 0 && <div className="text-muted text-center">No recent reports.</div>}
                <ul className="list-group list-group-flush">
                  {reports.map(r => (
                    <li className="list-group-item d-flex justify-content-between align-items-center" key={r._id}>
                      <span><i className="bi bi-file-earmark-text me-2"></i>{r.fileUrl.split('/').pop()}</span>
                      <a href={`${BACKEND_URL}${r.fileUrl}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary"><i className="bi bi-eye"></i></a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}