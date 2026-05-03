import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { fmtDate, isOverdue, statusBadgeClass, priorityBadgeClass } from '../utils/helpers';

export default function ProjectDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    api.get(`/projects/${id}`).then((r) => setData(r.data))
      .catch((e) => setError(e?.response?.data?.message || 'Failed to load'));
  };
  useEffect(load, [id]);

  const updateStatus = async (taskId, status) => {
    await api.put(`/tasks/${taskId}`, { status });
    load();
  };

  if (error) return <div className="container"><div className="error">{error}</div></div>;
  if (!data) return <div className="container"><p className="muted">Loading…</p></div>;

  const { project, tasks } = data;
  const canUpdate = (t) => user.role === 'admin' || t.assignedTo._id === user._id;

  return (
    <div className="container">
      <Link to="/projects" className="muted">← All projects</Link>
      <h1 className="title" style={{ marginTop: 8 }}>{project.title}</h1>
      <p className="subtitle">{project.description || 'No description'}</p>
      <div className="card">
        <p><strong>Deadline:</strong> {fmtDate(project.deadline)}</p>
        <p><strong>Members:</strong>{' '}
          {project.members.map((m) => (
            <span key={m._id} className={`badge ${m.role === 'admin' ? 'admin' : 'member'}`} style={{ marginRight: 6 }}>{m.name}</span>
          ))}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, flexWrap: 'wrap', gap: 12 }}>
        <h2 className="title" style={{ marginBottom: 0 }}>Tasks</h2>
        {user.role === 'admin' && <Link to="/tasks/new" className="btn">+ New Task</Link>}
      </div>

      {tasks.length === 0 ? (
        <p className="muted">No tasks yet.</p>
      ) : (
        <div className="table-wrap" style={{ marginTop: 12 }}>
          <table className="table">
            <thead>
              <tr><th>Title</th><th>Assignee</th><th>Priority</th><th>Status</th><th>Due</th><th></th></tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t._id}>
                  <td>{t.title}</td>
                  <td>{t.assignedTo?.name}</td>
                  <td><span className={priorityBadgeClass(t.priority)}>{t.priority}</span></td>
                  <td>
                    <span className={statusBadgeClass(t.status)}>{t.status}</span>
                    {isOverdue(t) && <span className="badge overdue" style={{ marginLeft: 6 }}>Overdue</span>}
                  </td>
                  <td>{fmtDate(t.dueDate)}</td>
                  <td>
                    {canUpdate(t) && (
                      <select value={t.status} onChange={(e) => updateStatus(t._id, e.target.value)}>
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
