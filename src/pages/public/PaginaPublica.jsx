import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function PaginaPublica() {
  const [ofertas, setOfertas] = useState([]);

  useEffect(() => {
    const obtenerOfertas = async () => {
      try {
        // Obtener empresas y sus rubros
        const empresasSnap = await getDocs(collection(db, "empresas"));
        const empresaRubroMap = {};
        empresasSnap.forEach((doc) => {
          empresaRubroMap[doc.id] = doc.data().rubro || "No definido";
        });

        // Obtener ofertas aprobadas
        const q = query(
          collection(db, "ofertas"),
          where("estado", "==", "aprobada")
        );
        const querySnapshot = await getDocs(q);
        const lista = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            rubro: empresaRubroMap[data.empresaId] || "No especificado",
          };
        });

        setOfertas(lista);
      } catch (error) {
        console.error("Error al obtener ofertas:", error);
      }
    };

    obtenerOfertas();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-end mb-4">
        <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded">
          Iniciar Sesión
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-6 text-center">
        Ofertas Disponibles
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ofertas.map((oferta) => (
          <div key={oferta.id} className="bg-white p-4 rounded shadow-md">
            <h2 className="font-bold text-lg mb-1">{oferta.titulo}</h2>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Rubro:</strong> {oferta.rubro}
            </p>
            <p>{oferta.descripcion}</p>
            <p className="mt-2 font-semibold text-blue-600">
              Precio: ${oferta.precioOferta}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
