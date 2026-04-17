import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { Calendar } from 'lucide-react';

export default function CalendarPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [monthData, setMonthData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMonthData();
  }, [year, month]);

  const fetchMonthData = async () => {
    try {
      setLoading(true);
      const response = await client.get(`/public/month/${year}/${month}`);
      if (response.data.success) {
        setMonthData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching month data:', error);
    } finally {
      setLoading(false);
    }
  };

  const daysInMonth = (y, m) => new Date(y, m, 0).getDate();
  const firstDayOfMonth = (y, m) => new Date(y, m - 1, 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayOfMonth(year, month); i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth(year, month); i++) {
    days.push(i);
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const getDataForDate = (day) => {
    const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return monthData.find((item) => item.dateString === dateString);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="container">
        <h1 className="section-title text-center">📅 Calendar {year}</h1>

        <div className="card p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setMonth(month === 1 ? 12 : month - 1)}
              className="btn-secondary"
            >
              ← Previous
            </button>

            <div className="flex items-center gap-6">
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="px-4 py-2 border rounded-lg"
              >
                {monthNames.map((m, i) => (
                  <option key={i} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="px-4 py-2 border rounded-lg"
              >
                {[year - 2, year - 1, year, year + 1, year + 2].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setMonth(month === 12 ? 1 : month + 1)}
              className="btn-secondary"
            >
              Next →
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p>Loading calendar data...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center font-bold text-gray-600 p-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => (
                  <div
                    key={index}
                    className="aspect-square p-2 border rounded-lg bg-white"
                  >
                    {day && (
                      <div className="h-full flex flex-col">
                        <div className="font-bold text-tamil">{day}</div>
                        {getDataForDate(day) && (
                          <div className="text-xs text-gray-600 overflow-hidden">
                            {getDataForDate(day).tamilDate}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
