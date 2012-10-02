$(document).ready(function(){	
	$("#openChannel").click(function(){
		getToken();
	});
	
	$("#sendMessage").click(function(){
		sendMessage( $("#messageTextarea").val() );
	});
});

function getToken(){
	var nickname = $("#nickname").val().trim();
	var gameID = $("#gameID").val().trim();	
	$.ajax({
		url: '/channel',
		type: "GET",
		data: {nickname: nickname, gameID: gameID},
		dataType: "json",
		success: function(resp){
			var token = resp.token
			openChannel(token);
		}
	});
}

function openChannel(token){
	console.log("channel opening");
	channel = new goog.appengine.Channel(token);
    socket = channel.open();
    socket.onopen = onOpened;
    socket.onmessage = onMessage;
    socket.onerror = onError;
    socket.onclose = onClose;
}

function onOpened(){
	console.log("channel opened");
	$("#openChannel").hide();
}

function onMessage(resp){
	console.log("new message recieved");
	console.log(resp);
	var message = JSON.parse(resp.data);
	$("#messages").append( $("<p>").html(message.from + ": " + message.message) );
}

function onError(error){
	console.log("channel error");
	console.log(error);
}

function onClose(){
	console.log("channel closed");
	$("#openChannel").show();
	alert("your connection to the chat has timed out. Please re-connect.");
}

function sendMessage(){
	var nickname = $("#nickname").val().trim();
	var gameID = $("#gameID").val().trim();
	var message = $("#messageTextarea").val();
	$.ajax({
		url: "/channel",
		type: "POST",
		data: {nickname: nickname, gameID: gameID, message: message},
		dataType: "json",
		success: function(resp){
			console.log("message sent");
			//console.log(resp);
		}
	});
}

