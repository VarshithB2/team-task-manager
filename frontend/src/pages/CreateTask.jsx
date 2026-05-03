import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function CreateTask() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', project: '', assignedTo: '',
    status: 'Pending', priority: 'Medium', dueDate: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/users').then((r) => setUsers(r.data));
    api.get('/projects').then((r) => setProjects(r.data));
  }, []);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.project || !form.assignedTo || !form.dueDate) {
      return setError('All required fields must be filled');
    }
    try {
      await api.post('/tasks', form);
      navigate('/tasks');
    } catch (err) {
      setError(err?.response?.data?.message || 'Create failed');
    }
  };

  return (
    <div className="container">
      <h1 className="title">New Task</h1>
      <form className="form card" onSubmit={submit}>
        <label>Title <input value={form.title} onChange={update('title')} required /></label>
        <label>Description <textarea value={form.description} onChange={update('description')} /></label>
        <label>Project
          <select value={form.project} onChange={update('project')} required>
            <option value="">Select project</option>
            {projects.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
          </select>
        </label>
        <label>Assigned to
          <select value={form.assignedTo} onChange={update('assignedTo')} required>
            <option value="">Select member</option>
            {users.map((u) => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
          </select>
        </label>
        <label>Status
          <select value={form.status} onChange={update('status')}>
            <option>Pending</option><option>In Progress</option><option>Completed</option>
          </select>
        </label>
        <label>Priority
          <select value={form.priority} onChange={update('priority')}>
            <option>Low</option><option>Medium</option><option>High</option>
          </select>
        </label>
        <label>Due date <input type="date" value={form.dueDate} onChange={update('dueDate')} required /></label>
        {error && <div className="error">{error}</div>}
        <button className="btn">Create task</button>
      </form>
    </div>
  );
}
