import axios from 'axios';
import type { AuthResponse, Blog, CreateBlogPayload, LoginPayload, RegisterPayload, UpdateBlogPayload } from '../types/api';

const API_BASE_URL = 'http://localhost:3000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await api.post('/register', payload);
    return response.data;
  },
  
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await api.post('/login', payload);
    return response.data;
  },
};

// Blog API
export const blogAPI = {
  getBlogs: async (): Promise<{ blogs: Blog[] }> => {
    const response = await api.get('/api/blogs');
    return response.data;
  },
  
  getBlog: async (id: string): Promise<{ blog: Blog }> => {
    const response = await api.get(`/api/blogs/${id}`);
    return response.data;
  },
  
  createBlog: async (payload: CreateBlogPayload): Promise<{ blog: Blog }> => {
    const response = await api.post('/api/blogs', payload);
    return response.data;
  },
  
  updateBlog: async (id: string, payload: UpdateBlogPayload): Promise<{ blog: Blog }> => {
    const response = await api.put(`/api/blogs/${id}`, payload);
    return response.data;
  },
  
  deleteBlog: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/api/blogs/${id}`);
    return response.data;
  },
};

export default api;
