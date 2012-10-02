package services;

import game.*;


public class NotificationEmail extends Email {
	private final Memcache cache = new Memcache();
	private Player toPlayer_;
	private Game game_;
	private NotificationType type_;
	private Player newPlayer_;
	private final HtmlGenerator htmlGenerator = new HtmlGenerator();
	
	public NotificationEmail(){
		
	}
	/**
	 * Constructor for a new Notification Email
	 * @param Player toPlayer - The player the email will be sent to. This player must have an associated email address
	 * @param NotificationType type - NotificationType
	 * @param Game game - game the player is in 
	 */
	public NotificationEmail(String nickname, String type, String gameID){
		super();		
		game_ = cache.getGame(gameID);
		toPlayer_ = game_.getPlayer(nickname);
		type_ = NotificationType.valueOf(type);
		this.setToEmail( toPlayer_.getEmail() );
		this.setToName(nickname);
		this.htmlGenerator.setGame(game_);
		createTextBody();
		createHtmlBody();
		createSubject();
	}
	
	/**
	 * Constructor for a new Notification Email
	 * @param Player toPlayer - The player the email will be sent to. This player must have an associated email address
	 * @param NotificationType type - NotificationType
	 * @param Game game - game the player is in 
	 */
	public NotificationEmail(Player toPlayer, NotificationType type, Game game){
		super( toPlayer.getEmail() );	
		this.setPlayer( toPlayer);
		this.setToName( toPlayer.getNickname() );
		this.setToEmail( toPlayer.getEmail() );
		this.game_ =  game;
		this.type_ = type;
		this.htmlGenerator.setGame(game_);
		createTextBody();
		createHtmlBody();
		createSubject();
	}
	
	/**
	 * Constructor for a new Notification Email to one player that references another player 
	 * @param Player toPlayer - The player the email will be sent to. This player must have an associated email address
	 * @param NotificationType type - NotificationType
	 * @param Game game - game the player is in 
	 * @param referencePlayer
	 */
	public NotificationEmail(Player player, NotificationType type, Game game, Player referencePlayer){
		super(player.getEmail());	
		this.setPlayer(player);
		this.setToEmail( player.getEmail() );
		this.setToName( player.getNickname() );
		this.game_ =  game;
		this.type_ = type;
		this.newPlayer_ = referencePlayer;
		this.htmlGenerator.setGame(game_);
		createTextBody();
		createHtmlBody();
		createSubject();
	}
	
	private void createTextBody(){				
		if ( type_.equals(NotificationType.PLAYER_JOIN) ){
			String body = null;
			body = newPlayer_.getNickname() + ", has joined your game, " + game_.getId();
			body += ". Players in game: " + getTextPlayerList();
			this.setTextBody(body);
		}
	}
	
	private void createHtmlBody(){
		createStyleSheet();
		if ( type_.equals(NotificationType.PLAYER_JOIN) ){
			String body = null;		
			body = getHeading()
				+ "<p style=\"margin: 0px; padding: 0px;\">Hello " + htmlGenerator.getPlayerNicknameHtml(toPlayer_, true, true) + ", "
				+ "<br>"			
				+ htmlGenerator.getPlayerNicknameHtml(this.newPlayer_, true, true) + " has joined. " 
					+ htmlGenerator.getLoginLink("Click here", toPlayer_) + " to go to the game."	 + "</p>" 				
				+ htmlGenerator.getPlayerListHtml(true, true)				
				+ "";
			
			this.setHtmlBody( body );
		}else if (type_.equals(NotificationType.PLAYER_ACTIVE) ){
			String body = null;
			body = getHeading()
					+ "<p style=\"margin: 0px; padding: 0px\">Hello " + htmlGenerator.getPlayerNicknameHtml(toPlayer_, true, true) + ", <br>"			
					+ htmlGenerator.getPlayerNicknameHtml(this.newPlayer_, true, true) + " is now Active. " 
						+ htmlGenerator.getLoginLink("Click here", toPlayer_) + " to go to the game." + "</p>"					
					+ htmlGenerator.getPlayerListHtml(true, true)				
					+ "";
			
				this.setHtmlBody(body);
		} else if( type_.equals(NotificationType.PLAYER_READY) ){
			String body = null;
			body = getHeading()
					+ "<p style=\"margin: 0px; padding: 0px\">Hello " + htmlGenerator.getPlayerNicknameHtml(toPlayer_, true, true) + ", <br>"			
					+ htmlGenerator.getPlayerNicknameHtml(this.newPlayer_, true, true) + " has changed their Ready status to <b>" 
						+ Boolean.toString( newPlayer_.isReady() ) + "</b>. The next round will begin once all players are ready " 
						+ htmlGenerator.getLoginLink("Click here", toPlayer_) + " to go to the game." + "</p>"					
					+ htmlGenerator.getPlayerListHtml(true, true)				
					+ "";
			
				this.setHtmlBody(body);
		} else if (type_.equals(NotificationType.GAME_ROUNDSTART)){
			String body = null;
			body = getHeading()
					+ "<p style=\"margin: 0px; padding: 0px\">Hello " + htmlGenerator.getPlayerNicknameHtml(toPlayer_, true, true) + ", <br>"			
					+ "A new round has started and you may now set your next set of orders. " 
						+ htmlGenerator.getLoginLink("Click here", toPlayer_) + " to go to the game." + "</p>"					
					+ htmlGenerator.getPlayerListHtml(true, true)				
					+ "";
			
				this.setHtmlBody(body);
		} else if (type_.equals(NotificationType.PLAYER_QUIT)){
			String body = null;
			body = getHeading()
					+ "<p style=\"margin: 0px; padding: 0px\">Hello " + htmlGenerator.getPlayerNicknameHtml(toPlayer_, true, true) + ", <br>"			
					+ htmlGenerator.getPlayerNicknameHtml(this.newPlayer_, true, true) + " has quit the game. "
						+ htmlGenerator.getLoginLink("Click here", toPlayer_) + " to go to the game." + "</p>"		
					+ htmlGenerator.getPlayerListHtml(true, true)				
					+ "";
			
				this.setHtmlBody(body);
		} else if ( type_.equals(NotificationType.PLAYER_IDLE) ){
			String body = null;
			body = getHeading()
					+ "<p style=\"margin: 0px; padding: 0px\">Hello " + htmlGenerator.getPlayerNicknameHtml(toPlayer_, true, true) + ", <br>"			
					+ htmlGenerator.getPlayerNicknameHtml(this.newPlayer_, true, true) + " is now idle. "
					+ "This will happen if the player is inactive for a period of time or has closed their browser window "
						+ htmlGenerator.getLoginLink("Click here", toPlayer_) + " to go to the game." + "</p>"				
					+ htmlGenerator.getPlayerListHtml(true, true)				
					+ "";
			
				this.setHtmlBody(body);
		}
	}
	
	private String getHeading(){
		String heading = null;
		heading = "<h2 style=\"margin: 0; padding: 0;\">" + this.type_.getDescription() + " Notification</h2>"
				+ "<h3 style=\"margin: 0; padding: 0;\">GameID: " + game_.getId() + "</h3>"
				+ "<h3 style=\"margin: 0; padding: 0;\">Nickname: " + toPlayer_.getNickname() + "</h3>"
				+ "<br>";
		return heading;
	}
	
	private void createStyleSheet(){
		StyleSheet stylesheet = this.htmlGenerator.getStyleSheet();
		stylesheet.addRule("#email li img", "height", "1em");
		stylesheet.addRule("#email li img", "margin-left", ".5em");
		stylesheet.addRule("#email li img", "margin-bottom", "-2px");
		stylesheet.addRule("#email li", "padding","2px");
		
//		this.setHtmlStyleSheet(stylesheet.getHtml());
	}
	
	private void createSubject(){
		String subject = type_.getDescription() + " Notification for GameID " + game_.getId();
		this.setSubject(subject);
	}
	
	public String getTextPlayerList(){
		String out = null;
		int i = 0;
		for (Player player : game_.getPlayers() ){
			if (i == 0){
				out += player.getNickname(); 
			} else {
				out += ", " + player.getNickname();
			}			
			i++;
		}
		return out;
	}

	public Player getPlayer() {
		return toPlayer_;
	}

	public void setPlayer(Player player) {
		this.toPlayer_ = player;
	}
	
	public String getBodyHtml(){
		return this.getHtmlBody();
	}
	
}
