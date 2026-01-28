export interface BeneficiarioDetalle {
  id: number;
  nombres: string;
  apellidos: string;
  documentoIdentidadId: number;
  documentoNombre: string;
  documentoAbreviatura: string;
  documentoPais: string;
  numeroDocumento: string;
  fechaNacimiento: string;
  sexo: 'M' | 'F';
}

export interface Beneficiario {
  id: number;
  nombres: string;
  apellidos: string;
  documentoIdentidadId: number;
  numeroDocumento: string;
  fechaNacimiento: string;
  sexo: 'M' | 'F';
}

export interface BeneficiarioRequest {
  nombres: string;
  apellidos: string;
  documentoIdentidadId: number;
  numeroDocumento: string;
  fechaNacimiento: string;
  sexo: 'M' | 'F';
}

export interface BeneficiarioResponse {
  id: number;
}

export interface DeleteResponse {
  rowsAffected: number;
}
