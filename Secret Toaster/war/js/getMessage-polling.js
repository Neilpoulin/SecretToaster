function getMsg(status){
	var offline = $("#offlineMode").is(":checked");
	if (offline){
		console.log("offline mode...not checking server");
	}else{
		getMsgCount++;
		var params = getUrlParameters();
		$.ajax({
			url: "/chat",
			type: "GET",
			data: {
				gameID: params.gameID,
				nickname: params.nickname,
				lastCheck: lastCheck,
				status: status
			},
			dataType: "json",
			success: function(resp){
				var params = getUrlParameters();
				var $target = $("#global_messages div.chat.messages");
				var $info;
				var $msg;
				console.log(resp);
				if ("players" in resp){
					newPlayers = [];
					removePlayers = [];
					if (playersObject != resp.players){							
						for (var i=0; i < resp.players.length; i++){  //go through all of the server responded players and compare to "current" players to see if anyone has been added
							var add = true;
							for (var j = 0; j < playersObject.length; j++){
								if (playersObject[j].nickname == resp.players[i].nickname){
									add = false;
									break;
								}
							}
							if (add){
								newPlayers.push(resp.players[i].nickname);
							}
						}						
						for(var i = 0; i < playersObject.length; i++){ //go through all of the "current" players to check for players that have left compared to the server player list
							var remove = true;
							for (var j=0; j < resp.players.length; j++){
								if (resp.players[j].nickname == playersObject[i].nickname){
									remove = false;
									break;
								}
							}
							if (remove){
								removePlayers.push(playersObject[i].nickname);
							}
						}
						playersObject = resp.players;
						buildgameChat();
					}			
				}
				if ("error" in resp){
					$msg = $("<p>").addClass("incoming message");
					$msg.addClass("incoming error");
					$msg.html("error: " +resp.error);
					$target = $("div[id$='_messages'] div.chat.messages");
					var scroll = false;
					if ($target[0].scrollHeight - $target.scrollTop() == $target.outerHeight()){
						scroll = true;
					}
					$target.append($msg);
					if (scroll){
						scrollBottom($target);
					}
				} else {					
					if (resp.chat.length == 0){
						var timestamp = formatTimestamp(new Date().getTime(), "elapsed");
						$msg = $("<p>").addClass("incoming lastcheck message");
						var newMsg = "No new messages. Last checked <span class='lastcheck formatted'>" 
							+ timestamp +"</span><span class='date hidden lastcheck'>" + new Date().getTime() + "</span>"; 											
						$msg.html(newMsg);
						$target = $("div[id$='_messages'] div.chat.messages");
						
						var scroll = false;
						if ($target[0].scrollHeight - $target.scrollTop() == $target.outerHeight()){
							scroll = true;
						}
						$target.find("p.lastcheck").remove();
						$target.append($msg);
						if (scroll){
							scrollBottom($target);
						}
					} else {
						lastCheck = resp.time;
						for (var i=0; i< resp.chat.length; i++){
							// get incoming chat messages from server. Only new messages (not sent before) are returned, so we should display all that arrive.
							// times are formatted as milliseconds. 
							var incoming = resp.chat[i];					
							//set message contents
							$msg = $("<p>").addClass("incoming message");
							var timestamp = formatTimestamp(incoming.date, "elapsed");
							var newMsg = "<span class='nickname'>" + incoming.from + "</span>" + "<span class='timestamp date hidden'>" 
								+ incoming.date + "</span><span class='timestamp formatted enclosed'>" + timestamp + "</span>";
												
							var me = getUrlParameters().nickname;
							if (incoming.from == me){
								$msg.addClass("me");
							}
							for (var q = 0; q < playersObject.length; q++){				
								if (playersObject[q].nickname == incoming.from && incoming.type != "global" ){ //if a player has left, send their messages to a log file
									console.log("message from player: " + incoming.from + " sent to log as they are no longer in the game");
									continue;
								}
							}	
							//decide where to post each message based on message type and player name
							if (incoming.type == "player"){  								
								if (incoming.from == me){
									$target = $("div[id^='" + incoming.to + "_messages'] div.chat.messages");
									$info = $("li[id^='"+ incoming.to + "'] div.groupInfo");
								} else{
									$target = $("div[id^='" + incoming.from + "_messages'] div.chat.messages");
									$info = $("li[id^='"+ incoming.from + "'] div.groupInfo");
								}																				
							} else if (incoming.type == "global"){
								$target =  $("div[id='global_messages'] div.chat.messages");
								$info = $("li[id^='global'] div.groupInfo");
							} else if (incoming.type == "alliance"){
								$target =  $("div[id='alliance_messages'] div.chat.messages");
								$info = $("li[id^='alliance'] div.groupInfo");
							}	
							newMsg += incoming.message;
							$msg.html(newMsg);
							$target.find("p.sent.temp").remove();
							var scroll = false;
							var scrollHeight = $target.get(0).scrollHeight || 0;
							var scrollTop = $target.scrollTop() || 0;
							var outerHeight = $target.outerHeight() || 0;
							
							if (scrollHeight - scrollTop == outerHeight){
								scroll = true;
							}
							$target.append($msg);
							if (incoming.from != me){
								newNotice($info);
							}
							if (scroll){
								scrollBottom($target);
							}
						}
					}								
				}		
				toggleTimestamps();		
			}
		}); //**End ajax
	}// **End if offline	
}
