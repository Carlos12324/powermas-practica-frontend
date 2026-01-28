import axios, { AxiosError } from 'axios';
import type { ProblemDetails } from '../types/problemDetails';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005',
  headers: {
    'Content-Type': 'application/json',
  },
});

export class ApiError extends Error {
  public status: number;
  public detail: string;

  constructor(message: string, status: number, detail: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

export function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ProblemDetails>;
    
    if (axiosError.response?.data) {
      const problemDetails = axiosError.response.data;
      return new ApiError(
        problemDetails.title || 'Error en la solicitud',
        problemDetails.status || axiosError.response.status,
        problemDetails.detail || 'Ha ocurrido un error inesperado'
      );
    }
    
    if (axiosError.response) {
      return new ApiError(
        'Error en la solicitud',
        axiosError.response.status,
        `Error ${axiosError.response.status}: ${axiosError.response.statusText}`
      );
    }
    
    if (axiosError.request) {
      return new ApiError(
        'Error de conexión',
        0,
        'No se pudo conectar con el servidor. Verifique su conexión.'
      );
    }
  }
  
  return new ApiError(
    'Error desconocido',
    500,
    'Ha ocurrido un error inesperado'
  );
}

export default apiClient;
