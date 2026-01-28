import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getBeneficiarios, deleteBeneficiario } from '../api/beneficiariosApi';
import { ApiError } from '../api/apiClient';
import type { BeneficiarioDetalle } from '../types/beneficiarios';
import { formatDateDisplay } from '../utils/formatDate';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';

export default function BeneficiariosListPage() {
  const navigate = useNavigate();
  const [beneficiarios, setBeneficiarios] = useState<BeneficiarioDetalle[]>([]);
  const [filteredBeneficiarios, setFilteredBeneficiarios] = useState<BeneficiarioDetalle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    beneficiario: BeneficiarioDetalle | null;
  }>({ isOpen: false, beneficiario: null });
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ show: false, message: '', type: 'info' });

  useEffect(() => {
    loadBeneficiarios();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBeneficiarios(beneficiarios);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = beneficiarios.filter(
        (b) =>
          b.nombres.toLowerCase().includes(term) ||
          b.apellidos.toLowerCase().includes(term) ||
          b.numeroDocumento.toLowerCase().includes(term)
      );
      setFilteredBeneficiarios(filtered);
    }
  }, [searchTerm, beneficiarios]);

  async function loadBeneficiarios() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getBeneficiarios();
      setBeneficiarios(data);
      setFilteredBeneficiarios(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.detail);
      } else {
        setError('Error al cargar los beneficiarios');
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleDeleteClick(beneficiario: BeneficiarioDetalle) {
    setDeleteModal({ isOpen: true, beneficiario });
  }

  async function handleConfirmDelete() {
    if (!deleteModal.beneficiario) return;

    setIsDeleting(true);
    try {
      await deleteBeneficiario(deleteModal.beneficiario.id);
      setDeleteModal({ isOpen: false, beneficiario: null });
      setToast({
        show: true,
        message: 'Beneficiario eliminado correctamente',
        type: 'success',
      });
      loadBeneficiarios();
    } catch (err) {
      if (err instanceof ApiError) {
        setToast({
          show: true,
          message: err.detail,
          type: 'error',
        });
      } else {
        setToast({
          show: true,
          message: 'Error al eliminar el beneficiario',
          type: 'error',
        });
      }
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Beneficiarios</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gestiona la lista de beneficiarios registrados en el sistema.
            </p>
          </div>
          <Button onClick={() => navigate('/beneficiarios/nuevo')}>
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nuevo beneficiario
          </Button>
        </div>

        {/* Search */}
        <div className="mt-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar por nombres, apellidos o número de documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Cargando beneficiarios...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-red-600 font-medium">{error}</p>
            <Button variant="secondary" className="mt-4" onClick={loadBeneficiarios}>
              Reintentar
            </Button>
          </div>
        ) : filteredBeneficiarios.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">
              {searchTerm
                ? 'No se encontraron resultados'
                : 'No hay beneficiarios registrados'}
            </p>
            {!searchTerm && (
              <Button
                variant="primary"
                className="mt-4"
                onClick={() => navigate('/beneficiarios/nuevo')}
              >
                Agregar primer beneficiario
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombres
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Apellidos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Nacimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sexo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBeneficiarios.map((beneficiario, index) => (
                  <tr key={beneficiario.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {beneficiario.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {beneficiario.nombres}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {beneficiario.apellidos}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                          {beneficiario.documentoAbreviatura}
                        </span>
                        <span>{beneficiario.numeroDocumento}</span>
                        <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                          {beneficiario.documentoPais}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDateDisplay(beneficiario.fechaNacimiento)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium ${
                          beneficiario.sexo === 'M'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-pink-100 text-pink-700'
                        }`}
                      >
                        {beneficiario.sexo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/beneficiarios/${beneficiario.id}/editar`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(beneficiario)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination info */}
      {!isLoading && !error && filteredBeneficiarios.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Mostrando {filteredBeneficiarios.length} de {beneficiarios.length} resultados
        </div>
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, beneficiario: null })}
        title="Eliminar beneficiario"
        onConfirm={handleConfirmDelete}
        confirmText="Eliminar"
        confirmVariant="danger"
        isLoading={isDeleting}
      >
        <p>
          ¿Está seguro que desea eliminar al beneficiario{' '}
          <strong>
            {deleteModal.beneficiario?.nombres} {deleteModal.beneficiario?.apellidos}
          </strong>
          ?
        </p>
        <p className="mt-2 text-sm text-gray-500">Esta acción no se puede deshacer.</p>
      </Modal>

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
