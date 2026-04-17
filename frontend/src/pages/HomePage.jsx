import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { useCalendarStore } from '../store/calendarStore';
import { Sun, Moon, Wind, Flame } from 'lucide-react';

export default function HomePage() {
  const { today, setToday, setLoading, setError } = useCalendarStore();
  const [localToday, setLocalToday] = useState(null);

  useEffect(() => {
    fetchToday();
  }, []);

  const fetchToday = async () => {
    try {
      setLoading(true);
      const response = await client.get('/public/today');
      if (response.data.success) {
        setLocalToday(response.data.data);
        setToday(response.data.data);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const data = localToday || today;

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 py-12">
      <div className="container">
        <h1 className="text-5xl font-bold text-white mb-2 text-center">வாழ்க தமிழ்</h1>
        <p className="text-xl text-gray-100 text-center mb-12">Today's Panchangam</p>

        {data ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Main Card */}
            <div className="lg:col-span-3 card p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-3xl font-bold gradient-text mb-6">{data.dateString}</h2>
                  {data.tamilDate && <p className="text-lg tamil-font text-gray-700 mb-4">{data.tamilDate}</p>}

                  <div className="space-y-3">
                    {data.tithi?.name && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">திதி (Tithi):</span>
                        <span className="font-semibold">{data.tithi.name}</span>
                      </div>
                    )}
                    {data.nakshatram?.name && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">நட்ஷத்திரம் (Nakshatram):</span>
                        <span className="font-semibold">{data.nakshatram.name}</span>
                      </div>
                    )}
                    {data.yogam?.name && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">யோகம் (Yoga):</span>
                        <span className="font-semibold">{data.yogam.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
                    <Sun className="text-yellow-500" size={24} />
                    <div>
                      <p className="text-sm text-gray-600">Sunrise</p>
                      <p className="text-xl font-bold">{data.sunrise || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                    <Moon className="text-blue-500" size={24} />
                    <div>
                      <p className="text-sm text-gray-600">Sunset</p>
                      <p className="text-xl font-bold">{data.sunset || 'N/A'}</p>
                    </div>
                  </div>

                  {data.rahuKalam?.startTime && (
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg">
                      <Flame className="text-red-500" size={24} />
                      <div>
                        <p className="text-sm text-gray-600">Rahu Kalam</p>
                        <p className="text-xl font-bold">
                          {data.rahuKalam.startTime} - {data.rahuKalam.endTime}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {data.festivals && data.festivals.length > 0 && (
                <div className="mt-8 pt-8 border-t">
                  <h3 className="text-xl font-bold mb-4">🎉 Festivals Today</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.festivals.map((festival, index) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                        <p className="font-semibold text-gray-800">{festival.name}</p>
                        {festival.description && <p className="text-sm text-gray-600 mt-1">{festival.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="card p-12 text-center">
            <p className="text-xl text-gray-600">Loading today's data...</p>
          </div>
        )}
      </div>
    </main>
  );
}
