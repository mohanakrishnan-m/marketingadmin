const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '');

async function request(path, options = {}) {
  const {
    token,
    method = 'GET',
    body,
    headers = {},
  } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof payload === 'string'
      ? payload
      : payload.message || Object.values(payload.errors || {}).flat()[0] || 'Request failed.';

    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export const authApi = {
  login(credentials) {
    return request('/login', { method: 'POST', body: credentials });
  },
  register(payload) {
    return request('/register', { method: 'POST', body: payload });
  },
  me(token) {
    return request('/me', { token });
  },
  logout(token) {
    return request('/logout', { method: 'POST', token });
  },
};

export const portalApi = {
  getClients(token) {
    return request('/clients', { token });
  },
  getClient(token, id) {
    return request(`/clients/${id}`, { token });
  },
  createClient(token, payload) {
    return request('/clients', { method: 'POST', token, body: payload });
  },
  updateClient(token, id, payload) {
    return request(`/clients/${id}`, { method: 'PUT', token, body: payload });
  },
  deleteClient(token, id) {
    return request(`/clients/${id}`, { method: 'DELETE', token });
  },
  getTemplates(token) {
    return request('/templates', { token });
  },
  getTemplate(token, id) {
    return request(`/templates/${id}`, { token });
  },
  createTemplate(token, payload) {
    return request('/templates', { method: 'POST', token, body: payload });
  },
  updateTemplate(token, id, payload) {
    return request(`/templates/${id}`, { method: 'PUT', token, body: payload });
  },
  deleteTemplate(token, id) {
    return request(`/templates/${id}`, { method: 'DELETE', token });
  },
  getCampaigns(token) {
    return request('/campaigns', { token });
  },
  createCampaign(token, payload) {
    return request('/campaigns', { method: 'POST', token, body: payload });
  },
  getSettings(token) {
    return request('/settings', { token });
  },
  updateSettings(token, payload) {
    return request('/settings', { method: 'PUT', token, body: payload });
  },
  sendTestMail(token, to) {
    return request('/mail/test', { method: 'POST', token, body: { to } });
  },
  debugMail(token) {
    return request('/mail/debug', { method: 'POST', token });
  },
};
