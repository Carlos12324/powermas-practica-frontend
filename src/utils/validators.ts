import type { DocumentoIdentidad } from '../types/documentos';

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export function validateRequired(value: string, fieldName: string): ValidationResult {
  if (!value || value.trim() === '') {
    return { isValid: false, message: `${fieldName} es requerido` };
  }
  return { isValid: true };
}

export function validateNumeroDocumento(
  value: string,
  documento?: DocumentoIdentidad
): ValidationResult {
  if (!value || value.trim() === '') {
    return { isValid: false, message: 'Número de documento es requerido' };
  }

  // Validar solo dígitos
  if (!/^\d+$/.test(value)) {
    return { isValid: false, message: 'El número de documento solo debe contener dígitos' };
  }

  // Si tenemos información del documento, validar longitud
  if (documento?.longitud) {
    if (value.length !== documento.longitud) {
      return {
        isValid: false,
        message: `El número de documento debe tener ${documento.longitud} dígitos`,
      };
    }
  } else {
    // Validación por defecto: entre 6 y 20 caracteres
    if (value.length < 6 || value.length > 20) {
      return {
        isValid: false,
        message: 'El número de documento debe tener entre 6 y 20 dígitos',
      };
    }
  }

  return { isValid: true };
}

export function validateSexo(value: string): ValidationResult {
  if (value !== 'M' && value !== 'F') {
    return { isValid: false, message: 'Debe seleccionar Masculino o Femenino' };
  }
  return { isValid: true };
}

export function validateFechaNacimiento(value: string): ValidationResult {
  if (!value) {
    return { isValid: false, message: 'Fecha de nacimiento es requerida' };
  }
  
  const fecha = new Date(value);
  const hoy = new Date();
  
  if (fecha > hoy) {
    return { isValid: false, message: 'La fecha de nacimiento no puede ser futura' };
  }
  
  return { isValid: true };
}
