
import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const ForgotPasswordForm = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');
  const { forgotPassword, error, clearError } = useAuth();

  const validateEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearError();
    setValidationError('');

    if (!email.trim()) {
      setValidationError('Email is required');
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setValidationError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      // Error is handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (validationError) setValidationError('');
    if (error) clearError();
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Email Sent!</h2>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <p className="mb-2">Password reset email has been sent to:</p>
            <p className="font-semibold">{email}</p>
            <p className="mt-2 text-sm">Please check your inbox and follow the instructions to reset your password.</p>
          </div>
          <button
            onClick={onBack}
            className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={16} />
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <Mail className="mx-auto h-12 w-12 text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
        <p className="text-gray-600 mt-2">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              validationError 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Enter your email address"
            required
            autoComplete="email"
          />
          {validationError && (
            <p className="mt-1 text-sm text-red-600">{validationError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Mail size={16} />
          {loading ? 'Sending...' : 'Send Reset Email'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 hover:underline flex items-center gap-2 mx-auto"
        >
          <ArrowLeft size={16} />
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;