import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      await signup(form);
      navigate('/dashboard');
    } catch (err) {
      const msg = err?.response?.data?.message
        || err?.response?.data?.errors?.[0]?.msg
        || 'Signup failed';
      setError(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="container">
      <h1 className="title">Sign up</h1>
      <form className="form card" onSubmit={submit}>
        <label>Name <input value={form.name} onChange={update('name')} required /></label>
        <label>Email <input type="email" value={form.email} onChange={update('email')} required /></label>
        <label>Password <input type="password" value={form.password} onChange={update('password')} required minLength={6} /></label>
        <label>Role
          <select value={form.role} onChange={update('role')}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        {error && <div className="error">{error}</div>}
        <button className="btn" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>
        <p className="muted">Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}
