const keyUser = 'user';

function setSession(user) {
  //localStorage.setItem(keyUser, JSON.stringify(json));
  const d = new Date();
  d.setTime(d.getTime() + (360*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = keyUser + "=" + user + ";" + expires + ";path=/";
}

function getSession() {
//   if (localStorage.getItem(keyUser) === null) {
//     return null;
//   } 
//  const user = localStorage.getItem(keyUser);
let name = keyUser + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return "";

 //return JSON.parse(user);
}

function isAuth() {
  return !!getSession();
}

export {
  getSession, isAuth, setSession
};
