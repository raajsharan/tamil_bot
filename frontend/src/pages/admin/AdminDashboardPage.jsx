import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import { LogOut, Settings, BarChart3, Clock } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token, admin, logout } = useAuthStore();

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await client.get('/admin/dashboard');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-text">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {admin?.name}</span>
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:text-red-700">
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container py-12">
        {loading ? (
          <div className="text-center">
            <p>Loading dashboard...</p>
          </div>
        ) : stats ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Statistics Cards */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600">Total Dates</h3>
                <BarChart3 className="text-tamil" size={24} />
              </div>
              <p className="text-4xl font-bold text-tamil">{stats.totalDates}</p>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600">Verified</h3>
                <Clock className="text-green-600" size={24} />
              </div>
              <p className="text-4xl font-bold text-green-600">{stats.verifiedDates}</p>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600">Verification Rate</h3>
                <Settings className="text-blue-600" size={24} />
              </div>
              <p className="text-4xl font-bold text-blue-600">{stats.verificationRate}%</p>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600">Today's Logs</h3>
                <Clock className="text-purple-600" size={24} />
              </div>
              <p className="text-4xl font-bold text-purple-600">{stats.logsToday}</p>
            </div>
          </div>
        ) : null}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-8">
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/admin/calendar')}
                className="w-full btn-primary text-left"
              >
                📅 Manage Calendar
              </button>
              <button
                onClick={() => navigate('/admin/logs')}
                className="w-full btn-secondary text-left"
              >
                📋 View Logs
              </button>
              <button
                onClick={() => navigate('/admin/settings')}
                className="w-full btn-secondary text-left"
              >
                ⚙️ Settings
              </button>
            </div>
          </div>

          <div className="card p-8">
            <h2 className="text-2xl font-bold mb-6">System Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                <span>Database</span>
                <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm">Connected</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                <span>API Server</span>
                <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm">Running</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                <span>Telegram Bot</span>
                <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
