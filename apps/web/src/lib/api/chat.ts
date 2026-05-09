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

export async function getRooms() {
  return authFetch(`${API_URL}/chat/rooms`);
}

export async function getRoomMessages(roomId: string, page = 1, limit = 50) {
  return authFetch(`${API_URL}/chat/rooms/${roomId}/messages?page=${page}&limit=${limit}`);
}

export async function getUnreadCount() {
  return authFetch(`${API_URL}/chat/unread`);
}

export async function createRoom(data: { agentId: string; carId: string; calculationData?: any }) {
  return authFetch(`${API_URL}/chat/rooms`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
