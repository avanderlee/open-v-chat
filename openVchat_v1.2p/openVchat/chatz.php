<?
	session_start();
	if($_SESSION["user"] == null){
		header("Location: index.php");
	}
	else if($_SESSION["lastCheck"] != null){
		header("Location: index.php");
	}
	else{
		$_SESSION["lastCheck"] = date("Y-m-d H:i:s");
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<HTML>
<HEAD>
	<meta http-equiv=Content-Type content="text/html; charset=windows-1252">
	<meta name="author" content="Andreanes Yosef Vanderlee">
	<link rel="stylesheet" href="util/styles/css.css" type="text/css">
	<link rel="icon" href="img/logo.gif" type="image/x-icon" />
	<script src="util/js/ui_js.php"></script>
	<title>openVchat v1.2p - <?=$_SESSION["user"]?></title>
</HEAD>
<BODY style="BACKGROUND-COLOR:#cdcdcd;margin:0" onbeforeunload="logoff()" onmousemove="moveWindow(event)">
	<!--This is a main form which displayed user list-->
	<div id="pnl_loader" style="color:#EFEFEF"><img src="img/working.gif" /> <b>Loading...</b></div>
	<div id="pnl_big_loading" style="display:none">
	<FORM name="f_friendlist" onsubmit="return false">
	<input type="hidden" name="currentUserId" value="<?=$_SESSION["user"]?>"/>
	<TABLE id="tbl_f_friendlist" cellSpacing="0" cellPadding="0" border="0" style="position:absolute;top:10;left:0" onmousedown="processIndex(this)">
	  <TBODY>
	  <TR>
		<TD class="nw" onmousedown="mouseDown(this.parentNode, 8)" background="img/nw.gif"></TD>
		<TD class="n" background="img/n.gif" onmousedown="mouseDown(this.parentNode, 1)"></TD>
		<TD class="ne" onmousedown="mouseDown(this.parentNode, 2)" background="img/ne.gif" height="8"></TD>
	  </TR>
	  <TR>
		<TD class="w" background="img/barw.gif" onmousedown="mouseDown(this.parentNode, 7)"></TD>
		<TD background="img/barn.gif" onmousedown="mouseDown(this.parentNode)" style="cursor:pointer">
			<table width="100%" cellpadding="0" cellspacing="0">
				<tr>
					<td onmousedown="mouseDown(this.parentNode.parentNode.parentNode.parentNode.parentNode)" width="90%"><div style="color:white"><b>Friendlist - <?=$_SESSION["user"]?></b></div></td>
					<td align="right" valign="top">
						<table cellpadding="0" cellspacing="0">
							<tr>
								<th title="mute"><img src="img/unmute.gif" onclick="changeSound(this)"/></th>
								<th title="Change Password"><img src="img/pass.png" onclick="document.forms[5].style.display = '';processIndex(document.forms[5].getElementsByTagName('table')[0]);"/></th>
								<th title="Logout"><img src="img/close.gif" onclick="doLogout(this)"/></th>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</TD>
		<TD class="e" onmousedown="mouseDown(this.parentNode, 3)" background="img/bare.gif"></TD>
	  </TR>
	  <TR bgColor="#EFF0E6">
		<TD class="w" onmousedown="mouseDown(this.parentNode, 7)" background="img/w.png" height="50"></TD>
		<TD>
			<table>
				<tr>
					<td>
						<img src="img/addBuddy.gif" onmouseover="this.parentNode.bgColor='#CDE0D6'"
							onmouseout="this.parentNode.bgColor='#EFF0E6'" style="cursor:pointer" title="Add/Edit Buddy or Group"
                            onclick="document.forms[3].style.display = '';processIndex(document.forms[3].getElementsByTagName('table')[0]);"/>
					</td>
					<td>
						<img src="img/removeBuddy.gif" onmouseover="this.parentNode.bgColor='#CDE0D6'"
							onmouseout="this.parentNode.bgColor='#EFF0E6'" style="cursor:pointer" title="Remove Buddy or Group"
                            onclick="document.forms[4].style.display = '';processIndex(document.forms[4].getElementsByTagName('table')[0])"/>
					</td>
					<td>
						<img src="img/conference.gif" onmouseover="this.parentNode.bgColor='#CDE0D6'"
							onmouseout="this.parentNode.bgColor='#EFF0E6'" style="cursor:pointer" title="Chat Room"
                            onclick="joinRoom('openVchat')"/>
					</td>
					<td title="set status" style="cursor:pointer">
						<table style="width:98px;height:38px;border:1px solid;border-color:black;font-size:11px;"
						onmouseover="this.style.borderColor='red'" onmouseout="this.style.borderColor='black'"
						onclick="setObjSelect(this, 2)" cellpadding="0">
							<tr><td id="status">Available</td><td><input size="10" maxlength="30" type="text" name="status" style="display:none" onkeydown="return handleCustomStatus(event)"/></td></tr>
						</table>
					</td>
				</tr>
			</table>
		</TD>
		<TD class="e" onmousedown="mouseDown(this.parentNode, 3)" background="img/e.png"></TD>
	  </TR>
	  <TR>
		<TD class="w" background="img/w.png" onmousedown="mouseDown(this.parentNode, 7)"></TD>
		<TD vAlign=top bgColor="#EFF0E6">
		  <DIV style="cursor:pointer;OVERFLOW: auto; WIDTH: 220px; HEIGHT: 400px; BACKGROUND-COLOR: white;border: solid 1px">
			  <TABLE style="FONT-SIZE: 12px" cellSpacing="0" cellPadding="0" width="100%" id="panel_friendlist">
				<TBODY>
			    </TBODY>
			  </TABLE>
		  </DIV>
		</TD>
		<TD class="e" background="img/e.png" onmousedown="mouseDown(this.parentNode, 3)"></TD>
	  </TR>
	  <TR>
		<TD class="sw" onmousedown="mouseDown(this.parentNode, 6)" background="img/resizesw.gif" width="8"></TD>
		<TD class="s" background="img/resizes.png" onmousedown="mouseDown(this.parentNode, 5)"></TD>
		<TD class="se" onmousedown="mouseDown(this.parentNode, 4)" background="img/resizese.png" height="11" width="8"></TD>
	  </TR>
	  </TBODY>
	 </TABLE>
	</FORM>


	<!--This is a template form chat-->
	<FORM name="f_templateChat" style="display:none" onsubmit="return(processForm(this))">
	<TABLE cellSpacing="0" cellPadding="0" border="0" style="position:absolute" onmousedown="processIndex(this)">
	  <TBODY>
	  <TR>
		<TD class="nw" onmousedown="mouseDown(this.parentNode, 8)" background="img/nw.gif"></TD>
		<TD class="n" background="img/n.gif" onmousedown="mouseDown(this.parentNode, 1)"></TD>
		<TD class="ne" onmousedown="mouseDown(this.parentNode, 2)" background="img/ne.gif" height="8"></TD>
	  </TR>
	  <TR>
		<TD class="w" background="img/barw.gif" onmousedown="mouseDown(this.parentNode, 7)"></TD>
		<TD background="img/barn.gif" onmousedown="mouseDown(this.parentNode)" style="cursor:pointer">
			<table width="100%" cellpadding="0" cellspacing="0">
				<tr>
					<td onmousedown="mouseDown(this.parentNode.parentNode.parentNode.parentNode.parentNode)" width="90%"><div style="color:white" id="userId"></div></td>
					<td align="right" valign="top"><img src="img/close.gif" onclick="hideWindow(this)" title="Close"/></td>
				</tr>
			</table>
		</TD>
		<TD class="e" onmousedown="mouseDown(this.parentNode, 3)" background="img/bare.gif"></TD>
	  </TR>
	  <TR>
		<TD class="w" onmousedown="mouseDown(this.parentNode, 7)" background="img/w.png">&nbsp;</TD>
		<TD bgColor="#EFF0E6">
			&nbsp;
		</TD>
		<TD background="img/e.png" class="e" onmousedown="mouseDown(this.parentNode, 3)"></TD>
	  </TR>
	  <TR>
		<TD class="w" background="img/w.png" onmousedown="mouseDown(this.parentNode, 7)"></TD>
		<TD vAlign=top bgColor="#EFF0E6">
		  <DIV style="cursor:pointer;OVERFLOW: auto; WIDTH: 250px; HEIGHT: 120px; BACKGROUND-COLOR: white;border: solid 1px;font-size:12px">
		  </DIV>
		</TD>
		<TD class="e" background="img/e.png" onmousedown="mouseDown(this.parentNode, 3)"></TD>
	  </TR>
	  <TR bgColor="#EFF0E6">
		<TD class="w" background="img/w.png" onmousedown="mouseDown(this.parentNode, 7)"></TD>
		<TD style="padding-top:2px">
			<table cellpadding="0" cellspacing="0">
				<tr>
					<td valign="center" cColor="0">
						<img src="img/bold.gif" onmouseover="this.parentNode.temp=this.parentNode.bgColor; this.parentNode.bgColor='#CDE0D6'"
							onmouseout="this.parentNode.bgColor=this.parentNode.temp" onclick="proAct(this)"
							style="cursor:pointer" title="Bold"/>
					</td>
					<td valign="center" cColor="0">
						<img src="img/italic.gif" onmouseover="this.parentNode.temp=this.parentNode.bgColor; this.parentNode.bgColor='#CDE0D6'"
							onmouseout="this.parentNode.bgColor=this.parentNode.temp" onclick="proAct(this)"
							style="cursor:pointer" title="Italic"/>
					</td>
					<td valign="center" cColor="0">
						<img src="img/underline.gif" onmouseover="this.parentNode.temp=this.parentNode.bgColor; this.parentNode.bgColor='#CDE0D6'"
							onmouseout="this.parentNode.bgColor=this.parentNode.temp" onclick="proAct(this)"
							style="cursor:pointer" title="Underline"/>
					</td>
					<td>
						<table width="50" style="border:1px solid;border-color:black;font-size:11px"
						onmouseover="this.style.borderColor='red'" onmouseout="this.style.borderColor='black'"
						onclick="setObjSelect(this)" cellpadding="0">
							<tr><td id="font_type">Arial</td></tr>
						</table>
					</td>
					<td style="padding-left:5px;">
						<table width="50" style="border:1px solid;border-color:black;font-size:11px"
						onmouseover="this.style.borderColor='red'" onmouseout="this.style.borderColor='black'"
						onclick="setObjSelect(this, 1)" cellpadding="0">
							<tr><td id="font_size">10</td></tr>
						</table>
					</td>
					<td valign="center" cColor="0">
						<img src="img/emoticon.gif" onmouseover="this.parentNode.temp=this.parentNode.bgColor; this.parentNode.bgColor='#CDE0D6'"
							onmouseout="this.parentNode.bgColor=this.parentNode.temp" onclick="proAct(this, 'icon')"
							style="cursor:pointer" title="Emoticon"/>
					</td>
					<td align="center" valign="center" style="border:1px solid; padding:0;border-color:black" width="15" title="BUZZ!!"
						onmouseover="this.style.borderColor='red'" onmouseout="this.style.borderColor='black'" onclick="par = this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;par.getElementsByTagName('textarea')[0].value='[ding]';par.getElementsByTagName('input')[0].click()">
					<b>!</b>
					</td>
				</tr>
			</table>
		</TD>
		<TD class="e" background="img/e.png" onmousedown="mouseDown(this.parentNode, 3)"></TD>
	  </TR>
	  <TR>
		<TD class="w" background="img/w.png" onmousedown="mouseDown(this.parentNode, 7)"></TD>
		<TD vAlign=top bgColor="#EFF0E6" valign="top">
			<table width="100%">
				<tr><td>
					<textarea style="font-family:arial;overflow:auto;width:200;height:50;font-size:10" name="taChat" onkeydown="return enterText(this, event)" onkeyup="releaseKey(this, event)"></textarea>
				</td>
				<td>
					<input type="submit" value="Send" style="height:50px;width:50px" name="btnSend"/>
				</td></tr>
			</table>
		</TD>
		<TD class="e" background="img/e.png" onmousedown="mouseDown(this.parentNode, 3)"></TD>
	  </TR>
	  <TR>
		<TD class="sw" onmousedown="mouseDown(this.parentNode, 6)" background="img/resizesw.gif" width="8"></TD>
		<TD class="s" background="img/resizes.png" onmousedown="mouseDown(this.parentNode, 5)"></TD>
		<TD class="se" onmousedown="mouseDown(this.parentNode, 4)" background="img/resizese.png" height="11" width="8"></TD>
	  </TR>
	  </TBODY>
	 </TABLE>
	</FORM>

	<FORM name="f_blankform" id="f_blankform" style="display:none">
	<input type="hidden" name="action"/>
	<TABLE cellSpacing="0" cellPadding="0" border="0" style="position:absolute;top:10;left:250" onmousedown="processIndex(this)">
	  <TBODY>
	  <TR>
		<TD class="nw" onmousedown="mouseDown(this.parentNode, 8)" background="img/nw.gif"></TD>
		<TD class="n" background="img/n.gif" onmousedown="mouseDown(this.parentNode, 1)"></TD>
		<TD class="ne" onmousedown="mouseDown(this.parentNode, 2)" background="img/ne.gif" height="8"></TD>
	  </TR>
	  <TR>
		<TD class="w" background="img/barw.gif" onmousedown="mouseDown(this.parentNode, 7)"></TD>
		<TD background="img/barn.gif" onmousedown="mouseDown(this.parentNode)" style="cursor:pointer">
			<table width="100%" cellpadding="0" cellspacing="0">
				<tr>
					<td onmousedown="mouseDown(this.parentNode.parentNode.parentNode.parentNode.parentNode)" width="90%"><div style="color:white" id="titleForm"></div></td>
					<td align="right" valign="top"><img src="img/close.gif" onclick="hideWindow(this)" title="Close"/></td>
				</tr>
			</table>
		</TD>
		<TD class="e" onmousedown="mouseDown(this.parentNode, 3)" background="img/bare.gif"></TD>
	  </TR>
	  <TR bgColor="#EFF0E6">
		<TD class="w" onmousedown="mouseDown(this.parentNode, 7)" background="img/w.png" height="10"></TD>
		<TD>
		</TD>
		<TD class="e" onmousedown="mouseDown(this.parentNode, 3)" background="img/e.png"></TD>
	  </TR>
	  <TR bgColor="#EFF0E6">
		<TD class="w" background="img/w.png" onmousedown="mouseDown(this.parentNode, 7)"></TD>
		<TD vAlign=top>
		  <DIV style="cursor:pointer;OVERFLOW: auto; WIDTH: 200px; HEIGHT: 120px; BACKGROUND-COLOR:#EFF0E6;border: solid 1px">
			  <TABLE style="FONT-SIZE: 12px" cellSpacing="0" cellPadding="0" width="100%" id="main_panel">
				<TBODY>
			    </TBODY>
			  </TABLE>
		  </DIV>
		</TD>
		<TD class="e" background="img/e.png" onmousedown="mouseDown(this.parentNode, 3)"></TD>
	  </TR>
	  <TR>
		<TD class="sw" onmousedown="mouseDown(this.parentNode, 6)" background="img/resizesw.gif" width="8"></TD>
		<TD class="s" background="img/resizes.png" onmousedown="mouseDown(this.parentNode, 5)"></TD>
		<TD class="se" onmousedown="mouseDown(this.parentNode, 4)" background="img/resizese.png" height="11" width="8"></TD>
	  </TR>
	  </TBODY>
	 </TABLE>
	</FORM>

	<!--This is a layer for emoticon-->
	<div id="emoteIcon" style="position:absolute;display:none;z-index:10000">
		<table border=1 cellpadding="0" cellspacing="0"><tr><td>
		<table cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
		<script>
			var total = iconCode.length;
			var row = 5;
			var col = parseInt(total / row);
			for(i=0; i<=row; i++){
				document.write("<tr>");
				for(j=0; j<col; j++){
					if(i*col+j<total){
						document.write("<td align='center' title='" + iconCode[i*col+j][1] + "' onclick='putEmote(this)'><img src=\"img/Smileys/"+iconCode[i*col+j][0]+".gif\"/></td>");
					}
				}
				document.write("</tr>");
			}
		</script>
		</table>
		</td></tr></table>
	</div>

	<!--This is a layer for font type-->
	<div id="s_font" style="border:1px solid;position:absolute;z-Index:10000;width:50;display:none">
		<table cellpadding="0" cellspacing="0" style="border-color:black;font-size:11px" width="100%" bgcolor="#EFEFEF">
			<tr onmouseover="this.bgColor='#cdcdcd'" onmouseout="this.bgColor='#EFEFEF'" onclick="parseValue(this.getElementsByTagName('td')[0].innerHTML)">
				<td>Arial</td>
			</tr>
			<tr onmouseover="this.bgColor='#cdcdcd'" onmouseout="this.bgColor='#EFEFEF'" onclick="parseValue(this.getElementsByTagName('td')[0].innerHTML)">
				<td>Times</td>
			</tr>
			<tr onmouseover="this.bgColor='#cdcdcd'" onmouseout="this.bgColor='#EFEFEF'" onclick="parseValue(this.getElementsByTagName('td')[0].innerHTML)">
				<td>Courier</td>
			</tr>
			<tr onmouseover="this.bgColor='#cdcdcd'" onmouseout="this.bgColor='#EFEFEF'" onclick="parseValue(this.getElementsByTagName('td')[0].innerHTML)">
				<td>Sans</td>
			</tr>
		</table>
	</div>

	<!--This is a layer for font size-->
	<div id="s_font_size" style="border:1px solid;position:absolute;z-Index:10000;width:50;display:none;overflow:auto;height:80px">
		<table cellpadding="0" cellspacing="0" style="border-color:black;font-size:11px" width="100%" bgcolor="#EFEFEF">
			<tr onmouseover="this.bgColor='#cdcdcd'" onmouseout="this.bgColor='#EFEFEF'" onclick="parseValue(this.getElementsByTagName('td')[0].innerHTML)">
				<td>8</td>
			</tr>
			<tr onmouseover="this.bgColor='#cdcdcd'" onmouseout="this.bgColor='#EFEFEF'" onclick="parseValue(this.getElementsByTagName('td')[0].innerHTML)">
				<td>10</td>
			</tr>
			<tr onmouseover="this.bgColor='#cdcdcd'" onmouseout="this.bgColor='#EFEFEF'" onclick="parseValue(this.getElementsByTagName('td')[0].innerHTML)">
				<td>12</td>
			</tr>
			<tr onmouseover="this.bgColor='#cdcdcd'" onmouseout="this.bgColor='#EFEFEF'" onclick="parseValue(this.getElementsByTagName('td')[0].innerHTML)">
				<td>14</td>
			</tr>
			<tr onmouseover="this.bgColor='#cdcdcd'" onmouseout="this.bgColor='#EFEFEF'" onclick="parseValue(this.getElementsByTagName('td')[0].innerHTML)">
				<td>16</td>
			</tr>
			<tr onmouseover="this.bgColor='#cdcdcd'" onmouseout="this.bgColor='#EFEFEF'" onclick="parseValue(this.getElementsByTagName('td')[0].innerHTML)">
				<td>18</td>
			</tr>
			<tr onmouseover="this.bgColor='#cdcdcd'" onmouseout="this.bgColor='#EFEFEF'" onclick="parseValue(this.getElementsByTagName('td')[0].innerHTML)">
				<td>20</td>
			</tr>
			<tr onmouseover="this.bgColor='#cdcdcd'" onmouseout="this.bgColor='#EFEFEF'" onclick="parseValue(this.getElementsByTagName('td')[0].innerHTML)">
				<td>22</td>
			</tr>
		</table>
	</div>

	<div id="s_status" style="cursor:pointer;border:1px solid;position:absolute;z-Index:10000;width:100;display:none;overflow:auto;height:73px;background-color:#EFEFEF;">
		<table cellpadding="0" cellspacing="0" style="border-color:black;font-size:11px" width="100%">
			<tr onmouseover="this.bgColor='#cdcdcd'" onmouseout="this.bgColor='#EFEFEF'" onclick="parseStatus(this.getElementsByTagName('td')[0].innerHTML)">
				<td>Available</td>
			</tr>
			<tr onmouseover="this.bgColor='#cdcdcd'" onmouseout="this.bgColor='#EFEFEF'" onclick="parseStatus(this.getElementsByTagName('td')[0].innerHTML)">
				<td>Not at my desk</td>
			</tr>
			<tr onmouseover="this.bgColor='#cdcdcd'" onmouseout="this.bgColor='#EFEFEF'" onclick="parseStatus(this.getElementsByTagName('td')[0].innerHTML)">
				<td>On the phone</td>
			</tr>
			<tr onmouseover="this.bgColor='#cdcdcd'" onmouseout="this.bgColor='#EFEFEF'" onclick="parseStatus(this.getElementsByTagName('td')[0].innerHTML)">
				<td>Invisible</td>
			</tr>
			<tr onmouseover="this.bgColor='#cdcdcd'" onmouseout="this.bgColor='#EFEFEF'" onclick="parseStatus(this.getElementsByTagName('td')[0].innerHTML)">
				<td>Custom</td>
			</tr>
		</table>
	</div>

	<div id="s_pnl_friendlist" style="cursor:pointer;border:1px solid;position:absolute;z-Index:10000;width:100;display:none;overflow:auto;height:73px;background-color:#EFEFEF;">
		<table cellpadding="0" cellspacing="0" style="border-color:black;font-size:11px" width="100%">
			<tbody>
			</tbody>
		</table>
	</div>
	<div id="s_pnl_grouplist" style="cursor:pointer;border:1px solid;position:absolute;z-Index:10000;width:100;display:none;overflow:auto;height:73px;background-color:#EFEFEF;">
		<table cellpadding="0" cellspacing="0" style="border-color:black;font-size:11px" width="100%">
			<tbody>
			</tbody>
		</table>
	</div>
		<table width="100%" height="94%"
			<tr>
				<!-- Please do not Remove this part-->
				<td valign="bottom" align="center" style="font-size:12px;color:#EFEFEF;font-weight:bold">
					openVchat v1.2p<br/>
					check update <a href="http://sourceforge.net/projects/open-v-chat" target="_blank" >http://sourceforge.net/projects/open-v-chat</a><br/>
					Copyright 2006
				</td>
			</tr>
		</table>
	</div>
</BODY>
<script src="util/js/sarissa.js"></script>
<script src="util/js/ui.js"></script>
</HTML>
<?}?>