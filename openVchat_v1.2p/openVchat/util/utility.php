<?
	session_cache_expire(1);
	session_start();
	if($_SESSION['user']){
		$_SESSION['user']=$_SESSION['user'];
		$_SESSION["lastCheck"] = $_SESSION["lastCheck"];
	}

	//return username on database
	function getUserName(){
		return "username";
	}

	//return database hostname
	function getHostName(){
		return "hostname";
	}

	//return database password
	function getPassword(){
		return "password";
	}

	//return database name
	function getDb(){
		return "databasename";
	}

	//to create connection with database
	function createConnection(){
		$con = mysql_connect(getHostName(),getUserName(),getPassword());
		if(mysql_error())
			die("Fatal Error while connecting database");
		mysql_select_db(getDb(),$con) or die("Fatal Error while select database");
		return $con;
	}
?>
