<?php
//CONFIGURE YOUR DB HERE
$username = "[YOUR USERNAME]";
$password = "[YOUR PASSWORD]";
$hostname = "localhost";	
$database = "[YOUR DB NAME]";

$dbh=mysql_connect($hostname, $username, $password) or die ('I cannot connect to the database because: ' . mysql_error());
mysql_select_db ($database);

// OBQtypeQ:QFeatureQCOQgeometryQ:OBQtypeQ is my dumb version of {"type":"Feature","geometry":{"type"
// i.e., what the json string should start with
//REPLACE "hoods4" IN THE QUERY BELOW WITH YOUR TABLE NAME
if ( strpos( $_POST['hoods'], 'OBQtypeQ:QFeatureQCOQgeometryQ:OBQtypeQ' ) == 0 ){
	$data = mysql_query("INSERT INTO hoods4 (json) VALUES ('".$_POST['hoods']."')");
}
if (!$data) {
	echo "Error";
//NOBODY BANTERS INLINE LIKE ANDY WOODRUFF . . .
} else {
	echo "Sweet";
}
?>
