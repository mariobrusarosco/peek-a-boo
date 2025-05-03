// API endpoints
export const API_BASE_URL = 'http://localhost:3001';

export const API_ENDPOINTS = {
  PROJECTS: {
    LIST: `${API_BASE_URL}/projects`,
    DETAIL: (id: string) => `${API_BASE_URL}/projects/${id}`,
    CREATE: `${API_BASE_URL}/projects`,
  },
  USERS: {
    LIST: `${API_BASE_URL}/users`,
    DETAIL: (id: string) => `${API_BASE_URL}/users/${id}`,
  },
  FLAGS: {
    LIST: `${API_BASE_URL}/feature-flags`,
    DETAIL: (id: string) => `${API_BASE_URL}/feature-flags/${id}`,
  }
};
