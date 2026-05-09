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

export async function registerAsAgent(data: any) {
  return authFetch(`${API_URL}/users/register-agent`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getMe() {
  return authFetch(`${API_URL}/users/me`);
}
