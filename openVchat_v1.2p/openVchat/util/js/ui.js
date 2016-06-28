	var dragObject = null;
	var ta = null;
	var x, y, temp1, temp2;
	var resize = -1;
	var currHeight, currWidth;
	var t_event = null;
	var t_event_key = 'a';
	var obj_up = document.forms[0].getElementsByTagName("table")[0];
	var obj_select = null;
	var counterWindowOpen = 0;
	var obj_lov = null;
	var conf = false;
	var newMessage = null;
	var defaultTitle = document.title;
	var checkServer = true;
	var soundEnable = true;
	var hiddenObj = null;
	var newGroup = null;
	var oldGroup = null;
	var d = null;
	var stackXml = new Array();
	var stackXmlRoom = new Array();
	var stackRoom = new Array();
	var logout = false;
	var activeForm = null;
	

	/**
	 * to handle change custom status
	 */
	function handleCustomStatus(evt){
		key = evt.keyCode?evt.keyCode:evt.which;
		if(key == 13){
			document.forms[0].status.style.display = 'none';
			document.getElementById("status").style.display = '';
			document.getElementById("status").innerHTML = document.forms[0].status.value;
			value = replaceAll(document.forms[0].status.value, "<", "&lt;");
			var xmlhttp =  new XMLHttpRequest();
			xmlhttp.open('POST', 'send.php', true);
			xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xmlhttp.send("action=setStatus&status="+escape(value));
			return false;
		}else if(key == 27){
			document.forms[0].status.style.display = 'none';
			document.getElementById("status").style.display = '';
			return false;
		}
		return true;
	}

	/**
	 * To process handle event ready state change for room action
	 */
	function stackRoomData(){
		if(stackXmlRoom.length){
			var tempArray = new Array();
			var tempArrayRoom = new Array();
			var ctrTemp = 0;
			for(var ctrStack=0; ctrStack<stackXmlRoom.length; ctrStack++){
				if (stackXmlRoom[ctrStack].readyState == 4) {
					if (stackXmlRoom[ctrStack].status == 0 || stackXmlRoom[ctrStack].status == 200){
						if(document.getElementById(stackRoom[ctrStack])){
							processRoomData(stackXmlRoom[ctrStack].responseXML);
						}
						try{
							CollectGarbage();
						}catch(e){}
					}
				}
				else{
					tempArray[ctrTemp] = stackXmlRoom[ctrStack];
					tempArrayRoom[ctrTemp] = stackRoom[ctrStack]; 
					ctrTemp ++;
				}
			}
			stackXmlRoom = tempArray;
			stackRoom = tempArrayRoom;
			tempArray = null;
			tempArrayRoom = null;
		}
	}

	/**
	 * To process handle event ready state change for global action
	 */
	function stackIncomingData(){
		if(stackXml.length){
			var tempArray = new Array();
			var ctrTemp = 0;
			for(var ctrStack=0; ctrStack<stackXml.length; ctrStack++){
				if (stackXml[ctrStack].readyState == 4) {
					if (stackXml[ctrStack].status == 0 || stackXml[ctrStack].status == 200){
						  processIncomingData(stackXml[ctrStack].responseXML);
						  try{
							CollectGarbage();
						  }catch(e){}
					}
				}
				else{
					tempArray[ctrTemp++] = stackXml[ctrStack];
				}
			}
			stackXml = tempArray;
			tempArray = null;
		}
	}

	/**
	 * To handle double click event on a user list
	 */
	function dblClick(){
		var user = this.innerHTML
		var pos = user.indexOf(" - ");
		if(pos != -1){
			user = user.substring(0, pos);
		}
		openWindowChat(user, true);
	}

	/**
	 * to handle mouse out event on a group
	 */
	function unsetNewGroup(){
		newGroup = null;
		unset(this);
	}

	/**
	 * to handle mouse over event on a group
	 */
	function setNewGroup(){
		if(hiddenObj){
			newGroup = this.getElementsByTagName("b")[0].innerHTML;					
		}
		set(this);
	}

	/**
	 * This function is used to refresh data for conference room
	 */
	function threadRoom(roomName, all){
		if (!Sarissa || !document.getElementById || !checkServer)
			return;

		var tempRoom = document.getElementById(roomName);
		if(!tempRoom){
			return;
		}
		var xmlhttp =  new XMLHttpRequest();
		xmlhttp.open('POST', 'room.php', true);
		stackXmlRoom[stackXmlRoom.length] = xmlhttp;
		stackRoom[stackRoom.length] = roomName;
		xmlhttp.onreadystatechange = stackRoomData;
		xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		if(all){
			xmlhttp.send("room="+escape(roomName)+"&all=true");
		}else{
			xmlhttp.send("room="+escape(roomName));
		}
		if(!tempRoom.thread){
			tempRoom.thread =function(){threadRoom(roomName)};
		}
		setTimeout(tempRoom.thread, 1500);
	}

	/**
	 * 
	 */
	function processRoomAccess(roomName, type){
		var xmlhttp =  new XMLHttpRequest();
		xmlhttp.open('POST', 'send.php', true);
		xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xmlhttp.send("action=roomAccess&room="+escape(roomName)+"&type="+escape(type));
	}
	/**
	 * To process incoming data for conference
	 */
	function processRoomData(responseXML){
		if(responseXML.getElementsByTagName("msgRoom").length > 0){
			msgsR  = responseXML.getElementsByTagName("msgRoom")[0].getElementsByTagName("m");
			for(ctrMsgR=0; ctrMsgR<msgsR.length; ctrMsgR++){
				b = msgsR[ctrMsgR].getAttribute("b");
				i = msgsR[ctrMsgR].getAttribute("i");
				u = msgsR[ctrMsgR].getAttribute("u");
				f = msgsR[ctrMsgR].getAttribute("fo");
				s = msgsR[ctrMsgR].getAttribute("s");
				to = msgsR[ctrMsgR].getAttribute("to");
				from = msgsR[ctrMsgR].getAttribute("fr");
				msg = msgsR[ctrMsgR].firstChild.data;
				msg = replaceAll(msg, "\\\'", "\'");
				msg = replaceAll(msg, "\\\"", "\"");
				msg = replaceAll(msg, "\\\\", "\\");
				if(from != f_friendlist.currentUserId.value){
					if(to==from && to.charAt(0) == '~'){
						if(msg.indexOf(" leave the room")!=-1){
							var tempTr = document.getElementById("!"+msg.substring(0, msg.indexOf(" leave the room")));
							if(tempTr){
								tempTr.parentNode.removeChild(tempTr);
							}
						}
						b = "bold";
						i = "italic";
					}
					showMessageText(b, i, u, f, s, to, from, msg);
				}
			}
		}
		if(responseXML.getElementsByTagName("usrRoom").length > 0){
			var roomName = responseXML.getElementsByTagName("usrRoom")[0].getAttribute("room");
			usersR = responseXML.getElementsByTagName("usrRoom")[0].getElementsByTagName("u");
			var tbodyRoot = document.getElementById(roomName).getElementsByTagName("div")[2].
				getElementsByTagName("tbody")[0];
			for(ctrUsrR = 0; ctrUsrR<usersR.length; ctrUsrR++){
				if(!document.getElementById("!" + usersR[ctrUsrR].firstChild.data)){
					var trTemp = document.createElement("tr");
					var tdTemp = document.createElement("td");

					tdTemp.onmouseover = set;
					tdTemp.onmouseout = unset;
					tdTemp.ondblclick = dblClick;
					trTemp.onmousedown = function(){
						mouseDown(this, null, null, true, true);
					};

					tdTemp.innerHTML = usersR[ctrUsrR].firstChild.data;
					trTemp.appendChild(tdTemp);
					trTemp.id = "!" + usersR[ctrUsrR].firstChild.data;
					var ok = false;
					for(cRoot=0; cRoot < tbodyRoot.childNodes.length; cRoot++){
						if(trTemp.id.toLowerCase()<tbodyRoot.childNodes[cRoot].id.toLowerCase()){
							tbodyRoot.insertBefore(trTemp, tbodyRoot.childNodes[cRoot]);
							ok = true;
							break;
						}
					}
					if(!ok){
						tbodyRoot.appendChild(trTemp);
					}
				}
			}
		}
	}
	
	/**
	 * To join to chat room
	 */
	function joinRoom(roomName){
		roomName = "~" + roomName;
		openWindowChat(roomName, true);
		var tempRoom = document.getElementById(roomName);
		if(tempRoom.getElementsByTagName("div").length == 3){
			return;
		}
		processRoomAccess(roomName, "in");
		var tempTdList = document.createElement("td");
		var divList = document.createElement("div");
		divList.style.overflow = "auto";
		divList.style.backgroundColor = "white";
		divList.style.width = 75;
		divList.style.height = 120;
		divList.style.border = "1px solid";
		divList.style.fontSize = "12px";
		divList.innerHTML = "<table style='font-size:12px' cellpadding='0' cellspacing='0' width='100%'><tbody></tbody></table>";
		tempTdList.appendChild(divList);
		var tempTextList = tempRoom.getElementsByTagName("div")[1];
		var dummyTd = document.createElement("td");
		tempRoom.getElementsByTagName("textarea")[0].style.width = parseInt(tempTextList.style.width) + 25;
		dummyTd.innerHTML = "&nbsp;";
		var tempRoot = tempTextList.parentNode;
		tempRoot.removeChild(tempRoom.getElementsByTagName("div")[1]);
		var tdTempTextList = document.createElement("td");
		tdTempTextList.appendChild(tempTextList);
		tempRoot.innerHTML = "<table cellpadding=0 cellspacing=0><tr></tr></table>";
		tempRoot.getElementsByTagName("tr")[0].appendChild(tdTempTextList);
		tempRoot.getElementsByTagName("tr")[0].appendChild(dummyTd);
		tempRoot.getElementsByTagName("tr")[0].appendChild(tempTdList);
		threadRoom(roomName, true);
	}
	
	/**
	 * This is to enable/disable sound function
	 */
	function changeSound(obj){
		if(soundEnable){
			obj.title = "unmute";
			obj.src = "img/mute.gif";
		}else{
			obj.title = "mute";
			obj.src = "img/unmute.gif";
		}
		soundEnable = !soundEnable;
	}
	
	/**
	 * This is an event that will logged out user whenever they close or reload the page
	 */
	function logoff(){
		checkServer = false;
		if(logout)
			return;
		var xmlhttp =  new XMLHttpRequest();
		xmlhttp.open('POST', 'logoff.php', true);
		xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xmlhttp.send("ok");
		for(i=0; i<1000000; i++);
	}

	/**
	 * to check if there's a new message exist
	 * It'll display a notification in a title window if there's a new message
	 */
	function checkNewMessage(){
		if(newMessage != null){
			document.title = newMessage;
			newMessage = newMessage.substring(1, newMessage.length) + newMessage.charAt(0);
		}
	}

	/**
	 * To show List Of Value user / group
	 */
	function showLov(obj, ctr){
		obj_lov = obj.parentNode.childNodes[0];
		var le = parseInt(obj_up.style.left);
		var to = parseInt(obj_up.style.top);
		if(ctr == 0 || ctr == 2){
			document.getElementById("s_pnl_grouplist").style.display = '';
			document.getElementById("s_pnl_grouplist").style.left = le + 89;
			if(ctr == 0){
				document.getElementById("s_pnl_grouplist").style.top = to + 62;
			}else{
				document.getElementById("s_pnl_grouplist").style.top = to + 87;
			}
		}else if(ctr == 1){
			document.getElementById("s_pnl_friendlist").style.display = '';
			document.getElementById("s_pnl_friendlist").style.left = le + 89;
			document.getElementById("s_pnl_friendlist").style.top = to + 62;
		}
	}

	function setLov(obj){
		if(!obj){
			obj = this;
		}
		if(!obj.innerHTML){
			obj = this;
		}
		if(obj_lov){
			obj_lov.value = obj.childNodes[0].innerHTML;
		}
	}

	/**
	 * To handle if user want to logout
	 */
	function doLogout(obj){
		if(confirm("Do you want to end this session?")){
			logout = true;
			window.location = "index.php";
		}
		return false;
	}

	/**
	 * simulate user
	 */
	function simulateUser(){
		if (!Sarissa || !document.getElementById)
			return;

		createWindow();
		parseStatus("Available", true);
		var xmlhttp =  new XMLHttpRequest();
		stackXml[stackXml.length] = xmlhttp;
		xmlhttp.open('POST', 'receive.php', true);
		xmlhttp.onreadystatechange = stackIncomingData;

		xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xmlhttp.send("all=true");
		setInterval("refreshFromServer()", 1500);
	}

	/**
	 *To create used window like: add user, add group, delete user, delete group
	 */
	function createWindow(){
		var blankForm = document.getElementById("f_blankform");

		//Create Window Add User or Group
		var objFormAddUserGroup = document.createElement("form");
		objFormAddUserGroup.style.display = 'none';
		objFormAddUserGroup.name = "f_add_user_group";
		objFormAddUserGroup.innerHTML = blankForm.innerHTML;
		objFormAddUserGroup.getElementsByTagName("div")[0].innerHTML = "<b>Add/Edit Buddy or Group</b>";
		tblContent = objFormAddUserGroup.getElementsByTagName("div")[1].getElementsByTagName("table")[0].
			getElementsByTagName("tbody")[0];
		tr = document.createElement("tr");
		td1 = document.createElement("td");
		td1.width = 80;
		td1.innerHTML = "<b>User Id</b>";
		td2 = document.createElement("td");
		td2.innerHTML = "<input type='text' name='user' size=10 maxlength=10/><input type='button' value='.' style='width:10px' onclick='showLov(this, 1)'/>";
		tr.appendChild(td1);
		tr.appendChild(td2);
		tblContent.appendChild(tr);

		tr = document.createElement("tr");
		td1 = document.createElement("td");
		td1.innerHTML = "<b>Group Name</b>";
		td2 = document.createElement("td");
		td2.innerHTML = "<input type='text' name='group' size=13 maxlength=15/>";
		tr.appendChild(td1);
		tr.appendChild(td2);
		tblContent.appendChild(tr);

		tr = document.createElement("tr");
		td1 = document.createElement("td");
		td1.innerHTML = "<b>Group List</b>";
		td2 = document.createElement("td");
		td2.innerHTML = "<input type='text' name='groupList' size=13 maxlength=15 value='friend' readonly/><input type='button' value='.' style='width:10px' onclick='showLov(this, 2)'/>";
		tr.appendChild(td1);
		tr.appendChild(td2);
		tblContent.appendChild(tr);

		tr = document.createElement("tr");
		td1 = document.createElement("td");
		td1.innerHTML = "<b>Type</b>";
		td2 = document.createElement("td");
		td2.innerHTML = "<input type='radio' name='type' checked onclick=\"mode('user', 3)\"/>User <input type='radio' name='type' onclick=\"mode('group', 3)\"/>Group";
		tr.appendChild(td1);
		tr.appendChild(td2);
		tblContent.appendChild(tr);

		tr = document.createElement("tr");
		td1 = document.createElement("td");
		td1.innerHTML = "&nbsp;";
		td2 = document.createElement("td");
		td2.innerHTML = "<input type='button' value='Save' onclick='doProcessUserGroup(3)'/>";
		tr.appendChild(td1);
		tr.appendChild(td2);
		tblContent.appendChild(tr);

		document.getElementsByTagName('body')[0].appendChild(objFormAddUserGroup);
			mode('user', 3);

		//Create Window Delete User or Group
		var objFormDeleteUserGroup = document.createElement("form");
		objFormDeleteUserGroup.style.display = 'none';
		objFormDeleteUserGroup.name = "f_delete_user_group";
		objFormDeleteUserGroup.innerHTML = blankForm.innerHTML;
		objFormDeleteUserGroup.getElementsByTagName("table")[0].style.top = 220;
		objFormDeleteUserGroup.getElementsByTagName("div")[0].innerHTML = "<b>Delete Buddy or Group</b>";
		tblContent = objFormDeleteUserGroup.getElementsByTagName("div")[1].getElementsByTagName("table")[0].
			getElementsByTagName("tbody")[0];
		tr = document.createElement("tr");
		td1 = document.createElement("td");
		td1.innerHTML = "<b>User Id</b>";
		td2 = document.createElement("td");
		td2.innerHTML = "<input type='text' name='user' readonly size=10 maxlength=10/><input type='button' value='.' style='width:10px' onclick='showLov(this, 1)'/>";
		tr.appendChild(td1);
		tr.appendChild(td2);
		tblContent.appendChild(tr);

		tr = document.createElement("tr");
		td1 = document.createElement("td");
		td1.innerHTML = "<b>Group List</b>";
		td2 = document.createElement("td");
		td2.innerHTML = "<input type='text' name='group' readonly size=13 maxlength=15/><input type='button' value='.' style='width:10px' onclick='showLov(this, 0)'/>";
		tr.appendChild(td1);
		tr.appendChild(td2);
		tblContent.appendChild(tr);

		tr = document.createElement("tr");
		td1 = document.createElement("td");
		td1.innerHTML = "<b>Type</b>";
		td2 = document.createElement("td");
		td2.innerHTML = "<input type='radio' name='type' checked onclick=\"mode('user', 4)\"/>User <input type='radio' name='type' onclick=\"mode('group', 4)\"/>Group";
		tr.appendChild(td1);
		tr.appendChild(td2);
		tblContent.appendChild(tr);

		tr = document.createElement("tr");
		td1 = document.createElement("td");
		td1.innerHTML = "&nbsp;";
		td1.width = 80;
		td2 = document.createElement("td");
		td2.innerHTML = "<input type='button' value='Delete' onclick='doProcessUserGroup(4)'/>";
		tr.appendChild(td1);
		tr.appendChild(td2);
		tblContent.appendChild(tr);

		document.getElementsByTagName('body')[0].appendChild(objFormDeleteUserGroup);
		mode('user', 4);

		//Create Window ChangePassword
		var objFormChangePassword = document.createElement("form");
		objFormChangePassword.style.display = 'none';
		objFormChangePassword.name = "f_change_password";
		objFormChangePassword.id = "f_change_password";
		objFormChangePassword.innerHTML = blankForm.innerHTML;
		objFormChangePassword.getElementsByTagName("table")[0].style.top = 10;
		objFormChangePassword.getElementsByTagName("table")[0].style.left = 500;
		objFormChangePassword.getElementsByTagName("div")[0].innerHTML = "<b>Change Password</b>";
		tblContent = objFormChangePassword.getElementsByTagName("div")[1].getElementsByTagName("table")[0].
			getElementsByTagName("tbody")[0];
		tr = document.createElement("tr");
		td1 = document.createElement("td");
		td1.width = 80;
		td1.innerHTML = "<b>Old Password</b>";
		td2 = document.createElement("td");
		td2.innerHTML = "<input type='password' name='oldPass' size=15 />";
		tr.appendChild(td1);
		tr.appendChild(td2);
		tblContent.appendChild(tr);

		tr = document.createElement("tr");
		td1 = document.createElement("td");
		td1.innerHTML = "<b>New Password</b>";
		td2 = document.createElement("td");
		td2.innerHTML = "<input type='password' name='new1' size=15 />";
		tr.appendChild(td1);
		tr.appendChild(td2);
		tblContent.appendChild(tr);

		tr = document.createElement("tr");
		td1 = document.createElement("td");
		td1.innerHTML = "<b>Retype</b>";
		td2 = document.createElement("td");
		td2.innerHTML = "<input type='password' name='new2' size=15 />";
		tr.appendChild(td1);
		tr.appendChild(td2);
		tblContent.appendChild(tr);

		tr = document.createElement("tr");
		td1 = document.createElement("td");
		td1.innerHTML = "&nbsp;";
		td2 = document.createElement("td");
		td2.innerHTML = "<input type='button' onclick='chgPass()' value='Submit'/>";
		tr.appendChild(td1);
		tr.appendChild(td2);
		tblContent.appendChild(tr);

		document.getElementsByTagName('body')[0].appendChild(objFormChangePassword);
	}

	
	/**
	 * This method is used to handle change password
	 */
	function chgPass(){
		var xmlhttp =  new XMLHttpRequest();
		xmlhttp.open('POST', 'send.php', true);
		xmlhttp.onreadystatechange = function() {
		  if (xmlhttp.readyState == 4) {
			if (xmlhttp.status == 0 || xmlhttp.status == 200){
				if(xmlhttp.responseXML.getElementsByTagName("okChg").length != 0){
					hideWindow(document.getElementById("f_change_password").getElementsByTagName("img")[0]);
					alert("Change password success");
				}
				else{
					alert(xmlhttp.responseXML.getElementsByTagName("errChg")[0].firstChild.data);
				}
				  try{
				  	CollectGarbage();
				  }catch(e){}
			}
		  }
		}

		xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		var frmPass = document.getElementById("f_change_password");
		xmlhttp.send("action=changePassword&oldPass=" + escape(frmPass.oldPass.value) +
			"&new1=" + escape(frmPass.new1.value) + "&new2=" + escape(frmPass.new2.value));
		frmPass.oldPass.value = "";
		frmPass.new1.value = "";
		frmPass.new2.value = "";
	}
	
	/**
	 * Handle processing user and group (add, delete)
	 */
	function doProcessUserGroup(ctrForm){
		if (!Sarissa || !document.getElementById)
			return;
		frmTarget = document.forms[ctrForm];
		var param = "action=" + frmTarget.action.value;
		if(frmTarget.action.value == "addUser"){
			param += "&user=" + escape(frmTarget.user.value) + "&group=" + escape(frmTarget.groupList.value);
		}
		else if(frmTarget.action.value == "addGroup"){
			param += "&group=" + escape(frmTarget.group.value);
		}
		else if(frmTarget.action.value == "deleteUser"){
			param += "&user=" + escape(frmTarget.user.value);
		}
		else if(frmTarget.action.value == "deleteGroup"){
			if(frmTarget.group.value == "friend"){
				alert("Sorry, you can't delete friend's group");
				return;
			}
			param += "&group=" + escape(frmTarget.group.value);
		}
		if(frmTarget.user){
			frmTarget.user.value = "";
		}
		if(frmTarget.group){
			frmTarget.group.value = "";
		}
		if(frmTarget.groupList){
			frmTarget.groupList.value = "friend";
		}
		var xmlhttp =  new XMLHttpRequest();
		stackXml[stackXml.length] = xmlhttp;
		xmlhttp.onreadystatechange = stackIncomingData;
		xmlhttp.open('POST', 'send.php', true);
		xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xmlhttp.send(param);
		//alert(frmTarget.getElementsByTagName("img").length);
		hideWindow(frmTarget.getElementsByTagName("img")[0]);
	}

	/**
	 * To change mode in add or delete
	 */
	function mode(md, ctrForm){
		tblContent = document.forms[ctrForm].getElementsByTagName("div")[1].getElementsByTagName("table")[0].
			getElementsByTagName("tbody")[0];
		trs = tblContent.getElementsByTagName("tr");
		if(ctrForm == 3){
			if(md == "group"){
				trs[0].style.display = 'none';
				trs[1].style.display = '';
				trs[2].style.display = 'none';
				document.forms[ctrForm].action.value = "addGroup";
			}
			else{
				trs[0].style.display = '';
				trs[1].style.display = 'none';
				trs[2].style.display = '';
				document.forms[ctrForm].action.value = "addUser";
			}
		}
		else if(ctrForm == 4){
			if(md == "group"){
				trs[0].style.display = 'none';
				trs[1].style.display = '';
				document.forms[ctrForm].action.value = "deleteGroup";
			}
			else{
				trs[0].style.display = '';
				trs[1].style.display = 'none';
				document.forms[ctrForm].action.value = "deleteUser";
			}
		}
	}

	/**
	 * To refresh message n list friend from server
	 */
	function refreshFromServer(){
		if (!Sarissa || !document.getElementById || !checkServer)
			return;

		var xmlhttp =  new XMLHttpRequest();
		stackXml[stackXml.length] = xmlhttp;
		xmlhttp.open('POST', 'receive.php', true);
		xmlhttp.onreadystatechange = stackIncomingData;

		xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xmlhttp.send("checked=ok");
	}

	/**
	 * This is a method to call confirm method, it has to be overiden because it raise a problem in firefox
	 */
	 function myConfirm(msg){
		conf = true;
		return confirm(msg);
	 }

	/**
	 * To process incoming data in xml format
	 */
	function processIncomingData(responseXML){
		if(document.getElementById("pnl_big_loading").style.display == 'none'){
			document.getElementById("pnl_big_loading").style.display = '';
			document.getElementById("pnl_loader").style.display = 'none';
			joinRoom("openVchat");
		}
		if(responseXML.getElementsByTagName("err").length != 0){
			window.location = "index.php?err="+responseXML.getElementsByTagName("err")[0].firstChild.data;
		}
		if(responseXML.getElementsByTagName("deleteUser").length != 0){
			deleteUser(responseXML.getElementsByTagName("deleteUser")[0].firstChild.data);
			return;
		}
		else if(responseXML.getElementsByTagName("deleteGroup").length != 0){
			deleteGroup(responseXML.getElementsByTagName("deleteGroup")[0].firstChild.data);
			return;
		}
		if(responseXML.getElementsByTagName("newFriend").length > 0){
			newUsers = responseXML.getElementsByTagName("newFriend")[0].getElementsByTagName("usr");
			var warn = "";
			window.status = "";
			for(ctrNewUsers=0; ctrNewUsers<newUsers.length; ctrNewUsers++){
				var newUser = newUsers[ctrNewUsers].firstChild.data;
				if(ctrNewUsers != 0){
					warn += ", ";
				}
				warn += newUser;
				if(!conf && document.forms[3].style.display == "none"){
					if(myConfirm(newUser + " has added you to his/her friendlist\nDo you want to add " + newUser + " to your friendlist?")){
						document.forms[3].user.value = newUser;
						document.forms[3].groupList.value = "friend";
						document.forms[3].style.display = "";
						processIndex(document.forms[3].getElementsByTagName('table')[0]);						
						conf = false;
					}else{
						mode("user", 4);
						document.forms[4].user.value = newUser;
						doProcessUserGroup(4);
						conf = false;
					}
				}
			}
			if(newUsers.length != 0){
				window.status = warn + " want to add you as their buddy, please close add/edit user window...";
			}
		}
		if(responseXML.getElementsByTagName("groups").length > 0){
			groups = responseXML.getElementsByTagName("groups")[0].getElementsByTagName("g");
			for(ctrGroups=0; ctrGroups<groups.length; ctrGroups++){
				addGroup(groups[ctrGroups].firstChild.data);
			}
		}
		if(responseXML.getElementsByTagName("users").length > 0){
			users = responseXML.getElementsByTagName("users")[0].getElementsByTagName("usr");
			for(ctrUsers=0; ctrUsers<users.length; ctrUsers++){
				if(users[ctrUsers].getElementsByTagName("stat")[0].firstChild.data == "offline"){
					addUser(users[ctrUsers].getElementsByTagName("id")[0].firstChild.data, "Offline",
						users[ctrUsers].getElementsByTagName("stat")[0].firstChild.data);
				}
				else{
					addUser(users[ctrUsers].getElementsByTagName("id")[0].firstChild.data,
						users[ctrUsers].getElementsByTagName("group")[0].firstChild.data,
						users[ctrUsers].getElementsByTagName("stat")[0].firstChild.data);
				}
			}
		}
		if(responseXML.getElementsByTagName("msg").length > 0){
			msgs  = responseXML.getElementsByTagName("msg")[0].getElementsByTagName("m");
			for(ctrMsg=0; ctrMsg<msgs.length; ctrMsg++){
				b = msgs[ctrMsg].getAttribute("b");
				i = msgs[ctrMsg].getAttribute("i");
				u = msgs[ctrMsg].getAttribute("u");
				f = msgs[ctrMsg].getAttribute("fo");
				s = msgs[ctrMsg].getAttribute("s");
				to = msgs[ctrMsg].getAttribute("to");
				from = msgs[ctrMsg].getAttribute("fr");
				msg = msgs[ctrMsg].firstChild.data;
				msg = replaceAll(msg, "\\\'", "\'");
				msg = replaceAll(msg, "\\\"", "\"");
				msg = replaceAll(msg, "\\\\", "\\");
				showMessageText(b, i, u, f, s, to, from, msg);
			}
		}
	}

	/**
	 * This function is used to remove a group from a friendlist and move it's user to group friend'
	 */
	function deleteGroup(groupName){
		if(groupName == "friend"){
			alert("Sorry, you can't delete friend's group");
			return;
		}
		grp = document.getElementById("id_" + groupName);
		grpList = document.getElementById("gl_" + groupName);
		if(grp){
			var par = grp.getElementsByTagName("tr");
			var tempUser = new Array();
			var i=0;
			for(i=0; i<par.length; i++){
				tempUser[i] = par[i].childNodes[1].innerHTML;
			}
			grp.parentNode.removeChild(grp);
		grp = document.getElementById("g_id_" + groupName);
			grp.parentNode.removeChild(grp);
			grpList.parentNode.removeChild(grpList);
			for(i=i-1; i>=0; i--){
				var user = tempUser[i];
				var pos = user.indexOf(" - ");
				var status = "Available";
				if(pos != -1){
					user = user.substring(0, pos);
					status = tempUser[i].substring(pos + 6, tempUser[i].length - 4);
				}
				addUser(user, "friend", status);
			}
		}
	}

	/**
	 * This function is used to remove user
	 */
	function deleteUser(userName){
		trUser = document.getElementById("usr_" + userName);
		trUsrList = document.getElementById("ul_" + userName);
		if(trUser != null){
		grpNode = trUser.parentNode.parentNode.parentNode.parentNode;
			if(grpNode.getElementsByTagName("tr").length == 1){
				if(grpNode.style.display != 'none'){
					grpNode.style.display = 'none';
				}
			}
			trUser.parentNode.removeChild(trUser);
			trUsrList.parentNode.removeChild(trUsrList);
		}
	}

	/**
	 * this function is used when we want to add a new user to our friend list
	 * param userName: user that you want to add
	 * param groupName: user group
	 */
	function addUser(userName, groupName, status){
		grp = document.getElementById("id_" + groupName);
		if(!grp){
			addGroup(groupName);
		}
		grp = document.getElementById("id_" + groupName);
		bdyUserList = grp.getElementsByTagName('tbody')[0];
			status = replaceAll(status, "<", "&lt;");

		trUser = document.getElementById("usr_" + userName);
		if(trUser != null){
			grpNode = trUser.parentNode.parentNode.parentNode.parentNode;
			if(grpNode.getElementsByTagName("tr").length == 1){
				if(grpNode.style.display != 'none'){
					grpNode.style.display = 'none';
				}
			}
			else{
				if(grpNode.style.display == 'none'){
					if(grpNode.previousSibling.getElementsByTagName("img")[0].src.
							indexOf("arrow-bottom.gif") != -1){
						grpNode.style.display = '';
					}
				}
			}
			trUser.parentNode.removeChild(trUser);
			td1 = trUser.getElementsByTagName("td")[0];
			td2 = trUser.getElementsByTagName("td")[1];
			fieldTitle = userName;
			if(status != "offline" && status != "Available"){
				fieldTitle += " - <i>" + status + "</i>";
			}
			td2.innerHTML = fieldTitle;
			var body = document.getElementsByTagName("body")[0];
			if(body.getElementsByTagName("embed").length != 0){
				body.removeChild(body.getElementsByTagName("embed")[0]);
			}
			var sound = document.createElement("embed");
			sound.style.width = "0px";
			sound.style.height = "0px";
			if(groupName == "Offline"){
				if(td1.innerHTML != "<img src=\"img/offline.gif\">"){
					td1.innerHTML = "<img src='img/offline.gif'>";
					if(soundEnable){
						sound.src = "sound/of.wav";
						body.appendChild(sound);
					}
				}
			}
			else{
				if(td1.innerHTML != "<img src=\"img/online.gif\">"){
					td1.innerHTML = "<img src='img/online.gif'>";
					if(soundEnable){
						sound.src = "sound/ol.wav";
						body.appendChild(sound);
					}
				}
			}
			try{
				activeForm.getElementsByTagName("input")[0].focus();
				activeForm.getElementsByTagName("textarea")[0].focus();
			}catch(e){}
		}
		else{
			tblUsrList = document.getElementById("s_pnl_friendlist").getElementsByTagName("tbody")[0];
			trUsrList = document.createElement("tr");
			trUsrList.id = "ul_" + userName;
			tdUsrList = document.createElement("td");
			tdUsrList.innerHTML = userName;
			trUsrList.appendChild(tdUsrList);
			trUsrList.onmouseover = set;
			trUsrList.onmouseout = unset;
			trUsrList.onclick = setLov;
			tblUsrList.appendChild(trUsrList);

			trUser = document.createElement("tr");
			trUser.id = "usr_" + userName;
			td1 = document.createElement("td");
			td1.vAlign = "top";
			if(groupName == "Offline"){
				td1.innerHTML = "<img src='img/offline.gif'>";
			}
			else{
				td1.innerHTML = "<img src='img/online.gif'>";
			}
			var td2 = document.createElement("td");
			fieldTitle = userName;
			if(status != "offline" && status != "Available"){
				fieldTitle += " - <i>" + status + "</i>";
			}
			td2.innerHTML = fieldTitle;
			td2.onmouseover = set;
			td2.onmouseout = unset;
			td2.ondblclick = dblClick;
			td1.style.padding = 0;
			td2.style.padding = 0;
			trUser.appendChild(td1);
			trUser.appendChild(td2);
			trUser.onmousedown = function(){
				mouseDown(this, null, null, true);
			};
			td2.width = 2000;
		}
		var okBdy = false;
		for(cBody=0; cBody<bdyUserList.childNodes.length; cBody++){
			if(trUser.id.toLowerCase()<bdyUserList.childNodes[cBody].id.toLowerCase()){
				bdyUserList.insertBefore(trUser, bdyUserList.childNodes[cBody]);
				okBdy = true;
				break;
			}
		}
		if(!okBdy){
			bdyUserList.appendChild(trUser);
		}
		if(grp.getElementsByTagName("table")[0].getElementsByTagName("tr").length == 0){
			if(grp.style.display != 'none'){
				grp.style.display = 'none';
			}
		}
		else{
			if(grp.style.display == 'none'){
				grp.style.display = '';
			}
		}
		if(grp.previousSibling.getElementsByTagName("img")[0].src.indexOf("arrow-bottom.gif") == -1){
			grp.style.display = 'none';
		}
		//sortUserList(trUser.parentNode);
	}

	/**
	 *This method is used to sort the user list
	 */
	function sortUserList(parent){
		totalRow = parent.rows.length;
		var tmpRow = new Array(totalRow);
		var i = null;
		for(i=0; i<totalRow; i++){
			tmpRow[i] = parent.rows[i];
		}
		for(i=0; i<totalRow; i++){
			parent.removeChild(tmpRow[i]);
		}
		var nochange = true;
		for(i=0; i<totalRow && nochange; i++){
			for(j=i+1; j<totalRow && nochange; j++){
				if(tmpRow[i].id.toLowerCase() > tmpRow[j].id.toLowerCase()){
					tmp1 = tmpRow[i];
					tmpRow[i] = tmpRow[j];
					tmpRow[j] = tmp1;
					nochange = false;
				}
			}
		}
		for(i=0; i<totalRow; i++){
			parent.appendChild(tmpRow[i]);
		}
	}

	/**
	 *This method is used when we want to add a new group
	 */
	function addGroup(groupName){
		grp = document.getElementById("id_" + groupName);
		if(grp){
			return;
		}
		if(groupName != "Offline"){
			grpList = document.getElementById("s_pnl_grouplist").getElementsByTagName("tbody")[0];
			trGroupList = document.createElement("tr");
			trGroupList.id = "gl_" + groupName;
			tdGroupList = document.createElement("td");
			tdGroupList.innerHTML = groupName;
			trGroupList.appendChild(tdGroupList);
			grpList.appendChild(trGroupList);
			trGroupList.onmouseover = set;
			trGroupList.onmouseout = unset;
			trGroupList.onclick = setLov;
		}
		trGroup = document.createElement("tr");
		trGroup.id = "g_id_" + groupName;
		trGroup.groupName = groupName;
		trGroup.onclick = showHide;
		td1 = document.createElement("td");
		td1.width = "15";
		imgTd = document.createElement("img");
		imgTd.src = "img/arrow-bottom.gif";
		td1.appendChild(imgTd);

		td2 = document.createElement("td");
		td2.innerHTML = "<b>" + groupName + "</b>";
		td2.onmouseover = setNewGroup;
		td2.onmouseout = unsetNewGroup;

		trGroup.appendChild(td1);
		trGroup.appendChild(td2);
		trUserGroup = document.createElement("tr");
		trUserGroup.id = "id_" + groupName;
		trUserGroup.style.display = 'none';
		td1 = document.createElement("td");
		td1.innerHTML = "&nbsp;";

		td2 = document.createElement("td");

		tbl = document.createElement("table");
		tbl.cellpadding = 0;
		tbl.cellspacing = 1;
		tbl.className = "groupFriend";

		tbdy = document.createElement("tbody");
		tbl.appendChild(tbdy);

		td2.appendChild(tbl);

		trUserGroup.appendChild(td1);
		trUserGroup.appendChild(td2);
		tbdy = document.getElementById("panel_friendlist").getElementsByTagName('tbody')[0];
		tempTr = tbdy.childNodes;
		tempTr1 = null;
		tempTr2 = null;
		l = tempTr.length;
		if(l>=2 && document.getElementById("id_Offline") && groupName!="Offline"){
			tempTr1 = tempTr[tempTr.length - 2];
			tempTr2 = tempTr[tempTr.length - 1];
				tbdy.removeChild(tempTr1);
				tbdy.removeChild(tempTr2);
		}
		tbdy.appendChild(trGroup);
		tbdy.appendChild(trUserGroup);
			trGroup.childNodes[1].width = 170;
		if(tempTr1){
			tbdy.appendChild(tempTr1);
			tbdy.appendChild(tempTr2);
		}
	}

	/**
	 * to set event in firefox
	 */
	function setKey(ev){
		t_event_key = ev;
		newMessage = null;
		if(document.title != defaultTitle)
			document.title = defaultTitle;
	}

	/**
	 * Method to show and hide the group
	 */
	function showHide(objName, objParam){
		if(!objParam){
			objParam = this;
			objName = this.groupName;
		}
		var obj = document.getElementById("id_"+objName);
		if(obj.style.display == ''){
			obj.style.display = 'none';
			objParam.getElementsByTagName('img')[0].src = 'img/arrow-right.gif';
		}
		else{
			obj.style.display = '';
			objParam.getElementsByTagName('img')[0].src = 'img/arrow-bottom.gif';
		}
	}

	/**
	 *To set obj background color
	 */
	function set(obj){
		if(!obj){
			obj = this;
		}
		if(!obj.innerHTML){
			obj = this;
		}
		obj.temp = obj.bgColor;
		obj.bgColor = "#CDCDCD";
	}

	/**
	 *To release obj background color to it's default background color
	 */
	function unset(obj){
		if(!obj){
			obj = this;
		}
		if(!obj.innerHTML){
			obj = this;
		}
		obj.bgColor = obj.temp;
	}

	/**
	 * to handle event mouse click in every object
	 */
	function mouseUp(){
		document.getElementById("emoteIcon").style.display = 'none';
		document.getElementById("s_pnl_friendlist").style.display = 'none';
		document.getElementById("s_pnl_grouplist").style.display = 'none';
		document.getElementById("s_font").style.display = 'none';
		document.getElementById("s_font_size").style.display = 'none';
		document.getElementById("s_status").style.display = 'none';
		if(hiddenObj){
			document.getElementsByTagName("body")[0].removeChild(dragObject);
			if(oldGroup != newGroup && newGroup != "Offline"){
				document.forms[3].groupList.value = newGroup;
				document.forms[3].user.value = dragObject.innerHTML;
				document.forms[3].action.value = "addUser";
				doProcessUserGroup(3);
			}
			hiddenObj = null;
		}
		dragObject = null;
		ta = null;
		document.onselectstart = returnTrue;
		document.onmousedown = returnTrue;
		resize = -1;
	}

	/**
	 * to handle when user try to drag a mouse in the draggable object
	 */
	function mouseDown(obj, res, textarea, drag, room){
		activeForm = obj;
		if(drag){
			if(!room)
				oldGroup = obj.parentNode.parentNode.parentNode.parentNode.previousSibling.getElementsByTagName("b")[0].innerHTML;
			dragObject = document.createElement("span");
			var tmpUser = "";
			if(obj.childNodes.length==1){
				tmpUser = obj.childNodes[0].innerHTML;
			}
			else{
				tmpUser = obj.childNodes[1].innerHTML;
			}
			if(tmpUser.indexOf(" ") != -1){
				tmpUser = tmpUser.substring(0, tmpUser.indexOf(" "));
			}
			dragObject.innerHTML = tmpUser;
			dragObject.style.position = 'absolute';
			dragObject.style.fontWeight = 'bold';
			dragObject.style.backgroundColor = "#CDCDFE";
			dragObject.style.fontSize = "12px";
			dragObject.style.left = t_event.clientX + 15;
			dragObject.style.top = t_event.clientY;
			dragObject.style.zIndex = 99999;
			dragObject.style.width = "100";
			hiddenObj = obj;
			temp1 = t_event.clientX + 15;
			temp2 = t_event.clientY;
			document.getElementsByTagName("body")[0].appendChild(dragObject);
		}else{
			dragObject = obj.parentNode.parentNode;
			temp1 = parseInt(dragObject.style.left?dragObject.style.left:0);
			temp2 = parseInt(dragObject.style.top?dragObject.style.top:0);
		}
		x = t_event.clientX;
		y = t_event.clientY;
		document.onselectstart = returnFalse;
		document.onmousedown = returnFalse;
		if(res){
			resize = res;
			d = dragObject.getElementsByTagName('div');
			h = d[1].style.height;
			currHeight = parseInt(h);
			w = d[1].style.width;
			currWidth = parseInt(w);
		}
		if(textarea){
			ta = textarea;
		}
	}

	/**
	 * To move the draggable object
	 */
	function moveWindow(ev){
		newMessage = null;
		if(document.title != defaultTitle)
			document.title = defaultTitle;
		//if(t_event==null){
		//	t_event = ev || window.event;
		//}
		t_event = ev;
		obj = dragObject;
		if(obj!=null){
			if(resize == -1){
				dragObject.style.left = temp1 + t_event.clientX - x;
				if(t_event.clientY-10>10){
				dragObject.style.top = temp2 + t_event.clientY - y;
				}
			}
			else{
				var difTa = 50;			
				if(d.length == 3){
					difTa = -25;
				}
				if(resize==1){
					tempH = t_event.clientY - y;
					nH = currHeight - tempH;
					if(nH>120){
						dragObject.style.top = t_event.clientY - 5;
						d[1].style.height =  nH + 'px';
					}
				}
				else if(resize==2){
					tempH = t_event.clientY - y;
					nH = currHeight - tempH;
					if(nH>120){
						dragObject.style.top = t_event.clientY - 5;
						d[1].style.height =  nH + 'px';
					}
					tempW = t_event.clientX - x;
					nW = currWidth + tempW;
					if(nW>120){
						taDrag = dragObject.getElementsByTagName('textarea');
						if(taDrag.length && nW > 220){
							taDrag[0].style.width = nW - difTa;
						}
						if(nW>220){
							d[1].style.width =  nW + 'px';
						}
					}
				}
				else if(resize==3){
					tempW = t_event.clientX - x;
					nW = currWidth + tempW;
					if(nW>100){
						taDrag = dragObject.getElementsByTagName('textarea');
						if(taDrag.length && nW > 220){
							taDrag[0].style.width = nW - difTa;
						}
						if(nW>220){
							d[1].style.width =  nW + 'px';
						}
					}
				}
				else if(resize==4){
					tempH = t_event.clientY - y;
					nH = currHeight + tempH;
					if(nH>120){
						d[1].style.height =  nH + 'px';
					}
					tempW = t_event.clientX - x;
					nW = currWidth + tempW;
					if(nW>100){
						taDrag = dragObject.getElementsByTagName('textarea');
						if(taDrag.length && nW > 220){
							taDrag[0].style.width = nW - difTa;
						}
						if(nW>220){
							d[1].style.width =  nW + 'px';
						}
					}
				}
				else if(resize==5){
					tempH = t_event.clientY - y;
					nH = currHeight + tempH;
					if(nH>120){
						d[1].style.height =  nH + 'px';
					}
				}
				else if(resize==6){
					tempH = t_event.clientY - y;
					nH = currHeight + tempH;
					if(nH>120){
						d[1].style.height =  nH + 'px';
					}
					tempW = t_event.clientX - x;
					nW = currWidth - tempW;
					if(nW>100){
						taDrag = dragObject.getElementsByTagName('textarea');
						if(taDrag.length && nW > 220){
							taDrag[0].style.width = nW - difTa;
						}
						if(nW>220){
							d[1].style.width =  nW + 'px';
							dragObject.style.left = t_event.clientX - 4;
						}
					}
				}
				else if(resize==7){
					tempW = t_event.clientX - x;
					nW = currWidth - tempW;
					if(nW>100){
						taDrag = dragObject.getElementsByTagName('textarea');
						if(taDrag.length && nW > 220){
							taDrag[0].style.width = nW - difTa;
						}
						if(nW>220){
							d[1].style.width =  nW + 'px';
							dragObject.style.left = t_event.clientX - 4;
						}
					}
				}
				else if(resize==8){
					tempH = t_event.clientY - y;
					nH = currHeight - tempH;
					if(nH>120){
						dragObject.style.top = t_event.clientY - 5;
						d[1].style.height =  nH + 'px';
					}
					tempW = t_event.clientX - x;
					nW = currWidth - tempW;
					if(nW>100){
						taDrag = dragObject.getElementsByTagName('textarea');
						if(taDrag.length && nW > 220){
							taDrag[0].style.width = nW - difTa;
						}
						if(nW>220){
							d[1].style.width =  nW + 'px';
							dragObject.style.left = t_event.clientX - 4;
						}
					}
				}
				
				if(d.length == 3){
					d[2].style.height = d[1].style.height;
				}
			}
		}
	}

	/**
	 * just return false
	 */
	function returnFalse(){
		return false;
	}

	/**
	 * just return true
	 */
	function returnTrue(){
		return true;
	}

	/**
	 * To open a window chat
	 */
	function openWindowChat(id, focus){
		var i;
		total = document.getElementsByTagName('body')[0].getElementsByTagName('form').length;
		if(!document.getElementById(id)){
			var objNew = document.createElement("form");
			objNew.name = id;
			objNew.id = id;
			objNew.innerHTML = f_templateChat.innerHTML;
			document.getElementsByTagName('body')[0].appendChild(objNew);
			document.forms[total].name = id;
			document.forms[total].method = "post";
			document.forms[total].style.cursor = "pointer";
			document.forms[total].getElementsByTagName("table")[0].style.left = 250 + ((counterWindowOpen%10) * 30) + (parseInt(counterWindowOpen/10) * 80);
			document.forms[total].getElementsByTagName("table")[0].style.top = 10 + ((counterWindowOpen%10) * 30);
			document.forms[total].getElementsByTagName('div')[0].innerHTML = "<b>" + id + "</b>";
			document.forms[total].onsubmit = f_templateChat.onsubmit;
			counterWindowOpen++;
			if(counterWindowOpen == 40){
				counterWindowOpen = 0;
			}
		}else{
			document.getElementById(id).style.display="";
		}
		if(focus){
			processIndex(document.getElementById(id).getElementsByTagName('table')[0]);
			document.getElementById(id).getElementsByTagName("textarea")[0].focus();
		}
	}

	/**
	 * To hide a window
	 */
	function hideWindow(obj){
		objRoot = obj.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.
			parentNode.parentNode.parentNode;
		objRoot.style.display="none";
		if(objRoot.id.charAt(0)=='~'){
			objRoot.thread = null;
			objRoot.parentNode.removeChild(objRoot);
			processRoomAccess(objRoot.id, "out");
		}
		dv = objRoot.getElementsByTagName('div')[objRoot.getElementsByTagName('div').length-1];
		sp = dv.getElementsByTagName('span');
		for(i=0; i<sp.length;i++){
			sp[i].style.color = '#CDCDCD';
		}
		frmLength = document.forms.length-1;
		while(frmLength>=0){
			if(document.forms[frmLength].style.display == ''){
				processIndex(document.forms[frmLength].getElementsByTagName('table')[0]);
				if(document.forms[frmLength].getElementsByTagName("textarea").length != 0){
					document.forms[frmLength].getElementsByTagName("textarea")[0].focus();
					break;
				}
			}
			frmLength--;
		}
	}

	/**
	 * To handle clicked on some object such as, bold, italic, etc
	 */
	function proAct(obj, icon){//processing click
		if(obj.parentNode.cColor == null || obj.parentNode.cColor == 0){//click
			if(!icon){
				obj.parentNode.temp = '#EFCDCD';
				obj.parentNode.bgColor = '#EFCDCD';
				obj.parentNode.cColor = 1;
				tempTa = obj.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.
					parentNode.parentNode.getElementsByTagName('textarea')[0];
				objImg = obj.parentNode.parentNode.getElementsByTagName('img');
				for(i=0; i<3; i++){
					if(objImg[i].parentNode.cColor==1){
						if(objImg[i].title == 'Bold'){
							tempTa.style.fontWeight = 'bold';
						}
						else if(objImg[i].title == 'Italic'){
							tempTa.style.fontStyle = 'italic';
						}
						else if(objImg[i].title == 'Underline'){
							tempTa.style.textDecoration = 'underline';
						}
					}
				}
			}
			else{
				document.getElementById("emoteIcon").style.left = t_event.clientX + 'px';
				document.getElementById("emoteIcon").style.top = t_event.clientY + 'px';
				document.getElementById("emoteIcon").style.display = '';
			}
		}
		else{//unclick
			if(obj.title == 'Bold'){
				tempTa.style.fontWeight = '';
			}
			else if(obj.title == 'Italic'){
				tempTa.style.fontStyle = '';
			}
			else if(obj.title == 'Underline'){
				tempTa.style.textDecoration = '';
			}
			obj.parentNode.cColor = 0;
			obj.parentNode.temp = '#EFF0E6';
			obj.parentNode.bgColor = obj.parentNode.temp;
			tempTa = obj.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.
				parentNode.parentNode.getElementsByTagName('textarea')[0];
			objImg = obj.parentNode.parentNode.getElementsByTagName('img');
		}
	}

	/**
	 * to set font attribute in textarea
	 */
	function setFontDesc(value, taChat){
		if(isNaN(value)){
			taChat.style.fontFamily = value;
		}
		else{
			taChat.style.fontSize = value;
		}
	}

	/**
	 * To change window image (inactive and active window)
	 */
	function turnPosition(obj, back){
		var tdObj = obj.getElementsByTagName("td");
		tdObj[0].style.backgroundImage = "url('img/" + back + "nw.gif')";
		tdObj[1].style.backgroundImage  = "url('img/" + back + "n.gif')";
		tdObj[2].style.backgroundImage  = "url('img/" + back + "ne.gif')";
		tdObj[3].style.backgroundImage  = "url('img/" + back + "barw.gif')";
		tdObj[4].style.backgroundImage  = "url('img/" + back + "barn.gif')";
		tdObj[5].style.backgroundImage  = "url('img/" + back + "barn.gif')";
		tdObj[7].style.backgroundImage  = "url('img/" + back + "bare.gif')";
	}

	/**
	 * To bring clicked object to front, and old object to back
	 */
	function processIndex(obj){
		activeForm = obj;
		if(obj_up){
			obj_up.style.zIndex = 0;
			turnPosition(obj_up, "b_");
		}
		turnPosition(obj, "");
		obj.style.zIndex = 9999;
		obj_up = obj;
	}

	/**
	 * to drop an emoticon into a textarea
	 */
	function putEmote(val){
		val = val.title;
		if(obj_up){
			  obj_up.getElementsByTagName('textarea')[0].focus();
			  if(document.selection){
				  var sel = document.selection.createRange();
				  sel.text = val;
			  }
			  else{
				obj_up.getElementsByTagName('textarea')[0].value += val;
			  }
		}
	}

	/**
	 * send message to another user
	 */
	function sendMessage(b, i, u, f, s, to, from, msg){
		if (!Sarissa || !document.getElementById)
			return;
		var xmlhttp =  new XMLHttpRequest();
		xmlhttp.open('POST', 'send.php', true);
		xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xmlhttp.send("action=sendMessage&b="+escape(b)+"=&i="+escape(i)+"&u="+escape(u)+"&font"+escape(f)+"=&s="+escape(s)+"&to="+escape(to)+"&from="+escape(from)+"&msg="+escape(msg));
	}

	/**
	 * to check wether the user wants to send a messsage
	 */
	function processForm(form){
		ta = form.getElementsByTagName('textarea')[0];
		msg = ta.value;
		if(msg == ""){
			return false;
		}
		from = f_friendlist.currentUserId.value;
		to = form.name;
		ta.value = "";
		b = ta.style.fontWeight;
		i = ta.style.fontStyle;
		u = ta.style.textDecoration;
		f = ta.style.fontFamily;
		s = ta.style.fontSize;
		sendMessage(b, i, u, f, s, to, from, msg);
		showMessageText(b, i, u, f, s, to, from, msg);
		return false;
	}

	/**
	 * to set a value from the clicked object into the textarea chat
	 */
	function parseValue(value){
		if(obj_select){
			obj_select.innerHTML = value;
			ta_chat = obj_select.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('textarea')[0];
			setFontDesc(value, ta_chat);
		}
	}

	/**
	 * handle status change
	 */
	function parseStatus(value, firstStatus){
		if(obj_select || firstStatus){
			if(value == "Custom"){
				document.forms[0].status.value = '';
				document.forms[0].status.style.display = '';
				document.getElementById("status").style.display = 'none';
				document.forms[0].status.focus();
				return;
			}
			if(!firstStatus){
				obj_select.innerHTML = value;
			}
			if (!Sarissa || !document.getElementById)
				return;
			var xmlhttp =  new XMLHttpRequest();
			xmlhttp.open('POST', 'send.php', true);
			xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xmlhttp.send("action=setStatus&status="+escape(value));
		}
	}

	/**
	 * To show some hided window when user click an object, like add, delete user/group, font, etc
	 */
	function setObjSelect(obj, ctr){
		obj_select = obj.getElementsByTagName('td')[0];
		if(!ctr){
				document.getElementById("s_font").style.left = parseInt(obj_up.style.left) + 83;
				document.getElementById("s_font").style.top = parseInt(obj_up.getElementsByTagName('div')[1].style.height)+parseInt(obj_up.style.top)+90;
				document.getElementById("s_font").style.display = '';
		}
		else if(ctr == 1){
				document.getElementById("s_font_size").style.left = parseInt(obj_up.style.left) + 138;
				document.getElementById("s_font_size").style.top = parseInt(obj_up.getElementsByTagName('div')[1].style.height)+parseInt(obj_up.style.top)+90;
				document.getElementById("s_font_size").style.display = '';
		}
		else if(ctr == 2){
			if(document.forms[0].status.style.display != 'none'){
				return;
			}
			objStat = document.getElementById("tbl_f_friendlist");
			left = parseInt(objStat.style.left);
			if(isNaN(left)){
				left = 0;
			}
			tp = parseInt(objStat.style.top);
			if(isNaN(tp)){
				tp = 0;
			}
				document.getElementById("s_status").style.left = left + 130;
				document.getElementById("s_status").style.top = tp + 72;
				document.getElementById("s_status").style.display = '';
		}
	}

	/**
	 * to animate buzz action
	 */
	function buzzWindow(formExist){
		wind = formExist.getElementsByTagName('table')[0];
		if(wind.ctr < 10){
			if(wind.ctr == 0){
				wind.running = true;
				wind.oldTop = parseInt(wind.style.top);
				wind.oldLeft = parseInt(wind.style.left);
			}
			wind.style.left = wind.oldLeft + (Math.random()*20);
			wind.style.top = wind.oldTop + (Math.random()*20);
		}else if(wind.ctr == 10){
				wind.style.left = wind.oldLeft;
				wind.style.top = wind.oldTop;
		}
		wind.ctr = wind.ctr + 1;
		if(!wind.actBuzz){
			wind.actBuzz = function(){
				buzzWindow(formExist);
			}
		}
		if(wind.ctr < 200){
			setTimeout(wind.actBuzz, 30);
		}
		else{
				wind.running = false;
		}
	}
	
	/**
	 * To animate blinking window when the messages arrive
	 */
	function animateBlinkWindow(objWindow, b){
		b = b==""?"b_":"";
		turnPosition(objWindow, b);
		objWindow.b = b;
		objWindow.blink = true;
		if(!objWindow.animateAction){
			var tempObj = objWindow;
			objWindow.animateAction = function(){
				animateBlinkWindow(tempObj, tempObj.b);
			}
		}
		if(objWindow.style.zIndex != 9999){
			setTimeout(objWindow.animateAction, 500);
		}else{
			objWindow.blink = false;
			turnPosition(objWindow, "");
		}
	}

	/**
	 * To show the new messages
	 */
	function showMessageText(b, i, u, fo, s, to, from, msg){
		var formExist = null;
		if(to == f_friendlist.currentUserId.value){
			openWindowChat(from);
			formExist = document.getElementById(from);
		}
		else{
			openWindowChat(to);
			formExist = document.getElementById(to);
		}
		var tblMessage = formExist.getElementsByTagName('table')[0];
		if(tblMessage.style.zIndex != 9999 && !tblMessage.blink){
			animateBlinkWindow(tblMessage, "");
		}
		if(from != f_friendlist.currentUserId.value){
			newMessage = " - Incoming Messages from " + from;
			if(soundEnable){
				var body = document.getElementsByTagName("body")[0];
				if(body.getElementsByTagName("embed").length != 0){
					body.removeChild(body.getElementsByTagName("embed")[0]);
				}
				if(msg!="[ding]"){
					var sound = document.createElement("embed");
					sound.style.width = "0px";
					sound.style.height = "0px";
					sound.src = "sound/msg.wav";
					body.appendChild(sound);
					try{
						activeForm.getElementsByTagName("input")[0].focus();
						activeForm.getElementsByTagName("textarea")[0].focus();
					}catch(e){}
				}
			}
		}
		fo = fo?fo:'arial';
		s = s?s:10;
		s = s<8?8:s;

		if(msg == "[ding]"&&formExist){
			if(!formExist.getElementsByTagName('table')[0].running){
				var f = document.createElement('span');
				f.style.color = 'red';
				f.style.fontSize = '15';
				f.innerHTML = '<b>BUZZ!!</b><br>';
				var dv = formExist.getElementsByTagName('div')[1];
				dv.appendChild(f);
				dv.scrollTop = dv.scrollHeight;

				formExist.getElementsByTagName('table')[0].ctr = 0;
				formExist.getElementsByTagName('table')[0].running = true;
				var body = document.getElementsByTagName("body")[0];
				if(body.getElementsByTagName("embed").length != 0){
					body.removeChild(body.getElementsByTagName("embed")[0]);
				}
				if(soundEnable){
					var sound = document.createElement("embed");
					sound.style.width = "0px";
					sound.style.height = "0px";
					sound.src = "sound/buzz.wav";
					body.appendChild(sound);
					try{
						activeForm.getElementsByTagName("input")[0].focus();
						activeForm.getElementsByTagName("textarea")[0].focus();
					}catch(e){}
				}
				buzzWindow(formExist);
			}
			return;
		}
		if(formExist){
			var ta = formExist.taChat;
			var sp = document.createElement('span');
			var sender = document.createElement('font');
			str = "style='color:blue'";
			if(from == f_friendlist.currentUserId.value)
				str = "style='color:red'";
			sender.innerHTML = "<b "+str+">"+from+": </b>";

			var f = document.createElement('span');
			if(b == "bold")
				f.style.fontWeight = b;
			if(i == "italic")
				f.style.fontStyle = i;
			if(u == "underline")
				f.style.textDecoration = u;
			if(fo)
				f.style.fontFamily = fo;
			if(s)
				f.style.fontSize = s;

			for(i=0;i<msg.length;i++){
				msg = msg.replace("<", "&lt;");
			}
			msg = replaceAll(msg, "\n", "<br>");

			for(i=0;i<iconCode.length;i++){
				msg = replaceAll(msg, iconCode[i][1], "<img src='img/Smileys/" + iconCode[i][0] + ".gif'>", true);
			}
			f.innerHTML = msg + "<br>";

			if(!(to==from && to.charAt(0)=='~')){
				sp.appendChild(sender);
			}
			sp.appendChild(f);

			var dv = formExist.getElementsByTagName('div')[1];
			dv.appendChild(sp);
			dv.scrollTop = dv.scrollHeight;

		}
	}

	/**
	 * when user type something
	 */
	function enterText(obj, parEvt){
		processIndex(obj.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
		if(!t_event || (t_event_key == 'a' & !window.event)){
			t_event_key = parEvt;
		}else if(window.event){
			t_event = window.event;
		}

		var key = parEvt.keyCode?parEvt.keyCode:parEvt.which;
		if(key==13){
			if(obj.shift){
				return true;
			}
			obj.parentNode.parentNode.getElementsByTagName('input')[0].click();
			obj.parentNode.parentNode.getElementsByTagName('input')[0].focus();
			obj.focus();
			return false;
		}
		else if(key == 27){
			hideWindow(obj);
		}
		else if(key == 17){
			obj.ctrl = true;
		}
		else if(key == 16){
			obj.shift = true;
		}
		else if(key == 71 && obj.ctrl){
			obj.value = "[ding]";
			obj.ctrl = false;
			obj.parentNode.parentNode.getElementsByTagName('input')[0].click();
			t_event_key = null;
			var body = document.getElementsByTagName("body")[0];
			return false;
		}
		return true;
	}

	/**
	 * To release ctrl key
	 */
	function releaseKey(obj, evt){
		if(obj.ctrl){
			obj.ctrl = false;
		}
		key = evt.keyCode?evt.keyCode:evt.which;
		if(key==16){
			obj.shift = false;
		}
	}

	/**
	 * This function is used to replace all substring in a string
	 */
	function replaceAll(textSource, s, d, caseSensitive){
		var iLen = 0;
		var retVal = "";
		for(iLen=0; iLen<textSource.length; iLen++){
			if(textSource.substring(iLen, iLen + s.length) == s){
				retVal += d;
				iLen += (s.length-1);
			}
			else if(textSource.substring(iLen, iLen + s.length).toLowerCase() == s.toLowerCase()){
				retVal += d;
				iLen += (s.length-1);
			}
			else{
				retVal += textSource.charAt(iLen);
			}
		}
		return retVal;
	}

	document.onmouseup = mouseUp;
	document.onkeydown = setKey;
	window.onload = simulateUser;
	setInterval("checkNewMessage()", 500);