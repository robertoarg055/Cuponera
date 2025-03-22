import { useState } from "react";

export default function CanjeCupon() {
  const [codigo, setCodigo] = useState("");
  const [infoCupon, setInfoCupon] = useState(null);

  const handleBuscar = () => {
    // *En esta sección se cambia por la conexión a la base de datos que vamos a ocupar*
    // Simular buscar cupón
    const cuponEjemplo = {
      codigo: "EMP001-1234567",
      oferta: "Descuento 50% en Pizza",
      estado: "Disponible",
      duiCliente: "12345678-9",
    };

    if (codigo === "EMP001-1234567") {
      setInfoCupon(cuponEjemplo);
    } else {
      alert("Cupón no encontrado");
      setInfoCupon(null);
    }
  };

  const handleCanjear = () => {
    if (!infoCupon || infoCupon.estado !== "Disponible") {
      alert("Este cupón no está disponible para canje");
      return;
    }

    // *En esta sección se cambia por la conexión a la base de datos que vamos a ocupar*
    alert("Cupón canjeado exitosamente (simulado)");

    // Simular actualización
    setInfoCupon({ ...infoCupon, estado: "Canjeado" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl mb-6">Canje de Cupones</h1>

      <div className="bg-white p-6 rounded shadow-md w-96">
        <input
          type="text"
          placeholder="Código del cupón"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          className="border w-full p-2 mb-4 rounded"
        />
        <button onClick={handleBuscar} className="bg-blue-500 text-white w-full p-2 rounded mb-4">
          Buscar Cupón
        </button>

        {infoCupon && (
          <div className="border p-4 rounded bg-gray-50">
            <p><strong>Oferta:</strong> {infoCupon.oferta}</p>
            <p><strong>Código:</strong> {infoCupon.codigo}</p>
            <p><strong>Estado:</strong> {infoCupon.estado}</p>
            <p><strong>DUI Cliente:</strong> {infoCupon.duiCliente}</p>

            {infoCupon.estado === "Disponible" && (
              <button onClick={handleCanjear} className="bg-green-500 text-white w-full p-2 rounded mt-4">
                Canjear Cupón
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
