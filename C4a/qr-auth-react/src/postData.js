async function callServer(action, email, password) {
    try {
      const response = await fetch('http://s-kominek-24.dev.spsejecna.net/app.php', {
        method: 'POST', // HTTP method (POST)
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*' 
        },
        body: JSON.stringify({
          action: action, // Action specifies 'login'
          email: email,    // The email entered by the user
          password: password // The password entered by the user
        })
      });
  
      // Parse JSON response
      const data = await response.json();
  
      if (response.ok) {
        // If login was successful
        console.log('Login successful:', data);
        return {success:true, data: data}
      } else {
        // If there was an error (e.g., invalid credentials)
        console.error('Error:', data.message);
        return {success:false, data: data.message}
      }
    } catch (error) {
      // Handle any other errors (e.g., network issues)
      console.error('Request failed:', error);
      return {success:false, data: error}
    }
  }
  
  async function callServer2(body) {
    try {
      const response = await fetch('http://s-kominek-24.dev.spsejecna.net/profil.php', {
        method: 'POST', // HTTP method (POST)
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*' 
        },
        body: body
      });
  
      // Parse JSON response
      const data = await response.json();
  
      if (response.ok) {
        // If login was successful
        console.log('Login successful:', data);
        return {success:true, data: data}
      } else {
        // If there was an error (e.g., invalid credentials)
        console.error('Error:', data.message);
        return {success:false, data: data.message}
      }
    } catch (error) {
      // Handle any other errors (e.g., network issues)
      console.error('Request failed:', error);
      return {success:false, data: error}
    }
  }

  async function uploadFile(formData) {
    try {
      const response = await fetch('http://s-kominek-24.dev.spsejecna.net/upload.php', {
        method: 'POST',
        body: formData,
        headers: {
          // Do not set 'Content-Type' header manually for form data in fetch.
          // It will be set automatically by the browser.
        },
      });
  
      // Parse JSON response
      const data = await response.json();
  
      if (response.ok) {
        // If login was successful
        console.log('Login successful:', data);
        return {success:true, data: data}
      } else {
        // If there was an error (e.g., invalid credentials)
        console.error('Error:', data.message);
        return {success:false, data: data.message}
      }
    } catch (error) {
      // Handle any other errors (e.g., network issues)
      console.error('Request failed:', error);
      return {success:false, data: error}
    }
  }

  async function getUserData(user) {
    try {
      const response = await fetch('http://s-kominek-24.dev.spsejecna.net/users/'+user+ '.json');
      
  
      // Parse JSON response
      const data = await response.json();
  
      if (response.ok) {
        // If login was successful
        console.log('Login successful:', data);
        return {success:true, data: data}
      } else {
        // If there was an error (e.g., invalid credentials)
        console.error('Error:', data.message);
        return {success:false, data: data.message}
      }
    } catch (error) {
      // Handle any other errors (e.g., network issues)
      console.error('Request failed:', error);
      return {success:false, data: error}
    }
  }
  // Example usage of the loginUser function:
  export {
    callServer,callServer2,uploadFile, getUserData
  };
  