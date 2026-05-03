import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { fmtDate } from '../utils/helpers';

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  const load = () => {
    api.get('/projects').then((r) => setProjects(r.data))
      .catch((e) => setError(e?.response?.data?.message || 'Failed to load'));
  };
  useEffect(load, []);

  const remove = async (id) => {
    if (!confirm('Delete this project and all its tasks?')) return;
    await api.delete(`/projects/${id}`);
    load();
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h1 className="title">Projects</h1>
        {user.role === 'admin' && <Link to="/projects/new" className="btn">+ New Project</Link>}
      </div>
      {error && <div className="error">{error}</div>}
      {projects.length === 0 ? (
        <p className="muted">No projects yet.</p>
      ) : (
        <div className="grid cols-2">
          {projects.map((p) => (
            <div key={p._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <h3 style={{ margin: 0 }}><Link to={`/projects/${p._id}`}>{p.title}</Link></h3>
                <span className="muted" style={{ fontSize: 13 }}>Due {fmtDate(p.deadline)}</span>
              </div>
              <p className="muted" style={{ marginTop: 8 }}>{p.description || 'No description'}</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                {p.members.map((m) => (
                  <span key={m._id} className={`badge ${m.role === 'admin' ? 'admin' : 'member'}`}>{m.name}</span>
                ))}
              </div>
              {user.role === 'admin' && (
                <div className="row-actions" style={{ marginTop: 12 }}>
                  <button className="btn sm danger" onClick={() => remove(p._id)}>Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
