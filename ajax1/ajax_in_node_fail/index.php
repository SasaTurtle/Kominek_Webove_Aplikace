<?php
 
require "db.php";
require "service.php";
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
  <meta http-equiv="content-type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
  <title></title>
  <style>
  <!--
   /*#form {width:100rem}
   */
   #form label{width:5rem;display:inline-block}
   #form label.userLabel {width:10rem;}
  /* #form input{width:80rem;}
  
   #form label, #form input {height:2rem;margin: 1rem 0} 
*/
  //-->
  </style>
  </head>
  <script src="https://code.jquery.com/jquery-3.6.1.min.js" integrity="sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ=" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.form/4.3.0/jquery.form.min.js" integrity="sha384-qlmct0AOBiA2VPZkMY3+2WqkHtIQ9lSdAsAn5RUJD/3vA5MKDgSGcdmIv4ycVxyn" crossorigin="anonymous"></script>
  <script src="js.js"></script>
  
  <body>
<form action="procedure.php?cmd=saveDrinks" method="post">
<div id="form">

</div>
<input type="submit" value="odeslat">

</form>

<p id="output1"></p>
  </body>
</html>
