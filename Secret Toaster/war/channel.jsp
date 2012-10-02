<!DOCTYPE>
<html>
	<head>
		<title>Socket Testing | SecretToaster</title>
		<link rel="stylesheet" href="styles/pepper-grinder/jquery-ui.css" />
	</head>
	
	<body>
	
		<label for="nickname">Nickname: </label><input id="nickname" />
		<label for="gameID">gameID: </label><input id="gameID" /> 
		<br/>
		<button id="openChannel">Open Chanel</button>
		<br>
		<textarea placeholder="Enter message here" id="messageTextarea"></textarea>
		<br/>
		<button id="sendMessage">Send</button>
		
		<div id="messages">
			<p>New Messages Below: </p>
		</div>
		
		<script type="text/javascript" src="js/plugins/combined.js"></script>
		<script type="text/javascript" src="/_ah/channel/jsapi"></script>
		<script type="text/javascript" src = "js/channel.js"></script>
	</body>
</html>