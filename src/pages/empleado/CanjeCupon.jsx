import BotonDeLogout from "../../components/BotonDeLogout";
import { useState } from "react";
import { db } from "../../firebase/config";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

export default function CanjeCupon() {
  const [codigo, setCodigo] = useState("");
  const [infoCupon, setInfoCupon] = useState(null);

  const handleBuscar = async () => {
    try {
      const cuponesRef = collection(db, "cupones");
      const q = query(cuponesRef, where("codigo", "==", codigo));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const cuponDoc = querySnapshot.docs[0];
        setInfoCupon({ id: cuponDoc.id, ...cuponDoc.data() });
      } else {
        alert("Cupón no encontrado");
        setInfoCupon(null);
      }
    } catch (error) {
      console.error("Error al buscar cupón:", error);
      alert("Error al buscar cupón");
    }
  };

  const handleCanjear = async () => {
    if (!infoCupon || infoCupon.estado !== "Disponible") {
      alert("Este cupón no está disponible para canje");
      return;
    }

    try {
      const cuponRef = doc(db, "cupones", infoCupon.id);
      await updateDoc(cuponRef, { estado: "Canjeado" });
      alert("Cupón canjeado exitosamente ✅");
      setInfoCupon({ ...infoCupon, estado: "Canjeado" });
    } catch (error) {
      console.error("Error al canjear cupón:", error);
      alert("Error al canjear el cupón ❌");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <BotonDeLogout />
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
