import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBeneficiarioById, updateBeneficiario } from '../api/beneficiariosApi';
import { getDocumentosActivos } from '../api/documentosApi';
import { ApiError } from '../api/apiClient';
import type { BeneficiarioRequest } from '../types/beneficiarios';
import type { DocumentoIdentidad } from '../types/documentos';
import { formatDateInput } from '../utils/formatDate';
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

export default function BeneficiarioEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [documentos, setDocumentos] = useState<DocumentoIdentidad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);
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
    loadData();
  }, [id]);

  async function loadData() {
    if (!id) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    try {
      const [beneficiario, docs] = await Promise.all([
        getBeneficiarioById(parseInt(id)),
        getDocumentosActivos(),
      ]);

      setDocumentos(docs);
      setFormData({
        nombres: beneficiario.nombres,
        apellidos: beneficiario.apellidos,
        documentoIdentidadId: beneficiario.documentoIdentidadId,
        numeroDocumento: beneficiario.numeroDocumento,
        fechaNacimiento: formatDateInput(beneficiario.fechaNacimiento),
        sexo: beneficiario.sexo,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 404) {
          setNotFound(true);
        } else {
          setErrors({ general: err.detail });
        }
      } else {
        setErrors({ general: 'Error al cargar el beneficiario' });
      }
    } finally {
      setIsLoading(false);
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
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleNumeroDocumentoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/\D/g, '');
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

    if (!validateForm() || !id) {
      return;
    }

    setIsSubmitting(true);
    try {
      await updateBeneficiario(parseInt(id), formData);
      setToast({
        show: true,
        message: 'Beneficiario actualizado correctamente',
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
        setErrors({ general: 'Error al actualizar el beneficiario' });
        setToast({
          show: true,
          message: 'Error al actualizar el beneficiario',
          type: 'error',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          <span className="ml-3 text-gray-600">Cargando...</span>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Beneficiario no encontrado
          </h1>
          <p className="text-gray-600 mb-6">
            El beneficiario que buscas no existe o ha sido eliminado.
          </p>
          <Button onClick={() => navigate('/beneficiarios')}>
            Volver a la lista
          </Button>
        </div>
      </div>
    );
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
          <span className="text-gray-900">Editar</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">Editar Beneficiario</h1>
        <p className="mt-1 text-sm text-gray-600">
          Modifique los datos del beneficiario.
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
              Guardar cambios
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
