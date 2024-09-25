import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Login = () => {
  const { id } = useParams();
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Zde byste ověřili heslo
    // Příklad bez skutečné autentifikace:
    if (password) {
      alert(`Přihlášení úspěšné pro ID: ${id}`);
      navigate('/'); // přesměrování na hlavní stránku
    } else {
      alert('Zadejte heslo.');
    }
  };

  return (
    <div>
      <h1>Přihlášení</h1>
      <input
        type="password"
        placeholder="Heslo"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Přihlásit se</button>
    </div>
  );
};

export default Login;
