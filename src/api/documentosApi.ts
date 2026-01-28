import apiClient, { handleApiError } from './apiClient';
import type { DocumentoIdentidad } from '../types/documentos';

export async function getDocumentosActivos(): Promise<DocumentoIdentidad[]> {
  try {
    const response = await apiClient.get<DocumentoIdentidad[]>('/api/documentos-identidad/activos');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
