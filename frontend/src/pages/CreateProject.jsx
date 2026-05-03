import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function CreateProject() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', deadline: '', members: [] });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => { api.get('/users').then((r) => setUsers(r.data)); }, []);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const toggleMember = (id) => {
    setForm((f) => ({
      ...f,
      members: f.members.includes(id) ? f.members.filter((x) => x !== id) : [...f.members, id],
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.deadline) return setError('Title and deadline are required');
    try {
      await api.post('/projects', form);
      navigate('/projects');
    } catch (err) {
      setError(err?.response?.data?.message || 'Create failed');
    }
  };

  return (
    <div className="container">
      <h1 className="title">New Project</h1>
      <form className="form card" onSubmit={submit}>
        <label>Title <input value={form.title} onChange={update('title')} required /></label>
        <label>Description <textarea value={form.description} onChange={update('description')} /></label>
        <label>Deadline <input type="date" value={form.deadline} onChange={update('deadline')} required /></label>
        <label>Members</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {users.map((u) => (
            <label key={u._id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <input type="checkbox" checked={form.members.includes(u._id)} onChange={() => toggleMember(u._id)} />
              {u.name} <span className={`badge ${u.role === 'admin' ? 'admin' : 'member'}`}>{u.role}</span>
            </label>
          ))}
        </div>
        {error && <div className="error">{error}</div>}
        <button className="btn">Create project</button>
      </form>
    </div>
  );
}
