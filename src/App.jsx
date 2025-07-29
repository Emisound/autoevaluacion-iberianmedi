import { useState } from 'react';
import './index.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

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

const categorias = {
  "Edición": [
    "Shorts para redes",
    "Video corporativo",
    "Podcast",
    "Montaje Recaps"
  ],
  "Operador de cámara": [],
  "Grafismos": [],
  "Animación 2D": [],
  "After Effects": [],
  "Color": [],
  "IA": [],
  "Realización": ["Dirección de pieza audiovisual"],
  "Realización en vivo": [],
  "Streaming": [],
  "Iluminación": [],
  "Arte": [],
  "Director de Fotografía": [],
  "Subtítulos": [],
  "Fotografía": [],
  "Dron": []
};

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
  "Director de Fotografía": "🎞️",
  "Subtítulos": "🔤",
  "Fotografía": "📷",
  "Dron": "🛸"
};

function App() {
  const [nombre, setNombre] = useState('');
  const [respuestas, setRespuestas] = useState({});

  const handleEmojiClick = (categoria, subcategoria, nivel) => {
    const clave = subcategoria ? `${categoria} - ${subcategoria}` : `${categoria}`;
    setRespuestas(prev => ({
      ...prev,
      [clave]: {
        valor: nivel,
        comentario: prev[clave]?.comentario || ""
      }
    }));
  };

  const handleComentarioChange = (categoria, subcategoria, comentario) => {
    const clave = subcategoria ? `${categoria} - ${subcategoria}` : `${categoria}`;
    setRespuestas(prev => ({
      ...prev,
      [clave]: {
        valor: prev[clave]?.valor || 0,
        comentario
      }
    }));
  };

  const enviar = async () => {
    if (!nombre) return alert("Pon tu nombre");
    await addDoc(collection(db, "auto-evaluaciones"), {
      nombre,
      evaluaciones: respuestas
    });
    alert("Enviado correctamente");
    setNombre('');
    setRespuestas({});
  };

  return (
    <div className="container">
      <h1>Autoevaluación de Filmmakers</h1>
      <label>Tu nombre</label>
      <input value={nombre} onChange={e => setNombre(e.target.value)} />
      {Object.entries(categorias).map(([categoria, subcategorias]) => (
        subcategorias.length > 0 ? (
          subcategorias.map(sub => {
            const clave = `${categoria} - ${sub}`;
            const valor = respuestas[clave]?.valor || 0;
            const icono = iconos[categoria] || "⭐";
            return (
              <div key={clave}>
                <strong>{clave}</strong><br />
                {[1,2,3,4,5].map(n => (
                  <span
                    key={n}
                    style={{ cursor: 'pointer', opacity: n <= valor ? 1 : 0.3 }}
                    onClick={() => handleEmojiClick(categoria, sub, n)}
                  >
                    {icono}
                  </span>
                ))}
                <br />
                <textarea
                  placeholder="Comentario opcional"
                  value={respuestas[clave]?.comentario || ''}
                  onChange={e => handleComentarioChange(categoria, sub, e.target.value)}
                />
              </div>
            );
          })
        ) : (
          (() => {
            const clave = categoria;
            const valor = respuestas[clave]?.valor || 0;
            const icono = iconos[categoria] || "⭐";
            return (
              <div key={clave}>
                <strong>{clave}</strong><br />
                {[1,2,3,4,5].map(n => (
                  <span
                    key={n}
                    style={{ cursor: 'pointer', opacity: n <= valor ? 1 : 0.3 }}
                    onClick={() => handleEmojiClick(categoria, null, n)}
                  >
                    {icono}
                  </span>
                ))}
                <br />
                <textarea
                  placeholder="Comentario opcional"
                  value={respuestas[clave]?.comentario || ''}
                  onChange={e => handleComentarioChange(categoria, null, e.target.value)}
                />
              </div>
            );
          })()
        )
      ))}
      <br />
      <button onClick={enviar}>Enviar</button>
    </div>
  );
}

export default App;

