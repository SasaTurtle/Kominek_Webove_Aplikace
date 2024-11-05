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
   #form {width:100rem}
   
   #form label{width:10rem;display:inline-block}
   #form input{width:80rem;}
 
   #form label, #form input {height:2rem;margin: 1rem 0} 
 
  //-->
  </style>
  </head>
  <script src="https://code.jquery.com/jquery-3.6.1.min.js" integrity="sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ=" crossorigin="anonymous"></script>
  <script src="js.js"></script>
  
  <body>
<?php

$ser = new Service($conn);
//echo $ser->getPeopleListJSON();

//echo $ser->getTypesListJSON();

function genCB($arr) {

$html="";

for ($i=1;$i<=count($arr);$i++)

{

$key=$arr[$i]["ID"];

$value=$arr[$i]["typ"];

$html.="<label for='$key'>$value</label>";
$html.="<input type='number' name='type[]' value='0'><br>";
	

}


return $html;
}


function genOptions($arr) {

$html="";

for ($i=1;$i<=count($arr);$i++)

{

$key=$arr[$i]["ID"];

$value=$arr[$i]["name"];

$html.="<label for='$key'>$value</label>";
$html.="<input type='radio' name='user' value='0'><br>";
	

}


return $html;
}
?>
<form action="requests.php?cmd=list" method="post">
<div id="form">

<?php

 echo genOptions($ser->getPeopleList());
?>

<?php echo genCB($ser->getTypesList());
?>
<button type="button">
 Uložit
</button>
</div>
<input type="submit" value="odeslat">

</form>


  </body>
</html>
