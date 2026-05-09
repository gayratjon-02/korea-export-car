const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

async function authFetch(url: string, options: RequestInit = {}) {
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('accessToken') || '';
  }
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || 'API error');
  }
  return res.json();
}

export const getAdminStats = async () => {
  return authFetch(`${API_URL}/users/admin/stats`);
};

export const getPendingAgents = async () => {
  return authFetch(`${API_URL}/users/admin/agents/pending`);
};

export const approveAgent = async (id: string) => {
  return authFetch(`${API_URL}/users/admin/agents/${id}/approve`, {
    method: 'PUT',
  });
};

export const rejectAgent = async (id: string) => {
  return authFetch(`${API_URL}/users/admin/agents/${id}/reject`, {
    method: 'PUT',
  });
};
