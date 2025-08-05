export async function fetchWithAuth(url: string, options?: RequestInit) {
  const token = localStorage.getItem('access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options?.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    // Token expirado ou inválido, redirecionar para o login
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  }

  return response;
}
