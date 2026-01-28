import apiClient, { handleApiError } from './apiClient';
import type {
  BeneficiarioDetalle,
  Beneficiario,
  BeneficiarioRequest,
  BeneficiarioResponse,
  DeleteResponse,
} from '../types/beneficiarios';

export async function getBeneficiarios(): Promise<BeneficiarioDetalle[]> {
  try {
    const response = await apiClient.get<BeneficiarioDetalle[]>('/api/beneficiarios');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getBeneficiarioById(id: number): Promise<Beneficiario> {
  try {
    const response = await apiClient.get<Beneficiario>(`/api/beneficiarios/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function createBeneficiario(data: BeneficiarioRequest): Promise<BeneficiarioResponse> {
  try {
    const response = await apiClient.post<BeneficiarioResponse>('/api/beneficiarios', data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updateBeneficiario(
  id: number,
  data: BeneficiarioRequest
): Promise<BeneficiarioResponse> {
  try {
    const response = await apiClient.put<BeneficiarioResponse>(`/api/beneficiarios/${id}`, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function deleteBeneficiario(id: number): Promise<DeleteResponse> {
  try {
    const response = await apiClient.delete<DeleteResponse>(`/api/beneficiarios/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
