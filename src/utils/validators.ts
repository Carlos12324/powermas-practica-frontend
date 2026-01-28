import type { DocumentoIdentidad } from '../types/documentos';

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Retorna la fecha de hoy en formato ISO (YYYY-MM-DD)
 */
export function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Verifica si una fecha es futura
 */
export function isFutureDate(dateString: string): boolean {
  if (!dateString) return false;
  const inputDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate > today;
}

/**
 * Sanitiza el número de documento según las reglas del documento
 * @param value - Valor actual del input
 * @param documento - Documento seleccionado (opcional)
 * @returns Valor sanitizado
 */
export function sanitizeNumeroDocumento(
  value: string,
  documento?: DocumentoIdentidad
): string {
  let sanitized = value;

  // Si el documento requiere solo números, eliminar todo lo que no sea dígito
  if (documento?.soloNumeros === true) {
    sanitized = value.replace(/\D/g, '');
  } else {
    // Permitir alfanumérico (letras y números), sin símbolos especiales
    sanitized = value.replace(/[^a-zA-Z0-9]/g, '');
  }

  // Aplicar límite de longitud
  const maxLen = documento?.longitud && documento.longitud > 0 ? documento.longitud : 20;
  sanitized = sanitized.slice(0, maxLen);

  return sanitized;
}

/**
 * Obtiene el mensaje de ayuda para el número de documento
 */
export function getNumeroDocumentoHint(documento?: DocumentoIdentidad): string | null {
  if (!documento) return null;
  
  const hints: string[] = [];
  
  if (documento.longitud && documento.longitud > 0) {
    hints.push(`Debe tener ${documento.longitud} caracteres`);
  } else {
    hints.push('Entre 6 y 20 caracteres');
  }
  
  if (documento.soloNumeros === true) {
    hints.push('solo números');
  } else if (documento.soloNumeros === false) {
    hints.push('letras y números permitidos');
  }
  
  return hints.join(' - ');
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

  // Validar según el tipo de documento
  if (documento?.soloNumeros === true) {
    if (!/^\d+$/.test(value)) {
      return { isValid: false, message: 'El número de documento solo debe contener dígitos' };
    }
  } else {
    // Alfanumérico
    if (!/^[a-zA-Z0-9]+$/.test(value)) {
      return { isValid: false, message: 'El número de documento solo debe contener letras y números' };
    }
  }

  // Si tenemos información del documento, validar longitud exacta
  if (documento?.longitud && documento.longitud > 0) {
    if (value.length !== documento.longitud) {
      return {
        isValid: false,
        message: `El número de documento debe tener exactamente ${documento.longitud} caracteres`,
      };
    }
  } else {
    // Validación por defecto: entre 6 y 20 caracteres
    if (value.length < 6 || value.length > 20) {
      return {
        isValid: false,
        message: 'El número de documento debe tener entre 6 y 20 caracteres',
      };
    }
  }

  return { isValid: true };
}

/**
 * Validación en tiempo real del número de documento (para mostrar mientras escribe)
 */
export function validateNumeroDocumentoRealTime(
  value: string,
  documento?: DocumentoIdentidad
): ValidationResult {
  if (!value) {
    return { isValid: true }; // No mostrar error si está vacío (se valida en blur/submit)
  }

  // Validar longitud si el documento tiene una definida
  if (documento?.longitud && documento.longitud > 0) {
    if (value.length < documento.longitud) {
      return {
        isValid: false,
        message: `Debe tener ${documento.longitud} caracteres (actual: ${value.length})`,
      };
    }
  } else {
    // Fallback: validar mínimo 6
    if (value.length > 0 && value.length < 6) {
      return {
        isValid: false,
        message: `Mínimo 6 caracteres (actual: ${value.length})`,
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
  
  if (isFutureDate(value)) {
    return { isValid: false, message: 'La fecha de nacimiento no puede ser futura' };
  }
  
  return { isValid: true };
}

/**
 * Validación en tiempo real de fecha de nacimiento
 */
export function validateFechaNacimientoRealTime(value: string): ValidationResult {
  if (!value) {
    return { isValid: true }; // No mostrar error si está vacío
  }
  
  if (isFutureDate(value)) {
    return { isValid: false, message: 'La fecha de nacimiento no puede ser futura' };
  }
  
  return { isValid: true };
}
