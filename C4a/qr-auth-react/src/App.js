import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './register';
import Login from './login';


function App() {
  return (
        <BrowserRouter >
          <Routes>
              <Route path="/" element={<Register />} />
              <Route path="/login/:username/:id" element={<Login />} />
          </Routes>
        </BrowserRouter>
  );
}

export default App;
