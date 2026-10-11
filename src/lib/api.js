import { getToken, clearToken } from './auth-storage';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function request(path, { method = 'GET', body } = {}) {
  const token = getToken();
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    });
  } catch {
    throw new Error('Cannot reach the API. Is the backend running?');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // An expired or invalid session on a protected call: tell the app to sign the user out
    if (res.status === 401 && token && !path.startsWith('/auth/login')) {
      clearToken();
      window.dispatchEvent(new Event('auth:expired'));
    }
    const err = new Error(data.message || `Request failed (${res.status})`);
    err.details = data.details;
    err.status = res.status;
    throw err;
  }
  return data;
}

const post = (path, body = {}) => request(path, { method: 'POST', body });

export const api = {
    login: (email, password, portal) => post('/auth/login', { email, password, portal }),
  register: (name, email, password) => post('/auth/register', { name, email, password }),
  me: () => request('/auth/me'),
  policy: () => request('/policy'),
  summary: () => request('/claims/summary'),
  listClaims: ({ status, q } = {}) => {
    const p = new URLSearchParams();
    if (status) p.set('status', status);
    if (q) p.set('q', q);
    return request(`/claims?${p}`);
  },
  getClaim: (id) => request(`/claims/${id}`),
  createClaim: (body) => post('/claims', body),
  reanalyse: (id) => post(`/claims/${id}/reanalyse`),
  approve: (id, note) => post(`/claims/${id}/approve`, { note }),
  reject: (id, note) => post(`/claims/${id}/reject`, { note }),
  override: (id, category, reason) => post(`/claims/${id}/override`, { category, reason }),
  requestClarification: (id, question) => post(`/claims/${id}/clarifications`, { question }),
  answerClarification: (id, cid, answer) => post(`/claims/${id}/clarifications/${cid}/answer`, { answer }),
};
