<?php
header('Content-type: text/plain');
//CONFIGURE YOUR DB HERE
$username = "[YOUR USERNAME]";
$password = "[YOUR PASSWORD]";
$hostname = "localhost";	
$database = "[YOUR DB NAME]";

$dbh=mysql_connect ($hostname, $username, $password) or die ('I cannot connect to the database because: ' . mysql_error());
mysql_select_db ($database);

//REPLACE "hoods4" IN THE QUERY BELOW WITH YOUR TABLE NAME
$query = 'SELECT json FROM hoods4';
$data = mysql_query($query);
$i = 0;
if (!$data) {
	echo "Error";
} else {
	echo '{
';
	echo '  "type": "FeatureCollection",
';
	echo '  "features": [
';
	while ( $row = mysql_fetch_array($data) ){
		if ( $i > 0 ) echo ',
';
		$str = $row[0];
		$str = str_replace('OB','{',$str);
		$str = str_replace('CB','}',$str);
		$str = str_replace('OS','[',$str);
		$str = str_replace('CS',']',$str);
		$str = str_replace('Q','"',$str);
		$str = str_replace('CO',',',$str);
		echo "    ".trim($str,',');
		$i = $i+1;
	}
	echo '
  ]
';
	echo '}';
}
?>
