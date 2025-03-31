import BotonDeLogout from "../../components/BotonDeLogout";
import { useState, useEffect } from "react";
import { db, auth } from "../../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  query,
  where,
  updateDoc
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function DashboardAdmin() {
  const [empresas, setEmpresas] = useState([]);
  const [nuevaEmpresa, setNuevaEmpresa] = useState({
    nombre: "",
    codigo: "",
    direccion: "",
    contacto: "",
    telefono: "",
    correo: "",
    rubro: "",
    porcentajeComision: "",
  });

  const [rubros, setRubros] = useState([]);
  const [nuevoRubro, setNuevoRubro] = useState("");

  const [ofertasPendientes, setOfertasPendientes] = useState([]);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    correo: "",
    password: "",
    nombre: "",
    rol: "empresa",
    empresaAsociada: "",
  });

  const obtenerEmpresas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "empresas"));
      const listaEmpresas = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmpresas(listaEmpresas);
    } catch (error) {
      console.error("Error al obtener empresas:", error);
    }
  };

  const obtenerRubros = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "rubros"));
      const listaRubros = querySnapshot.docs.map((doc) => doc.data().nombre);
      setRubros(listaRubros);
    } catch (error) {
      console.error("Error al obtener rubros:", error);
    }
  };

  const obtenerOfertasPendientes = async () => {
    try {
      const q = query(collection(db, "ofertas"), where("estado", "==", "pendiente"));
      const querySnapshot = await getDocs(q);
      const lista = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOfertasPendientes(lista);
    } catch (error) {
      console.error("Error al obtener ofertas pendientes:", error);
    }
  };

  useEffect(() => {
    obtenerEmpresas();
    obtenerRubros();
    obtenerOfertasPendientes();
  }, []);

  const handleChangeEmpresa = (e) => {
    setNuevaEmpresa({ ...nuevaEmpresa, [e.target.name]: e.target.value });
  };

  const handleCrearEmpresa = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "empresas"), {
        ...nuevaEmpresa,
        fechaRegistro: new Date()
      });

      alert("Empresa registrada exitosamente ✅");

      setNuevaEmpresa({
        nombre: "",
        codigo: "",
        direccion: "",
        contacto: "",
        telefono: "",
        correo: "",
        rubro: "",
        porcentajeComision: "",
      });

      obtenerEmpresas();
    } catch (error) {
      console.error("Error al registrar la empresa:", error);
      alert("Ocurrió un error al registrar la empresa ❌");
    }
  };

  const handleAgregarRubro = async (e) => {
    e.preventDefault();
    try {
      const nuevoDoc = doc(collection(db, "rubros"));
      await setDoc(nuevoDoc, {
        nombre: nuevoRubro,
      });

      alert("Rubro agregado correctamente ✅");
      setNuevoRubro("");
      obtenerRubros();
    } catch (error) {
      console.error("Error al agregar rubro:", error);
      alert("Hubo un error al agregar el rubro ❌");
    }
  };

  const handleChangeUsuario = (e) => {
    setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value });
  };

  const handleCrearUsuario = async (e) => {
    e.preventDefault();

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        nuevoUsuario.correo,
        nuevoUsuario.password
      );

      let empresaId = null;

      if (nuevoUsuario.rol === "empresa") {
        const querySnapshot = await getDocs(collection(db, "empresas"));
        const empresaCoincidente = querySnapshot.docs.find(
          (doc) => doc.data().correo === nuevoUsuario.correo
        );

        if (empresaCoincidente) {
          empresaId = empresaCoincidente.id;
        }
      }

      await setDoc(doc(db, "usuarios", res.user.uid), {
        correo: nuevoUsuario.correo,
        nombre: nuevoUsuario.nombre,
        rol: nuevoUsuario.rol,
        empresaAsociada:
          nuevoUsuario.rol === "empleado"
            ? nuevoUsuario.empresaAsociada
            : null,
        empresaId: empresaId,
      });

      alert("Usuario registrado exitosamente ✅");
      setNuevoUsuario({
        correo: "",
        password: "",
        nombre: "",
        rol: "empresa",
        empresaAsociada: "",
      });
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert("Error al registrar usuario ❌");
    }
  };

  const actualizarEstadoOferta = async (idOferta, nuevoEstado) => {
    try {
      const ofertaRef = doc(db, "ofertas", idOferta);
      await updateDoc(ofertaRef, { estado: nuevoEstado });
      alert(`Oferta ${nuevoEstado} ✅`);
      obtenerOfertasPendientes();
    } catch (error) {
      console.error("Error al actualizar estado de la oferta:", error);
    }
  };

  return (
    <div className="p-8">
      <BotonDeLogout />
      <h1 className="text-2xl mb-6">Dashboard Administrador</h1>

      {/* Revisión de Ofertas Pendientes */}
      <h2 className="text-xl mb-4">Ofertas Pendientes</h2>
      <ul className="space-y-4 mb-10">
        {ofertasPendientes.map(oferta => (
          <li key={oferta.id} className="border p-4 rounded shadow-md">
            <h3 className="font-bold">{oferta.titulo}</h3>
            <p>{oferta.descripcion}</p>
            <p><strong>Empresa ID:</strong> {oferta.empresaId}</p>
            <div className="flex gap-4 mt-2">
              <button onClick={() => actualizarEstadoOferta(oferta.id, "aprobada")} className="bg-green-500 text-white px-3 py-1 rounded">Aprobar</button>
              <button onClick={() => actualizarEstadoOferta(oferta.id, "rechazada")} className="bg-red-500 text-white px-3 py-1 rounded">Rechazar</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Gestión de Empresas */}
      <h2 className="text-xl mb-4">Gestión de Empresas</h2>
      <ul className="space-y-2 mb-4">
        {empresas.map((empresa) => (
          <li key={empresa.id} className="border p-4 rounded">
            <p><strong>Nombre:</strong> {empresa.nombre}</p>
            <p><strong>Código:</strong> {empresa.codigo}</p>
            <p><strong>Rubro:</strong> {empresa.rubro}</p>
          </li>
        ))}
      </ul>

      <form onSubmit={handleCrearEmpresa} className="space-y-3 bg-white p-6 rounded shadow-md max-w-md mb-10">
        <h3 className="text-lg mb-2 font-bold">Registrar nueva empresa</h3>
        <input type="text" name="nombre" placeholder="Nombre empresa" value={nuevaEmpresa.nombre} onChange={handleChangeEmpresa} className="border w-full p-2 rounded" />
        <input type="text" name="codigo" placeholder="Código (ej: EMP001)" value={nuevaEmpresa.codigo} onChange={handleChangeEmpresa} className="border w-full p-2 rounded" />
        <input type="text" name="direccion" placeholder="Dirección" value={nuevaEmpresa.direccion} onChange={handleChangeEmpresa} className="border w-full p-2 rounded" />
        <input type="text" name="contacto" placeholder="Nombre contacto" value={nuevaEmpresa.contacto} onChange={handleChangeEmpresa} className="border w-full p-2 rounded" />
        <input type="text" name="telefono" placeholder="Teléfono" value={nuevaEmpresa.telefono} onChange={handleChangeEmpresa} className="border w-full p-2 rounded" />
        <input type="email" name="correo" placeholder="Correo" value={nuevaEmpresa.correo} onChange={handleChangeEmpresa} className="border w-full p-2 rounded" />
        <select name="rubro" value={nuevaEmpresa.rubro} onChange={handleChangeEmpresa} className="border w-full p-2 rounded" required>
          <option value="">Seleccionar rubro</option>
          {rubros.map((rubro, idx) => (
            <option key={idx} value={rubro}>{rubro}</option>
          ))}
        </select>
        <input type="number" name="porcentajeComision" placeholder="% Comisión" value={nuevaEmpresa.porcentajeComision} onChange={handleChangeEmpresa} className="border w-full p-2 rounded" />
        <button type="submit" className="bg-blue-500 text-white w-full p-2 rounded">Registrar Empresa</button>
      </form>

      {/* Gestión de Rubros */}
      <h2 className="text-xl mb-4">Gestión de Rubros</h2>
      <ul className="mb-4 space-y-2">
        {rubros.map((rubro, index) => (
          <li key={index} className="border p-2 rounded">{rubro}</li>
        ))}
      </ul>

      <form onSubmit={handleAgregarRubro} className="space-y-3 bg-white p-6 rounded shadow-md max-w-md mb-10">
        <input type="text" placeholder="Nuevo Rubro" value={nuevoRubro} onChange={(e) => setNuevoRubro(e.target.value)} className="border w-full p-2 rounded" />
        <button type="submit" className="bg-blue-500 text-white w-full p-2 rounded">Agregar Rubro</button>
      </form>

      {/* Registro de Usuarios (Empresa/Empleado) */}
      <h2 className="text-xl mb-4">Registrar Usuario Empresa o Empleado</h2>
      <form onSubmit={handleCrearUsuario} className="space-y-3 bg-white p-6 rounded shadow-md max-w-md mb-10">
        <input type="email" name="correo" placeholder="Correo" value={nuevoUsuario.correo} onChange={handleChangeUsuario} className="border w-full p-2 rounded" required />
        <input type="password" name="password" placeholder="Contraseña" value={nuevoUsuario.password} onChange={handleChangeUsuario} className="border w-full p-2 rounded" required />
        <input type="text" name="nombre" placeholder="Nombre o Contacto" value={nuevoUsuario.nombre} onChange={handleChangeUsuario} className="border w-full p-2 rounded" required />

        <select name="rol" value={nuevoUsuario.rol} onChange={handleChangeUsuario} className="border w-full p-2 rounded">
          <option value="empresa">Empresa</option>
          <option value="empleado">Empleado</option>
        </select>

        {nuevoUsuario.rol === "empleado" && (
          <input
            type="text"
            name="empresaAsociada"
            placeholder="Código de Empresa Asociada"
            value={nuevoUsuario.empresaAsociada}
            onChange={handleChangeUsuario}
            className="border w-full p-2 rounded"
            required
          />
        )}

        <button type="submit" className="bg-green-500 text-white w-full p-2 rounded">
          Registrar Usuario
        </button>
      </form>
    </div>
  );
}
