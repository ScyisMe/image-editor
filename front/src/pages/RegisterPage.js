import React, { useState } from 'react';
import useAuth from '../hooks/userAuth';

export default function RegisterPage() {
  const { register, error, clearError } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', password2: '' });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    clearError();
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) {
      alert('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register({ email: form.email, password: form.password });
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
        )}
        <form onSubmit={onSubmit} className="grid gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input name="email" type="email" value={form.email} onChange={onChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input name="password" type="password" value={form.password} onChange={onChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Confirm password</label>
            <input name="password2" type="password" value={form.password2} onChange={onChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Registering…' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}


