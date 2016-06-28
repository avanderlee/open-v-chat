<?
	header('Content-type: text/xml');
	include("util/utility.php");

	if($_SESSION['user'] == null){
		echo "<openVchat>\n";
		echo "<err>Login first</err>\n";
		echo "</openVchat>\n";
	}
	else if(isDuplicate()){
		echo "<openVchat>\n";
		echo "<err>Dupplicate Login</err>\n";
		echo "</openVchat>\n";
	}
	else{
		if($_POST["all"]){
			getChatProgress(true);
		}
		else{
			getChatProgress(false);
		}
		$con = createConnection();
		$row = mysql_fetch_array(mysql_query("select now()", $con));
		$_SESSION["lastCheck"] = $row[0];
	}

	/**
	 * To check if there's duplicate login for the current user
	 */
	function isDuplicate(){
		$con = createConnection();
		$row = mysql_fetch_array(mysql_query("select dlogin from txn_user_status
			where usr_user_id = '".$_SESSION["user"]."'", $con));
		if($row[0] != $_SESSION["loginTime"]){
			return true;
		}
		return false;
	}

	/**
	 *
	 */
	 function getNewFriendRequest($con){
		$rows = mysql_query("select usr_friend_id from detail_friend_list
			where usr_user_id = '".$_SESSION["user"]."' and group_seq = '-1'", $con);
		echo "<newFriend>\n";
		while($row = mysql_fetch_array($rows)){
			echo "<usr>$row[0]</usr>\n";
		}
		echo "</newFriend>\n";
	 }

	/**
	 * This method to handling all chat progress eg: message, user transaction status
	 */
	function getChatProgress($all){
		echo "<openVchat>\n";
		$con = createConnection();
		if($all){
			getGroups($con);
		}
		getNewFriendRequest($con);
		getUserlist($con, $all);
		getMessages($con, $all);
		echo "</openVchat>\n";
	}

	/**
	 * This method to get all groups
	 */
	function getGroups($con){
		$rows = mysql_query("select group_name from mst_group where usr_user_id
            = '".$_SESSION["user"]."' order by group_name asc", $con);
		echo "<groups>\n";
		while($row = mysql_fetch_array($rows)){
			echo "<g><![CDATA[$row[0]]]></g>\n";
		}
		echo "</groups>\n";
	}

	/**
	 * To get message from the other user
	 */
	function getMessages($con, $all){
		$to = $_SESSION["user"];
		$where ="usr_to = '$to'\n";
		$rows = mysql_query("select usr_from, usr_to, msg, b, i, u, fo, s from txn_msg_chat
			where $where order by dcrea asc, seq asc", $con);
		$valid = false;
		echo"<msg>\n";
		while($row = mysql_fetch_array($rows)){
			echo "<m fr=\"$row[0]\" to=\"$row[1]\" b=\"$row[3]\" i=\"$row[4]\"
                u=\"$row[5]\" fo=\"$row[6]\" s=\"$row[7]\">";
			echo "<![CDATA[".base64_decode($row[2])."]]>\n";
			echo "</m>";
			$valid = true;
		}
		echo"</msg>";
		if($valid){
			mysql_query("delete from txn_msg_chat where $where", $con);
		}
	}

	/**
	 * To get user list
	 */
	function getUserlist($con, $all){
		$sql = "select b.usr_user_id, b.status, c.group_name
            from detail_friend_list a, txn_user_status b, mst_group c
			where a.usr_user_id = '".$_SESSION["user"]."' and a.usr_friend_id =
            b.usr_user_id and a.usr_user_id = c.usr_user_id and a.group_seq = c.seq\n";
		if(!$all){
			$sql .= " and dmodi >= '".$_SESSION['lastCheck']."'\n";
		}
		$rows = mysql_query($sql);
		echo"<users>\n";
		while($row = mysql_fetch_array($rows)){
			echo "<usr>\n";
			echo " <id>$row[0]</id>\n";
			echo " <stat><![CDATA[$row[1]]]></stat>\n";
			echo " <group><![CDATA[$row[2]]]></group>\n";
			echo "</usr>\n";
		}
		echo"</users>\n";
	}
?>
