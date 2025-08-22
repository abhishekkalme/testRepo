import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Layout({ children, showNavigation = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/create-quiz', label: 'Create Quiz', icon: '➕' },
    { path: '/view', label: 'Take Quiz', icon: '📝' },
    { path: '/group-results', label: 'Results', icon: '📊' },
    { path: '/history', label: 'History', icon: '📚' },
  ];

  if (!showNavigation) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-slate-800">QuizMaster</h1>
              <nav className="hidden md:flex space-x-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">Welcome, {username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white border-b border-slate-200">
        <div className="px-4 py-2">
          <div className="flex space-x-1 overflow-x-auto">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex-shrink-0 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span className="block">{item.icon}</span>
                <span className="block mt-1">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}