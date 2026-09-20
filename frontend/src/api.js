const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.error || `Error ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  // Boards
  getBoards: () => request('/boards'),
  getBoard: (id) => request(`/boards/${id}`),
  getReport: (boardId) => request(`/boards/${boardId}/report`),
  createBoard: (payload) => 
    request(`/boards`, { method: 'POST', body: JSON.stringify(payload) }),
  // Lists
  getLists: (boardId) => request(`/boards/${boardId}/lists`),
  createList: (boardId, payload) =>
    request(`/boards/${boardId}/lists`, { method: 'POST', body: JSON.stringify(payload) }),

  // Cards
  getCards: (listId) => request(`/lists/${listId}/cards`),
  createCard: (listId, payload) =>
    request(`/lists/${listId}/cards`, { method: 'POST', body: JSON.stringify(payload) }),
  updateCard: (cardId, payload) =>
    request(`/cards/${cardId}`, { method: 'PUT', body: JSON.stringify(payload) }),
  moveCard: (cardId, payload) =>
    request(`/cards/${cardId}/move`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteCard: (cardId) => request(`/cards/${cardId}`, { method: 'DELETE' }),
};
