import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBeneficiario } from '../api/beneficiariosApi';
import { getDocumentosActivos } from '../api/documentosApi';
import { ApiError } from '../api/apiClient';
import type { BeneficiarioRequest } from '../types/beneficiarios';
import type { DocumentoIdentidad } from '../types/documentos';
import {
  validateRequired,
  validateNumeroDocumento,
  validateSexo,
  validateFechaNacimiento,
} from '../utils/validators';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Toast from '../components/ui/Toast';

interface FormErrors {
  nombres?: string;
  apellidos?: string;
  documentoIdentidadId?: string;
  numeroDocumento?: string;
  fechaNacimiento?: string;
  sexo?: string;
  general?: string;
}

export default function BeneficiarioCreatePage() {
  const navigate = useNavigate();
  const [documentos, setDocumentos] = useState<DocumentoIdentidad[]>([]);
  const [isLoadingDocumentos, setIsLoadingDocumentos] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ show: false, message: '', type: 'info' });

  const [formData, setFormData] = useState<BeneficiarioRequest>({
    nombres: '',
    apellidos: '',
    documentoIdentidadId: 0,
    numeroDocumento: '',
    fechaNacimiento: '',
    sexo: 'M',
  });

  useEffect(() => {
    loadDocumentos();
  }, []);

  async function loadDocumentos() {
    try {
      const data = await getDocumentosActivos();
      setDocumentos(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors({ general: err.detail });
      } else {
        setErrors({ general: 'Error al cargar los tipos de documento' });
      }
    } finally {
      setIsLoadingDocumentos(false);
    }
  }

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'documentoIdentidadId' ? parseInt(value) || 0 : value,
    }));
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleNumeroDocumentoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/\D/g, ''); // Solo dígitos
    setFormData((prev) => ({ ...prev, numeroDocumento: value }));
    if (errors.numeroDocumento) {
      setErrors((prev) => ({ ...prev, numeroDocumento: undefined }));
    }
  }

  function validateForm(): boolean {
    const newErrors: FormErrors = {};

    const nombresValidation = validateRequired(formData.nombres, 'Nombres');
    if (!nombresValidation.isValid) {
      newErrors.nombres = nombresValidation.message;
    }

    const apellidosValidation = validateRequired(formData.apellidos, 'Apellidos');
    if (!apellidosValidation.isValid) {
      newErrors.apellidos = apellidosValidation.message;
    }

    if (!formData.documentoIdentidadId) {
      newErrors.documentoIdentidadId = 'Debe seleccionar un tipo de documento';
    }

    const selectedDoc = documentos.find(
      (d) => d.id === formData.documentoIdentidadId
    );
    const docValidation = validateNumeroDocumento(
      formData.numeroDocumento,
      selectedDoc
    );
    if (!docValidation.isValid) {
      newErrors.numeroDocumento = docValidation.message;
    }

    const fechaValidation = validateFechaNacimiento(formData.fechaNacimiento);
    if (!fechaValidation.isValid) {
      newErrors.fechaNacimiento = fechaValidation.message;
    }

    const sexoValidation = validateSexo(formData.sexo);
    if (!sexoValidation.isValid) {
      newErrors.sexo = sexoValidation.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createBeneficiario(formData);
      setToast({
        show: true,
        message: 'Beneficiario creado correctamente',
        type: 'success',
      });
      setTimeout(() => {
        navigate('/beneficiarios');
      }, 1500);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors({ general: err.detail });
        setToast({
          show: true,
          message: err.detail,
          type: 'error',
        });
      } else {
        setErrors({ general: 'Error al crear el beneficiario' });
        setToast({
          show: true,
          message: 'Error al crear el beneficiario',
          type: 'error',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const documentoOptions = documentos.map((doc) => ({
    value: doc.id,
    label: `${doc.abreviatura} - ${doc.nombre}`,
  }));

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <nav className="text-sm text-gray-500 mb-2">
          <span
            className="hover:text-blue-600 cursor-pointer"
            onClick={() => navigate('/beneficiarios')}
          >
            Beneficiarios
          </span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Nuevo</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">Nuevo Beneficiario</h1>
        <p className="mt-1 text-sm text-gray-600">
          Complete los datos para registrar un nuevo beneficiario.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nombres"
              name="nombres"
              value={formData.nombres}
              onChange={handleInputChange}
              placeholder="Ej. Juan Carlos"
              error={errors.nombres}
              required
            />

            <Input
              label="Apellidos"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleInputChange}
              placeholder="Ej. García Pérez"
              error={errors.apellidos}
              required
            />

            <Select
              label="Documento Identidad"
              name="documentoIdentidadId"
              value={formData.documentoIdentidadId || ''}
              onChange={handleInputChange}
              options={documentoOptions}
              placeholder="Seleccione un documento"
              error={errors.documentoIdentidadId}
              disabled={isLoadingDocumentos}
              required
            />

            <Input
              label="Número Documento"
              name="numeroDocumento"
              value={formData.numeroDocumento}
              onChange={handleNumeroDocumentoChange}
              placeholder="00000000"
              error={errors.numeroDocumento}
              required
            />

            <Input
              label="Fecha Nacimiento"
              name="fechaNacimiento"
              type="date"
              value={formData.fechaNacimiento}
              onChange={handleInputChange}
              error={errors.fechaNacimiento}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sexo <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-6 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sexo"
                    value="M"
                    checked={formData.sexo === 'M'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Masculino</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sexo"
                    value="F"
                    checked={formData.sexo === 'F'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Femenino</span>
                </label>
              </div>
              {errors.sexo && (
                <p className="mt-1 text-sm text-red-600">{errors.sexo}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/beneficiarios')}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Guardar
            </Button>
          </div>
        </form>
      </div>

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}
