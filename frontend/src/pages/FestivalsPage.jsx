import React, { useState, useEffect } from 'react';
import client from '../api/client';

export default function FestivalsPage() {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFestivals();
  }, []);

  const fetchFestivals = async () => {
    try {
      setLoading(true);
      const response = await client.get('/public/festivals');
      if (response.data.success) {
        setFestivals(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching festivals:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 py-12">
      <div className="container">
        <h1 className="section-title text-center">🎉 Tamil Festivals</h1>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl">Loading festivals...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {festivals.map((festival, index) => (
              <div key={index} className="card p-6 hover:shadow-xl transition">
                <div className="text-3xl mb-3">{festival.type === 'major' ? '🏛️' : '📿'}</div>
                <h3 className="text-xl font-bold mb-2 text-tamil">{festival.name}</h3>
                {festival.nameTamil && <p className="text-sm tamil-font text-gray-600 mb-2">{festival.nameTamil}</p>}
                <p className="text-sm text-gray-600 mb-3">📅 {festival.date}</p>
                {festival.description && <p className="text-sm text-gray-700">{festival.description}</p>}
              </div>
            ))}
          </div>
        )}

        {!loading && festivals.length === 0 && (
          <div className="text-center py-12 card p-8">
            <p className="text-xl text-gray-600">No festivals found</p>
          </div>
        )}
      </div>
    </main>
  );
}
