import BotonDeLogout from "../../components/BotonDeLogout";
import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import jsPDF from "jspdf";

export default function DashboardCliente() {
  const { user } = useAuth();
  const [ofertas, setOfertas] = useState([]);
  const [misCupones, setMisCupones] = useState([]);

  useEffect(() => {
    const obtenerOfertas = async () => {
      try {
        const q = query(collection(db, "ofertas"), where("estado", "==", "aprobada"));
        const querySnapshot = await getDocs(q);
        const lista = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOfertas(lista);
      } catch (error) {
        console.error("Error al obtener ofertas:", error);
      }
    };

    const obtenerCupones = async () => {
      try {
        if (!user) return;
        const q = query(collection(db, "cupones"), where("clienteId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const lista = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMisCupones(lista);
      } catch (error) {
        console.error("Error al obtener cupones:", error);
      }
    };

    obtenerOfertas();
    obtenerCupones();
  }, [user]);

  const generarCodigoCupon = (codigoEmpresa) => {
    const random = Math.floor(1000000 + Math.random() * 9000000);
    return `${codigoEmpresa}-${random}`;
  };

  const handleComprar = async (oferta) => {
    try {
      if (!user) return alert("Debes iniciar sesión.");

      const codigo = generarCodigoCupon(oferta.codigoEmpresa || "EMPXXX");

      await addDoc(collection(db, "cupones"), {
        clienteId: user.uid,
        codigo,
        oferta: oferta.titulo,
        estado: "Disponible",
        fechaCompra: Timestamp.now(),
        duiCliente: "N/A",
      });

      alert("¡Compra realizada exitosamente! ✅");

      const q = query(collection(db, "cupones"), where("clienteId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const lista = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMisCupones(lista);
    } catch (error) {
      console.error("Error al comprar cupón:", error);
      alert("Error al realizar la compra ❌");
    }
  };

  const handleDescargarPDF = (cupon) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Cupón de Descuento", 20, 20);
    doc.setFontSize(12);
    doc.text(`Oferta: ${cupon.oferta}`, 20, 40);
    doc.text(`Código: ${cupon.codigo}`, 20, 50);
    doc.text(`Estado: ${cupon.estado}`, 20, 60);
    doc.text("Gracias por tu compra.", 20, 80);
    doc.save(`cupon-${cupon.codigo}.pdf`);
  };

  return (
    <div className="p-8">
      <BotonDeLogout />
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
              <button
                onClick={() => handleDescargarPDF(cupon)}
                className="bg-green-500 text-white mt-2 p-2 rounded"
              >
                Descargar PDF
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
