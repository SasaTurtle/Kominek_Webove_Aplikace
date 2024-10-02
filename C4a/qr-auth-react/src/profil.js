import React, { useState } from 'react';
import './Profil.css';
import { getSession, isAuth } from './AuthService';
import { callServer2 } from './postData'; 

function Profil(){

    const [jmeno, setJmeno] = useState('');
    const [prijmeni, setPrijmeni] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [fileError, setFileError] = useState('');
    const isRegistered = isAuth();
    
  

 const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType === 'image/jpeg' || fileType === 'image/png') {
        this.setState({ profilePic: file, fileError: '' });
      } else {
        this.setState({ profilePic: null, fileError: 'Only JPG or PNG files are allowed' });
      }
    }
  };

 const handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

 const handleProfil = () => {
    
    if (!profilePic) {
      console.log('Please upload a valid file.');
      return;
    }
    
    const body = {user:getSession(),name:jmeno,surname:prijmeni};

    callServer2(JSON.stringify(body)).then(response=>{
        if (response.success){
            console.log(response.success + " ULOZENO")
        }
    })
    // Submit or log the data
    console.log('Jmeno:', jmeno);
    console.log('Prijmeni:', prijmeni);
    console.log('Profile Pic:', profilePic);
  };

    return (
        <div> 
            {isRegistered?(<div className="profil-container">
            <h1>Profil uživatele</h1>
            <input
              type="text"
              name="jmeno"
              placeholder="Jmeno"
              value={jmeno}
              onChange={handleInputChange}
            />
            <br />
            <input
              type="text"
              name="prijmeni"
              placeholder="Prijmeni"
              value={prijmeni}
              onChange={handleInputChange}
            />
            <br />
            <input
              type="file"
              accept=".jpg,.png"
              onChange={handleFileChange}
            />
            <br />
            {fileError && <p>{fileError}</p>}
            <button onClick={handleProfil}>Změna</button>
          </div>):(<h1>Neni zaregistrovan</h1>)}
          
        </div>
       
      
    );
}

export default Profil;
