import api from './api.js';

export async function getOngMovementsById(id) {
  const response = await api.get(`/api/ong/inventory/${id}/movements`);
  return response.data;
}

export async function postOngMovement(id, movement) {
  const response = await api.post(`/api/ong/inventory/${id}/movements`, {
    type: movement.type,
    quantity: Number(movement.quantity),
    reason: movement.reason
  });

  return response.data;
}