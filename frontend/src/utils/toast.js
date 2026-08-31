// Barramento de eventos simples para notificações, sem precisar de Context/Provider.
const listeners = new Set();
let idCounter = 0;

export function subscribeToast(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit(message, type) {
  const item = { id: ++idCounter, message, type };
  listeners.forEach((fn) => fn(item));
}

export const toast = {
  success: (message) => emit(message, 'success'),
  error: (message) => emit(message, 'error'),
};
