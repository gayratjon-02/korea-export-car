import { ICar } from '@kci/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export async function getCars(params?: Record<string, string | number>) {
  const queryString = params 
    ? '?' + new URLSearchParams(params as Record<string, string>).toString() 
    : '';
    
  const res = await fetch(`${API_URL}/cars${queryString}`, {
    cache: 'no-store',
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch cars');
  }
  
  return res.json() as Promise<{ items: ICar[], total: number }>;
}

export async function getCarById(id: string) {
  const res = await fetch(`${API_URL}/cars/${id}`, {
    cache: 'no-store',
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch car');
  }
  
  return res.json() as Promise<ICar>;
}

// Helper for authenticated requests
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

export async function getAgentCars(): Promise<ICar[]> {
  return authFetch(`${API_URL}/cars/agent/my-cars`);
}

export async function createCar(data: any): Promise<ICar> {
  return authFetch(`${API_URL}/cars`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function uploadCarMedia(carId: string, mediaData: { url: string; type: string; sortOrder?: number }) {
  return authFetch(`${API_URL}/cars/${carId}/media`, {
    method: 'POST',
    body: JSON.stringify(mediaData),
  });
}
