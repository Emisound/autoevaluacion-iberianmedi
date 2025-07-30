import './index.css';
import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
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

const emojis = {
  "Edición": "🎬",
  "After Effects": "✨",
  "Streaming": "📡",
  "Subtítulos": "🔤",
  "Fotografía": "📷",
  "Realización": "🎬",
  "Iluminación": "💡",
  "Operador de cámara": "🎥",
  "Grafismos": "💻",
  "Animación 2D": "🌊",
  "Color": "🎨",
  "IA": "🤖",
  "Realización en vivo": "📺",
  "Arte": "🖼️",
  "Director de Fotografía": "🎞️",
  "Dron": "🛸"
};

function Dashboard() {
  const [respuestas, setRespuestas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "auto-evaluaciones"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRespuestas(data);
    };
    fetchData();
  }, []);

  const eliminar = async (id) => {
    await deleteDoc(doc(db, "auto-evaluaciones", id));
    setRespuestas(prev => prev.filter(r => r.id !== id));
  };

  const promedios = {};
  const conteos = {};

  respuestas.forEach(resp => {
    Object.entries(resp.evaluaciones).forEach(([clave, { valor }]) => {
      const categoria = clave.split(" - ")[0];

      // Extraer solo el número del valor (por si viene como string tipo “2 – Nivel básico / Principiante”)
      const valorNumerico = typeof valor === 'number'
        ? valor
        : parseInt(String(valor).trim().charAt(0));

      if (!isNaN(valorNumerico)) {
        promedios[categoria] = (promedios[categoria] || 0) + valorNumerico;
        conteos[categoria] = (conteos[categoria] || 0) + 1;
      }
    });
  });

  Object.keys(promedios).forEach(cat => {
    promedios[cat] = promedios[cat] / conteos[cat];
  });

  return (
    <div className="container">
      <img src={logo} alt="Logo" className="logo" />
      <h2>Dashboard de Administrador</h2>

      <h3>Promedio por Categoría</h3>
      <ul>
        {Object.entries(promedios).map(([categoria, promedio]) => (
          <li key={categoria}>
            <strong>{categoria}:</strong> <span style={{ color: promedio <= 2.99 ? 'red' : 'black' }}>
              {emojis[categoria] || ''} {promedio.toFixed(2)}/5
            </span>
            {promedio <= 2.99 && <span style={{ color: 'red', marginLeft: 8 }}>Necesita mejorar</span>}
          </li>
        ))}
      </ul>

      {respuestas.map((resp) => (
        <div key={resp.id}>
          <h4>{resp.nombre}</h4>
          <ul>
            {Object.entries(resp.evaluaciones).map(([clave, { valor, comentario }]) => {
              const categoria = clave.split(" - ")[0];

              // Extraer solo el número del valor para mostrarlo correctamente
              const valorNumerico = typeof valor === 'number'
                ? valor
                : parseInt(String(valor).trim().charAt(0));

              return (
                <li key={clave}>
                  <strong>{clave}:</strong> {emojis[categoria] || ''} ({valorNumerico}/5)
                  {comentario && <em> – {comentario}</em>}
                </li>
              );
            })}
          </ul>
          <button onClick={() => eliminar(resp.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;



