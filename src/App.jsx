import './index.css';
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import logo from 'https://cdn.jsdelivr.net/gh/iberianmedia/assets@main/IM_icon_color_fondo_negro.png';

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

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'inherit' }}>
      <img src={logo} alt="Logo" style={{ height: 60 }} />
      <h1>Autoevaluación de filmmakers</h1>
      <p>Formulario cargando...</p>
    </div>
  );
}

export default App;
