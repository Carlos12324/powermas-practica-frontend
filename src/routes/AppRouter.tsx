import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import BeneficiariosListPage from '../pages/BeneficiariosListPage';
import BeneficiarioCreatePage from '../pages/BeneficiarioCreatePage';
import BeneficiarioEditPage from '../pages/BeneficiarioEditPage';
import DocumentosIdentidadPage from '../pages/DocumentosIdentidadPage';
import ComingSoonPage from '../pages/ComingSoonPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          {/* Redirect root to beneficiarios */}
          <Route index element={<Navigate to="/beneficiarios" replace />} />

          {/* Beneficiarios routes */}
          <Route path="beneficiarios" element={<BeneficiariosListPage />} />
          <Route path="beneficiarios/nuevo" element={<BeneficiarioCreatePage />} />
          <Route path="beneficiarios/:id/editar" element={<BeneficiarioEditPage />} />

          {/* Documentos de identidad */}
          <Route path="documentos-identidad" element={<DocumentosIdentidadPage />} />

          {/* Coming soon pages */}
          <Route
            path="dashboard"
            element={<ComingSoonPage title="Dashboard - Próximamente" />}
          />
          <Route
            path="configuracion"
            element={<ComingSoonPage title="Configuración - Próximamente" />}
          />

          {/* Catch all - redirect to beneficiarios */}
          <Route path="*" element={<Navigate to="/beneficiarios" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
