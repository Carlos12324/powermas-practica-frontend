import { useState, useEffect } from 'react';
import { getDocumentosActivos } from '../api/documentosApi';
import { ApiError } from '../api/apiClient';
import type { DocumentoIdentidad } from '../types/documentos';
import Button from '../components/ui/Button';

export default function DocumentosIdentidadPage() {
  const [documentos, setDocumentos] = useState<DocumentoIdentidad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDocumentos();
  }, []);

  async function loadDocumentos() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDocumentosActivos();
      setDocumentos(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.detail);
      } else {
        setError('Error al cargar los documentos de identidad');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <nav className="text-sm text-gray-500 mb-2">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span>Configuración</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Documentos de identidad</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">Documentos de identidad</h1>
        <p className="mt-1 text-sm text-gray-600">
          Tipos de documentos de identidad soportados para beneficiarios en el sistema PowerMas.
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando documentos...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
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
          <Button variant="secondary" className="mt-4" onClick={loadDocumentos}>
            Reintentar
          </Button>
        </div>
      ) : documentos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">
            No hay documentos de identidad configurados
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentos.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                  Activo
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {doc.abreviatura}
              </h3>
              <p className="text-sm text-gray-600 mb-3">{doc.nombre}</p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">País:</span>
                  <span className="font-medium px-2 py-0.5 bg-gray-100 rounded text-gray-700">
                    {doc.pais}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">ID:</span>
                  <span className="font-mono text-gray-700">{doc.id}</span>
                </div>
                {doc.longitud !== undefined && doc.longitud > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Longitud:</span>
                    <span className="text-gray-700">{doc.longitud} caracteres</span>
                  </div>
                )}
                {doc.soloNumeros !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Solo números:</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      doc.soloNumeros 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {doc.soloNumeros ? 'Sí' : 'No (alfanumérico)'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
