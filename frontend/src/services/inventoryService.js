import { ALL } from '../constants/filters.js';
import api from './api.js';

export async function getOngInventory(filters = {}) {
  const params = {};

  if (filters.search) {
    params.search = filters.search;
  }

  if (filters.category && filters.category !== ALL) {
    params.category = filters.category;
  }

  if (filters.status && filters.status !== ALL) {
    params.status = filters.status;
  }

  const response = await api.get('/api/ong/inventory', { params });
  return response.data;
}