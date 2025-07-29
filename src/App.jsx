import './index.css';
import { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

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

const competencias = [
  {
    categoria: "Edición",
    subcategorias: [
      "Shorts para redes",
      "Video corporativo",
      "Podcast",
      "Montaje Recaps",
    ],
    icono: "🎬"
  },
  {
    categoria: "Operador de cámara",
    subcategorias: [""],
    icono: "🎥"
  },
  {
    categoria: "Grafismos",
    subcategorias: [""],
    icono: "💻"
  },
  {
    categoria: "Animación 2D",
    subcategorias: [""],
    icono: "🌊"
  },
  {
    categoria: "After Effects",
    subcategorias: [""],
    icono: "✨"
  },
  {
    categoria: "Color",
    subcategorias: [""],
    icono: "🎨"
  },
  {
    categoria: "IA",
    subcategorias: [""],
    icono: "🤖"
  },
  {
    categoria: "Realización",
    subcategorias: ["Dirección de pieza audiovisual"],
    icono: "🎬"
  },
  {
    categoria: "Realización en vivo",
    subcategorias: [""],
    icono: "📺"
  },
  {
    categoria: "Streaming",
    subcategorias: [""],
    icono: "📡"
  },
  {
    categoria: "Iluminación",
    subcategorias: [""],
    icono: "💡"
  },
  {
    categoria: "Arte",
    subcategorias: [""],
    icono: "🖼️"
  },
  {
    categoria: "Director de Fotografía",
    subcategorias: [""],
    icono: "🎞️"
  },
];

const niveles = ["😵", "😕", "😐", "😊", "🤩"];

function App() {
  const [formulario, setFormulario] = useState({});
  const [nombre, setNombre] = useState("");

  const manejarCambio = (clave, valor) => {
    setFormulario(prev => ({
      ...prev,
      [clave]: {
        ...prev[clave],
        valor
      }
    }));
  };

  const manejarComentario = (clave, comentario) => {
    setFormulario(prev => ({
      ...prev,
      [clave]: {
        ...prev[clave],
        comentario
      }
    }));
  };

  const enviarFormulario = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "auto-evaluaciones"), {
        nombre,
        evaluaciones: formulario,
        fecha: new Date().toISOString()
      });
      alert("¡Autoevaluación enviada con éxito!");
      setNombre("");
      setFormulario({});
    } catch (error) {
      console.error("Error al enviar: ", error);
      alert("Hubo un error al enviar el formulario.");
    }
  };

  return (
    <div className="container">
      <img src="https://cdn.jsdelivr.net/gh/iberianmedia/assets@main/IM_icon_color_fondo_negro.png" alt="Logo Iberian Media" className="logo" />
      <h1>Autoevaluación de Filmmakers</h1>
      <form onSubmit={enviarFormulario}>
        <label>Tu nombre</label>
        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required />

        {competencias.map((comp) =>
          comp.subcategorias.map((sub, i) => {
            const clave = `${comp.categoria} - ${sub || comp.categoria}`;
            const datos = formulario[clave] || {};

            return (
              <div key={clave}>
                <label>{clave}</label>
                <div className="emoji-container">
                  {niveles.map((nivel, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`emoji-button ${datos.valor === nivel ? "selected" : ""}`}
                      onClick={() => manejarCambio(clave, nivel)}
                    >
                      {nivel}
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Comentario opcional"
                  value={datos.comentario || ""}
                  onChange={e => manejarComentario(clave, e.target.value)}
                />
              </div>
            );
          })
        )}
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default App;
