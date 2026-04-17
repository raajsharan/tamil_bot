import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuthStore } from '../store/authStore';
import { ArrowLeft } from 'lucide-react';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchLogs(1);
  }, []);

  const fetchLogs = async (page) => {
    try {
      setLoading(true);
      const response = await client.get('/admin/logs', {
        params: { page, limit: 20 },
      });
      if (response.data.success) {
        setLogs(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const getActionBadge = (action) => {
    const colors = {
      login: 'bg-blue-100 text-blue-800',
      logout: 'bg-gray-100 text-gray-800',
      create: 'bg-green-100 text-green-800',
      update: 'bg-yellow-100 text-yellow-800',
      delete: 'bg-red-100 text-red-800',
      verify: 'bg-purple-100 text-purple-800',
      scrape: 'bg-indigo-100 text-indigo-800',
    };
    return colors[action] || 'bg-gray-100 text-gray-800';
  };

  return (
    <main className="min-h-screen bg-gray-100 py-12">
      <div className="container">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 mb-8 text-tamil hover:text-orange-600"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="card p-8">
          <h1 className="text-3xl font-bold mb-8">Activity Logs</h1>

          {loading ? (
            <div className="text-center py-12">
              <p>Loading logs...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto mb-8">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-3 px-4">Action</th>
                      <th className="text-left py-3 px-4">Admin</th>
                      <th className="text-left py-3 px-4">Entity</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getActionBadge(log.action)}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-4">{log.admin?.name || 'System'}</td>
                        <td className="py-3 px-4">{log.entity || '-'}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              log.status === 'success'
                                ? 'bg-green-100 text-green-800'
                                : log.status === 'failure'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{formatDate(log.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-8">
                <div className="text-gray-600">
                  Showing {logs.length} of {pagination.total} logs
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => fetchLogs(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <span className="px-4 py-2 border rounded-lg">
                    Page {pagination.page} of {pagination.pages}
                  </span>

                  <button
                    onClick={() => fetchLogs(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
