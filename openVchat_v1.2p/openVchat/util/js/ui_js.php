<?
	include("./../utility.php");
	$con = createConnection();
    $rows = mysql_query("select * from mst_icon order by length(icon_char) desc", $con);
	echo "var iconCode = new Array();";
	$i = 0;
    while($row = mysql_fetch_array($rows)){
    	echo "iconCode[$i] = new Array();\n";
    	echo "iconCode[$i][0] = $row[0];\n";
    	echo "iconCode[$i][1] = \"".ereg_replace("<", "&lt;",ereg_replace("\'", "\\\'", ereg_replace("\"", "\\\"", $row[1])))."\";\n";
    	$i++;
    }
?>