import './index.css';
import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import logo from './assets/IM_icon_color_fondo_negro.png';

const firebaseConfig = {
  apiKey: "AIzaSyD0oQUhF2Fpg4u_m5mnebR7BLJkKfKFNHQ",
  authDomain: "filmakers-evaluacion.firebaseapp.com",
  projectId: "filmakers-evaluacion",
  storageBucket: "filmakers-evaluacion.appspot.com",
  messagingSenderId: "190347887731",
  appId: "1:190347887731:web:d64909df1c12e637cf9606",
  measurementId: "G-MZ6S0FBEC2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function Dashboard() {
  const [evaluaciones, setEvaluaciones] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "auto-evaluaciones"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvaluaciones(data);
    };
    fetchData();
  }, []);

  const eliminarEvaluacion = async (id) => {
    await deleteDoc(doc(db, "auto-evaluaciones", id));
    setEvaluaciones(evaluaciones.filter(e => e.id !== id));
  };

  return (
    <div className="container">
      <img src={logo} alt="Logo Iberian Media" className="logo" />
      <h1>Dashboard de Administrador</h1>
      {evaluaciones.length === 0 ? (
        <p>No hay evaluaciones registradas todavía.</p>
      ) : (
        <div className="dashboard-list">
          {evaluaciones.map((evalItem) => (
            <div key={evalItem.id} className="dashboard-item">
              <h2>{evalItem.nombre}</h2>
              <ul>
                {Object.entries(evalItem.evaluaciones).map(([clave, datos]) => (
                  <li key={clave}>
                    <strong>{clave}</strong>: {datos.valor} ⭐<br />
                    <em>{datos.comentario}</em>
                  </li>
                ))}
              </ul>
              <button onClick={() => eliminarEvaluacion(evalItem.id)}>Eliminar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
