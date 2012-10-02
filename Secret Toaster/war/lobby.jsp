<!DOCTYPE> 
<html>
	<head>
		<title>Lobby | SecretToaster</title>
		<link rel="stylesheet" href="styles/lobby.css" />
		<link rel="stylesheet" href="styles/custom-theme/jquery-ui.css" />
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
	<body>
		<ul id="colors"></ul>
		<div id="header">
			<p>Just want to check out the page? Click <a href="/index.jsp?gameID=SAMPLE&nickname=Sample1">here</a> to view a sample game.</p>
		</div>
		<div id="about">
			<h3>
				What is <i>SecretToaster</i>? Read about the game and how to play <a href="/about.jsp" target="_blank">here</a>.
			</h3>
			
		</div>
		
		<div id="searchDIV" class="search center">
			<h2 class="center">Join Game</h2>		
			<span id="inputError" class="tip"> </span><br>
			<div id="info">
				<div id="labels">
					<label for ="nickname">Nickname</label><input id="nickname"/><br>
					<label for="gameID">Game ID</label><input id="gameID" /><br>
					<label for="selectedColor">Color</label><span id="selectedColor">Please select a color</span>
				</div>		
			</div>
			<div id="controls">
				<button id="searchGame">Search</button>
				<button id="joinGame">Search</button>
				<button id="createGame">Create</button>				
			</div>
			<p id="notice"></p>
		</div>
		<ul id="recentGames"></ul>
		
		<jsp:include page="scripts.html"></jsp:include>
		<script type="text/javascript" src="/js/localStorage.js"></script>
		<script type="text/javascript" src="/js/lobby.js"></script>
	</body>
</html>