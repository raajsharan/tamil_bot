import React, { useState } from 'react';
import client from '../../api/client';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      const response = await client.get('/public/search', {
        params: { q: query },
      });
      if (response.data.success) {
        setResults(response.data.data);
      }
    } catch (error) {
      console.error('Error searching:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12">
      <div className="container">
        <h1 className="section-title text-center">🔍 Search Calendar</h1>

        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="card p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by date (YYYY-MM-DD) or festival name..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tamil"
                />
              </div>
              <button type="submit" className="btn-primary">
                Search
              </button>
            </div>
          </form>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-xl">Searching...</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {results.map((item, index) => (
              <div key={index} className="card p-6">
                <h3 className="text-lg font-bold text-tamil mb-3">{item.dateString}</h3>
                {item.tamilDate && <p className="tamil-font text-gray-600 mb-4">{item.tamilDate}</p>}

                <div className="space-y-2 text-sm">
                  {item.tithi?.name && <div>திதி: {item.tithi.name}</div>}
                  {item.nakshatram?.name && <div>நட்ஷத்திரம்: {item.nakshatram.name}</div>}
                  {item.sunrise && <div>🌅 Sunrise: {item.sunrise}</div>}
                  {item.sunset && <div>🌇 Sunset: {item.sunset}</div>}
                </div>

                {item.festivals?.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="font-semibold mb-2">🎉 Festivals:</p>
                    {item.festivals.map((f, i) => (
                      <p key={i} className="text-sm text-gray-700">
                        • {f.name}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && results.length === 0 && query && (
          <div className="text-center py-12 card p-8">
            <p className="text-xl text-gray-600">No results found for "{query}"</p>
          </div>
        )}
      </div>
    </main>
  );
}
