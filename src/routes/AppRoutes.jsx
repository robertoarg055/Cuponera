import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/public/login";
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import DashboardEmpresa from "../pages/empresa/DashboardEmpresa";
import DashboardCliente from "../pages/cliente/DashboardCliente";
import CanjeCupon from "../pages/empleado/CanjeCupon";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="/empresa" element={<DashboardEmpresa />} />
        <Route path="/cliente" element={<DashboardCliente />} />
        <Route path="/empleado" element={<CanjeCupon />} />
      </Routes>
    </Router>
  );
}
