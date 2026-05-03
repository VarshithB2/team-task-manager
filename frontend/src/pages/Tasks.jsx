import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { fmtDate, isOverdue, statusBadgeClass, priorityBadgeClass } from '../utils/helpers';

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  const load = () => {
    api.get('/tasks').then((r) => setTasks(r.data))
      .catch((e) => setError(e?.response?.data?.message || 'Failed to load'));
  };
  useEffect(load, []);

  const updateStatus = async (id, status) => {
    await api.put(`/tasks/${id}`, { status });
    load();
  };
  const remove = async (id) => {
    if (!confirm('Delete this task?')) return;
    await api.delete(`/tasks/${id}`);
    load();
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h1 className="title">Tasks</h1>
        {user.role === 'admin' && <Link to="/tasks/new" className="btn">+ New Task</Link>}
      </div>
      {error && <div className="error">{error}</div>}
      {tasks.length === 0 ? (
        <p className="muted">No tasks.</p>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Title</th><th>Project</th><th>Assignee</th><th>Priority</th><th>Status</th><th>Due</th><th></th></tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t._id}>
                  <td>{t.title}</td>
                  <td>{t.project?.title}</td>
                  <td>{t.assignedTo?.name}</td>
                  <td><span className={priorityBadgeClass(t.priority)}>{t.priority}</span></td>
                  <td>
                    <span className={statusBadgeClass(t.status)}>{t.status}</span>
                    {isOverdue(t) && <span className="badge overdue" style={{ marginLeft: 6 }}>Overdue</span>}
                  </td>
                  <td>{fmtDate(t.dueDate)}</td>
                  <td>
                    <div className="row-actions">
                      <select value={t.status} onChange={(e) => updateStatus(t._id, e.target.value)}>
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                      </select>
                      {user.role === 'admin' && (
                        <button className="btn sm danger" onClick={() => remove(t._id)}>Delete</button>
                      )}
                    </div>
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
