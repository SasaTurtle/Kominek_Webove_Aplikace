import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { callServer } from './postData'; 

const Login = () => {
  const { id } = useParams();
  const { username } = useParams();
  const [username1, setUserName1] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState('');
  const [show, setShow] = useState(false);
  const [showList, setShowList] = useState(false);
  const [userList, setUserList] = useState([{"email": ""}]);

  const handleLogin = () => {
    callServer("login",username,password).then(response =>{
      if(response.success){
        setShowMessage(`Přihlášení úspěšné pro uživatele: ${username}`);
        setShowList(true);
      } else {
        setShowMessage("Spatne uz jmeno nebo heslo");
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

  useEffect(() => {
    setUserName1(username);
  }, [username]);

  return (
    <div>
      <h1>Přihlášení</h1>
      <input
        type="text"
        placeholder="Username"
        value={username1}
        onChange={(e) => setUserName1(e.target.value)}
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
        </div>
      )}
      {showList && (
        <div>
         
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
