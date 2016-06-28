<?
	header('Content-type: text/xml');
	include("util/utility.php");
	echo "<root>\n";
	if($_POST["action"] == "roomAccess"){
		processRoom();
	}
	else if($_POST["action"] == "sendMessage"){
		sendMessage();
	}
	else if($_POST["action"] == "setStatus"){
		setStatus();
	}
	else if($_POST["action"] == "addUser"){
        addUser();
    }
	else if($_POST["action"] == "addGroup"){
        addGroup();
    }
	else if($_POST["action"] == "deleteUser"){
        deleteUser();
    }
	else if($_POST["action"] == "deleteGroup"){
        deleteGroup();
    }
	else if($_POST["action"] == "changePassword"){
        changePassword();
    }
	echo "</root>\n";

	//To handle status in a chat room (join/leave)
	function processRoom(){
		$con = createConnection();
		$typ = $_POST["type"];
		$room = $_POST["room"];
		$user = $_SESSION["user"];
		if($typ == "in"){
			$usr_to = $room;
			$msg = ereg_replace("'", "\\'", base64_encode("$user join the room"));
			$b = $_POST["b"];
			$i = $_POST["i"];
			$u = $_POST["u"];
			$fo = $_POST["font"];
			$s = 10;
			$con = createConnection();
			mysql_query("insert into txn_msg_chat (usr_from, usr_to, msg, b, i,
                u, fo, s, dcrea) values('$room', '$usr_to', '$msg', '$b',
                '$i', '$u', '$fo', '$s', now())", $con);
			mysql_query("insert into dtl_room_member  (r_room_id, usr_user_id, dcrea, dcheck) values ('$room', '$user', now(), now())", $con);
		}
		else if($typ == "out"){
			$usr_to = $room;
			$msg = ereg_replace("'", "\\'", base64_encode("$user leave the room"));
			$b = $_POST["b"];
			$i = $_POST["i"];
			$u = $_POST["u"];
			$fo = $_POST["font"];
			$s = 10;
			$con = createConnection();
			mysql_query("insert into txn_msg_chat (usr_from, usr_to, msg, b, i,
                u, fo, s, dcrea) values('$room', '$usr_to', '$msg', '$b',
                '$i', '$u', '$fo', '$s', now())", $con);
			mysql_query("delete from dtl_room_member where r_room_id='$room' and usr_user_id='$user'", $con);
		}
	}

	//To handle change password
	function changePassword(){
		$oldPass = $_POST["oldPass"];
		$new1 = $_POST["new1"];
		$new2 = $_POST["new2"];
		if($oldPass == ""){
			echo "<errChg>Old pasword must be filled!</errChg>\n";
		}
		else if($new1 != $new2){
			echo "<errChg>New password didn't match!</errChg>\n";
		}
		else if(strlen($new1) < 5){
			echo "<errChg>Minimum password is 5 character!</errChg>\n";
		}
		else{
			$usr = $_SESSION["user"];
			$con = createConnection();
			mysql_query("update mst_user set password = md5('$new1') where user_id = '$usr' and password = md5('$oldPass')", $con);
			if(mysql_affected_rows() <= 0){
				echo "<errChg>Invalid old password!</errChg>\n";
			}
			else{
				echo "<okChg>ok</okChg>\n";
			}
		}
	}

    //This method is used to send message to another user
	function sendMessage(){
		$usr_from = $_POST["from"];
		if($usr_from == $_SESSION["user"]){
			$usr_to = $_POST["to"];
			$msg = ereg_replace("'", "\\'", base64_encode($_POST["msg"]));
			$b = $_POST["b"];
			$i = $_POST["i"];
			$u = $_POST["u"];
			$fo = $_POST["font"];
			$s = $_POST["s"];
			$con = createConnection();
			mysql_query("insert into txn_msg_chat (usr_from, usr_to, msg, b, i,
                u, fo, s, dcrea) values('$usr_from', '$usr_to', '$msg', '$b',
                '$i', '$u', '$fo', '$s', now())", $con);
		}
	}

    //To set user' status
	function setStatus(){
		$con = createConnection();
		$status = $_POST["status"];
		if($status == "Invisible"){
			$status = "offline";
		}
		$user = $_SESSION["user"];
		echo "<status>$status\n";
		mysql_query("update txn_user_status set status='$status', dmodi = now()
            where usr_user_id = '$user'", $con);
		echo "</status>\n";
	}

    //To add a new friend
	function addUser(){
        $con = createConnection();
        $user = $_SESSION["user"];
        $friend = $_POST["user"];
        $group = $_POST["group"];
        $row = mysql_fetch_array(mysql_query("select seq from mst_group where
        	usr_user_id = '$user' and group_name = '$group'", $con));
        if(!$row){
        	return;
        }
        echo "<users>\n";
        $groupSeq = $row[0];
        mysql_query("update detail_friend_list set group_seq = '$groupSeq' where
        	usr_user_id = '$user' and usr_friend_id = '$friend'", $con);
		if(mysql_affected_rows() <= 0){
			$rUsr = mysql_fetch_array(mysql_query("select user_id from mst_user where user_id='$friend'", $con));
			if($rUsr){
				$friend = $rUsr[0];
			}else{
				echo "</users>";
				return;
			}

			mysql_query("insert into detail_friend_list (usr_user_id, usr_friend_id,
				group_seq) values('$user','$friend','$groupSeq')", $con);
			if(mysql_affected_rows() != 0){
				mysql_query("insert into detail_friend_list (usr_friend_id, usr_user_id,
					group_seq) values('$user','$friend','-1')", $con);
			}
		}
        $row = mysql_fetch_array(mysql_query("select status from txn_user_status where
        	usr_user_id = '$friend'", $con));
        echo "<usr>\n";
        echo "<id>$friend</id>\n";
        echo "<group><![CDATA[$group]]></group>\n";
        echo "<stat><![CDATA[$row[0]]]></stat>\n";
        echo "</usr>\n";
        echo "</users>\n";
    }

    //To add a new group
    function addGroup(){
        $con = createConnection();
        $group = $_POST["group"];
        $user = $_SESSION["user"];
		$rows = mysql_query("select seq from mst_group where usr_user_id = '$user'
            	and group_name = '$group'", $con);
        if(mysql_num_rows($rows)!=0){
        	return;
        }
        $rows = mysql_query("select seq from mst_group where usr_user_id = '$user'
            order by seq desc", $con);
        $row = mysql_fetch_array($rows);
        $newSeq = $row[0] + 1;
        mysql_query("insert into mst_group (seq, usr_user_id, group_name)
            values ('$newSeq', '$user', '$group')", $con);
        echo "<groups><g>$group</g></groups>\n";
    }

    //To delete friend
    function deleteUser(){
        $con = createConnection();
        $user = $_SESSION["user"];
        $friend = $_POST["user"];
        mysql_query("delete from detail_friend_list where usr_friend_id = '$friend'
            and usr_user_id = '$user'", $con);
        echo "<deleteUser>$friend</deleteUser>\n";
    }

    //To delete group
    function deleteGroup(){
        $con = createConnection();
        $group = $_POST["group"];
        $user = $_SESSION["user"];
        $row = mysql_fetch_array(mysql_query("select seq from mst_group where
        	usr_user_id = '$user' and group_name = '$group'", $con));
        if(!$row){
        	return;
        }
        $groupSeq = $row[0];
        mysql_query("update detail_friend_list set group_seq = '1'
            where group_seq = '$groupSeq'");
        mysql_query("delete from mst_group where usr_user_id = '$user'
            and seq = '$groupSeq'", $con);
        echo "<deleteGroup>$group</deleteGroup>\n";
    }
?>
