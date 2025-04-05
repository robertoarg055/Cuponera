// src/pages/empresa/DashboardEmpresa.jsx
import BotonDeLogout from "../../components/BotonDeLogout";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export default function DashboardEmpresa() {
  const { user } = useAuth();
  const [empresa, setEmpresa] = useState(null);
  const [ofertas, setOfertas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
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
  const [ofertaEditando, setOfertaEditando] = useState(null);

  const obtenerOfertasDeEmpresa = async (idEmpresa) => {
    const q = query(collection(db, "ofertas"), where("empresaId", "==", idEmpresa));
    const querySnapshot = await getDocs(q);
    const lista = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setOfertas(lista);
  };

  const obtenerEmpleados = async (codigoEmpresa) => {
    const q = query(
      collection(db, "usuarios"),
      where("rol", "==", "empleado"),
      where("empresaAsociada", "==", codigoEmpresa)
    );
    const snapshot = await getDocs(q);
    setEmpleados(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleEliminarEmpleado = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este empleado?")) {
      await deleteDoc(doc(db, "usuarios", id));
      alert("Empleado eliminado ✅");
      if (empresa?.codigo) obtenerEmpleados(empresa.codigo);
    }
  };

  const handleEditarEmpleado = async (id, nuevoNombre) => {
    try {
      await updateDoc(doc(db, "usuarios", id), { nombre: nuevoNombre });
      alert("Empleado actualizado ✅");
      obtenerEmpleados(empresa.codigo);
    } catch (error) {
      console.error("Error al actualizar empleado:", error);
    }
  };

  useEffect(() => {
    const obtenerDatosEmpresa = async () => {
      if (!user) return;
      const usuarioRef = doc(db, "usuarios", user.uid);
      const usuarioSnap = await getDoc(usuarioRef);
      if (usuarioSnap.exists()) {
        const { empresaId } = usuarioSnap.data();
        if (empresaId) {
          const empresaRef = doc(db, "empresas", empresaId);
          const empresaSnap = await getDoc(empresaRef);
          if (empresaSnap.exists()) {
            const empresaData = { id: empresaSnap.id, ...empresaSnap.data() };
            setEmpresa(empresaData);
            obtenerOfertasDeEmpresa(empresaData.id);
            obtenerEmpleados(empresaData.codigo);
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
    if (!empresa) return alert("No se puede crear la oferta sin datos de la empresa.");
    await addDoc(collection(db, "ofertas"), {
      ...nuevaOferta,
      empresaId: empresa.id,
      estado: "pendiente",
      fechaCreacion: Timestamp.now(),
      fechaInicio: Timestamp.fromDate(new Date(nuevaOferta.fechaInicio)),
      fechaFin: Timestamp.fromDate(new Date(nuevaOferta.fechaFin)),
      fechaLimiteUso: Timestamp.fromDate(new Date(nuevaOferta.fechaLimiteUso)),
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
  };

  const handleEditar = (oferta) => {
    setOfertaEditando(oferta.id);
    setNuevaOferta({
      titulo: oferta.titulo,
      precioRegular: oferta.precioRegular,
      precioOferta: oferta.precioOferta,
      fechaInicio: oferta.fechaInicio?.toDate().toISOString().split("T")[0] || "",
      fechaFin: oferta.fechaFin?.toDate().toISOString().split("T")[0] || "",
      fechaLimiteUso: oferta.fechaLimiteUso?.toDate().toISOString().split("T")[0] || "",
      cantidadCupones: oferta.cantidadCupones,
      descripcion: oferta.descripcion,
      otrosDetalles: oferta.otrosDetalles,
    });
  };

  const handleActualizarOferta = async (e) => {
    e.preventDefault();
    if (!ofertaEditando) return;
    await updateDoc(doc(db, "ofertas", ofertaEditando), {
      ...nuevaOferta,
      estado: "pendiente",
      motivoRechazo: "",
      fechaModificacion: Timestamp.now(),
      fechaInicio: Timestamp.fromDate(new Date(nuevaOferta.fechaInicio)),
      fechaFin: Timestamp.fromDate(new Date(nuevaOferta.fechaFin)),
      fechaLimiteUso: Timestamp.fromDate(new Date(nuevaOferta.fechaLimiteUso)),
    });
    alert("Oferta actualizada ✅");
    setOfertaEditando(null);
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
  };

  return (
    <div className="p-8">
      <BotonDeLogout />
      <h1 className="text-2xl mb-6">Dashboard Empresa</h1>

      {empresa && (
        <div className="mb-6 bg-gray-100 p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Datos de la Empresa</h2>
          <p><strong>Nombre:</strong> {empresa.nombre}</p>
          <p><strong>Código:</strong> {empresa.codigo}</p>
          <p><strong>Rubro:</strong> {empresa.rubro}</p>
          <p><strong>Correo:</strong> {empresa.correo}</p>
          <p><strong>Contacto:</strong> {empresa.contacto}</p>
        </div>
      )}

      <h2 className="text-xl mb-4">Mis Ofertas</h2>
      <ul className="space-y-4 mb-6">
        {ofertas.map((oferta) => (
          <li key={oferta.id} className="border p-4 rounded">
            <h3 className="font-bold text-lg">{oferta.titulo}</h3>
            <p><strong>Estado:</strong> {oferta.estado}</p>
            {oferta.estado === "rechazada" && (
              <>
                <p className="text-red-500">
                  <strong>Motivo de rechazo:</strong> {oferta.motivoRechazo || "No especificado"}
                </p>
                <button
                  onClick={() => handleEditar(oferta)}
                  className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Editar y reenviar
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h2 className="text-xl mb-4">
        {ofertaEditando ? "Editar Oferta Rechazada" : "Crear Nueva Oferta"}
      </h2>
      <form
        onSubmit={ofertaEditando ? handleActualizarOferta : handleCrearOferta}
        className="space-y-4 bg-white p-6 rounded shadow-md max-w-md"
      >
        <input name="titulo" placeholder="Título" value={nuevaOferta.titulo} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="precioRegular" type="number" placeholder="Precio Regular" value={nuevaOferta.precioRegular} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="precioOferta" type="number" placeholder="Precio Oferta" value={nuevaOferta.precioOferta} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="fechaInicio" type="date" value={nuevaOferta.fechaInicio} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="fechaFin" type="date" value={nuevaOferta.fechaFin} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="fechaLimiteUso" type="date" value={nuevaOferta.fechaLimiteUso} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="cantidadCupones" type="number" placeholder="Cantidad Cupones" value={nuevaOferta.cantidadCupones} onChange={handleChange} className="w-full border p-2 rounded" />
        <textarea name="descripcion" placeholder="Descripción" value={nuevaOferta.descripcion} onChange={handleChange} className="w-full border p-2 rounded" />
        <textarea name="otrosDetalles" placeholder="Otros Detalles" value={nuevaOferta.otrosDetalles} onChange={handleChange} className="w-full border p-2 rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          {ofertaEditando ? "Actualizar y reenviar" : "Crear Oferta"}
        </button>
      </form>

      <h2 className="text-xl mt-10 mb-4">Mis Empleados</h2>
      <ul className="space-y-4">
        {empleados.map((empleado) => (
          <li key={empleado.id} className="border p-4 rounded bg-gray-100">
            <p><strong>Nombre:</strong> {empleado.nombre || "Sin nombre"}</p>
            <p><strong>Correo:</strong> {empleado.correo}</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => {
                  const nuevoNombre = prompt("Nuevo nombre:", empleado.nombre);
                  if (nuevoNombre) handleEditarEmpleado(empleado.id, nuevoNombre);
                }}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleEliminarEmpleado(empleado.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
