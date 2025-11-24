import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const navItems = [
    { path: '/clients', label: 'Clients', icon: '👥' },
    { path: '/invoices', label: 'Invoices', icon: '📄' },
  ];
  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleLogout = () => {
    signOut();
    setOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 bg-gray-800 text-white p-2 rounded"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <span className="text-2xl">☰</span>
      </button>

      {/* Overlay/Drawer sidebar for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-20 transition-opacity ${open ? 'block' : 'hidden md:hidden'}`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-30 transform
          ${open ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-200
          md:static md:translate-x-0 md:block md:min-h-screen md:w-64
          p-4
        `}
        style={{ minHeight: '100vh' }}
      >
        <div className="flex mb-8 justify-between items-center">
          <h1 className="text-2xl font-bold">Invoice Generator</h1>
          {/* Close button for mobile */}
          <button className="md:hidden" onClick={() => setOpen(false)} aria-label="Close sidebar">
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setOpen(false)}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-10 border-t border-gray-700 pt-4">
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Signed in as</p>
          <p className="text-white font-semibold truncate">{user?.name || 'Unknown user'}</p>
          <button
            onClick={handleLogout}
            className="mt-4 w-full px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm font-medium transition-colors"
          >
            Log out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

