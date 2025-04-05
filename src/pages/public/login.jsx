import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await login(email, password);
      const userDoc = await getDoc(doc(db, "usuarios", res.user.uid));

      if (userDoc.exists()) {
        const data = userDoc.data();
        const rol = data.rol;

        if (rol === "admin") navigate("/admin");
        else if (rol === "empresa") navigate("/empresa");
        else if (rol === "empleado") navigate("/empleado");
        else navigate("/cliente");
      } else {
        setError("No se encontró información del usuario en la base de datos.");
      }
    } catch (err) {
      console.error(err);
      setError("Correo o contraseña incorrectos.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl mb-6">Iniciar Sesión</h1>
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-96 space-y-4"
      >
        {error && <p className="text-red-500">{error}</p>}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
        >
          Iniciar sesión
        </button>

        <p className="text-sm text-center mt-4">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="text-blue-600 hover:underline">
            Regístrate aquí
          </Link>
        </p>

        <p className="text-sm text-center mt-2">
          <Link to="/cambiar-password" className="text-blue-600 hover:underline">
            ¿Olvidaste o quieres cambiar tu contraseña?
          </Link>
        </p>

        <p className="text-sm text-center mt-2">
          <Link to="/" className="text-gray-600 hover:underline">
            ← Volver a la página pública
          </Link>
        </p>
      </form>
    </div>
  );
}
