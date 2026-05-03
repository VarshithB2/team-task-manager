import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user } = useAuth();
  return (
    <>
      <section className="hero">
        <h1>Plan projects. Assign tasks. Ship work.</h1>
        <p>A clean, role-based team task manager built with the MERN stack. Admins manage everything, members focus on what's theirs.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {user ? (
            <Link to="/dashboard" className="btn">Go to dashboard</Link>
          ) : (
            <>
              <Link to="/signup" className="btn">Get started</Link>
              <Link to="/login" className="btn secondary">Login</Link>
            </>
          )}
        </div>
      </section>
      <div className="container">
        <div className="grid cols-3">
          <div className="card"><h3>Projects</h3><p className="muted">Create projects with deadlines and assign team members.</p></div>
          <div className="card"><h3>Tasks</h3><p className="muted">Assign work with priority, due date and live status updates.</p></div>
          <div className="card"><h3>Dashboard</h3><p className="muted">See pending, in‑progress, completed and overdue tasks at a glance.</p></div>
        </div>
      </div>
    </>
  );
}
