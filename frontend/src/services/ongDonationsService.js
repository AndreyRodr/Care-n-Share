import api from './api.js';
import { ALL } from '../constants/filters.js';

export async function getOngDonations(filters = {}) {
  const params = {};

  if (filters.search) {
    params.search = filters.search;
  }

  if (filters.status && filters.status !== ALL) {
    params.status = filters.status;
  }

  if (filters.type && filters.type !== ALL) {
    params.type = filters.type;
  }

  const response = await api.get('/api/ong/donations', { params });
  return response.data;
}

export async function completeDonation(id) {
  const response = await api.patch(`/api/ong/donations/${id}/complete`);
  return response.data;
}