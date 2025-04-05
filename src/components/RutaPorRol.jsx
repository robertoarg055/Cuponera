// src/components/RutaPorRol.jsx
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export default function RutaPorRol({ children, rolRequerido }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const obtenerRol = async () => {
      if (user) {
        const ref = doc(db, "usuarios", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setRol(snap.data().rol);
        }
      }
      setLoading(false);
    };
    obtenerRol();
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;
  if (loading) return <p className="text-center">Cargando...</p>;
  if (rol !== rolRequerido) return <Navigate to="/login" replace />;

  return children;
}
