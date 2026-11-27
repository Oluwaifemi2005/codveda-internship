
import { useCallback, useEffect, useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';

const Dashboard = () => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get(`/tasks?page=${page}&limit=5`);

      const fetchedTasks = response.data.tasks;
      const pagination = response.data.pagination;

      setTasks(fetchedTasks);
      setTotalPages(pagination.totalPages);

      const completed = fetchedTasks.filter(
        (task) => task.completed
      ).length;

      setStats({
        total: pagination.total,
        completed,
        pending: pagination.total - completed,
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({ title: '', description: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editingId) {
        await api.put(`/tasks/${editingId}`, formData);
      } else {
        await api.post('/tasks', formData);
      }

      resetForm();

      if (!editingId && page !== 1) {
        setPage(1);
      } else {
        await fetchTasks();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save task.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description || '',
    });

    setEditingId(task._id);
    setShowForm(true);
  };

  const handleToggle = async (task) => {
    try {
      await api.put(`/tasks/${task._id}`, {
        completed: !task.completed,
      });

      await fetchTasks();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update task.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await api.delete(`/tasks/${id}`);

      if (tasks.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await fetchTasks();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete task.');
    }
  };

  return (
    <>
      <Navbar />

      <main className="dashboard">
        <section className="dashboard-heading">
          <div>
            <span className="eyebrow">YOUR WORKSPACE</span>
            <h1>Hello, {user?.name}</h1>
            <p>Keep track of your work and get things done.</p>
          </div>

          <button
            className="primary-btn"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <Plus size={18} />
            New Task
          </button>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span>Total Tasks</span>
            <strong>{stats.total}</strong>
          </div>

          <div className="stat-card">
            <span>Completed</span>
            <strong>{stats.completed}</strong>
          </div>

          <div className="stat-card">
            <span>Pending</span>
            <strong>{stats.pending}</strong>
          </div>
        </section>

        {showForm && (
          <form className="task-form" onSubmit={handleSubmit}>
            <h2>{editingId ? 'Edit Task' : 'Create a New Task'}</h2>

            <label>Task title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              required
            />

            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add some details..."
              rows={3}
            />

            <div className="form-actions">
              <button type="button" className="secondary-btn" onClick={resetForm}>
                Cancel
              </button>

              <button type="submit" className="primary-btn" disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        )}

        <section className="tasks-section">
          <div className="section-heading">
            <div>
              <h2>Your Tasks</h2>
              <p>Manage everything you need to get done.</p>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <p className="empty-state">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <h3>No tasks yet</h3>
              <p>Create your first task to get started.</p>
            </div>
          ) : (
            <div className="tasks-list">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage((current) => current - 1)}
              >
                <ChevronLeft size={18} />
                Previous
              </button>

              <span>Page {page} of {totalPages}</span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default Dashboard;
