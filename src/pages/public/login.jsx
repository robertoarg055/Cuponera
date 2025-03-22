import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [role, setRole] = useState("cliente");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        // Simular login
        const usuario = { email, role };
        // Aquí haces validación real
        if (role === "admin") navigate("/admin");
        else if (role === "empresa") navigate("/empresa");
        else if (role === "empleado") navigate("/empleado");
        else navigate("/cliente");
    };

    const handleRecuperarPassword = () => {
        if (!email) {
            alert("Por favor ingresa tu correo para recuperar la contraseña.");
            return;
        }

        // *En esta sección se cambia por la conexión a la base de datos que vamos a ocupar*
        // Aquí enviarías el email de recuperación real
        alert(`Se ha enviado un correo de recuperación a: ${email} (simulado)`);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-3xl mb-4">La Cuponera</h1>
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-center mb-4 text-xl font-bold">Inicio de Sesión</h2>
                <div className="flex justify-around mb-4">
                    {["cliente", "empresa", "admin", "empleado"].map((r) => (
                        <button
                            key={r}
                            className={`px-4 py-2 rounded-md ${role === r ? "bg-blue-500 text-white" : "bg-gray-200"
                                }`}
                            onClick={() => setRole(r)}
                        >
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                        </button>
                    ))}
                </div>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    className="border w-full p-2 rounded mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    className="border w-full p-2 rounded mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    onClick={handleLogin}
                    className="bg-blue-500 text-white w-full py-2 rounded mb-2"
                >
                    Ingresar
                </button>
            </div>
        </div>
    );
}
