<!DOCTYPE>

<html>
<%@ page import="game.*, services.*" %>
<% 	
	Memcache cache = new Memcache();	
	Game game = cache.getGame("SAMPLE");
	HtmlGenerator html = new HtmlGenerator(game);
	for (Player player : game.getPlayers()){
		player.setEmail("neil@neilpoulin.com");
	}
	NotificationEmail email = new NotificationEmail(game.getPlayers().get(0), NotificationType.PLAYER_READY, game, game.getPlayers().get(1));
	//ShareEmail email = new ShareEmail("neil@neilpoulin.com", "Neil", "admin@neilpoulin.com", "Aministrator", "SELF", game.getId(), game.getPlayers().get(0).getNickname());
%>
	<head>
		<title>Sample Email</title>
		<link rel="stylesheet" href="/styles/email.css" />
	</head>
	
	<body>
		<div id="sample">
			<ul>
				<li>
					<span>Sample LI element</span><img src="/data/icons/away.png"  title="away"></img>
				</li>
			</ul>
		</div>

		<hr>
		
		<div id="server">
			<div id="subject">
				<span><%= email.getSubject() %></span>
			</div>
			<hr>
			<div id="body"><%= email.getHtmlBody() %></div>
		</div>
	</body>
	
</html>