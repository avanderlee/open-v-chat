<?
	include 'util/utility.php';
	header('Content-type: text/xml');
	echo "<l>";
	$con = createConnection();
	$user = $_SESSION["user"];
	mysql_query("update txn_user_status set status='offline', dmodi = now() where usr_user_id = '".$_SESSION["user"]."'", $con);
	$rows = mysql_query("select r_room_id from dtl_room_member where usr_user_id='$user'");
			$msg = ereg_replace("'", "\\'", base64_encode("$user leave the room"));
	while($row = mysql_fetch_array($rows)){
		echo $row[0];
		mysql_query("delete from dtl_room_member where usr_user_id='$user' and r_room_id='$row[0]'", $con);
		mysql_query("insert into txn_msg_chat (usr_from, usr_to, msg, b, i,
			u, fo, s, dcrea) values('$row[0]', '$row[0]', '$msg', '$b',
			'$i', '$u', '$fo', '10', now())", $con);
	}
	session_unset();
	echo "</l>";
?>