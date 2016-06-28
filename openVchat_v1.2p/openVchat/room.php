<?
	header('Content-type: text/xml');
	include("util/utility.php");

	if($_SESSION['user'] == null){
		echo "<openVchat>\n";
		echo "<err>Login first</err>\n";
		echo "</openVchat>\n";
	}
	$room = $_POST['room'];
	$con = createConnection();
	echo "<openVchat>";
	getMessages($con, $room);
	getUsers($con, $room);
	echo "</openVchat>";

	/**
	 * To get message from the other user
	 */
	function getMessages($con, $room){
		$to = $_SESSION["user"];
		$where ="usr_to = '$room'\n";
		$lastMsg = $_SESSION["lastCheck"];
		$rows = mysql_query("select usr_from, usr_to, msg, b, i, u, fo, s, tmc.dcrea from txn_msg_chat tmc, dtl_room_member drm
			where tmc.dcrea >= drm.dcheck and tmc.dcrea < '$lastMsg' and drm.usr_user_id = '$to' and tmc.usr_to='$room' order by tmc.dcrea asc, seq asc", $con);
		echo"<msgRoom>\n";
		while($row = mysql_fetch_array($rows)){
			echo "<m fr=\"$row[0]\" to=\"$row[1]\" b=\"$row[3]\" i=\"$row[4]\"
                u=\"$row[5]\" fo=\"$row[6]\" s=\"$row[7]\">";
			echo "<![CDATA[".base64_decode($row[2])."]]>\n";
			echo "</m>";
		}
		echo "</msgRoom>";
		mysql_query("update dtl_room_member set dcheck='$lastMsg' where usr_user_id='$to' and r_room_id='$room'", $con);
		mysql_query("delete from txn_msg_chat where dcrea < now()-150 and usr_to='$room'", $con);
	}

	function getUsers($con, $room){
		$where = "";
		$user = $_SESSION["user"];
		if($_POST["all"]!="true"){
			$where = " and a.dcrea>=b.dcheck-1";
		}
		$rows = mysql_query("select a.usr_user_id from dtl_room_member a , dtl_room_member b where a.r_room_id='$room'
			and a.r_room_id = b.r_room_id and b.usr_user_id='$user' $where", $con);
		echo "<usrRoom room=\"$room\">\n";
		while($row = mysql_fetch_array($rows)){
			echo "<u>$row[0]</u>\n";
		}
		echo "</usrRoom>\n";
	}
?>