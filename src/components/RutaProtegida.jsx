// src/components/RutaProtegida.jsx
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function RutaProtegida({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
