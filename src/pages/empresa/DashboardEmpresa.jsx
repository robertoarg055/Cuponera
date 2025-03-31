import BotonDeLogout from "../../components/BotonDeLogout";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import { doc, getDoc, collection, addDoc, Timestamp, query, where, getDocs } from "firebase/firestore";

export default function DashboardEmpresa() {
  const { user } = useAuth();
  const [empresa, setEmpresa] = useState(null);
  const [ofertas, setOfertas] = useState([]);
  const [nuevaOferta, setNuevaOferta] = useState({
    titulo: "",
    precioRegular: "",
    precioOferta: "",
    fechaInicio: "",
    fechaFin: "",
    fechaLimiteUso: "",
    cantidadCupones: "",
    descripcion: "",
    otrosDetalles: "",
  });

  const obtenerOfertasDeEmpresa = async (idEmpresa) => {
    try {
      const q = query(collection(db, "ofertas"), where("empresaId", "==", idEmpresa));
      const querySnapshot = await getDocs(q);
      const ofertasEmpresa = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOfertas(ofertasEmpresa);
    } catch (error) {
      console.error("Error al obtener ofertas:", error);
    }
  };

  useEffect(() => {
    const obtenerDatosEmpresa = async () => {
      if (user) {
        const usuarioRef = doc(db, "usuarios", user.uid);
        const usuarioSnap = await getDoc(usuarioRef);

        if (usuarioSnap.exists()) {
          const { empresaId } = usuarioSnap.data();
          if (empresaId) {
            const empresaRef = doc(db, "empresas", empresaId);
            const empresaSnap = await getDoc(empresaRef);

            if (empresaSnap.exists()) {
              setEmpresa({ id: empresaSnap.id, ...empresaSnap.data() });
              obtenerOfertasDeEmpresa(empresaSnap.id);
            }
          }
        }
      }
    };

    obtenerDatosEmpresa();
  }, [user]);

  const handleChange = (e) => {
    setNuevaOferta({ ...nuevaOferta, [e.target.name]: e.target.value });
  };

  const handleCrearOferta = async (e) => {
    e.preventDefault();

    try {
      if (!empresa) {
        alert("No se puede crear la oferta sin datos de la empresa.");
        return;
      }

      await addDoc(collection(db, "ofertas"), {
        ...nuevaOferta,
        empresaId: empresa.id || "",
        estado: "pendiente",
        fechaCreacion: Timestamp.now(),
      });

      alert("Oferta creada correctamente ✅");

      setNuevaOferta({
        titulo: "",
        precioRegular: "",
        precioOferta: "",
        fechaInicio: "",
        fechaFin: "",
        fechaLimiteUso: "",
        cantidadCupones: "",
        descripcion: "",
        otrosDetalles: "",
      });

      obtenerOfertasDeEmpresa(empresa.id);

    } catch (error) {
      console.error("Error al crear oferta:", error);
      alert("Hubo un error al crear la oferta ❌");
    }
  };

  return (
    <div className="p-8">
      <BotonDeLogout />
      <h1 className="text-2xl mb-6">Dashboard Empresa</h1>

      {/* Datos de la empresa */}
      {empresa ? (
        <div className="mb-6 bg-gray-100 p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Datos de la Empresa</h2>
          <p><strong>Nombre:</strong> {empresa.nombre}</p>
          <p><strong>Código:</strong> {empresa.codigo}</p>
          <p><strong>Rubro:</strong> {empresa.rubro}</p>
          <p><strong>Correo:</strong> {empresa.correo}</p>
          <p><strong>Contacto:</strong> {empresa.contacto}</p>
        </div>
      ) : (
        <p className="text-red-500">Cargando datos de la empresa o no vinculada.</p>
      )}

      {/* Lista de ofertas */}
      <h2 className="text-xl mb-4">Mis Ofertas</h2>
      <ul className="space-y-2 mb-6">
        {ofertas.map((oferta) => (
          <li key={oferta.id} className="border p-4 rounded">
            <h3 className="font-bold">{oferta.titulo}</h3>
            <p>Estado: {oferta.estado}</p>
          </li>
        ))}
      </ul>

      {/* Formulario para crear oferta */}
      <h2 className="text-xl mb-4">Crear Nueva Oferta</h2>
      <form onSubmit={handleCrearOferta} className="space-y-4 bg-white p-6 rounded shadow-md max-w-md">
        <input
          type="text"
          name="titulo"
          placeholder="Título de la oferta"
          value={nuevaOferta.titulo}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        />
        <input
          type="number"
          name="precioRegular"
          placeholder="Precio regular"
          value={nuevaOferta.precioRegular}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        />
        <input
          type="number"
          name="precioOferta"
          placeholder="Precio oferta"
          value={nuevaOferta.precioOferta}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        />
        <input
          type="date"
          name="fechaInicio"
          value={nuevaOferta.fechaInicio}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        />
        <input
          type="date"
          name="fechaFin"
          value={nuevaOferta.fechaFin}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        />
        <input
          type="date"
          name="fechaLimiteUso"
          value={nuevaOferta.fechaLimiteUso}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        />
        <input
          type="number"
          name="cantidadCupones"
          placeholder="Cantidad límite de cupones"
          value={nuevaOferta.cantidadCupones}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        />
        <textarea
          name="descripcion"
          placeholder="Descripción de la oferta"
          value={nuevaOferta.descripcion}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        />
        <textarea
          name="otrosDetalles"
          placeholder="Otros detalles"
          value={nuevaOferta.otrosDetalles}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white w-full p-2 rounded">
          Crear Oferta
        </button>
      </form>
    </div>
  );
}
