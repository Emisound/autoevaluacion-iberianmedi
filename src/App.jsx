import './index.css';
import { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
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

const competencias = [
  { categoria: "Edición", subcategorias: ["Shorts para redes", "Video corporativo", "Podcast", "Montaje Recaps"], icono: "🎬" },
  { categoria: "Operador de cámara", subcategorias: [""], icono: "🎥" },
  { categoria: "Grafismos", subcategorias: [""], icono: "💻" },
  { categoria: "Animación 2D", subcategorias: [""], icono: "🌊" },
  { categoria: "After Effects", subcategorias: [""], icono: "✨" },
  { categoria: "Color", subcategorias: [""], icono: "🎨" },
  { categoria: "IA", subcategorias: [""], icono: "🤖" },
  { categoria: "Realización", subcategorias: ["Dirección de pieza audiovisual"], icono: "🎬" },
  { categoria: "Realización en vivo", subcategorias: [""], icono: "📺" },
  { categoria: "Streaming", subcategorias: [""], icono: "📡" },
  { categoria: "Iluminación", subcategorias: [""], icono: "💡" },
  { categoria: "Arte", subcategorias: [""], icono: "🖼️" },
  { categoria: "Director de Fotografía", subcategorias: [""], icono: "🎞️" },
  { categoria: "Subtítulos", subcategorias: [""], icono: "🔤" },
  { categoria: "Fotografía", subcategorias: [""], icono: "📷" },
  { categoria: "Dron", subcategorias: [""], icono: "🛸" }
];

function App() {
  const [formulario, setFormulario] = useState({});
  const [nombre, setNombre] = useState("");
  const [hover, setHover] = useState({});
  const [adminID, setAdminID] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const navigate = useNavigate();

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

  const accederComoAdmin = () => {
    if (adminID === "administrador" && adminPass === "Khloe") {
      navigate("/dashboard");
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="container">
      <img src={logo} alt="Logo Iberian Media" className="logo" />
      <h1>Autoevaluación de Filmmakers</h1>

      <div className="explicativo">
        <p>Por favor, rellena honestamente tus aptitudes en cada categoría. Utiliza la siguiente guía para puntuarte:</p>
        <ul>
          <li><strong>1️⃣ – Sin experiencia / Nulo:</strong> No tengo conocimientos o experiencia práctica en esta área. Nunca lo he hecho o no sé cómo empezar.</li>
          <li><strong>2️⃣ – Nivel básico / Principiante:</strong> He hecho alguna prueba o tengo una idea general, pero me falta confianza y necesito apoyo constante. Requiere supervisión.</li>
          <li><strong>3️⃣ – Nivel intermedio / Autónomo:</strong> Puedo trabajar en esta tarea de forma autónoma en contextos sencillos. Me manejo bien, aunque aún me falta fluidez en situaciones más complejas.</li>
          <li><strong>4️⃣ – Nivel avanzado / Experto funcional:</strong> Domino esta aptitud con seguridad. Soy eficiente, puedo resolver problemas y tengo criterio propio. Puedo aportar valor y mejorar procesos.</li>
          <li><strong>5️⃣ – Especialista / Referente:</strong> Soy experto en esta área. Domino todas sus facetas, puedo liderar proyectos relacionados y ayudar a otros a mejorar. Me consultan por mi criterio.</li>
        </ul>
      </div>

      <form onSubmit={enviarFormulario}>
        <label>Tu nombre</label>
        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required />

        {competencias.map((comp) =>
          comp.subcategorias.map((sub, i) => {
            const clave = sub ? `${comp.categoria} - ${sub}` : comp.categoria;
            const datos = formulario[clave] || {};
            const hoverValue = hover[clave] || 0;

            return (
              <div key={clave}>
                <label>{sub ? `${comp.categoria} - ${sub}` : comp.categoria}</label>
                <div className="emoji-container">
                  {[1, 2, 3, 4, 5].map((nivel) => (
                    <span
                      key={nivel}
                      className={`emoji-button ${(hoverValue >= nivel || datos.valor >= nivel) ? "selected" : ""}`}
                      onClick={() => manejarCambio(clave, nivel)}
                      onMouseEnter={() => setHover(prev => ({ ...prev, [clave]: nivel }))}
                      onMouseLeave={() => setHover(prev => ({ ...prev, [clave]: 0 }))}
                      style={{
                        opacity: (hoverValue >= nivel || datos.valor >= nivel) ? 1 : 0.3,
                        transform: hoverValue === nivel ? 'scale(1.2)' : 'scale(1)',
                        transition: 'transform 0.2s ease, opacity 0.3s ease'
                      }}
                    >
                      {comp.icono}
                    </span>
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

      <div className="admin-login">
        <h2>Acceso Administrador</h2>
        <input type="text" placeholder="ID" value={adminID} onChange={e => setAdminID(e.target.value)} />
        <input type="password" placeholder="Contraseña" value={adminPass} onChange={e => setAdminPass(e.target.value)} />
        <button onClick={accederComoAdmin}>Acceder</button>
      </div>
    </div>
  );
}

export default App;


