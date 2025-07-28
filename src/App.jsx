import './index.css';
import { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

const logo = 'https://cdn.jsdelivr.net/gh/iberianmedia/assets@main/IM_icon_color_fondo_negro.png';

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

const CATEGORIES = [
  { key: 'edicion_shorts', label: 'Edición - Shorts para redes', icon: '✂️' },
  { key: 'edicion_corporativo', label: 'Edición - Vídeo corporativo', icon: '📈' },
  { key: 'edicion_podcast', label: 'Edición - Podcast', icon: '🎧' },
  { key: 'edicion_recaps', label: 'Edición - Montaje Recaps', icon: '🔁' },
  { key: 'camara', label: 'Operador de cámara', icon: '📷' },
  { key: 'grafismos', label: 'Grafismos', icon: '🎨' },
  { key: 'animacion2d', label: 'Animación 2D', icon: '🌀' },
  { key: 'aftereffects', label: 'After Effects', icon: '✨' },
  { key: 'color', label: 'Color', icon: '🌈' },
  { key: 'ia', label: 'IA aplicada a vídeo', icon: '🤖' },
  { key: 'realizacion', label: 'Realización (Dirección)', icon: '🎬' },
  { key: 'realizacion_vivo', label: 'Realización en vivo', icon: '📺' },
  { key: 'streaming', label: 'Streaming', icon: '🌐' },
  { key: 'iluminacion', label: 'Iluminación', icon: '💡' },
  { key: 'arte', label: 'Arte', icon: '🖌️' },
  { key: 'dof', label: 'Director de Fotografía', icon: '🎥' },
];

function AutoevaluacionApp() {
  const [nombre, setNombre] = useState('');
  const [resultados, setResultados] = useState({});
  const [comentarios, setComentarios] = useState({});
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [modoAdmin, setModoAdmin] = useState(false);
  const [loginID, setLoginID] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [errorLogin, setErrorLogin] = useState('');
  const [hoverValues, setHoverValues] = useState({});
  const [filtroNombre, setFiltroNombre] = useState('');

  const enviarEvaluacion = async () => {
    if (!nombre) return alert('Introduce tu nombre');
    const nuevaEval = { nombre, resultados, comentarios, fecha: new Date().toISOString() };
    await addDoc(collection(db, "evaluaciones"), nuevaEval);
    setNombre('');
    setResultados({});
    setComentarios({});
    alert('¡Evaluación enviada!');
  };

  const entrarComoAdmin = async () => {
    if (loginID === 'administrador' && loginPass === 'Khloe') {
      const snapshot = await getDocs(collection(db, "evaluaciones"));
      const data = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      setEvaluaciones(data);
      setModoAdmin(true);
      setErrorLogin('');
    } else {
      setErrorLogin('Credenciales incorrectas');
    }
  };

  const eliminarEvaluacion = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta evaluación?')) {
      await deleteDoc(doc(db, "evaluaciones", id));
      setEvaluaciones(evaluaciones.filter(e => e.id !== id));
    }
  };

  const promedio = (key) => {
    const valores = evaluaciones.map(e => parseInt(e.resultados[key] || 0)).filter(v => v > 0);
    if (valores.length === 0) return '-';
    return (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(1);
  };

  if (modoAdmin) {
    const evaluacionesFiltradas = filtroNombre
      ? evaluaciones.filter(e => e.nombre.toLowerCase().includes(filtroNombre.toLowerCase()))
      : evaluaciones;

    return (
      <div className="p-4">
        <img src={logo} alt="Logo Iberian Media" className="h-12 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Panel de Administrador</h1>
        <input
          type="text"
          placeholder="Filtrar por nombre..."
          className="mb-4 p-2 border rounded w-full sm:w-1/2"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
        />
        <h2 className="text-xl font-semibold">Promedios por categoría</h2>
        <ul className="mb-6 list-disc pl-6">
          {CATEGORIES.map(cat => (
            <li key={cat.key}>{cat.label}: {promedio(cat.key)}</li>
          ))}
        </ul>
        <h2 className="text-xl font-semibold">Evaluaciones individuales</h2>
        {evaluacionesFiltradas.map((e) => (
          <div key={e.id} className="border p-4 my-2 rounded">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">{e.nombre}</h3>
              <button className="text-red-600 text-sm" onClick={() => eliminarEvaluacion(e.id)}>Eliminar</button>
            </div>
            <ul className="text-sm list-disc pl-5">
              {Object.keys(e.resultados).map(k => (
                <li key={k}><strong>{CATEGORIES.find(c => c.key === k)?.label}:</strong> {e.resultados[k]}<br/>{e.comentarios[k] && <em>Comentario: {e.comentarios[k]}</em>}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 grid gap-4 max-w-screen-md mx-auto">
      <img src={logo} alt="Logo Iberian Media" className="h-12 mb-4" />
      <h1 className="text-2xl font-bold">Autoevaluación de Filmmakers</h1>
      <input
        type="text"
        placeholder="Tu nombre"
        className="w-full mb-2 p-2 border rounded"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      {CATEGORIES.map(cat => (
        <div key={cat.key} className="border rounded p-3">
          <label className="block font-semibold mb-1">{cat.label}</label>
          <div className="flex flex-wrap sm:flex-nowrap gap-1 mb-2">
            {[1, 2, 3, 4, 5].map(n => (
              <span
                key={n}
                className={`text-2xl cursor-pointer transition-transform duration-150 transform hover:scale-125 ${n <= (hoverValues[cat.key] ?? resultados[cat.key] ?? 0) ? 'opacity-100' : 'opacity-30'}`}
                onMouseEnter={() => setHoverValues({ ...hoverValues, [cat.key]: n })}
                onMouseLeave={() => setHoverValues({ ...hoverValues, [cat.key]: undefined })}
                onClick={() => setResultados({ ...resultados, [cat.key]: n })}
              >{cat.icon}</span>
            ))}
          </div>
          <textarea
            placeholder="Comentario opcional"
            className="w-full mb-2 p-2 border rounded"
            value={comentarios[cat.key] || ''}
            onChange={(e) => setComentarios({ ...comentarios, [cat.key]: e.target.value })}
          />
        </div>
      ))}
      <button className="w-full sm:w-auto bg-green-600 text-white py-2 rounded" onClick={enviarEvaluacion}>Enviar Evaluación</button>

      <div className="mt-8">
        <h2 className="font-semibold mb-2">¿Eres administrador?</h2>
        <input
          type="text"
          placeholder="ID"
          className="w-full sm:w-auto mb-2 p-2 border rounded mr-2"
          value={loginID}
          onChange={(e) => setLoginID(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full sm:w-auto mb-2 p-2 border rounded mr-2"
          value={loginPass}
          onChange={(e) => setLoginPass(e.target.value)}
        />
        <button onClick={entrarComoAdmin} className="w-full sm:w-auto bg-blue-600 text-white py-2 px-4 rounded">Entrar</button>
        {errorLogin && <p className="text-red-600 mt-2">{errorLogin}</p>}
      </div>
    </div>
  );
}

export default AutoevaluacionApp;

