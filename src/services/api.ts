import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  withCredentials: true, // send HTTP-only cookie automatically
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor: handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if session expired
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }).then((r) => r.data),

  logout: () =>
    api.post('/api/auth/logout').then((r) => r.data),

  me: () =>
    api.get('/api/auth/me').then((r) => r.data),

  updateStatus: (status: string) =>
    api.put('/api/auth/status', { status }).then((r) => r.data),
};

// ─── Tickets ─────────────────────────────────────────────────────────────────

export const ticketsApi = {
  list: (params?: Record<string, string>) =>
    api.get('/api/tickets', { params }).then((r) => r.data),

  get: (id: string) =>
    api.get(`/api/tickets/${id}`).then((r) => r.data),

  create: (data: Record<string, unknown>) =>
    api.post('/api/tickets', data).then((r) => r.data),

  updateStatus: (id: string, status: string) =>
    api.put(`/api/tickets/${id}/status`, { status }).then((r) => r.data),

  updatePriority: (id: string, priority: string) =>
    api.put(`/api/tickets/${id}/priority`, { priority }).then((r) => r.data),

  addMessage: (id: string, content: string, isInternal: boolean) =>
    api.post(`/api/tickets/${id}/messages`, { content, isInternal }).then((r) => r.data),

  addAnnotation: (id: string, text: string) =>
    api.post(`/api/tickets/${id}/annotations`, { text }).then((r) => r.data),
};

// ─── Clients ─────────────────────────────────────────────────────────────────

export const clientsApi = {
  list: () =>
    api.get('/api/clients').then((r) => r.data),

  get: (id: string) =>
    api.get(`/api/clients/${id}`).then((r) => r.data),
};

// ─── Projects ────────────────────────────────────────────────────────────────

export const projectsApi = {
  list: () =>
    api.get('/api/projects').then((r) => r.data),

  get: (id: string) =>
    api.get(`/api/projects/${id}`).then((r) => r.data),
};

// ─── Knowledge ───────────────────────────────────────────────────────────────

export const knowledgeApi = {
  list: (params?: Record<string, string>) =>
    api.get('/api/knowledge', { params }).then((r) => r.data),

  get: (id: string) =>
    api.get(`/api/knowledge/${id}`).then((r) => r.data),

  create: (data: Record<string, unknown>) =>
    api.post('/api/knowledge', data).then((r) => r.data),

  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/api/knowledge/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/api/knowledge/${id}`).then((r) => r.data),
};

// ─── Notifications ───────────────────────────────────────────────────────────

export const notificationsApi = {
  list: () =>
    api.get('/api/notifications').then((r) => r.data),

  markRead: (id: string) =>
    api.put(`/api/notifications/${id}/read`).then((r) => r.data),

  markAllRead: () =>
    api.put('/api/notifications/read-all').then((r) => r.data),

  listReminders: () =>
    api.get('/api/notifications/reminders').then((r) => r.data),

  createReminder: (data: Record<string, unknown>) =>
    api.post('/api/notifications/reminders', data).then((r) => r.data),

  toggleReminder: (id: string) =>
    api.put(`/api/notifications/reminders/${id}/toggle`).then((r) => r.data),

  deleteReminder: (id: string) =>
    api.delete(`/api/notifications/reminders/${id}`).then((r) => r.data),
};

// ─── Settings ────────────────────────────────────────────────────────────────

export const settingsApi = {
  get: () =>
    api.get('/api/settings').then((r) => r.data),

  update: (data: Record<string, unknown>) =>
    api.put('/api/settings', data).then((r) => r.data),
};

export default api;
