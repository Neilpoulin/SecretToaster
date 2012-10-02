$("#searchGame, #joinGame, #controls, #createGame").hide();
$("#colors").css({height: 0}).addClass("up").css({opacity: 0});
$("#selectedColor").css({opacity: 0}).prev().css({opacity: 0});
window.dots = setInterval();

$(document).ready(function(){
	window.localStorageManager = new LocalStorageManager();
	$("#gameID").val(getUrlParameters().gameID);
	
	$("#searchGame").click(function(){
		var nickname = $("#nickname").val(), 
			gameID = $("#gameID").val();
		searchGames( nickname, gameID );
	});
		
	$("#joinGame").click(function(){
		var nickname = $("#nickname").val(), 
			gameID = $("#gameID").val(), 
			color = $("#selectedColor").text();
		if ( validateColor() ){
			joinGame(nickname, gameID, color);
		} else {
			$("#inputError").html("You must select a color").animate({opacity: 1}, 100);
		}
	});
	
	$("#createGame").click(function(){
		var nickname = $("#nickname").val(), 
			gameID = $("#gameID").val(), 
			color = $("#selectedColor").text();
		if ( validateColor() ) {
			createGame( nickname, gameID, color );
		} else {
			$("#inputError").html("You must select a color").animate({opacity: 1}, 100);
		}
	});
	
	$("#nickname, #gameID").bind("keyup keydown", function(event){
		inputValidation($(this), event); //on keydown and key up, run a validation function and only return valid text (no periods and spaces, etc).				
		if (event.type == "keyup" && event.keyCode == 13){ //if enter is pushed
			$("button:visible").click();
		} 
			if ($("#nickname").val() != "" && $("#gameID").val() != ""){
				$("#searchGame").show();
				$("#controls").slideDown();
			} else {
				$("#controls").slideUp();
			}
			$("#notice").slideUp();
			$("#joinGame").hide();
			$("#createGame").hide();
			$("#selectedColor")
				.stop()
				.animate({opacity: 0}, 50, function(){
					$("#selectedColor").html("Please select a color");
				})
				.prev()
					.stop()
					.animate({opacity: 0}, 50);
			
			slideUp($("#colors"), 500);
			clearInterval(dots);
	});
	
	$("button").button();
	
	$("#selectedColor, label[for='selectedColor']").click(function(){
		$colors = $("#colors");
		$selector = $("#selectedColor");
		$colors.css({overflow: "auto"});
		var colorHeight = $(document).height() - $colors.position().top - 20;
		if (colorHeight < 50){
			colorHeight = 50;
		}
		if ( $selector.css("opacity") != "0"){
			//$colors.toggleClass("up");
			if ( !$colors.hasClass("up") ){
				slideUp($colors, 1000);
			} else{		
				slideDown($colors, colorHeight, 1000);
			}
		}			
	});
	
	$(window).resize(function(){
		positionColorSelect();
	});
	
	buildRecentGamesList();
});

function slideUp($elm, duration){

	$elm.stop().addClass("up").animate({height: 0}, duration, "easeOutExpo", function(){
		$elm.css({ opacity: 0, overflow: "auto" });
	});
}

function slideDown($elm, height, duration){
	$elm.css({opacity: 1, overflow: "auto"});
	$elm.stop().removeClass("up").animate({height: height}, duration, "easeOutExpo", function(){
		//after the list is out
	});
}

function validateColor(){
	var color = $("#selectedColor").text();
	var message = "Please select a color";
	var valid = true;
	if (color.toUpperCase() == message.toUpperCase() ){
		valid = false;
	}
	
	return valid;
}

function positionColorSelect(){
	$("#colors").position({
		of: $("#selectedColor"),
		my: "left top",
		at: "left bottom",
		collision: "none"
	});
}

function joinGame(nickname, id, color){
	var $notice = $("#notice");
	var $search = $("#searchGame");
	var $join = $("#joinGame");
	$("#createGame").hide();
	$("#searchGame").hide();
	$join.show().html("Join Game");
	var msg1 = "Joining Game: <b>" + id + "</b>";
	var msg2 = msg1;
	var count = 0;
	dots = setInterval(function(){
		msg2 += ".";
		if (count == 5){
			count = 0;
			msg2 = msg1;
		}
		$("#notice").html(msg2).css({color: "black"});
		count++;					
	},300);
	$("#notice").hide().html(msg2).css({color: "green"}).fadeIn();
	
	$.ajax({
		url: "/login",
		type: "GET",
		data: {
			gameID: id,
			nickname: nickname,
			color: color
		},
		dataType: "json",
		success: function(resp){
			console.log(resp);
			var $notice = $("#notice");
			var $search = $("#searchGame");
			var $join = $("#joinGame");
			
			if (resp.status == "OK"){
				$join.show().html("Join Game");
				var msg1 = "Joining Game: <b>" + id + "</b>";
				var msg2 = msg1;
				var count = 0;
				dots = setInterval(function(){
					msg2 += ".";
					if (count == 5){
						count = 0;
						msg2 = msg1;
					}
					$("#notice").html(msg2).css({color: "black"});
					count++;					
				},300);
				$("#notice").hide().html(msg2).css({color: "black"}).fadeIn();
				connect();
			} else {
				alert("ERROR! " + resp.status.message);
			}
			
			$notice.slideDown("fast");
										
		} // end of join ajax success
	});
		
	function connect(){
		setInterval(function(){
			$.ajax({
				url: "/findGame",
				type: "GET",
				data: {
					gameID: id,
					nickname: nickname,
				},
				dataType: "json",
				success: function(resp){
					console.log(resp);
					for (var i=0; i < resp.game.players_.length; i++){
						var player = resp.game.players_[i];
						if (player.nickname_ == nickname){
							$("html").fadeOut(600, function(){
								window.location = "index.jsp?gameID=" + id.toUpperCase() + "&nickname=" + nickname;					
							});
							break;
						}
					}
				}
			});
		}, 1000);
	} // end of "connect" function
	
		
}

function searchGames(nickname, id){
	$("#joinGame").hide();
	$("#createGame").hide();
	$.ajax({
		url: "/findGame",
		type: "GET",
		data: {
			gameID: id,
			nickname: nickname,
		},
		dataType: "json",
		success: function(resp){
			console.log(resp);
			var $notice = $("#notice");
			var $search = $("#searchGame");
			var $join = $("#joinGame");
			var $colors = $("#colors");
			$colors.empty();		
			var colorList = resp.status.colors;
			for (var i=0; i< colorList.length; i++){
				var color = colorList[i];
				$colors.append( 
					$("<li>" + color + "</li>")
						.prepend( $("<span>").addClass("colorBlock").css({background: color}) )
						.click(function(){
							$("#selectedColor").empty();
							$(this).contents().clone().appendTo("#selectedColor");
							slideUp($colors, 500);
							$("#inputError").animate({opacity: 0}, 500, function(){
								$("#inputError").html(" ");
							});
						})
				);	
			}			
			if (resp.status.game == "running"){
				//if the game status is running	
				if (resp.game.players_.length > 5){
					//check if game is full
					$("#joinGame").hide();
					$("#controls").slideUp();
					$("#notice").html("This game is full. Please search for another or create a new one.").css({color: "red"});
					$("#gameID").focus();
				} else if (resp.status.nickname == "taken"){
					//check if the nickname is in use 
					$notice
						.html("The nickname <b>" + $("#nickname").val() + "</b> is alreaday in use. Please choose another nickname or try to join a different game.")
						.css({color: "red"});
				} else {
					//if the game is not full and the nickname is not in use, allow use to join
					$("#joinGame").html("Join Game").show();
					$search.hide();
					if ("colors" in resp.status){
						$("#selectedColor").animate({opacity: 1}, 50).prev().animate({opacity: 1}, 50);
						positionColorSelect();
					}				
					var $content = $("<span>").append("Success! there are " + resp.game.players_.length + " others in the the game.<br>Join ");
					for (var i=0; i< resp.game.players_.length; i++){
						var player = resp.game.players_[i];
						var $name = $("<span>").attr("id", "name_"+player.nickname_).css({color: player.color_, fontWeight: "bold"}).html(player.nickname_); 
						console.log($name);
						if (i == resp.game.players_.length-1 && i != 0){
							$content.append(" and ");
						} else if (i != 0){
							$content.append(", ");
						}
						$content.append( $name );
					}
					$date = $("<span>").html( "<br><br>Game created on " + formatDate( resp.game.creationDate_ ) );
					$notice.empty().append( $content ).css({color: "black"}).append( $date );
				}
			} else {
				//if the game status is not "running", it has not been created	
				if ("colors" in resp.status){
					$("#selectedColor").animate({opacity: 1}, 50).prev().animate({opacity: 1}, 50);
					positionColorSelect();
				}
				$search.hide(0, function(){
					$join.html("Create Game").hide();
					$("#createGame").show();
				});
				$("#notice").html("Game has not been created. You may create it now.").css({color: "orange"});
			}	
			$notice.slideDown("fast");
		}
	});
}

function createGame(nickname, id, color){
	$("#searchGame, #joinGame").hide();
	$.ajax({
		url: "/createGame",
		type: "GET",
		data: {
			gameID: id,
			nickname: nickname,
			color: color
		},
		dataType: "json",
		success: function(resp){
			console.log(resp);
			var $notice = $("#notice");
			var $search = $("#searchGame");
			var $join = $("#joinGame");
			
			if (resp.status == "OK"){		
				var msg1 = "Creating Game: <b>" + id + "</b>";
				var msg2 = msg1;
				var count = 0;
				dots = setInterval(function(){
					msg2 += ".";
					if (count == 5){
						count = 0;
						msg2 = msg1;
					}
					$("#notice").html(msg2).css({color: "green"});
					count++;
				},300);
				$notice.hide().html(msg1).css({color: "green"}).fadeIn();		
				
				setInterval(function(){
					checkAvailability(id, nickname);
				}, 1000);						
			}
		}
	});
}

function checkAvailability(id, nickname){
	$.ajax({
		url: "/findGame",
		type: "GET",
		data: {
			gameID: id,
			nickname: nickname,
		},
		dataType: "json",
		success: function(resp){
			if (resp.status.game == "running"){
				$("html").fadeOut(600, function(){
					window.location = "index.jsp?gameID=" + id.toUpperCase() + "&nickname=" + nickname;
				});
			}
		}
	});
}

function inputValidation($input, event){
	var text = $input.val();
	var key = event.keyCode;
	var maxLength = 50;
	var $error; 
	if (key == 35 || key == 36 || key == 37 || key == 39 || key == 8 || key == 46 || key == 16 || (key >= 65 && key <= 90) ){ //if the key was arrows, delete, backspace, home, end, just end the function
		return;
	}
	$error = $("#inputError");
	var re = /[.?&*^$%#@()!~`\/\\<>,:;+=_'\[\]\{\}"|]/g 
	var badChar = false;
	if (re.test(text)){
		badChar = true;
		var match = text.match(re);
		var verbage = "";
		if (match.length == 1){
			verbage = " is not allowed.";
		} else {
			verbage = " are not allowed."
		}
		$error.html(match + verbage);
		text = text.replace(re, "");
	}
	var space = /\s/g;
	if (space.test(text)){
		badChar = true;
		var html = $error.html();
		html = "  Space converted to \"-\"";
		$error.html(html);
		text = text.replace(space, "-");
	}
	
	if (!badChar){
		return;
	}
	clearTimeout(fadeOut);
	$("#inputError").stop().show();
	$("#inputError").stop().animate({opacity: 1}, 100, function(){
		fadeOut = setTimeout(function(){
			$("#inputError").stop().animate({opacity: 0}, 1500, function(){
				$("#inputError").html(" ");
			});
		}, 1000);
	});
	$input.val(text);
}
window.fadeOut = setTimeout(function(){
	$("#inputError").stop().animate({opacity: 0}, 1500);
}, 1500);


function formatDate(incoming){
	var rawtime = new Date(incoming);
	var formattedDate = $.datepicker.formatDate('DD, MM d, yy', rawtime);
	
	var hours = rawtime.getHours();
	var period = "am";
	if (hours > 12){
		hours = Number(hours - 12);
		period = "pm"
	}
	
	var formattedTime = hours + ":" + addLeadingZero( rawtime.getMinutes() ) + ":" + addLeadingZero( rawtime.getSeconds() ) + " " + period;	
	
	return formattedDate + " at " + formattedTime;
}
function addLeadingZero(number){ number = Number(number); if (number < 10){ number = "0" + number.toString();} else { number = number.toString();}	return number;}

function getRecentGames(){
	var recentGames = [];
	if ( "recentGames" in localStorage ){
		recentGames = JSON.parse( localStorage.recentGames );
	}
	return recentGames;
}

function buildRecentGamesList(){
	var recentGames = localStorageManager.recentGames;
	recentGames.sort(dynamicSort("date"));
	var $list = $("#recentGames");
	for (var i=0; i < recentGames.length; i++){
		var recentGame = recentGames[i];
		$("#recentGames").prepend( 
			$("<li>").html( $("<a>").html(recentGame.gameID).attr("href", "/index.jsp?gameID=" + recentGame.gameID + "&nickname=" + recentGame.nickname ).css({color: recentGame.color, borderColor: recentGame.color})
				.append( 				
					" | <span style='color:"+ recentGame.color +"'>" + recentGame.nickname + "</span>" + "<span style='color:black'> (" + formatTimestamp(recentGame.date, "elapsed") + ") </span>" )
		)
		);
	}
	if ( recentGames.length > 0){
		$("#recentGames").prepend($("<h3>").html("Your Recent Games") );
	}
}

function formatTimestamp(incoming, type){
	var now = new Date();
	var timestamp = "";
	
	if (type == "elapsed"){
		//format the timestamp based on how long ago the message was recieved compared to current time
		var millsAgo = now.getTime() - Number(incoming);
		var secondsAgo = Math.floor((now.getTime() - Number(incoming))/1000);
		millsAgo = millsAgo - secondsAgo;
		var minsAgo = Math.floor(secondsAgo/60);
		secondsAgo = secondsAgo - minsAgo*60;
		var hoursAgo = Math.floor(minsAgo/60);
		minsAgo = minsAgo - hoursAgo;
		var daysAgo = Math.floor(hoursAgo/24);
		hoursAgo = hoursAgo - daysAgo;
		
		if (daysAgo > 0){
			timestamp = daysAgo + " days ago";
		} else if (hoursAgo < 24 && hoursAgo > 0){
			if (hoursAgo > 1){
				timestamp = hoursAgo + " hours ago";
			} else {
				timestamp = hoursAgo + " hour ago";
			}
		} else  if (minsAgo < 60 && minsAgo > 0){
			if (minsAgo > 1){
				timestamp = minsAgo + " minutes ago";
			}
			else {
				timestamp = minsAgo + " minute ago";
			}
		}else if (secondsAgo >= 30){
			timestamp = "less than a minute ago";
		} else { 
			timestamp = "seconds ago"; 
		}
	} else if (type == "date"){
		var rawtime = new Date(incoming);
		var formattedDate = $.datepicker.formatDate('DD, MM d, yy', rawtime);
		
		var hours = rawtime.getHours();
		var period = "am";
		if (hours > 12){
			hours = Number(hours - 12);
			period = "pm"
		}
		
		var formattedTime = hours + ":" + addLeadingZero( rawtime.getMinutes() ) + ":" + addLeadingZero( rawtime.getSeconds() ) + " " + period;	
		timestamp = formattedDate + " at " + formattedTime;	
	}	 
	return timestamp;
}


function dynamicSort(property) {
    return function (a,b) {
        return (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    }
}

function getUrlParameters() {
	var params = function() {
		// This function is anonymous, is executed immediately and
		// the return value is assigned to QueryString!
		var query_string = {};
		var query = window.location.search.substring(1);
		var vars = query.split("&");
		for ( var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			// If first entry with this name
			if (typeof query_string[pair[0]] === "undefined") {
				query_string[pair[0]] = pair[1];
				// If second entry with this name
			} else if (typeof query_string[pair[0]] === "string") {
				var arr = [ query_string[pair[0]], pair[1] ];
				query_string[pair[0]] = arr;
				// If third or later entry with this name
			} else {
				query_string[pair[0]].push(pair[1]);
			}
		}
		return query_string;
	}();
	return params;
}

