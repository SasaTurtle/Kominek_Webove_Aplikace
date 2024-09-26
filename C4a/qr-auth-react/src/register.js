import React, { useState } from 'react';
import { QRCode } from 'react-qrcode-logo';
import { v4 as uuidv4 } from 'uuid';
import { callServer } from './postData'; 

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [message, setMessage] = useState('');
  const [url, setUrl] = useState('');
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [deadline, setDeadline] = useState(new Date());

  const handleRegister = () => {
    const id = uuidv4(); // generujeme unikátní ID pro uživatele
    const url = `/login/${username}/${id}`; // URL s ID
    let interval = null;
    

    callServer("register",username,password).then(response =>{
        if(response.success){
            setUsername('');
            setPassword('');
            setUrl(url);
            setShowQRCode(true);
            setMessage(`QR kód pro uživatele ${username} byl vygenerován. `);
            setDeadline(new Date().setMinutes(5));
            interval = setInterval(() => getTime(deadline), 1000);

        }else{
            setMessage(`chyba registrace.`);
        }
    });
    
    const getTime = () => {
      const time = Date.parse(deadline) - Date.now();
      setMinutes(5+Math.floor((time / 1000 / 60) % 60));
      setSeconds(60+Math.floor((time / 1000) % 60));
    };

    // Nastavit platnost QR kódu na 5 minut
    setTimeout(() => {
      setUrl("");
      setShowQRCode(false);
      setMessage('Platnost QR kódu vypršela.');
      clearInterval(interval);
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
          <QRCode value={"http://s-kominek-24.dev.spsejecna.net" + url} />
          <a href={url} >Link na registraci</a>
          <p>{message} Platnost {minutes}:{seconds}</p>
        </div>
        
      )}
      
    </div>
  );
}

export default Register;
