import { useState, useEffect } from "react";

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

  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    // *En esta sección se cambia por la conexión a la base de datos que vamos a ocupar*
    // Simular obtener datos
    const empresasEjemplo = [
      { id: 1, nombre: "Empresa X", codigo: "EMP001", rubro: "Restaurante" },
    ];
    const rubrosEjemplo = ["Restaurante", "Taller", "Salón"];
    const clientesEjemplo = [
      { id: 1, nombres: "Juan Pérez", cupones: 3 },
      { id: 2, nombres: "Ana Gómez", cupones: 2 },
    ];

    setEmpresas(empresasEjemplo);
    setRubros(rubrosEjemplo);
    setClientes(clientesEjemplo);
  }, []);

  const handleChangeEmpresa = (e) => {
    setNuevaEmpresa({ ...nuevaEmpresa, [e.target.name]: e.target.value });
  };

  const handleCrearEmpresa = (e) => {
    e.preventDefault();
    // *En esta sección se cambia por la conexión a la base de datos que vamos a ocupar*
    console.log(nuevaEmpresa);
    alert("Empresa registrada (simulada)");

    // Reset formulario
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
  };

  const handleAgregarRubro = (e) => {
    e.preventDefault();
    // *En esta sección se cambia por la conexión a la base de datos que vamos a ocupar*
    alert(`Rubro agregado (simulado): ${nuevoRubro}`);
    setRubros([...rubros, nuevoRubro]);
    setNuevoRubro("");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-6">Dashboard Administrador</h1>

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
        <input type="text" name="rubro" placeholder="Rubro" value={nuevaEmpresa.rubro} onChange={handleChangeEmpresa} className="border w-full p-2 rounded" />
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

      {/* Visualización de Clientes */}
      <h2 className="text-xl mb-4">Clientes Registrados</h2>
      <ul className="space-y-2">
        {clientes.map((cliente) => (
          <li key={cliente.id} className="border p-4 rounded">
            <p><strong>{cliente.nombres}</strong> - Cupones comprados: {cliente.cupones}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
