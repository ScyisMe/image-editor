import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

export default function UserSidebar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <aside className="bg-white border border-gray-200 rounded-lg p-4 h-fit">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
          {(user?.email || '?').slice(0, 1).toUpperCase()}
        </div>
        <div>
          <div className="font-medium">{user?.email}</div>
          <div className="text-xs text-gray-500">ID: {user?.id}</div>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span>Status</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
            {user?.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Verified</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
            {user?.is_verified ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Superuser</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
            {user?.is_superuser ? 'Yes' : 'No'}
          </span>
        </div>
      </div>

      <button
        onClick={logout}
        className="mt-4 w-full bg-gray-800 text-white text-sm px-3 py-2 rounded hover:bg-gray-700"
      >
        Logout
      </button>
    </aside>
  );
}


