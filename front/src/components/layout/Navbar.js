import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="font-semibold">Picture Convert</div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.email || user?.username}</span>
          <button
            onClick={logout}
            className="bg-gray-800 text-white text-sm px-3 py-1.5 rounded hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}


