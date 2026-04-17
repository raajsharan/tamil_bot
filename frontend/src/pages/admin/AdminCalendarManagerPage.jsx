import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import { ArrowLeft, Save } from 'lucide-react';

export default function AdminCalendarManagerPage() {
  const [dateString, setDateString] = useState('');
  const [calendarData, setCalendarData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!dateString) return;

    try {
      setLoading(true);
      const response = await client.get(`/admin/calendar/${dateString}`);
      if (response.data.success) {
        setCalendarData(response.data.data);
        setMessage('');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Date not found');
      setCalendarData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!calendarData) return;

    try {
      setSaving(true);
      const response = await client.post('/admin/calendar', {
        dateString,
        ...calendarData,
      });

      if (response.data.success) {
        setMessage('Calendar saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving calendar');
    } finally {
      setSaving(false);
    }
  };

  const handleVerify = async () => {
    if (!calendarData) return;

    try {
      setSaving(true);
      const response = await client.post(`/admin/calendar/${dateString}/verify`);

      if (response.data.success) {
        setCalendarData(response.data.data);
        setMessage('Calendar verified successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error verifying calendar');
    } finally {
      setSaving(false);
    }
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

        <div className="card p-8 mb-8">
          <h1 className="text-3xl font-bold mb-6">Calendar Manager</h1>

          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <input
              type="date"
              value={dateString}
              onChange={(e) => setDateString(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tamil"
            />
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Loading...' : 'Search'}
            </button>
          </form>

          {message && (
            <div
              className={`p-4 mb-6 rounded-lg ${
                message.includes('successfully')
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-red-100 text-red-700 border border-red-300'
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {calendarData && (
          <div className="card p-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-bold mb-4">Tithi (Lunar Day)</h3>
                <input
                  type="text"
                  placeholder="Tithi name"
                  value={calendarData.tithi?.name || ''}
                  onChange={(e) =>
                    setCalendarData({
                      ...calendarData,
                      tithi: { ...calendarData.tithi, name: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg mb-2"
                />
                <input
                  type="time"
                  placeholder="Start time"
                  value={calendarData.tithi?.startTime || ''}
                  onChange={(e) =>
                    setCalendarData({
                      ...calendarData,
                      tithi: { ...calendarData.tithi, startTime: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Nakshatram (Star)</h3>
                <input
                  type="text"
                  placeholder="Nakshatram name"
                  value={calendarData.nakshatram?.name || ''}
                  onChange={(e) =>
                    setCalendarData({
                      ...calendarData,
                      nakshatram: { ...calendarData.nakshatram, name: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg mb-2"
                />
                <input
                  type="time"
                  placeholder="Start time"
                  value={calendarData.nakshatram?.startTime || ''}
                  onChange={(e) =>
                    setCalendarData({
                      ...calendarData,
                      nakshatram: { ...calendarData.nakshatram, startTime: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Sunrise & Sunset</h3>
                <input
                  type="time"
                  placeholder="Sunrise"
                  value={calendarData.sunrise || ''}
                  onChange={(e) => setCalendarData({ ...calendarData, sunrise: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg mb-2"
                />
                <input
                  type="time"
                  placeholder="Sunset"
                  value={calendarData.sunset || ''}
                  onChange={(e) => setCalendarData({ ...calendarData, sunset: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Rahu Kalam</h3>
                <input
                  type="time"
                  placeholder="Start"
                  value={calendarData.rahuKalam?.startTime || ''}
                  onChange={(e) =>
                    setCalendarData({
                      ...calendarData,
                      rahuKalam: { ...calendarData.rahuKalam, startTime: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg mb-2"
                />
                <input
                  type="time"
                  placeholder="End"
                  value={calendarData.rahuKalam?.endTime || ''}
                  onChange={(e) =>
                    setCalendarData({
                      ...calendarData,
                      rahuKalam: { ...calendarData.rahuKalam, endTime: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={handleSave} disabled={saving} className="flex-1 btn-primary">
                <Save className="inline mr-2" size={20} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleVerify}
                disabled={saving || calendarData.verified}
                className={`flex-1 ${calendarData.verified ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white px-6 py-3 rounded-lg font-semibold transition-colors`}
              >
                {calendarData.verified ? '✓ Verified' : 'Verify Data'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
