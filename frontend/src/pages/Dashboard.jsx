import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

function Stat({ label, value, color }) {
  return (
    <div className="card stat">
      <span className="label">{label}</span>
      <span className="value" style={{ color: color || 'inherit' }}>{value}</span>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard/stats')
      .then((r) => setStats(r.data))
      .catch((e) => setError(e?.response?.data?.message || 'Failed to load'));
  }, []);

  if (error) return <div className="container"><div className="error">{error}</div></div>;
  if (!stats) return <div className="container"><p className="muted">Loading…</p></div>;

  const total = stats.totalTasks || 1;
  const pct = (n) => Math.round((n / total) * 100);

  return (
    <div className="container">
      <h1 className="title">{user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}</h1>
      <p className="subtitle">Welcome back, {user.name}.</p>

      <div className="grid cols-3">
        <Stat label="Total Projects" value={stats.totalProjects} />
        <Stat label="Total Tasks" value={stats.totalTasks} />
        <Stat label="Overdue" value={stats.overdue} color="var(--danger)" />
      </div>

      <div style={{ height: 16 }} />

      <div className="grid cols-3">
        <div className="card stat">
          <span className="label">Pending</span>
          <span className="value">{stats.pending}</span>
          <div className="bar"><span style={{ width: `${pct(stats.pending)}%`, background: 'var(--warning)' }} /></div>
        </div>
        <div className="card stat">
          <span className="label">In Progress</span>
          <span className="value">{stats.inProgress}</span>
          <div className="bar"><span style={{ width: `${pct(stats.inProgress)}%`, background: 'var(--info)' }} /></div>
        </div>
        <div className="card stat">
          <span className="label">Completed</span>
          <span className="value">{stats.completed}</span>
          <div className="bar"><span style={{ width: `${pct(stats.completed)}%`, background: 'var(--success)' }} /></div>
        </div>
      </div>
    </div>
  );
}
