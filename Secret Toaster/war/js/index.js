
$("#mouseTip").hide();
$("#actionDialog").draggable().hide();
$("#moveDiv").hide();
$("#fortifyDiv").hide();
$("#idleDialog").hide();
var localStorageManager = new LocalStorageManager();
var shareType = {
		SELF: "SELF",
		INVITE: "INVITE"
}
var notificationType = {
		PLAYER_JOIN: "PLAYER_JOIN", 
		PLAYER_QUIT: "PLAYER_QUIT", 
		PLAYER_IDLE: "PLAYER_IDLE",
		PLAYER_READY: "PLAYER_READY", 
		PLAYER_ACTIVE: "PLAYER_ACTIVE", 
		GAME_ROUNDSTART: "ROUND_START"
}
var emailType = {
		SHARE: shareType,
		NOTIFICATION: notificationType
}

$(document).ready(function(){
	validateGame();
	$("head title").html(getUrlParameters().nickname + " | " + getUrlParameters().gameID + " | SecretToaster");
	$("#about").button();
	$("#orderButtonset").buttonset();	
	$("#orderButtonset input").change(function(){
//		game.getHexagon(0).shape.simulate("click");
//		eventManager.clear();
		eventManager.update();
//		highlightAvailableStarts();
	});
	$("#actionDialog button").click(function(){
		$("#orderType").val( $(this).text() );
		
		submitOrder();
		$("#orderType").val("");
		$("#actionDialog").hide();
		$("input[name='orders']:checked").next().next().button("enable")
		$("input[name='orders']:checked").next().next().click().button("refresh");
		$("#orderButtonset").buttonset("refresh");
	});
	
	$("#newsDialog").dialog({
		autoOpen: false,
		title: "News",
		width: "600",
		height: "500",
		buttons: {
			OK: function(){
				$("#newsDialog").dialog("close");
			}
		}	
	});
	$("#settingsDiv").dialog({
		autoOpen: false,
		title: "Settings",
		width: 450,
		buttons: {
			Done: function(){
				var $email = $("#noticeEmail");
				if ($("#emailNotificationSettings input:checked").length > 0 && ! validateEmail( $email.val() ) ){
					updateTips("Please enter a valid email");
					$email.addClass("ui-state-error");
				} else{
					$email.removeClass("ui-state-error");
					localStorage.emailAddress = $("#noticeEmail").val();
					localStorage.emailName = $("#noticeName").val();
					$( "#settingsDiv" ).dialog( "close");
				}
			}
		}, open: function(event, ui){
			$("#noticeEmail").val( localStorage.emailAddress );
			$("#noticeName").val( localStorage.emailName );
		}, close: function(event, ui){
			
		}
	});
	
	$("#shareDiv").dialog({
		autoOpen: false,
		title: "Share",
		width: 500,		
		buttons: {
			Cancel: function(){
				$(this).dialog("close");
			}, Send: function(){
				if ( validateShareInfo() ){
					sendShareEmail( $("#emailFrom").val(), $("#nameFrom").val(), $("input[name='shareType']:checked").val(), $("#emailTo").val(), $("#nameTo").val() );
					//localStorage.emailAddress = $("#emailFrom").val();
					//localStorage.emailName = $("#nameFrom").val();
					$(this).dialog("close");
				} else {
					//alert("there were errors in the info");
				}
			}
		}, open: function(event, ui){
			$("#shareDiv").parent().focus();
			$("#recipientInfo").hide();
			$( "#senderInfo").show();
			$("#emailFrom").val(localStorage.emailAddress);
			$("#nameFrom").val(localStorage.emailName);
		}, close: function(event, ui){
			$("#shareDiv input:radio").removeAttr("checked").button("refresh");
			$("#shareMe").attr("checked", "checked").button("refresh");
			$("#shareDiv input[id$='To']").val("");
			$("#shareDiv .ui-state-error, #shareDiv .ui-state-highlight").text("").removeClass("ui-state-error ui-state-highlight");			
		}			
	});
	
	$("#zoomFieldset").width( $("#orderButtonset").width() );
}); //end document ready function

function validateGame(){
	$.ajax({
		url: "/validate",
		type: "GET",
		data: {
			nickname: getUrlParameters().nickname,
			gameID: getUrlParameters().gameID
		},success: function(resp){			
			if ( $.trim(resp) == "true" ){
				initialize();
			} else{
				localStorageManager.removeGameLog( getUrlParameters() );
				window.location = "/invalid.jsp";
			}
		} 	
	});
}

function initialize(){
	if ( getUrlParameters().gameID == "SAMPLE"){
		$("#logout").click(function(){
			window.location = "/lobby.jsp";
		})
	} else {
		$("#logout").click(function(){
			logout();
		});
	}
	
	$(window).resize(function(){
		position();
		$("textarea.chat").each(function(index, obj){
			messageResize( $(obj) );
		});
	});
	position();
	
	$("#gameCanvas, #game_container").bind("mouseout mouseleave", function(){
		$("#mouseTip").hide();
	});
	
	$("#nickname").html( getUrlParameters().nickname );
	$("#gameID").html( getUrlParameters().gameID.toLowerCase() );
	$("#gameRound").html( game.round );
	$("button, input:checkbox").button();
	getToken();
	game.updateGame();	
	
	$("#logout").button("option", "text", false);
	$("#logout").button("option", "icons", {primary:'ui-icon-mylogout'});
	
	$("#about").button("option", "text", false);
	$("#about").button("option", "icons", {primary:'ui-icon-myinfo'});
	
	$("#share").button("option", "text", false);
	$("#share").button("option", "icons", {primary:'ui-icon-myshare'});
	$("#share").click(function(){
		$("#shareDiv").dialog("open");
	});
	
	$("#shareTypeButtonset").buttonset();
	$("#shareDiv input:radio").change(function(){
		$("#shareDiv input:text, #shareDiv input[type='email']").each(function(index, obj){
			//$(obj).val("");
		});
		
		if ($("input[name='shareType']:checked").val() == "SELF"){
			$("#recipientInfo").slideUp();
			$("#senderInfo").slideDown();
		} else if ($("input[name='shareType']:checked").val() == "INVITE"){
			$("#recipientInfo").slideDown();
			$("#senderInfo").slideDown();
		}
	});
	$("#shareTypeButtonset").css("textAlign", "center");
	
	$("#settings").button("option", "text", false);
	$("#settings").button("option", "icons", {primary:'ui-icon-mygear'});
	$("#settings").click(function(){
		$("#settingsDiv").dialog("open");
	});
	
	$("#emailNotificationSettings input").change(function(){
		var $chk = $(this);
		var value = false;
		var type = $chk.val();
		if ($chk.is(":checked")){
			value = true;
			var $email = $("#noticeEmail");
			if (! validateEmail( $email.val() ) ){
				updateTips("Please enter a valid email");
				$email.addClass("ui-state-error");
				$(this).removeAttr("checked").button("refresh");
			} else{
				$email.removeClass("ui-state-error");
				updateEmailPreferences(type, value, $email.val() );
			}
		}else{
//			$email.removeClass("ui-state-error");
			updateEmailPreferences(type, value, "none" );
		}				
	});	
	//$("body").animate({opacity: 1}, 500);
	//$("body").css({opacity: 1});
	setTimeout(function(){		
		$("body").addClass("visible").removeClass("invisible");
		setTimeout(function(){
			$("body").removeClass("wait");
		}, 2000);
	}, 1500);
}

function updateEmailPreferences(type, value, email){
	console.log(type + ", " + value + ", " + email);
	$.ajax({
		url: "/notification",
		type: "POST",
		data: {
			gameID: getUrlParameters().gameID,
			nickname: getUrlParameters().nickname,
			type: type,
			preference: value.toString(),
			email: email
		}, success: function(resp){
			
		}
	});
}

function position(){
	$("#gameChat").position({
		of: $("#game_container"),
		my: "left top",
		at: "right top",
		offset: "2 0",
		collision: "none none"
	});
	var $chatList = $("#chatList");
	var listLength = $chatList.children("li").length;
	var chatHeight = $chatList.height();
	var setHeight = Math.floor(chatHeight/listLength);
	var extra = chatHeight - setHeight * listLength;
	$chatList.children("li").height(setHeight);
	$chatList.children("li:last").height(setHeight + extra);
	//$("#gameCanvas").height($("#game_container").height()*1-5);
	
	var $idle = $("#idleDialog");
	var halfWindow = $(window).width()/2;
	var halfIdle = $idle.width()/2;
	$idle.css({left: halfWindow-halfIdle});
}

function logout(){
	var QueryString = getUrlParameters();
	var r = confirm("Are you sure you want to quit?")
	if (r){	
		$.ajax({
			url: "/logout",
			data: {
				action: "logout",
				gameID: QueryString.gameID,
				nickname: QueryString.nickname
			},
			type: "GET",
			dataType: "json",
			success: function(resp){
				$("html").fadeOut(600, function(){
					localStorageManager.removeGameLog( getUrlParameters() );
					window.location = "/lobby.jsp";
				});
			}		
		});
	}	
}

function validateShareInfo(){
	var valid = true;
	
	if ($("input[name='shareType']:checked").val() == "SELF"){
		$("#shareDiv input[id^='email']").each(function(index, obj){
			$obj = $(obj);
			$obj.val( $("#emailFrom").val() );
		});
		$("#shareDiv input[id^='name']").each(function(index, obj){
			$obj = $(obj);
			$obj.val( $("#nameFrom").val() );
		});
	}
	
	$("#shareDiv input[id^='email']").each(function(index, obj){
		$obj = $(obj);
		var flag = validateEmail( $obj.val() );
		if (!flag){
			updateTips( "there is an invalid email address" );
			$obj.addClass("ui-state-error");
		}
		valid = valid && flag;
	});
	$("#shareDiv input[id^='name']").each(function(index, obj){
		$obj = $(obj);
		var flag = validateName( $obj.val() );
		if (!flag){
			updateTips( "there is an invalid name" );
			$obj.addClass("ui-state-error");
		}
		valid = valid && flag;
	});	
	return valid;
}

function updateTips( t ) {
	var tips = $(".validateTips");
	tips
		.text( t )
		.addClass( "ui-state-error" ).stop()
		.animate({"opacity":1}, 500);
	setTimeout(function() {
		tips.stop().animate({"opacity": 0}, 500, function(){
			
		} );
		
	}, 3000 );
}


function validateName(name){
	if (name.length > 1){
		return true;
	}
	return false;
} 

function validateEmail(email){
	var x = email;
	var atpos=x.indexOf("@");
	var dotpos=x.lastIndexOf(".");
	if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length)
	  {
	  return false;
	  }	
	return true;
}

function sendShareEmail( fromEmail, fromName, type, toEmail, toName ){
	var gameID = getUrlParameters().gameID;
	var nickname = getUrlParameters().nickname;
	
	if (toEmail == undefined || toEmail == null || toEmail == ""){
		toEmail = fromEmail;
		type = "SELF";
	}
	if (toName == undefined || toName == null || toName == ""){
		toName = fromName;
		type="SELF";
	}
	
	console.log("from email: " + fromEmail + ", fromName: " + fromName + ", type: " + type.toUpperCase() + ", toEmail: " + toEmail + ", toName: " + toName );
	$.ajax({
		url: "/shareEmail",
		type: "POST",
		data: {
			toEmail: toEmail, 
			toName: toName, 
			fromEmail: fromEmail, 
			fromName: fromName, 
			type: shareType[type.toUpperCase()], 
			gameID: gameID, 
			nickname: nickname
		}, success: function(){

		}		
	});
}



function getPlayerInfoDiv(nickname){
	return $("li[id^='"+ nickname + "'] div.groupInfo");
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

