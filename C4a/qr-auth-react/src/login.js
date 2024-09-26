import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { callServer } from './postData'; 

const Login = () => {
  const { id } = useParams();
  const { username } = useParams();
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState('');
  const [show, setShow] = useState(false);
  const [userList, setUserList] = useState([{"email": ""}]);

  const handleLogin = () => {
    callServer("login",username,password).then(response =>{
      if(response.success){
        setShowMessage(`Přihlášení úspěšné pro uživatele: ${username}`);
      } else {
        setShowMessage("chyba:" + response.message);
      }
      setShow(true);
    });
  }

  const handleUserList = () => {
    callServer("userlist",username,password).then(response =>{
      if(response.success){
        setUserList(response.data);
      } else {
        setShowMessage("chyba:" + response.message);
      }
      setShow(true);
    });
  }

  return (
    <div>
      <h1>Přihlášení</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setPassword(e.target.value)}
      /><br/>
      <input
        type="password"
        placeholder="Heslo"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br/>
      <button onClick={handleLogin}>Přihlásit se</button>

      {show && (
        <div>
          {showMessage}<br/>
          <button onClick={handleUserList}>Seznam uživatelů</button>
          <ul>
          {userList?.map(function(s) {return (
                <li>{s.email}</li>
            );
          })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Login;
