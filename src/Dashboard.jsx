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

const iconos = {
  "Edición": "🎬",
  "Operador de cámara": "🎥",
  "Grafismos": "💻",
  "Animación 2D": "🌊",
  "After Effects": "✨",
  "Color": "🎨",
  "IA": "🤖",
  "Realización": "🎬",
  "Realización en vivo": "📺",
  "Streaming": "📡",
  "Iluminación": "💡",
  "Arte": "🖼️",
  "Director de Fotografía": "🎞️"
};

function Dashboard() {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [promedios, setPromedios] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "auto-evaluaciones"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvaluaciones(data);

      const acumulador = {};
      const conteo = {};

      data.forEach((evalItem) => {
        Object.entries(evalItem.evaluaciones).forEach(([clave, datos]) => {
          const categoria = clave.split(" - ")[0];
          if (!acumulador[categoria]) {
            acumulador[categoria] = 0;
            conteo[categoria] = 0;
          }
          acumulador[categoria] += datos.valor;
          conteo[categoria]++;
        });
      });

      const calculado = {};
      Object.keys(acumulador).forEach(categoria => {
        calculado[categoria] = (acumulador[categoria] / conteo[categoria]).toFixed(2);
      });
      setPromedios(calculado);
    };
    fetchData();
  }, []);

  const eliminarEvaluacion = async (id) => {
    const confirmacion = window.confirm("¿Estás seguro de que quieres eliminar esta evaluación?");
    if (confirmacion) {
      await deleteDoc(doc(db, "auto-evaluaciones", id));
      setEvaluaciones(evaluaciones.filter(e => e.id !== id));
    }
  };

  return (
    <div className="container">
      <img src={logo} alt="Logo Iberian Media" className="logo" />
      <h1>Dashboard de Administrador</h1>

      {Object.keys(promedios).length > 0 && (
        <div className="dashboard-promedios">
          <h2>Promedio por Categoría</h2>
          <ul>
            {Object.entries(promedios).map(([categoria, promedio]) => {
              const icono = iconos[categoria] || '⭐';
              const promedioValor = parseFloat(promedio);
              const colorStyle = promedioValor <= 2.99 ? { color: 'red', fontWeight: 'bold' } : {};
              return (
                <li key={categoria}>
                  <strong>{categoria}</strong>: {icono} <span style={colorStyle}>({promedio}/5)</span>
                  {promedioValor <= 2.99 && <span style={{ color: 'red', marginLeft: '8px' }}>Necesita mejorar</span>}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {evaluaciones.length === 0 ? (
        <p>No hay evaluaciones registradas todavía.</p>
      ) : (
        <div className="dashboard-list">
          {evaluaciones.map((evalItem) => (
            <div key={evalItem.id} className="dashboard-item">
              <h2>{evalItem.nombre}</h2>
              <ul>
                {Object.entries(evalItem.evaluaciones).map(([clave, datos]) => {
                  const categoria = clave.split(" - ")[0];
                  const icono = iconos[categoria] || "⭐";
                  return (
                    <li key={clave}>
                      <strong>{clave}</strong>: {icono.repeat(datos.valor)} ({datos.valor}/5)
                      <br />
                      <em>{datos.comentario}</em>
                    </li>
                  );
                })}
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


