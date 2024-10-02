import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './register';
import Login from './login';
import Profil from './profil';


function App() {
  return (
        <BrowserRouter >
          <Routes>
              <Route path="/" element={<Register />} />
              <Route path="/login/:username/:id" element={<Login />} />
              <Route path="/login/profil" element={<Profil />}/>
          </Routes>
        </BrowserRouter>
  );
}

export default App;
