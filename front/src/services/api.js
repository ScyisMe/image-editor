import { API_BASE_URL } from '../utils/contens';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      credentials: 'include',
      ...options,
    };

    // Override headers if provided
    if (options.headers) {
      config.headers = { ...config.headers, ...options.headers };
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return response;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }

  async uploadFile(endpoint, file, options = {}) {
    const formData = new FormData();
    formData.append('file', file);
    // Support passing simple extra fields
    if (options.bodyFields && typeof options.bodyFields === 'object') {
      Object.entries(options.bodyFields).forEach(([k, v]) => formData.append(k, v));
    }

    const token = localStorage.getItem('token');
    let url = `${this.baseURL}${endpoint}`;
    if (options.queryParams && typeof options.queryParams === 'object') {
      const qs = new URLSearchParams();
      Object.entries(options.queryParams).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') qs.append(k, String(v));
      });
      const sep = url.includes('?') ? '&' : '?';
      url = `${url}${sep}${qs.toString()}`;
    }
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
      credentials: 'include',
      ...options,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await res.json();
    }

    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    return { blob, url: objectUrl, contentType };
  }

  async uploadFileJson(endpoint, file, extraFields = {}, options = {}) {
    const formData = new FormData();
    formData.append('file', file);
    for (const [key, value] of Object.entries(extraFields)) {
      formData.append(key, value);
    }

    const token = localStorage.getItem('token');
    const url = `${this.baseURL}${endpoint}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
      credentials: 'include',
      ...options,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    return await res.json();
  }

  async loginWithFormData(endpoint, credentials) {
    const body = new URLSearchParams();
    body.append('username', credentials.email);
    body.append('password', credentials.password);

    const url = `${this.baseURL}${endpoint}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body,
      credentials: 'include',
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    // Try parse JSON regardless of content-type quirks
    const rawText = await res.text();
    let data = {};
    try { data = JSON.parse(rawText); } catch (_) {}
    const tokenFromHeader = res.headers.get('Authorization') || res.headers.get('authorization') || '';
    return { data, rawText, tokenFromHeader };
  }
}

export const apiService = new ApiService();
export default apiService;