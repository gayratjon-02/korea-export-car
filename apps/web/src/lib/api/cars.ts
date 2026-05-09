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
  
  return res.json() as Promise<{ data: { items: ICar[], total: number } }>;
}

export async function getCarById(id: string) {
  const res = await fetch(`${API_URL}/cars/${id}`, {
    cache: 'no-store',
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch car');
  }
  
  return res.json() as Promise<{ data: ICar }>;
}
