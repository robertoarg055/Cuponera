import { useState, useEffect } from "react";

export default function DashboardCliente() {
  const [ofertas, setOfertas] = useState([]);
  const [misCupones, setMisCupones] = useState([]);

  useEffect(() => {
    // *En esta sección se cambia por la conexión a la base de datos que vamos a ocupar*
    // Simular obtener ofertas aprobadas
    const ofertasEjemplo = [
      { id: 1, titulo: "Descuento 50% en Pizza", precioOferta: 5, descripcion: "Válido hasta fin de mes." },
      { id: 2, titulo: "2x1 en Café", precioOferta: 3, descripcion: "Café premium." },
    ];
    setOfertas(ofertasEjemplo);

    // *En esta sección se cambia por la conexión a la base de datos que vamos a ocupar*
    // Simular obtener cupones del cliente
    const cuponesEjemplo = [
      { id: 101, codigo: "EMP001-1234567", estado: "Disponible", oferta: "Descuento 50% en Pizza" },
      { id: 102, codigo: "EMP002-7654321", estado: "Canjeado", oferta: "2x1 en Café" },
    ];
    setMisCupones(cuponesEjemplo);
  }, []);

  const handleComprar = (oferta) => {
    // *En esta sección se cambia por la conexión a la base de datos que vamos a ocupar*
    alert(`Compra simulada: ${oferta.titulo}`);
    // Aquí generarías el código único y agregarías el cupón al cliente en la base
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-6">Bienvenido, Cliente</h1>

      {/* Ofertas disponibles */}
      <h2 className="text-xl mb-4">Ofertas Disponibles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {ofertas.map((oferta) => (
          <div key={oferta.id} className="border p-4 rounded shadow-md">
            <h3 className="font-bold">{oferta.titulo}</h3>
            <p className="text-sm">{oferta.descripcion}</p>
            <p className="mt-2 mb-2">Precio Oferta: ${oferta.precioOferta}</p>
            <button
              onClick={() => handleComprar(oferta)}
              className="bg-blue-500 text-white w-full p-2 rounded"
            >
              Comprar Cupón
            </button>
          </div>
        ))}
      </div>

      {/* Cupones comprados */}
      <h2 className="text-xl mb-4">Mis Cupones</h2>
      <ul className="space-y-3">
        {misCupones.map((cupon) => (
          <li key={cupon.id} className="border p-4 rounded">
            <p><strong>Oferta:</strong> {cupon.oferta}</p>
            <p><strong>Código:</strong> {cupon.codigo}</p>
            <p><strong>Estado:</strong> {cupon.estado}</p>
            {cupon.estado === "Disponible" && (
              <button className="bg-green-500 text-white mt-2 p-2 rounded">
                Descargar PDF
              </button>
              // *En esta sección se cambia por generación y descarga de PDF*
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
