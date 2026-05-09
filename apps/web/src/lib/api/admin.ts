import { apiCall } from './auth';

export const getAdminStats = async () => {
  return apiCall('/users/admin/stats');
};

export const getPendingAgents = async () => {
  return apiCall('/users/admin/agents/pending');
};

export const approveAgent = async (id: string) => {
  return apiCall(`/users/admin/agents/${id}/approve`, {
    method: 'PUT',
  });
};

export const rejectAgent = async (id: string) => {
  return apiCall(`/users/admin/agents/${id}/reject`, {
    method: 'PUT',
  });
};
