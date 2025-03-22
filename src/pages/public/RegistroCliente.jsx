import { useState } from "react";

export default function RegistroCliente() {
  const [cliente, setCliente] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    correo: "",
    direccion: "",
    dui: "",
    password: "",
  });

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(cliente);

    // *En esta sección se cambia por la conexión a la base de datos que vamos a ocupar*
    alert("Cliente registrado (simulado)!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl mb-6">Registro de Cliente</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96 space-y-4"
      >
        <input
          type="text"
          name="nombres"
          placeholder="Nombres"
          value={cliente.nombres}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        />
        <input
          type="text"
          name="apellidos"
          placeholder="Apellidos"
          value={cliente.apellidos}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={cliente.telefono}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo electrónico"
          value={cliente.correo}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={cliente.direccion}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        />
        <input
          type="text"
          name="dui"
          placeholder="Número de DUI"
          value={cliente.dui}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={cliente.password}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white w-full p-2 rounded">
          Registrar
        </button>
      </form>
    </div>
  );
}
