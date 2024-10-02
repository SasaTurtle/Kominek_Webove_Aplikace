import React, { useState, useEffect } from 'react';
import './Profil.css';
import { getSession, isAuth } from './AuthService';
import { callServer2, uploadFile, getUserData } from './postData'; 

function Profil(){

    const [jmeno, setJmeno] = useState('');
    const [prijmeni, setPrijmeni] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [fileError, setFileError] = useState('');
    const [profile, setProfile] = useState({
        "user": "",
        "name": "",
        "surname": "",
        "image": ""
    });
    const isRegistered = isAuth();
    
  

 const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType === 'image/jpeg' || fileType === 'image/png') {
        setProfilePic(file);
        setFileError("");
      } else {
        setProfilePic(null);
        setFileError('Only JPG or PNG files are allowed');
      }
    }
  };
 const userLoaderData = () =>{
    getUserData(getSession()).then(response=>{
        if (response.success){
            setProfile(response.data);
        }
    })
 }
 const handleProfil = () => {
    
     if (!profilePic) {
       console.log('Please upload a valid file.');
       return;
     }
    
    const formData = new FormData();
    formData.append('image', profilePic);
    uploadFile(formData).then(response=>{
        if (response.success){
            console.log(response.success + " ULOZENO")
        }
    })


    const body = {user:getSession(),name:jmeno,surname:prijmeni,image:profilePic.name};

    callServer2(JSON.stringify(body)).then(response=>{
        if (response.success){
            console.log(response.success + " ULOZENO");
            userLoaderData();
            alert("uloženo");
        }
    })
    // Submit or log the data
    console.log('Jmeno:', jmeno);
    console.log('Prijmeni:', prijmeni);
    console.log('Profile Pic:', profilePic);
  };


  useEffect(() => {
    if(isRegistered){
        userLoaderData();
    }
   },[isRegistered]);
    return (
        <div> 
            {isRegistered?(<div className="profil-container">
            <h1>Profil uživatele</h1>
            <input
              type="text"
              name="jmeno"
              placeholder="Jmeno"
              value={jmeno}
              onChange={(e) => setJmeno(e.target.value)}
            />
            <br />
            <input
              type="text"
              name="prijmeni"
              placeholder="Prijmeni"
              value={prijmeni}
              onChange={(e) => setPrijmeni(e.target.value)}
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
         <div>
            {profile.name}
            {profile.surname}
            <img src={"http://s-kominek-24.dev.spsejecna.net/users"+profile.image}></img>
         </div>

        </div>
       
      
    );
}

export default Profil;
