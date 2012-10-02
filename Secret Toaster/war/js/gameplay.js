$(document).ready(function(){
	setDialogs();
	$("#btnOrders").click(function(){
		$("#ordersDialog").dialog("open");
	});
	$("#chkReady").click(function(){
		var ready = $(this).is(":checked");
		var user = game.getPlayer(getUrlParameters().nickname);
		if (user.orders.length == 3){
			postReady( ready );
		} else {
			alert("You must have three orders committed before you can ready up. You currently have " + user.orders.length + ". ");
			ready = false;
			$(this).removeAttr("checked")
			$(this).button("refresh");
		}
		
		eventManager.update();
		
	});
	//postReady(false);
});


function postReady(ready){
	if ( typeof(ready) == "boolean"){
		ready = ready.toString();
	}
	
	$.ajax({
		url: "/ready",
		type: "POST",
		data: {
			nickname: request.nickname,
			gameID: request.gameID,
			ready: ready			
		}, dataType: "json",
		success: function(resp){
			game.updateGame(resp);
			if ( ready == "true" ){
				sendSystemMsg( "<b>" + request.nickname + "</b> is ready" );
			} else {
				sendSystemMsg( "<b>" + request.nickname + "</b> is not ready" );
			}
		}
	});
}

function setDialogs(){
	$("#ordersDialog").dialog({
		autoOpen: false,
		title: "Issue Orders",
		buttons: {
			Done: function(){
				$(this).dialog("close");
			}
		}		
	});
}

function submitOrder(){
	var orderNumber = $("input[name='orders']:checked").val();
	var orderType = $("#orderType").val().toLowerCase();
	console.log(orderType);
	var knightName = $("#knightSelect").val();
	var fromId = $("#knightId").html();
	var toId = $("#toId").html() == "" ? fromId : $("#toId").html();
	var user = game.getPlayer( getUrlParameters().nickname );
	var troops = $("#troopsInput").val() == "" ? 0 : $("#troopsInput").val();
	var order = new Order(orderNumber, orderType, knightName, fromId, toId, user.nickname, troops );
	saveOrder(user, order);
	var order_ = {};
	for (var key in order){
		if (order.hasOwnProperty( key ) ){
			order_[key + "_"] = order[key];
		}		
	}
	
	$.ajax({
		url: "/order",
		type: "POST",
		data: {
			order: JSON.stringify(order_),
			gameID: getUrlParameters().gameID,
			nickname: getUrlParameters().nickname
		}, success: function(resp){
	
		}
	});
}

function updateReady(){
	for (var i=0; i < game.getPlayers().length; i++ ){
		var player = game.getPlayers()[i];
		var ready = player.ready;
		var nickname = player.nickname;
		var $info = getPlayerInfoDiv( nickname );
		if ( ready ){
			if ( $info.find("img.ready").length == 0 ){
				$info.append( $("<img>").attr("src", "data/icons/checkmark.png").addClass("ready") );
			}
			if ( nickname == request.nickname ){
				$("#chkReady").attr("checked", "checked").button("refresh");
			}
		} else{
			$info.find("img.ready").remove();
			if ( nickname == request.nickname ){
				$("#chkReady").removeAttr("checked").button("refresh");
			}
		}
	}
}

function updateNotificationSettings(){
	var player = getPlayer( getUrlParameters().nickname );
	var $target = null;
	var $div = $("#emailNotificationSettings");
	
	for (var key in player.notifications){
		var value = player.notifications[key];
		$target = $("#emailNotificationSettings input[value='" + key + "']");
		
//		switch (key){		
//			case "PLAYER_JOIN": 
//				$target = $("#notificationPlayerJoins");
//				break;
//			default:
//			//default code
//		} 
		if (value){
			$target.attr("checked", "checked").button("refresh");
		} else {
			$target.removeAttr("checked").button("refresh");
		}
	}
}

function updateIdle(){
	for (var i=0; i < game.getPlayers().length; i++ ){
		var player = game.getPlayers()[i];
		var active = player.active;
		var nickname = player.nickname;
		var $info = getPlayerInfoDiv( nickname );
		if ( !active  ){
			if ( $info.find("img.ready").length == 0 ){
				$info.append( $("<img>").attr("src", "data/icons/away.png").addClass("idle") );
			}				
		} else{
			$info.find("img.idle").remove();
		}
	}
}




