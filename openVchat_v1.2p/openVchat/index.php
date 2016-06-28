<?
	include 'util/utility.php';
	$usr = $_POST["usr"];
	$pass = $_POST["pass"];
	$pass1 = $_POST["pass1"];
	$action = $_POST["action"];
	$err = $_GET["err"];

	function okUser($usr){
		$allowedChar = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
		for($i=0; $i<strlen($usr); $i++){
			if(strlen(ereg_replace($usr[$i], "", $allowedChar)) != strlen($allowedChar)-1){
				return false;
			}
		}
		return true;
	}

	if($_SESSION["user"]){
		$con = createConnection();
		$userLog = $_SESSION["user"];
		$rows = mysql_query("select r_room_id from dtl_room_member where usr_user_id='$userLog'");
		$msg = ereg_replace("'", "\\'", base64_encode("$userLog leave the room"));
		while($row = mysql_fetch_array($rows)){
			mysql_query("delete from dtl_room_member where usr_user_id='$user' and r_room_id='$row[0]'", $con);
			mysql_query("insert into txn_msg_chat (usr_from, usr_to, msg, b, i,
				u, fo, s, dcrea) values('$row[0]', '$row[0]', '$msg', '$b',
				'$i', '$u', '$fo', '10', now())", $con);
		}
		mysql_query("update txn_user_status set status='offline', dmodi = now() where usr_user_id = '".$_SESSION["user"]."'", $con);
		$_SESSION["user"] = null;
		$_SESSION["lastCheck"] = null;
		$_SESSION["loginTime"] = null;
	}
	else if($usr && $action == "login"){
		$con = createConnection();
		$rows = mysql_query("select user_id from mst_user where user_id = '$usr' and password = MD5('$pass')", $con);
		if($row = mysql_fetch_array($rows)){
			$_SESSION["loginTime"] = date("Y-m-d H:i:s");
			$dlogin = ", dlogin = '".$_SESSION["loginTime"]."' ";
			mysql_query("update txn_user_status set status='Available', dmodi = now() $dlogin
				where usr_user_id = '$row[0]'", $con);
			session_cache_expire(10);
			$_SESSION["user"] = $row[0];
			//$_SESSION["lastCheck"] = date("Y-m-d H:i:s");
			header("Location:chatz.php");
		}
		else{
			$err = "Login failed";
		}
	}
	else if($usr && $action == "register"){
		if(strlen($usr) < 2){
			$err = "Minimum user is 2 character";
		}
		else if(!okUser($usr)){
			$err = "Allowed username (a-z, A-Z, 0-9, -, _)";
		}
		else if(strlen($pass) < 5){
			$err = "Minimum password is 5 character!";
		}
		else if($pass == $pass1){
			$con = createConnection();
			mysql_query("insert into mst_user (user_id, password) values ('$usr', MD5('$pass'))", $con);
			if(mysql_affected_rows() <= 0){
				$err = "Username is already exist!";
			}else{
				mysql_query("insert into mst_group (seq, usr_user_id, group_name) values ('1', '$usr', 'friend')", $con);
				mysql_query("insert into txn_user_status (usr_user_id, status, dmodi) values ('$usr', 'Available', now())", $con);
				session_cache_expire(10);
				$_SESSION["user"] = $usr;
	//			$_SESSION["lastCheck"] = date("Y-m-d H:i:s");
				header("Location:chatz.php");
			}
		}
		else{
			$err = "Password is not identical!";
		}
	}
	if(!$usr || $err){
		header("Content-Type: text/html; charset=utf-8");
?>

<html>
<head>
	<title>openVchat v1.2p Login Page</title>
	<link rel="stylesheet" href="util/styles/css.css" type="text/css">
	<link rel="icon" href="img/logo.gif" type="image/x-icon" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="author" content="Andreanes Yosef Vanderlee">
</head>
<script>
	function swapMode(mode){
		if(mode == "Register"){
			modeRegister = "";
			modeLogin = "none";
			document.getElementById("btnReg").disabled = true;
			document.getElementById("btnLog").disabled = false;
		}
		else if(mode == "Login"){
			modeRegister = "none";
			modeLogin = "";
			document.getElementById("btnReg").disabled = false;
			document.getElementById("btnLog").disabled = true;
		}
		document.getElementById("frmLogin").style.display = modeLogin;
		document.getElementById("frmRegister").style.display = modeRegister;
	}
</script>
<body bgColor="#CDCDCD">
	<table height="100%" width="100%">
		<tr>
			<td>
			</td>
		</tr>
		<tr>
			<td valign="center" align="center">
				<table style="border:1px solid; border-color:#000000" width="300">
					<tr>
						<td align="center" style="font-size:14px;color:#EFEFEF;font-weight:bold" height="50">
							openVchat v1.2p
							<hr/>
						</td>
					</tr>
					<tr>
						<td valign="top" height="170">
							<form method="post" name="frmLogin" id="frmLogin" <?if($action == "register") echo "style=\"display:none\""?>>
								<input type="hidden" name="action" value="login"/>
								<table bgColor="#EFEFEF" id="tblLogin" width="100%">
									<tr>
										<td>Username</td>
										<td>:</td>
										<td><input type=text name="usr" value="<?=$usr?>" size="10" maxlength="10"/></td>
									</tr>
									<tr>
										<td>Password</td>
										<td>:</td>
										<td><input type="password" name="pass" size="25" maxlength="25"/></td>
									</tr>
									<tr>
										<td colspan="2">&nbsp;</td>
										<td><input type="submit" value="Login"/></td>
									</tr>
								</table>
							</form>
							<form method="post" name="frmRegister" id="frmRegister" <?if($action != "register") echo "style=\"display:none\""?>>
								<input type="hidden" name="action" value="register"/>
								<table bgColor="#EFEFEF" id="tblRegister" width="100%">
									<tr>
										<td>Username</td>
										<td>:</td>
										<td><input type=text name="usr" value="<?=$usr?>" size="10" maxlength="10"/></td>
									</tr>
									<tr>
										<td>Password</td>
										<td>:</td>
										<td><input type="password" name="pass" size="25" maxlength="25"/></td>
									</tr>
									<tr>
										<td>Confirm</td>
										<td>:</td>
										<td><input type="password" name="pass1" size="25" maxlength="25"/></td>
									</tr>
									<tr>
										<td colspan="2">&nbsp;</td>
										<td><input type="submit" value="Register"/></td>
									</tr>
								</table>
							</form>
						</td>
					</tr>
					<tr>
						<td align="center">
							 <b style="color:red"><?=$err?></b>
						</td>
					</tr>
					<tr>
						<td valign="bottom" align="center">
							<input type="button" value="Register" id="btnReg" onclick="swapMode('Register')" <?if($action == "register") echo "disabled"?>/>
							<input type="button" value="Login" id="btnLog" onclick="swapMode('Login')" <?if($action != "register") echo "disabled"?>/>
						</td>
					</tr>
				</table>
			</td>
		</tr>
		<tr>
			<!-- Please do not Remove this part-->
			<td align="center" style="font-size:12px;color:#EFEFEF;font-weight:bold" height="60">
					openVchat v1.2p<br/>
					check update <a href="http://sourceforge.net/projects/open-v-chat" target="_blank">http://sourceforge.net/projects/open-v-chat</a><br/>
					Copyright 2006
			</td>
		</tr>
	</table>
</body>
</html>
<?}?>