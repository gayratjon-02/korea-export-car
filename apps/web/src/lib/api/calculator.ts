import { CountryCode, ICalculationResult, ICountry, ICity } from '@kci/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export async function getCountries(): Promise<ICountry[]> {
  const res = await fetch(`${API_URL}/calculator/countries`, { cache: 'force-cache' });
  if (!res.ok) throw new Error('Failed to fetch countries');
  return res.json();
}

export async function getCities(countryCode: string): Promise<ICity[]> {
  const res = await fetch(`${API_URL}/calculator/cities/${countryCode}`, { cache: 'force-cache' });
  if (!res.ok) throw new Error('Failed to fetch cities');
  return res.json();
}

export async function calculateCost(data: {
  carId: string;
  countryCode: string;
  cityId: string;
}): Promise<ICalculationResult> {
  const res = await fetch(`${API_URL}/calculator/calculate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) throw new Error('Failed to calculate cost');
  return res.json();
}
