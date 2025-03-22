import { useState, useEffect } from "react";

export default function DashboardEmpresa() {
  const [ofertas, setOfertas] = useState([]);
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

  useEffect(() => {
    // *En esta sección se cambia por la conexión a la base de datos que vamos a ocupar*
    // Aquí obtendrás las ofertas de la empresa
    const ofertasEjemplo = [
      { id: 1, titulo: "2x1 Hamburguesas", estado: "En espera de aprobación" },
      { id: 2, titulo: "50% en Spa", estado: "Aprobada" },
    ];
    setOfertas(ofertasEjemplo);
  }, []);

  const handleChange = (e) => {
    setNuevaOferta({ ...nuevaOferta, [e.target.name]: e.target.value });
  };

  const handleCrearOferta = (e) => {
    e.preventDefault();

    // *En esta sección se cambia por la conexión a la base de datos que vamos a ocupar*
    console.log(nuevaOferta);
    alert("Oferta creada (simulada)");

    // Limpiar formulario
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
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-6">Dashboard Empresa</h1>

      {/* Lista de ofertas */}
      <h2 className="text-xl mb-4">Mis Ofertas</h2>
      <ul className="space-y-2 mb-6">
        {ofertas.map((oferta) => (
          <li key={oferta.id} className="border p-4 rounded">
            <h3 className="font-bold">{oferta.titulo}</h3>
            <p>Estado: {oferta.estado}</p>
          </li>
        ))}
      </ul>

      {/* Formulario para crear oferta */}
      <h2 className="text-xl mb-4">Crear Nueva Oferta</h2>
      <form onSubmit={handleCrearOferta} className="space-y-4 bg-white p-6 rounded shadow-md max-w-md">
        <input
          type="text"
          name="titulo"
          placeholder="Título de la oferta"
          value={nuevaOferta.titulo}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        />
        <input
          type="number"
          name="precioRegular"
          placeholder="Precio regular"
          value={nuevaOferta.precioRegular}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        />
        <input
          type="number"
          name="precioOferta"
          placeholder="Precio oferta"
          value={nuevaOferta.precioOferta}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        />
        <input
          type="date"
          name="fechaInicio"
          value={nuevaOferta.fechaInicio}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        />
        <input
          type="date"
          name="fechaFin"
          value={nuevaOferta.fechaFin}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        />
        <input
          type="date"
          name="fechaLimiteUso"
          value={nuevaOferta.fechaLimiteUso}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        />
        <input
          type="number"
          name="cantidadCupones"
          placeholder="Cantidad límite de cupones"
          value={nuevaOferta.cantidadCupones}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        />
        <textarea
          name="descripcion"
          placeholder="Descripción de la oferta"
          value={nuevaOferta.descripcion}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        />
        <textarea
          name="otrosDetalles"
          placeholder="Otros detalles"
          value={nuevaOferta.otrosDetalles}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white w-full p-2 rounded">
          Crear Oferta
        </button>
      </form>
    </div>
  );
}
