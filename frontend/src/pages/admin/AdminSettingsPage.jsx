import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function AdminSettingsPage() {
  const navigate = useNavigate();

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
          <h1 className="text-3xl font-bold mb-8">Admin Settings</h1>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">General Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Title</label>
                  <input
                    type="text"
                    defaultValue="Tamil Panchagam"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select className="w-full px-4 py-2 border rounded-lg">
                    <option>Asia/Kolkata (IST)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select className="w-full px-4 py-2 border rounded-lg">
                    <option>Tamil</option>
                    <option>English</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">API Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">API Rate Limit</label>
                  <input
                    type="number"
                    defaultValue="100"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scraper Timeout</label>
                  <input
                    type="number"
                    defaultValue="10"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <p className="text-sm text-gray-500 mt-1">in seconds</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Backup Retention</label>
                  <input
                    type="number"
                    defaultValue="90"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <p className="text-sm text-gray-500 mt-1">in days</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t">
            <button className="btn-primary">Save Settings</button>
          </div>
        </div>
      </div>
    </main>
  );
}
