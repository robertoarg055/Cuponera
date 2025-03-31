import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function RegistroCliente() {
  const { signup } = useAuth();
  const navigate = useNavigate();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signup(cliente.correo, cliente.password);

      await setDoc(doc(db, "usuarios", res.user.uid), {
        nombres: cliente.nombres,
        apellidos: cliente.apellidos,
        telefono: cliente.telefono,
        correo: cliente.correo,
        direccion: cliente.direccion,
        dui: cliente.dui,
        rol: "cliente",
      });

      alert("¡Cliente registrado exitosamente!");
      navigate("/login");
    } catch (error) {
      console.error("Error al registrar cliente:", error);
      alert("Hubo un error al registrar. Revisa los datos.");
    }
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
          required
        />
        <input
          type="text"
          name="apellidos"
          placeholder="Apellidos"
          value={cliente.apellidos}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono"
          value={cliente.telefono}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo electrónico"
          value={cliente.correo}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={cliente.direccion}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="dui"
          placeholder="DUI"
          value={cliente.dui}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={cliente.password}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}
