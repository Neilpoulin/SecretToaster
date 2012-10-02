$(document).ready(function(){
	$("#createGame").click(function(){
		createGame();
	});
	
	$("#getGame").click(function(){
		getGame();
	});
	
});

function createGame(){
	var gameID = $("#gameID").val();
	var nickname = $("#nickname").val();
	var color = $("#color").val();
	
	$.ajax({
		url: "/gameTest",
		type: "POST",
		data: {
			gameID: gameID,
			nickname: nickname,
			color: color
		},
		dataType: "json",
		success: function(resp){
			console.log(resp);
		}
	});
}

function getGame(){
	var gameID = $("#gameID").val();
	
	$.ajax({
		url: "/gameTest",
		type: "GET",
		data: {
			gameID: gameID
		},
		dataType: "json",
		success: function(resp){
			console.log(resp);
			alert(resp);
		}
	});
	
}
