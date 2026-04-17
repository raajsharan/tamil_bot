import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 gradient-text">Tamil Panchagam</h3>
            <p className="text-gray-400">Complete Tamil Calendar and astrological data with Telegram bot integration.</p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/" className="hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/calendar" className="hover:text-white transition">
                  Calendar
                </a>
              </li>
              <li>
                <a href="/festivals" className="hover:text-white transition">
                  Festivals
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  API Docs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Telegram Bot
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  About
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="mailto:info@tamil-calendar.local" className="hover:text-white transition">
                  Email
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Telegram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex items-center justify-between">
          <p className="text-gray-400">© 2024 Tamil Calendar. All rights reserved.</p>
          <div className="flex items-center gap-2 text-gray-400">
            <span>Made with</span>
            <Heart size={16} className="text-red-500" />
            <span>for Tamil culture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
