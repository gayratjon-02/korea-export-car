const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export async function getAgents() {
  const res = await fetch(`${API_URL}/users/agents`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to fetch agents');
  return res.json();
}

export async function getAgentById(id: string) {
  const res = await fetch(`${API_URL}/users/agents/${id}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to fetch agent');
  return res.json();
}
