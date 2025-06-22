import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://coda-pay.vercel.app/api' // Replace with your actual production backend URL
  : 'http://localhost:5000/api';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  adminLogin: (credentials) => apiClient.post('/auth/admin-login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  getMe: () => apiClient.get('/auth/me'),
  logout: () => apiClient.post('/auth/logout'),
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', email),
  resetPassword: (token, password) => apiClient.put(`/auth/reset-password/${token}`, password),
};

// Tasks API
export const tasksAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/tasks${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => apiClient.get(`/tasks/${id}`),
  create: (taskData) => apiClient.post('/tasks', taskData),
  update: (id, taskData) => apiClient.put(`/tasks/${id}`, taskData),
  delete: (id) => apiClient.delete(`/tasks/${id}`),
  updateProgress: (id, progress) => apiClient.put(`/tasks/${id}/progress`, { progress }),
  addComment: (id, text) => apiClient.post(`/tasks/${id}/comment`, { text }),
};

// Users API
export const usersAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/users${queryString ? `?${queryString}` : ''}`);
  },
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (profileData) => apiClient.put('/users/profile', profileData),
  changePassword: (currentPassword, newPassword) => apiClient.put('/users/password', { currentPassword, newPassword }),
  update: (id, userData) => apiClient.put(`/users/${id}`, userData),
  delete: (id) => apiClient.delete(`/users/${id}`),
};

// Vacancies API
export const vacanciesAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/vacancies${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => apiClient.get(`/vacancies/${id}`),
  create: (vacancyData) => apiClient.post('/vacancies', vacancyData),
  update: (id, vacancyData) => apiClient.put(`/vacancies/${id}`, vacancyData),
  delete: (id) => apiClient.delete(`/vacancies/${id}`),
};

// Applications API
export const applicationsAPI = {
  getAll: () => apiClient.get('/applications'),
  getById: (id) => apiClient.get('/applications/${id}'),
  create: (applicationData) => apiClient.post('/applications', applicationData),
  updateStatus: (id, status) => apiClient.put(`/applications/${id}/status`, { status }),
  delete: (id) => apiClient.delete(`/applications/${id}`),
  addDocuments: (id, documents) => apiClient.post(`/applications/${id}/documents`, { documents }),
};

// Submissions API
export const submissionsAPI = {
  create: (data) => apiClient.post('/submissions', data),
  getByTaskId: (taskId) => apiClient.get(`/submissions?taskId=${taskId}`),
};

// Health check
export const healthCheck = () => apiClient.get('/health');

export default apiClient; 