<!DOCTYPE> 
<html>
	<head>
		<title>Game | SecretToaster</title>
		<link rel="stylesheet" href="styles/index.css"/>
		<link rel="stylesheet" href="styles/borders.css"/>
		<link rel="stylesheet" href="styles/alliance.css"/>
		<link rel="stylesheet" href="styles/layout.css"/>
		<link rel="stylesheet" href="styles/custom-theme/jquery-ui.css" />
		<script src="/js/plugins/less.js" type="text/javascript"></script>
		<script type="text/javascript"> //Google Analytics
			var _gaq = _gaq || [];
			_gaq.push(['_setAccount', 'UA-33466629-1']);
			_gaq.push(['_trackPageview']);
			
			(function() {
			  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			})();		
		</script>
	</head>
	<body class="wait invisible">
		<div id="toolbar" class="border black border2px solid radius10">
			<div id="gameInfo">			
				<span id="gameID"></span>
				<span id="nickname"></span>					
				<span id="gameRound"></span>
			</div>
			<button id="logout">Quit</button>			
			<a id="about" href="/about.jsp" target="_blank">Rules & Info</a>
			<button id="share">Share</button>						
			<button id="settings">Settings</button>				
			<button class="getMessages hidden">Check Messages</button>
			<br>		
		</div>		
		<div id="gameChat" class="chat absolute_pos"> 
			<ol id="chatList" class="">
				<li id="global_chat" class="">
					<div class="groupInfo selected">
						<p class="player name chat">Global</p>
						<img src="data/icons/Globe.png" class="player chat"/>
					</div>	
				</li>
				<li id="alliance_chat">
					<div class="groupInfo">
						<p class="player name chat">Alliance</p>
						<img src="data/icons/alliance.png" class="player chat"/>
					</div>				
				</li>					
			</ol>
			<div id="alliance_messages" class="chatWindow">
				<div class="alliance chat messages" name="alliance"></div>
				<textarea class="alliance chat" placeholder="Alliance Chat Message"></textarea>					
			</div>
			<div id="global_messages" class="chatWindow">
				<div id = "globalChatDIV" class="global chat messages" name ="global"></div>
				<textarea class="global chat" placeholder="Global Chat Message"></textarea>
			</div>		
		</div>
		
		<div id="game_container" class="absolute_pos border black border2px solid">
			<div id="board_group">
				<div id=boardControls>					
					<button id="openAlliances">Alliances</button>
					<button id="btnOrders">Orders</button>					
					<fieldset id="orderButtonset">
						<legend>Orders</legend>	
						<label for="orderRadio1">1</label><input type="radio" name="orders" id="orderRadio1" value="1" />
						<label for="orderRadio2">2</label><input type="radio" name="orders" id="orderRadio2" value="2"/>
						<label for="orderRadio3">3</label><input type="radio" name="orders" id="orderRadio3" value="3"/>						
					</fieldset>
					<label for="chkReady">Ready</label><input id="chkReady" type="checkbox" />						
					<fieldset id="zoomFieldset">
						<legend>Board</legend>						
						<button id="zoomIn">+</button>
						<button id="zoomOut">-</button>
						<button id="zoomReset">Reset</button>	
						<button id="refresh" class="hidden">Refresh</button>
					</fieldset>
					
					
				</div>
				<div id="gameCanvas" class="border black border2px solid"></div>
			</div>
		</div>
		<div id="mouseTip" class=""></div>
		
		<div id="timeoutDialog">
			<p>You have been idle since <span id="idleTimestamp"></span>. </p>
			<p>You have stopped receiving chat messages and your status has been set to "Away".</p>
			<p> To resume receiving messages, please click "I'm Back!"</p>
		</div>
		
		<div id="idleDialog" class=""></div>
		
		<div id="allianceDIV" class="">
			<div id="membership"></div>
			<div class="clear"></div>
			<h4>Tips:</h4>
			<p>
				<b>Join:</b> Drag and drop your name onto desired alliance.
			</p>
			<p>
				<b>Re-Name Alliance: </b>Alliance "owners" may change the alliance's name by clicking the button next to their alliance's name
			</p>			
		</div>
		
		<div id="allianceRenameDIV">
			<input id="allianceNewName" type="text" placeholder="New Name"/>
		</div>
		
		<div id="allianceCreateDIV">
			<input id="allianceName" type="text" placeholder="New Name"/>
			<input id="allianceId" type="text" class="hidden"/>
		</div>
		
		<div id="templates" class="hidden">
			<ul>	
				<li id="gameChatTemplate" class="player">
					<div class="groupInfo">
						<p class="player name chat"></p>
						<div class="playerLogo"></div>
					</div>
				</li>
			</ul>	
			<div id="chat_messagesTemplate" class="chatWindow">
				<div class="chat messages" name="player">
					
				</div>
				<textarea class="chat"placeholder="Player 1 Chat Message"></textarea>
			</div>
		</div>
		
		<div id="ordersDialog">
			<p>
				This is where you will set orders 1, 2, and 3. Not sure the lay out yet... this will eventually be all on the game board. 
			</p>
		</div>
		
		<div id="actionDialog">
			<h1 id="orderNumber">Order</h1>
			<h2 id="orderTitle"></h2>
			<p class="location">From Hex: <span id="knightId"></span> To Hex: <span id="toId"></span></p>						
			<span>Knight: </span><select class="knight" id="knightSelect"></select>
			<p class="troops">Troops: <input id="troopsInput" type="text" /></p>
			<button id="promote">Promote</button>
			<button id="fortify">Fortify</button>
			<button id="move">Move</button>
			<button id="saveOrder">Save</button>
			<input type="text" id="orderType"/>
		</div>
		
		<div id="settingsDiv">
			<p class="validateTips"> </p>
			
			<fieldset id="personalInfo">
				<legend>Personal Info</legend>
				<input id="noticeName" type="text"/><label for="noticeName">Name</label>
				<input id="noticeEmail" type="email"/><label for="noticeEmail">Email</label>
			</fieldset>			
			<fieldset>
				<legend>Chat</legend>
				<label for="timestamp" title="Show timestamps on each message in the chat window">Time Stamps</label><input type="checkbox" id="timestamp" title="Show Timestamps for messages in the chat window"/>
			</fieldset>
			<fieldset>
				<legend>Board</legend>
				<label for="showLabels" title="Show hexgon labels on the gameboard">Labels</label><input id="showLabels" type="checkbox" disabled="disabled"/>
			</fieldset>		
			<fieldset id="emailNotificationSettings">
				<legend>Email Notifications</legend>				
				<label for="notificationPlayerJoins" title = "Email me when a player joins the game">Player Join</label><input id="notificationPlayerJoins" type="checkbox" value="PLAYER_JOIN"/>
				<label for="notificationPlayerQuit" title="Email me when a player quits the game">Player Quit</label><input id="notificationPlayerQuit" type="checkbox" value="PLAYER_QUIT"/>
				<label for="notificationPlayerActive" title="Email me when a player becomes active">Player Active</label><input id="notificationPlayerActive" type="checkbox" value="PLAYER_ACTIVE"/>
				<label for="notificationPlayerIdle" title="Email me when a player goes idle">Player Idle</label><input id="notificationPlayerIdle" type="checkbox" value="PLAYER_IDLE"/>
				<label for="notificationPlayerReady" title="Email me when a player has set their status to ready">Player Ready</label><input id="notificationPlayerReady" type="checkbox" value="PLAYER_READY"/>
				<label for="notificationGameRoundStart" title="Email me when a new round has started">Round Start</label><input id="notificationGameRoundStart" type="checkbox" value="GAME_ROUNDSTART"/>
								
			</fieldset>
		</div>
		
		<div id="shareDiv">
			<p class="validateTips"></p>
			<div id="shareTypeButtonset">
				<label for="shareMe">Send Me Login Link</label><input type="radio" name="shareType" id="shareMe" value="SELF" checked="checked" />
				<label for="shareInvite">Invite Others</label><input type="radio" name="shareType" id="shareInvite" value="INVITE"/>
			</div>

			<fieldset id="senderInfo">
				<legend>Your Info</legend>				
				<input id="nameFrom" type="text"/><label for="nameFrom">Name</label>
				<input id="emailFrom" type="email"/><label for="emailFrom">Email</label>
			</fieldset>
			
			<fieldset id="recipientInfo">
				<legend>Recipient's Info</legend>
				<input id="nameTo" type="text"/><label for="nameTo">Name</label>
				<input id="emailTo" type="email"/><label for="emailTo">Email</label>
			</fieldset>									
		</div>
		
		
		<div id="newsDialog">
			<h2><span id="newsDate">Aug 13, 2012 - </span>Updates</h2>
			<h3>Features</h3>
			<ul>
				<li>
					<b>Email Notifications</b> - Set your settings to have the game notify you when a new player joins. More notifications are to follow: active, idle, ready, round start, etc. 
				</li>
				<li>
					<b>Share</b> - Invite others to join you by sending them a link to the game via email. Also, send yourself a link to your gamestate so you can continute playing on other devices. 
				</li>				
				<li>
					<b>Orders - you can now commit orders!</b>
					<ul>
						<li>
							Choose which order to issue by clicking the appropriate button on the left. The highlighted order is your "active order". 
							Any changes you make on the game board will be saved to the selected "active order". 
						</li>
						<li>
							Light Yellow game hexes indicate valid starting points for the selected order (i.e. has one of your Knights on it). 
							These indicators will change depending on which order you have selected - it is the projected position of the knights as orders are issued. Remember, Orders are always issued sequentially from 1 to 3.
						</li>
						<li>
							Once you have selected all three of your orders and are ready for the next round, click the Ready button on the left. Once all players in the game are ready, the current round will end. 
							The server will issue orders from all players, one at a time in a random order until there are no orders left. The board will then refresh and the next round begins.  
						</li>						
					</ul>
				</li>
				<li>
					<b>Tooltop-on-Hover</b> with a delay. Instead of having a tooltip always follow your mouse around while on the game board,
					 now it will only pop up if you've been hovering on the same hex for a second. 
				</li>
				<li>
					<b>Added a Recent Games list</b> to the lobby. Games you have joined in the past will be remembered so it is easy to pick up where you left off!   
				</li>
			</ul>
			<h3>Bugs</h3>
			<ul>
				<li>
					When one player moves to another player's land, currently the most recent player to move onto it becomes the owner. 
				</li>
				<li>
					There are a few bugs on the display of the game board, especially once you Raise and have multiple knights in a small area. 
				</li>
			</ul>
		</div>
		
		<%-- <jsp:include page="scripts.html"/> --%>
		<script type="text/javascript" src="/js/plugins/jquery.js"></script>
		<script type="text/javascript" src="/js/plugins/jquery-ui.min.js"></script>
		<script type="text/javascript" src="/js/localStorage.js"></script>
		<script type="text/javascript" src="/js/plugins/kinetic.js"></script>
		<script type="text/javascript" src="/js/plugins/jquery.overscroll.min.js"></script>
		<script type="text/javascript" src="/js/plugins/prefix-free.js"></script>
		<script type="text/javascript" src="/js/plugins/resize.js"></script>
		<script type="text/javascript" src="/js/plugins/autosize.js"></script>
		<script type="text/javascript" src="/js/plugins/jquery.idletimeout.js"></script>
		<script type="text/javascript" src="/js/plugins/jquery.idletimer.js"></script>
		<script type="text/javascript" src="/_ah/channel/jsapi"></script>
		<script type="text/javascript" src="/js/test.js"></script>				
		<script type="text/javascript" src="/js/game.js"></script>
		<script type="text/javascript" src="/js/index.js"></script>
		<script type="text/javascript" src="/js/chat.js"></script>		
		<script type="text/javascript" src="/js/alliance.js"></script>
		<script type="text/javascript" src="/js/gameCanvas.js"></script>
		<script type="text/javascript" src="/js/gameplay.js"></script>
	</body>
</html>