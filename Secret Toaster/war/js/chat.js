window.updateTimeStamp = setInterval("refreshStamp()", 1000);
window.request = getUrlParameters();

$(document).ready( function(){
	addChatListeners();
	$("div.chatWindow").hide();
	openChat();
	
	toggleTimestamps();
	$("#timestamp").change(function(){
		toggleTimestamps();
	});
	
	$("button.getMessages").click(function(){
		getMsg();
	});
	window.lastCheck = 0;
	window.playersObject = [];
	window.newPlayers = [];
	window.removePlayers = [];
	idleSetup();
});

function idleSetup(){
	var msgCheckShort = 10000; //10 seconds - no longer checking messages
	var msgCheckLong = 20000; //20 seconds  -no longer checking messages like this. 
	var idleTimer = 300; // 5 minutes
	var idleWarnTime = 30; //15 seconds
	//initialize message check interval
	
	//set Timeout to display elapsed time form last message check
	setInterval("refreshLastChecked()", 1000);
	
	//initialize the JQuery UI Dialog properties to display when user is idle
	$("#timeoutDialog").dialog({
		autoOpen: false,
		modal: true,
		closeOnEscape: false,
		draggable: false,
		resizable: false,
		position: "middle",		
		title: "Idle",
		open: function(event, ui){ 
			$( "#idleTimestamp" ).html( formatTimestamp( new Date().getTime(), "date" ) ); 
		},
		buttons: {
			'I\'m back!': function(){ $(this).dialog('close'); },
			'Quit': function(){	$(this).dialog('close'); logout(); }
		}
	});
	$("#timeoutDialog").parent().addClass("idle");
	
	// start the idleTimeout plugin
	$.idleTimeout('#timeoutDialog', 'div.idle div.ui-dialog-buttonpane button:first', {
		idleAfter: idleTimer, // time elapsed of no movement for user to be considered idle (seconds)
		warningLength: idleWarnTime,
		onIdle: function(){	
			$("#idleDialog").slideDown();			
		},	
		onCountdown: function(counter){			
			$("#idleDialog").html("<p>You will be idle in " + counter + " seconds");			
		},
		onTimeout: function(){	 
			$(this).dialog("open");
			socket.close();
			$("head title").html("You are Idle | SecretToaster");
			postActive(false);
		},	
		onResume: function(){	 
			$("#idleDialog").slideUp();
			getToken();
			getMsg();
			game.getHexagon(1).shape.simulate("click");
			postActive(true);
		}
	});
	
	//bind a listener for when the event active.idleTimer is fired
	$(document).bind("active.idleTimer", function(){
		// if the timeoutDialog box is NOT visible, then click "i'm back" button
		if ( !$("#timeoutDialog").is(":visible") ){
			$("div.ui-dialog-buttonpane button:first").click();
		}	
	});
	
	getMsg(); //load messages saved to the datastore. This is the only time we do this. 
	
} //end document ready function

function toggleTimestamps(){	
	clearInterval(updateTimeStamp);
	if ($("#timestamp").is(":checked")){
		$(".timestamp.formatted:not(.lastcheck)").removeClass("hidden");
		updateTimeStamp = setInterval("refreshStamp()", 1000);
		
	} else {
		$(".timestamp.formatted").addClass("hidden");
		clearInterval(updateTimeStamp);
	}
}

function refreshLastChecked(){
	$.each($("span.date.lastcheck"), function(index, obj){
		var html = formatTimestamp($(obj).html().trim(), "elapsed");
		$(obj).siblings("span.lastcheck.formatted").html(html);
	});
}

function refreshStamp(){
	$.each($("span.timestamp.date"), function(index, obj){
		var html = formatTimestamp($(obj).html().trim(), "elapsed");
		$(obj).siblings("span.timestamp.formatted").html(html);
	});
}

function buildgameChat(){
	var me = request.nickname;
	for (var i=0; i< newPlayers.length; i++){
		var player = newPlayers[i];
		if (player.nickname_ == me){
			newPlayers.splice(newPlayers.indexOf(me), 1);
		}
	}
	var buildList = newPlayers;
	//console.log(buildList);
	for (var i=0; i < buildList.length; i++){
		var player = buildList[i];
		//console.log(player);
		var $playerLI = $("#gameChatTemplate").clone();
		$playerLI
			.attr("id", player.nickname_ + "_chat")
			.find("div.groupInfo > p.player.name.chat")
				.html( player.nickname_ ).css({color: player.color_ })
					.siblings("div.playerLogo").css({ background: player.color_ });				
		$("#chatList").append($playerLI);
		
		var $playerMessages = $("#chat_messagesTemplate").clone();
		$playerMessages
			.attr("id", player.nickname_ + "_messages")
			.find("textarea.chat")
				.attr("placeholder", "Message to " + player.nickname_);
		$("#gameChat").append($playerMessages);
	}
	if (removePlayers.length > 0){
		for (var i = 0; i < removePlayers.length; i++){
			var player = removePlayers[i];
			var $chat = $("#" + player.nickname_ + "_chat");
			var $messages = $("#" + player.nickname_ + "_messages");
			if ($chat.children(".groupInfo").hasClass("selected")){
				$("#global_chat div.groupInfo").click();
				setTimeout(function(){
					removeItem();
				}, 1500)
			} else {
				removeItem();
			}
			function removeItem(){
				$chat.effect("slide", { direction: "right", mode: "hide"},500, function(){
					$chat.remove();
					$messages.remove();	
					setListSizes();
				});
			}
		}
		removePlayers = [];
	} else {
		setListSizes();
	}			
}

function setListSizes(){
	var $chatList = $("#chatList");
	var listLength = $chatList.children("li").length;
	var chatHeight = $chatList.height();
	var setHeight = Math.floor(chatHeight/listLength);
	var extra = chatHeight - setHeight * listLength;
	$chatList.children("li").height(setHeight);
	$chatList.children("li:last").height(setHeight + extra);
	
	addChatListeners();
	newPlayers = [];
}

function addChatListeners(){
	
	$("div.groupInfo").unbind( "click" ).click(function(){		
		var $clicked = $(this);
		var selected = $clicked.hasClass("selected");
		$("div.groupInfo").removeClass("selected");
		if (!selected){
			$(this).addClass("selected");		
		} else{
			$("div.groupInfo:first").addClass("selected");
		}
		openChat();
		removeNotice( $(this) );
	}); //end player info click function	
	
	$("textarea.chat").unbind("keyup").bind("keyup", function(l){
		if(l.keyCode == 13){
			sendMsg($(this).siblings("div.chat.messages"), $(this));
		}
	});
	$("textarea.chat").unbind("focus").focus(function(){
		removeNotice($(this).parent().siblings("div.groupInfo"));
	});
}

function scrollBottom($content, animate){
	if (animate || animate == null || animate == undefined){
		$content.each(function(index, obj){
			$(obj).animate({scrollTop: $(obj)[0].scrollHeight},1500)
		});
	} else {
		$content.each(function(index, obj){
			$(obj).animate({scrollTop: $(obj)[0].scrollHeight}, 0);
		});
	}
}

function openChat(){
	var $open = $("div.groupInfo.selected");
	var id = $open.parent().attr("id").split("_")[0];
	id = id + "_messages";
	var $messages = $("#" +id);
	var $others = $('div.chatWindow[id!="' + id+'"]');	
	$messages.show();
	$messages.find("textarea").focus();
	$others.hide();
	scrollBottom( $messages.children("div.chat.messages"), false );
}

function messageResize( $obj ){
	var parentH = $obj.parent().height();
	var txtH = $obj.height();
	$obj.css({ maxHeight: .5*parentH });
	$obj.siblings( "div.chat.messages" ).css({ height: parentH - txtH - 20 });
}

function newNotice($obj){
	$obj.each(function(index, obj){
		var $target = $(obj);
		if ($target.find("img.msgNotice").length == 0){
			$target.append(	$("<img>").attr("src", "data/icons/Message.png").addClass("msgNotice") );
			var $img = $target.find("img:last"); 
			$img.css("-webkit-animation-playstate", "paused").hide();
			$img.fadeIn( function(){ $img.css("-webkit-animation-playstate", "running"); });
			setTimeout(function(){
				if ($target.hasClass("selected") || ($target.siblings().find("textarea:focus").length > 0) ){ removeNotice($target); }
			}, 1000);					
			$target.click(function(){ removeNotice($target); });
		} else {
			var $img = $target.find("img:last"); 
			$img.css("-webkit-animation-playstate", "paused").hide();
			$img.fadeIn(0, function(){ $img.css("-webkit-animation-playstate", "running"); });		
		}	
	});
}

function removeNotice($target){
	var $img = $target.find(".msgNotice"); //.fadeOut("fast", function(){$(this).remove()});
	var playState = 'animation-play-state';
	$img.css(playState, function(i, v) { return v === 'paused' ? 'running' : 'paused'; }); 
	$img.fadeOut( function(){ $img.remove(); });
}

function sendSystemMsg( message ){
	var params = getUrlParameters();
	$.ajax({
		url: "/chat",
		type: "POST",
		data: {
			message: message,
			gameID: params.gameID,
			nickname: "System",
			type: "global",
			to: "global"
		},
		dataType: "json",
		success: function(resp){ 
			
		}
	});
}

function sendMsg($target, $msg){
	var message = $msg.val();
	var params = getUrlParameters();
	$msg.val("");
	var $sentTest = $("<p>").addClass("sent temp message");
	var htmlTest = "<span class='nickname'>" + params.nickname + "</span>" + message;			
	$sentTest.html(htmlTest);

	var scroll = false;
	if ( $target[0].scrollHeight - $target.scrollTop() == $target.outerHeight() ){ scroll = true; }
	if (scroll){ scrollBottom($target);	}
	toggleTimestamps();
	$.ajax({
		url: "/chat",
		type: "POST",
		data: {
			message: message,
			gameID: params.gameID,
			nickname: params.nickname,
			type: $target.attr("name"),
			to: $msg.parent().attr("id").split("_")[0]
		},
		dataType: "json",
		success: function(resp){ }
	});	 //**End Ajax
} 

window.getMsgCount = 0
function getMsg(){
	var offline = $("#offlineMode").is(":checked");	
		getMsgCount++;
		var params = getUrlParameters();
		$.ajax({
			url: "/chat",
			type: "GET",
			data: {
				gameID: params.gameID,
				nickname: params.nickname,
				lastCheck: lastCheck,
			},
			dataType: "json",
			success: function(resp){
				processAllMessages( resp );
			}
		}); //**End ajax	
}

function processAllMessages( resp ){
	var params = getUrlParameters();
	var $target = $("#global_messages div.chat.messages");
	var $info;
	var $msg;
	//game = resp.game;
	//game.updateGame(resp.game);
	//console.log(resp);
	if ("players" in resp){
		newPlayers = [];
		removePlayers = [];
		if (playersObject != resp.players){							
			for (var i=0; i < resp.players.length; i++){  //go through all of the server responded players and compare to "current" players to see if anyone has been added
				var player = resp.players[i];
				if (player.nickname_ == params.nickname ){
					$("#toolbar").css({backgroundImage: "-webkit-linear-gradient(top, white -150%, " + player.color_ + " 125%)"});
				} else {								
					$("li[id='" + player.nickname_ + "_chat'] div.groupInfo").css({color: player.color_});
				}
				var add = true;
				for (var j = 0; j < playersObject.length; j++){
					if ( playersObject[j].nickname_ == resp.players[i].nickname_){
						add = false;
						break;
					}
				}
				if (resp.players[i].nickname_ == params.nickname){
					add = false;
				}
				if (add){
					newPlayers.push(resp.players[i]);
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
		if (resp.newMessages.length == 0){
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
			//if there are new message, do this
			lastCheck = resp.time;
			for (var i=0; i< resp.newMessages.length; i++){
				// get incoming chat messages from server. Only new messages (not sent before) are returned, so we should display all that arrive.
				// times are formatted as milliseconds. 
				var incoming = resp.newMessages[i];	
				$msg = $("<p>").addClass("incoming message");
				var timestamp = formatTimestamp(incoming.date_, "elapsed");
				if ("from_" in incoming){
					//set message contents
					var newMsg = "<span class='nickname'>" + incoming.from_.nickname_ + "</span>" + "<span class='timestamp date hidden'>" 
						+ incoming.date_ + "</span><span class='timestamp formatted enclosed'>" + timestamp + "</span>";
										
					var me = getUrlParameters().nickname;
					if (incoming.from_.nickname_ == me){
						$msg.addClass("me");
					}
					for (var q = 0; q < playersObject.length; q++){				
						if (playersObject[q].nickname == incoming.from_.nickname_ && incoming.type_ != "GLOBAL" ){ //if a player has left, send their messages to a log file
							continue;
						}
					}
				} else {
					//if there is no "from"
				}
					
				//decide where to post each message based on message type and player name

				if (incoming.type_ == "PLAYER"){  																											
					if (incoming.from_.nickname_ == me){
						$target = $("div[id^='" + incoming.to_.nickname_ + "_messages'] div.chat.messages");
						$info = $("li[id^='"+ incoming.to_.nickname_ + "'] div.groupInfo");
					} else{
						$target = $("div[id^='" + incoming.from_.nickname_ + "_messages'] div.chat.messages");
						$info = $("li[id^='"+ incoming.from_.nickname_ + "'] div.groupInfo");
					}																
				} else if (incoming.type_ == "GLOBAL"){
					$target =  $("div[id='global_messages'] div.chat.messages");
					$info = $("li[id^='global'] div.groupInfo");
				} else if (incoming.type_ == "ALLIANCE"){
					$target =  $("div[id='alliance_messages'] div.chat.messages");
					$info = $("li[id^='alliance'] div.groupInfo");
				}	
				newMsg += incoming.message_;
				$msg.html(newMsg);
				$target.find("p.sent.temp").remove();
				try{
					var scroll = false;
					var scrollHeight = $target.get(0).scrollHeight || 0;
					var scrollTop = $target.scrollTop() || 0;
					var outerHeight = $target.outerHeight() || 0;
					
					if (scrollHeight - scrollTop == outerHeight){
						scroll = true;
					}
					
					if(incoming.from_ != null){
						if (incoming.from_.color_ != null){
							$msg.css("color", incoming.from_.color_);
						}
						$target.append($msg);
					}
					
					if (incoming.from != me){
						newNotice($info);
					}
					if (scroll){
						scrollBottom($target);
					}		
				} catch (e){
					//console.log(e);
				}	
			}
		}								
	}		
	toggleTimestamps();		
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

function addLeadingZero(number){ number = Number(number); if (number < 10){ number = "0" + number.toString();} else { number = number.toString();}	return number;}

function getUrlParameters(){
	var params = function () {
		  // This function is anonymous, is executed immediately and 
		  // the return value is assigned to QueryString!
		  var query_string = {};
		  var query = window.location.search.substring(1);
		  var vars = query.split("&");
		  for (var i=0;i<vars.length;i++) {
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
		} ();
	return params;
}

function getToken(){
	var params = getUrlParameters();
	$.ajax({
		url: '/channel',
		type: "GET",
		data: {nickname: params.nickname, gameID: params.gameID},
		dataType: "json",
		success: function(resp){
			var token = resp.token			
			openChannel(token);
		}
	});
}

function closeChannel(){
	//console.log("channel closing...");
	socket.close();
}

function openChannel(token){
	//console.log("channel opening...");
	channel = new goog.appengine.Channel(token);
    socket = channel.open();
    socket.onopen = onOpened;
    socket.onmessage = onMessage;
    socket.onerror = onError;
    socket.onclose = onClose;
}

function onOpened(){
	//console.log("channel opened");
	$("#openChannel").hide();
}

function onMessage(resp){
	//console.log("new message recieved");
	var incoming = JSON.parse(resp.data);
//	console.log(incoming);
	if ("command" in incoming){
		game.command( incoming.command );
	}
	
	if ( "login" in incoming ){
		//console.log(incoming.login.nickname_ + " - LOGGED IN");
		newPlayers.push(incoming.login);
		playersObject.push(incoming.login);
		buildgameChat();
		systemMessage(incoming.login.nickname_ + " has joined the game.");
	} else if ( "logout" in incoming ){
		//console.log(incoming.logout.nickname_ + " - LOGGED OUT");
		removePlayers.push(incoming.logout);
		buildgameChat();
		for (var i=0; i< playersObject.length; i++){
			if (playersObject[i].nickname_ == incoming.logout.nickname_){				
				playersObject.splice(i, 1);
			}
		}
		systemMessage(incoming.logout.nickname_ + " has left the game.");
	} else if ("chat" in incoming){
		if ("from_" in incoming.chat && incoming.chat.from_.nickname_ != "System"){
			newMessage(incoming.chat);
		} else {
			systemMessage(incoming.chat.message_);
		}
			
	}
}

function onError(error){
	//console.log("channel error");
	//console.log(error);
}

function onClose(){
	//console.log("channel closed");
	//$("#openChannel").show();
}

function systemMessage(message){
	var $msg = $("<p>").addClass("incoming message system");
	var date = new Date();
	var timestamp = formatTimestamp(date, "elapsed");
	var newMsg = "";
	newMsg= /*"<span class='nickname'>" + "SYSTEM" + "</span>" + */"<span class='timestamp date hidden'>" 
		 	+ date + "</span><span class='timestamp formatted enclosed'>" + timestamp + "</span>";	

	$target =  $("div[id='global_messages'] div.chat.messages");
	$info = $("li[id^='global'] div.groupInfo");
	
	$content = $("<span>").html(message);	
	$msg.html(newMsg);
	$msg.append($content);
	$target.append($msg);
	if ( scroll( $target ) ){
		scrollBottom( $target );
	}
	
	toggleTimestamps();
	newNotice($info);
}

function newMessage(incoming){
	//this is run every time a message is pushed to the user. Only one message can be returned at a time, so no loops are required.
	//set message contents
	$msg = $("<p>").addClass("incoming message");
	var timestamp = formatTimestamp(incoming.date_, "elapsed");
	lastCheck = incoming.date_;
	var newMsg = "";
	try{
		 newMsg= "<span class='nickname'>" + incoming.from_.nickname_ + "</span>" + "<span class='timestamp date hidden'>" 
		 	+ incoming.date_ + "</span><span class='timestamp formatted enclosed'>" + timestamp + "</span>";	
	}catch(e){
		$msg.addClass("system");
		newMsg= "<span class='nickname'>" + "system" + "</span>" + "<span class='timestamp date hidden'>" 
	 		+ incoming.date_ + "</span><span class='timestamp formatted enclosed'>" + timestamp + "</span>";
		
		console.log(e);
	}
							
	var me = getUrlParameters().nickname;
	if (incoming.from_ == me){
		$msg.addClass("me");
	}
	for (var q = 0; q < playersObject.length; q++){				
		if (playersObject[q].nickname == incoming.from_ && incoming.type_ != "global" ){ //if a player has left, send their messages to a log file
			continue;
		}
	}	
	//decide where to post each message based on message type and player name	
	window.incoming = incoming;
	if (incoming.type_ == "PLAYER"){  								
		if (incoming.from_.nickname_ == me){
			$target = $("div[id^='" + incoming.to_.nickname_ + "_messages'] div.chat.messages");
			$info = $("li[id^='"+ incoming.to_.nickname_ + "'] div.groupInfo");			
		} else{
			$target = $("div[id^='" + incoming.from_.nickname_ + "_messages'] div.chat.messages");
			$info = $("li[id^='"+ incoming.from_.nickname_ + "'] div.groupInfo");
		}																				
	} else if (incoming.type_ == "GLOBAL"){
		$target =  $("div[id='global_messages'] div.chat.messages");
		$info = $("li[id^='global'] div.groupInfo");
	} else if (incoming.type_ == "ALLIANCE"){
		$target =  $("div[id='alliance_messages'] div.chat.messages");
		$info = $("li[id^='alliance'] div.groupInfo");
	}	
	newMsg += incoming.message_;
	$msg.html(newMsg);
	$target.find("p.sent.temp").remove();

	try{
		$msg.css("color", incoming.from_.color_);
	} catch(e){
		$msg.css("color", "red");
	}
	//$msg.css("color", incoming.from_.color_);
	$target.append($msg);
	toggleTimestamps();
	try{
		if (incoming.from_.nickname_ != me){
			newNotice($info);
		}
	} catch(e){
		console.log(e);
		newNotice($info);
	}
	if ( scroll( $target ) ){
		scrollBottom($target);
	}
}

function scroll($target){
	var scroll = false;
	var scrollHeight = $target.get(0).scrollHeight || 0;
	var scrollTop = $target.scrollTop() || 0;
	var outerHeight = $target.outerHeight() || 0;	
	
	//if the content is scrolled within 50px of the bottom, then scroll
	if (scrollHeight - scrollTop - 50 <= outerHeight){
		scroll = true;
	}
	return scroll;
}


