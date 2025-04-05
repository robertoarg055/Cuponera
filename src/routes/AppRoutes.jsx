import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/public/login";
import RegistroCliente from "../pages/public/RegistroCliente";
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import DashboardEmpresa from "../pages/empresa/DashboardEmpresa";
import DashboardCliente from "../pages/cliente/DashboardCliente";
import CanjeCupon from "../pages/empleado/CanjeCupon";
import PaginaPublica from "../pages/public/PaginaPublica";

// Cambiado el import para que esté en "components" (si es ahí donde lo guardaste)
import CambiarContraseña from "../components/CambiarContraseña";

import RutaProtegida from "../components/RutaProtegida";
import RutaPorRol from "../components/RutaPorRol";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaginaPublica />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<RegistroCliente />} />

        {/* ✅ Ruta corregida para que coincida con la URL que estás visitando */}
        <Route path="/cambiar-password" element={<CambiarContraseña />} />

        {/* Rutas protegidas por rol */}
        <Route
          path="/admin"
          element={
            <RutaProtegida>
              <RutaPorRol rolRequerido="admin">
                <DashboardAdmin />
              </RutaPorRol>
            </RutaProtegida>
          }
        />
        <Route
          path="/empresa"
          element={
            <RutaProtegida>
              <RutaPorRol rolRequerido="empresa">
                <DashboardEmpresa />
              </RutaPorRol>
            </RutaProtegida>
          }
        />
        <Route
          path="/cliente"
          element={
            <RutaProtegida>
              <RutaPorRol rolRequerido="cliente">
                <DashboardCliente />
              </RutaPorRol>
            </RutaProtegida>
          }
        />
        <Route
          path="/empleado"
          element={
            <RutaProtegida>
              <RutaPorRol rolRequerido="empleado">
                <CanjeCupon />
              </RutaPorRol>
            </RutaProtegida>
          }
        />
      </Routes>
    </Router>
  );
}
