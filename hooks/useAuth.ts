import { useMutation } from '@tanstack/react-query';
import { fetchWithAuth } from '@/utils/api';
import { LoginResponse, RegisterResponse } from '@/types/api';
import { LoginData, RegisterData } from '@/app/api/lib/validation';

// Login
export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginData>({
    mutationFn: async (credentials) => {
      const response = await fetchWithAuth('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao fazer login.');
      }
      return response.json();
    },
  });
};

// Register
export const useRegister = () => {
  return useMutation<RegisterResponse, Error, RegisterData>({
    mutationFn: async (userData) => {
      const response = await fetchWithAuth('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao registrar usuário.');
      }
      return response.json();
    },
  });
};