import { useMutation } from '@tanstack/react-query';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

// Login
export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (credentials) => {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
  return useMutation<{ message: string }, Error, RegisterRequest>({
    mutationFn: async (userData) => {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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