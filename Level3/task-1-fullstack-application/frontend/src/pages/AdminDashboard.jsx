
import { useEffect, useState } from 'react';
import { Users, ListTodo, CheckCircle, Clock } from 'lucide-react';

import api from '../services/api';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setStats(response.data.stats);
      } catch (error) {
        setError(
          error.response?.data?.message || 'Failed to load admin dashboard.'
        );
      }
    };

    fetchStats();
  }, []);

  const cards = stats
    ? [
        { label: 'Total Users', value: stats.totalUsers, icon: Users },
        { label: 'Total Tasks', value: stats.totalTasks, icon: ListTodo },
        { label: 'Completed Tasks', value: stats.completedTasks, icon: CheckCircle },
        { label: 'Pending Tasks', value: stats.pendingTasks, icon: Clock },
      ]
    : [];

  return (
    <>
      <Navbar />

      <main className="dashboard">
        <span className="eyebrow">ADMINISTRATION</span>
        <h1>Admin Dashboard</h1>
        <p>Overview of application activity.</p>

        {error && <div className="error-message">{error}</div>}

        {!stats && !error ? (
          <p className="empty-state">Loading statistics...</p>
        ) : (
          <section className="stats-grid admin-stats">
            {cards.map(({ label, value, icon: Icon }) => (
              <div className="stat-card" key={label}>
                <Icon size={22} />
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </section>
        )}
      </main>
    </>
  );
};

export default AdminDashboard;
