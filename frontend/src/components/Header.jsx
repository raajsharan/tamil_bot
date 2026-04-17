import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Moon, Users } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <Calendar className="text-tamil" size={32} />
          <span className="text-2xl font-bold gradient-text">Tamil Panchagam</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-700 hover:text-tamil transition">
            Home
          </Link>
          <Link to="/calendar" className="text-gray-700 hover:text-tamil transition">
            Calendar
          </Link>
          <Link to="/festivals" className="text-gray-700 hover:text-tamil transition">
            Festivals
          </Link>
          <Link to="/search" className="text-gray-700 hover:text-tamil transition">
            Search
          </Link>
          <Link to="/admin/login" className="btn-primary text-sm">
            Admin
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
    </header>
  );
}
