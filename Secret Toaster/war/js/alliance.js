$(document).ready(function(){	
	$("#allianceDIV").dialog({
		autoOpen: false,
		modal: false,
		closeOnEscape: false,
		draggable: true,
		resizable: true,
		position: ["center", "middle"],
		width: 800,
		title: "Alliances",
		open: function(event, ui){
			refreshAlliances();
		},
		buttons: {
			Done: function(){
				$(this).dialog('close');
			}
		}	
	});
	
	$("#allianceRenameDIV").dialog({
		autoOpen: false,
		modal: true,
		closeOnEscape: true,
		draggable: false,
		resizeable: false,
		position: ["center", "center"],
		width: 400,
		height: 200,
		title: "Alliance Name",
		buttons: {
			Save: function(){
				renameAlliance( $("#allianceNewName").val() );
				$(this).find("input").val("");
				$(this).dialog("close");
			},
			Cancel: function(){
				$(this).find("input").val("");
				$(this).dialog("close");
			}			
		}
	});
	
	$("#allianceCreateDIV").dialog({
		autoOpen: false,
		modal: true,
		closeOnEscape: true,
		draggable: false,
		resizeable: false,
		position: ["center", "center"],
		width: 400,
		height: 200,
		title: "Crate Alliance",
		buttons: {
			Done: function(){
				joinAlliance( $("#allianceName").val(), $("#allianceId").val(), "create" );
				$(this).find("input").val("");
				$(this).dialog("close");
			},	Cancel: function(){
				$(this).find("input").val("");
				$(this).dialog("close");
				refreshAlliances();
			}	
		}
	});
	
	
	$( "#openAlliances" ).click( function(){
		ajaxAlliances();
		$("#allianceDIV").dialog("open");
	});
	
});

function ajaxAlliances(){
	$.ajax({
		url: "/alliance",
		type: "GET",
		data: {
			gameID: request.gameID
		},
		dataType: "json",
		success: function( resp ){
			//game = resp;
			game.updateGame( resp );
			refreshAlliances();
		}
	});
}

function joinAlliance(name, id, type){
	var oldAlliance = getAlliance( request.nickname );
	
	$.ajax({
		url: "/alliance",
		type: "POST",
		data: {
			nickname: request.nickname,
			gameID: request.gameID,
			allianceID: id,
			allianceName: name,
			action: "join"
		},
		dataType: "json",
		success: function( resp ){
			//game = resp;
			game.updateGame( resp );
			game.push();
			refreshAlliances();
			if (type != "create"){
				sendSystemMsg( request.nickname + " left <b>" + oldAlliance.name + "</b> and joined <b>" + name + "</b>");	
			} else {
				sendSystemMsg( request.nickname + " left <b>" + oldAlliance.name +  "</b> created new alliance <b>" + name + "</b>" );
			}
		}		
	});
}

function renameAlliance( newName ){
	var oldAlliance = getAlliance( request.nickname );
	$.ajax({
		url: "/alliance",
		type: "POST",
		data: {
			nickname: request.nickname,
			gameID: request.gameID,
			action: "rename",
			newName: newName
		},
		dataType: "json",
		success: function( resp ){
			//game = resp;
			game.updateGame( resp );
			game.push();
			refreshAlliances();	
				sendSystemMsg( request.nickname + " renamed <b>" + oldAlliance.name + "</b> to <b>" + newName + "</b>");
				//sendSystemMsg( request.nickname + " named the alliance <b>" + newName + "</b>");			
		}		
	});
}

function refreshAlliances(){
	var $dialog = $("#allianceDIV");
	var $membership = $("#membership");
	var alliances = game.alliances;
	$membership.empty();
	var maxHeight = 0;
	var divW = 0;
	for (var i=0; i< alliances.length; i++){
		var alliance = alliances[i];
		var numMembers = alliance.members.length;
		var $allyDIV = $("<div>").attr( "title", i );
		var $allyList = $("<ul>").addClass("connectedSortable");	
		if ( (alliances.length + 1) % 3 == 0 || alliances.length == 5){
			divW = "32%";
		} else if ( (alliances.length + 1) % 2 == 0){
			divW = "49%";
		} else{
			divW = "32%";
		}	
		$allyDIV.css({ width: divW });
		
		$allyDIV.append( $("<h3>").html( alliance.name ) );		
		for (var j = 0; j < alliance.members.length; j++){
			var member = alliance.members[j];
			$allyList.append( $("<li>").attr( "name", member.nickname.toLowerCase() ).html( member.nickname )
					.css({backgroundImage: "-webkit-linear-gradient(top, white -150%, " + member.color + " 125%)"}) );
			if ( member.nickname.toLowerCase() == request.nickname.toLowerCase() ){
				$allyList.find("li:last").css({ cursor: "pointer" });
				if ( $allyList.find("li:last").is(":first-child") ){
					$allyDIV.prepend( $("<button>").attr("id", "renameAlliance")
							.button({  icons: { primary: "ui-icon-pencil" }, text: false })
							.click(function(){
								$("#allianceNewName").val( game.getAlliance( request.nickname ).name );
								$("#allianceRenameDIV").dialog("open");
							}) 
					);
				}
			}
		}
		$allyDIV.append($allyList);
		$membership.append( $allyDIV );
		$membership.find("ul").sortable({
			connectWith: ".connectedSortable",
			receive: function(event, ui){
				joinAlliance( $(this).parent().find("h3").html(), $(this).parent().attr("title") );
			}, items: "li[name='" + getUrlParameters().nickname.toLowerCase() + "']"
		});	
		var liHeight = $("#membership").find("li").outerHeight();
		maxHeight = liHeight*alliance.members.length > maxHeight ? liHeight*alliance.members.length + 5*alliance.members.length : maxHeight; 	
	}	
	$membership.append( $("<div>").attr("title", alliances.length + 1).css({ width: divW })
			.append( $("<h3>").html("Create New Alliance") )
			.append( $("<ul>").addClass("connectedSortable") )
		);
	$membership.find("ul:last").sortable({
		connectWith: ".connectedSortable",
		receive: function(event, ui){
			$("#allianceId").val( $(this).parent().attr("title") );
			$("#allianceCreateDIV").dialog("open");
		}, items: "li[name='" + getUrlParameters().nickname.toLowerCase() + "']"
	});
	
	$("#membership").find("ul").height( maxHeight );
//	$dialog.dialog( "open" );
}


