import React, { useState } from 'react';
import { QRCode } from 'react-qrcode-logo';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { callServer } from './postData'; 

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [message, setMessage] = useState('');
  const [url, setUrl] = useState('');


  const handleRegister = () => {
    const id = uuidv4(); // generujeme unikátní ID pro uživatele
    const url = `https://nirmala.cz/sasa/login/${id}`; // URL s ID
   
    //loginUser('test@example.com', 'yourpassword');
    // Reset username a password

    callServer("register",username,password).then(response =>{
        if(response.success){
            setUsername('');
            setPassword('');
            setUrl(url);
            setQrValue(url);
            setShowQRCode(true);
            setMessage(`QR kód pro uživatele ${username} byl vygenerován. Platnost: 5 minut.`);
        }else{
            setMessage(`chyba registrace.`);
        }
    });
    
    
    // Nastavit platnost QR kódu na 5 minut
    setTimeout(() => {
      setQrValue('');
      setShowQRCode(false);
      setMessage('Platnost QR kódu vypršela.');
    }, 5 * 60 * 1000); // 5 minut
  };


  

  return (
    <div className="App">
      <h1>Registrace</h1>
      <input
        type="text"
        placeholder="Uživatelské jméno"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Heslo"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Registrovat</button>
      {showQRCode && (
        <div>
          <h2>QR Kód</h2>
          <QRCode value={url} />
          <link rel="qr" href={url} />
        </div>
      )}
      <p>{message}</p>
    </div>
  );
}

export default Register;
