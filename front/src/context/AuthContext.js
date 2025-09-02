import React, { createContext, useState, useEffect } from 'react';
import apiService from '../services/api';
import { ENDPOINTS } from '../utils/constants';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      setError(null);
      const userData = await apiService.get(ENDPOINTS.USERS.ME);
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('token');
      setError('Session expired. Please login again.');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);

      const data = await apiService.loginWithFormData(ENDPOINTS.AUTH.LOGIN, credentials);
      
      localStorage.setItem('token', data.access_token);
      await fetchCurrentUser();
      
      return data;
    } catch (error) {
      setError('Invalid email or password');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await apiService.post(ENDPOINTS.AUTH.REGISTER, userData);
      return response;
    } catch (error) {
      setError('Registration failed. Email might already exist.');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setError(null);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setError(null);
      const response = await apiService.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
      return response;
    } catch (error) {
      setError('Failed to send reset email');
      throw error;
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setError(null);
      const response = await apiService.post(ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        new_password: newPassword
      });
      return response;
    } catch (error) {
      setError('Failed to reset password');
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const updatedUser = await apiService.patch(ENDPOINTS.USERS.ME, profileData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      setError('Failed to update profile');
      throw error;
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    clearError,
    fetchCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;