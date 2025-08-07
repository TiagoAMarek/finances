const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchWithAuth(url: string, options?: RequestInit) {
  const token = localStorage.getItem('access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options?.headers,
  };

  // Se a URL não começar com http, adicionar base URL
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;

  const response = await fetch(fullUrl, { ...options, headers });

  if (response.status === 401) {
    // Token expirado ou inválido, redirecionar para o login
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  }

  return response;
}
