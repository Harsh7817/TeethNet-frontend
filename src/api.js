import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export async function signup(email, password, name) {
  const { data } = await api.post('/auth/signup', { email, password, name });
  localStorage.setItem('token', data.token);
  return data;
}

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', data.token);
  return data;
}

export async function submitImage(file) {
  const form = new FormData();
  form.append('image', file);
  const { data } = await api.post('/submit', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}

export async function getStatus(jobId) {
  const { data } = await api.get(`/status/${jobId}`);
  return data;
}

export async function streamFile(fileId) {
  // For direct viewing you just build the URL: `${API_BASE}/files/${fileId}`
  return `${API_BASE}/files/${fileId}`;
}

export function logout() {
  localStorage.removeItem('token');
}

export async function checkHealth() {
  try {
    const { data } = await api.get('/health');
    return data;
  } catch (e) {
    console.warn('Health check failed:', e);
    return { status: 'error' };
  }
}