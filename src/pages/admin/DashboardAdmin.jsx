import { useState, useEffect } from "react";
import BotonDeLogout from "../../components/BotonDeLogout";
import { db, auth } from "../../firebase/config";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function DashboardAdmin() {
  const [empresas, setEmpresas] = useState([]);
  const [rubros, setRubros] = useState([]);
  const [nuevoRubro, setNuevoRubro] = useState("");
  const [ofertasPorEmpresa, setOfertasPorEmpresa] = useState({});
  const [editarEmpresaId, setEditarEmpresaId] = useState(null);
  const [clientes, setClientes] = useState([]);

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

  const [nuevoUsuario, setNuevoUsuario] = useState({
    correo: "",
    password: "",
    nombre: "",
    rol: "empresa",
    empresaAsociada: "",
  });

  const obtenerEmpresas = async () => {
    const snapshot = await getDocs(collection(db, "empresas"));
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setEmpresas(lista);
  };

  const obtenerRubros = async () => {
    const snapshot = await getDocs(collection(db, "rubros"));
    setRubros(snapshot.docs.map((doc) => doc.data().nombre));
  };

  const obtenerOfertasPorEmpresa = async () => {
    const snapshot = await getDocs(collection(db, "ofertas"));
    const hoy = new Date();
    const agrupadas = {};

    snapshot.docs.forEach((docSnap) => {
      const oferta = { id: docSnap.id, ...docSnap.data() };
      const empresaId = oferta.empresaId;
      const inicio = oferta.fechaInicio?.toDate?.() || new Date();
      const fin = oferta.fechaFin?.toDate?.() || new Date();

      let categoria = "otras";
      if (oferta.estado === "pendiente") categoria = "pendientes";
      else if (oferta.estado === "aprobada") {
        if (inicio > hoy) categoria = "futuras";
        else if (inicio <= hoy && fin >= hoy) categoria = "activas";
        else categoria = "pasadas";
      } else if (oferta.estado === "rechazada") categoria = "rechazadas";
      else if (oferta.estado === "descartada") categoria = "descartadas";

      if (!agrupadas[empresaId]) {
        agrupadas[empresaId] = {
          pendientes: [],
          futuras: [],
          activas: [],
          pasadas: [],
          rechazadas: [],
          descartadas: [],
        };
      }

      agrupadas[empresaId][categoria].push(oferta);
    });

    setOfertasPorEmpresa(agrupadas);
  };

  const obtenerClientes = async () => {
    const usuariosSnap = await getDocs(collection(db, "usuarios"));
    const cuponesSnap = await getDocs(collection(db, "cupones"));

    const usuariosClientes = usuariosSnap.docs
      .filter((doc) => doc.data().rol === "cliente")
      .map((doc) => {
        const data = doc.data();
        const cupones = cuponesSnap.docs
          .filter((c) => c.data().clienteId === doc.id)
          .map((c) => c.data().codigo);
        return {
          id: doc.id,
          correo: data.correo,
          cupones,
        };
      });

    setClientes(usuariosClientes);
  };

  const handleEliminarCliente = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este cliente?")) {
      await deleteDoc(doc(db, "usuarios", id));
      alert("Cliente eliminado ✅");
      obtenerClientes();
    }
  };

  const handleEliminarOferta = async (idOferta) => {
    if (confirm("¿Deseas eliminar esta oferta?")) {
      await deleteDoc(doc(db, "ofertas", idOferta));
      alert("Oferta eliminada ✅");
      obtenerOfertasPorEmpresa();
    }
  };

  useEffect(() => {
    obtenerEmpresas();
    obtenerRubros();
    obtenerOfertasPorEmpresa();
    obtenerClientes();
  }, []);

  const handleChangeEmpresa = (e) => {
    setNuevaEmpresa({ ...nuevaEmpresa, [e.target.name]: e.target.value });
  };

  const handleGuardarEmpresa = async (e) => {
    e.preventDefault();
    try {
      if (editarEmpresaId) {
        await updateDoc(doc(db, "empresas", editarEmpresaId), nuevaEmpresa);
        alert("Empresa actualizada ✅");
      } else {
        await addDoc(collection(db, "empresas"), nuevaEmpresa);
        alert("Empresa registrada ✅");
      }
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
      setEditarEmpresaId(null);
      obtenerEmpresas();
    } catch (err) {
      console.error("Error al guardar empresa", err);
    }
  };

  const handleAprobarOferta = async (id) => {
    await updateDoc(doc(db, "ofertas", id), {
      estado: "aprobada",
      motivoRechazo: "", // limpiamos el motivo si lo tuvo antes
    });
    alert("Oferta aprobada ✅");
    obtenerOfertasPorEmpresa();
  };

  const handleRechazarOferta = async (id, motivo) => {
    await updateDoc(doc(db, "ofertas", id), {
      estado: "rechazada",
      motivoRechazo: motivo,
    });
    alert("Oferta rechazada ❌");
    obtenerOfertasPorEmpresa();
  };

  const handleEditarEmpresa = (empresa) => {
    setEditarEmpresaId(empresa.id);
    setNuevaEmpresa(empresa);
  };

  const handleEliminarEmpresa = async (id) => {
    if (confirm("¿Seguro que deseas eliminar esta empresa?")) {
      await deleteDoc(doc(db, "empresas", id));
      alert("Empresa eliminada ✅");
      obtenerEmpresas();
    }
  };

  const handleAgregarRubro = async (e) => {
    e.preventDefault();
    try {
      const nuevoDoc = doc(collection(db, "rubros"));
      await setDoc(nuevoDoc, { nombre: nuevoRubro });
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
        if (empresaCoincidente) empresaId = empresaCoincidente.id;
      }
      await setDoc(doc(db, "usuarios", res.user.uid), {
        correo: nuevoUsuario.correo,
        nombre: nuevoUsuario.nombre,
        rol: nuevoUsuario.rol,
        empresaAsociada:
          nuevoUsuario.rol === "empleado" ? nuevoUsuario.empresaAsociada : null,
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

  return (
    <div className="p-8">
      <BotonDeLogout />
      <h1 className="text-2xl mb-6">Dashboard Administrador</h1>

      {/* Empresas */}
      <h2 className="text-xl mb-4">Gestión de Empresas</h2>
      <ul className="space-y-4 mb-10">
        {empresas.map((empresa) => (
          <li key={empresa.id} className="border rounded p-4">
            <p>
              <strong>{empresa.nombre}</strong> ({empresa.codigo}) -{" "}
              {empresa.rubro}
            </p>
            <p>
              {empresa.correo} | {empresa.telefono}
            </p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEditarEmpresa(empresa)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleEliminarEmpresa(empresa.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Eliminar
              </button>
            </div>

            {ofertasPorEmpresa[empresa.id] && (
              <div className="mt-4">
                {Object.entries(ofertasPorEmpresa[empresa.id]).map(
                  ([categoria, lista]) => (
                    <div key={categoria} className="mb-4">
                      <h4 className="font-semibold capitalize">{categoria}:</h4>
                      <ul className="list-disc ml-6">
                        {lista.map((oferta) => (
                          <li
                            key={oferta.id}
                            className="flex flex-col gap-1 mb-2"
                          >
                            <span className="font-semibold">
                              {oferta.titulo}
                            </span>
                            <span className="text-sm text-gray-600">
                              Estado: {oferta.estado}
                            </span>
                            {oferta.estado === "rechazada" && (
                              <span className="text-red-500 text-sm">
                                Motivo:{" "}
                                {oferta.motivoRechazo || "No especificado"}
                              </span>
                            )}
                            <div className="flex gap-2 mt-1">
                              <button
                                onClick={() => handleEliminarOferta(oferta.id)}
                                className="text-red-600 hover:underline"
                              >
                                Eliminar
                              </button>
                              {oferta.estado === "pendiente" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleAprobarOferta(oferta.id)
                                    }
                                    className="text-green-600 hover:underline"
                                  >
                                    Aprobar
                                  </button>
                                  <button
                                    onClick={() => {
                                      const motivo =
                                        prompt("Motivo de rechazo:");
                                      if (motivo)
                                        handleRechazarOferta(oferta.id, motivo);
                                    }}
                                    className="text-yellow-600 hover:underline"
                                  >
                                    Rechazar
                                  </button>
                                </>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Formulario Empresa */}
      <form
        onSubmit={handleGuardarEmpresa}
        className="bg-white shadow-md rounded p-6 max-w-md mb-10"
      >
        <h3 className="font-bold mb-4">
          {editarEmpresaId ? "Editar Empresa" : "Registrar Nueva Empresa"}
        </h3>
        <input
          name="nombre"
          value={nuevaEmpresa.nombre}
          onChange={handleChangeEmpresa}
          placeholder="Nombre"
          className="border w-full p-2 rounded mb-2"
        />
        <input
          name="codigo"
          value={nuevaEmpresa.codigo}
          onChange={handleChangeEmpresa}
          placeholder="Código"
          className="border w-full p-2 rounded mb-2"
        />
        <input
          name="direccion"
          value={nuevaEmpresa.direccion}
          onChange={handleChangeEmpresa}
          placeholder="Dirección"
          className="border w-full p-2 rounded mb-2"
        />
        <input
          name="contacto"
          value={nuevaEmpresa.contacto}
          onChange={handleChangeEmpresa}
          placeholder="Contacto"
          className="border w-full p-2 rounded mb-2"
        />
        <input
          name="telefono"
          value={nuevaEmpresa.telefono}
          onChange={handleChangeEmpresa}
          placeholder="Teléfono"
          className="border w-full p-2 rounded mb-2"
        />
        <input
          name="correo"
          value={nuevaEmpresa.correo}
          onChange={handleChangeEmpresa}
          placeholder="Correo"
          className="border w-full p-2 rounded mb-2"
        />
        <select
          name="rubro"
          value={nuevaEmpresa.rubro}
          onChange={handleChangeEmpresa}
          className="border w-full p-2 rounded mb-2"
        >
          <option value="">Seleccionar rubro</option>
          {rubros.map((rubro, index) => (
            <option key={index} value={rubro}>
              {rubro}
            </option>
          ))}
        </select>
        <input
          name="porcentajeComision"
          value={nuevaEmpresa.porcentajeComision}
          onChange={handleChangeEmpresa}
          placeholder="% Comisión"
          className="border w-full p-2 rounded mb-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 w-full rounded"
        >
          {editarEmpresaId ? "Actualizar" : "Registrar"}
        </button>
      </form>

      {/* Rubros */}
      <h2 className="text-xl mb-4">Gestión de Rubros</h2>
      <ul className="mb-4 space-y-2">
        {rubros.map((rubro, index) => (
          <li key={index} className="border p-2 rounded">
            {rubro}
          </li>
        ))}
      </ul>
      <form
        onSubmit={handleAgregarRubro}
        className="space-y-3 bg-white p-6 rounded shadow-md max-w-md mb-10"
      >
        <input
          type="text"
          placeholder="Nuevo Rubro"
          value={nuevoRubro}
          onChange={(e) => setNuevoRubro(e.target.value)}
          className="border w-full p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white w-full p-2 rounded"
        >
          Agregar Rubro
        </button>
      </form>

      {/* Usuarios */}
      <h2 className="text-xl mb-4">Registrar Usuario Empresa o Empleado</h2>
      <form
        onSubmit={handleCrearUsuario}
        className="space-y-3 bg-white p-6 rounded shadow-md max-w-md mb-10"
      >
        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={nuevoUsuario.correo}
          onChange={handleChangeUsuario}
          className="border w-full p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={nuevoUsuario.password}
          onChange={handleChangeUsuario}
          className="border w-full p-2 rounded"
          required
        />
        <input
          type="text"
          name="nombre"
          placeholder="Nombre o Contacto"
          value={nuevoUsuario.nombre}
          onChange={handleChangeUsuario}
          className="border w-full p-2 rounded"
          required
        />
        <select
          name="rol"
          value={nuevoUsuario.rol}
          onChange={handleChangeUsuario}
          className="border w-full p-2 rounded"
        >
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
        <button
          type="submit"
          className="bg-green-500 text-white w-full p-2 rounded"
        >
          Registrar Usuario
        </button>
      </form>

      {/* Clientes */}
      <h2 className="text-xl mb-4">Clientes Registrados</h2>
      <ul className="space-y-4 mb-10">
        {clientes.map((cliente) => (
          <li key={cliente.id} className="border p-4 rounded bg-gray-100">
            <p>
              <strong>Correo:</strong> {cliente.correo}
            </p>
            <p>
              <strong>Cupones:</strong>{" "}
              {cliente.cupones.join(", ") || "Ninguno"}
            </p>
            <button
              onClick={() => handleEliminarCliente(cliente.id)}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
            >
              Eliminar Cliente
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
