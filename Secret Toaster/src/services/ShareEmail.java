package services;

import game.ShareType;

public class ShareEmail extends Email{
	private String toEmail_;
	private String toName_;
	private String fromEmail_;
	private String fromName_;
	
	private String gameId_;
	private String nickname_;
	private ShareType type_;
	private final HtmlGenerator htmlGenerator = new HtmlGenerator();
	
	public ShareEmail(String toEmail, String toName, String fromEmail, String fromName, String type, String gameID, String nickname){
		super(toEmail);
		toEmail_ = toEmail;
		toName_ = toName;
		fromEmail_ = fromEmail;
		fromName_ = fromName;
		gameId_ = gameID;
		nickname_ = nickname;
		type_ = ShareType.valueOf(type);
		this.htmlGenerator.setGame(gameId_);
		
		this.createTextBody();
		this.createHtmlBody();
		this.createSubject();	
		
	}

	public String getToEmail() {
		return toEmail_;
	}

	public void setToEmail(String toEmail) {
		this.toEmail_ = toEmail;
	}

	public String getToName() {
		return toName_;
	}

	public void setToName(String toName) {
		this.toName_ = toName;
	}

	public String getFromEmail() {
		return fromEmail_;
	}

	public void setFromEmail(String fromEmail) {
		this.fromEmail_ = fromEmail;
	}

	public String getFromName() {
		return fromName_;
	}

	public void setFromName(String fromName) {
		this.fromName_ = fromName;
	}

	public void createSubject(){
		String subject = null;
		if ( type_.equals(ShareType.SELF) ){
			subject = "Link to " + gameId_ + " as " + nickname_;
		} else if (type_.equals(ShareType.INVITE) ){
			subject = this.fromName_ + " has invited you to a game at SecretToaster";
		}		
		this.setSubject(subject);
	}
	
	public void createHtmlBody(){
		String body = null;
		if ( type_.equals(ShareType.SELF)  ){
			body = getHeading() 
				+ "Hello " + this.toName_ + ", <br>"
				+ "Here's a link to re-join game <b>" + gameId_ + "</b> as " + htmlGenerator.getPlayerNicknameHtml(this.nickname_, true, true) + ": <br><br>" 
					+ htmlGenerator.getLoginLink(nickname_ + " in " + gameId_, nickname_) + "<br><br>"
				+ htmlGenerator.getPlayerListHtml(true, true);
		} else if ( type_.equals(ShareType.INVITE) ){
			body = getHeading()
				+ "Hello " + this.toName_ + ","
				+ "<br>"
				+ this.fromName_ + " (" + this.fromEmail_ +") has invited you to join the game " + this.gameId_ + " at SecretToaster."
				+ "<br><br>"
				+ " To join, go to the" + htmlGenerator.getLobbyLink("SecretToaster Lobby") + " and enter a nickname, choose a color and click Join."
				+ htmlGenerator.getPlayerListHtml(true, true);
		}
		this.setHtmlBody(body);
	}
	
	public void createTextBody(){
		String body = null;		
		if ( type_.equals(ShareType.SELF) ){
			body = htmlGenerator.getLoginLink("Click Here", nickname_) + " to re-join the game " + gameId_ + " as " + nickname_ + ". ";
		} else if ( type_.equals(ShareType.INVITE) ){
			body = "Hello, " + this.toName_ + ", \n";
			body += this.fromName_ + "(" + this.fromEmail_ +") has invited you to join the game " + this.gameId_ + " at SecretToaster.";
			body += " To join, go to the" + htmlGenerator.getLobbyLink("SecretToaster Lobby") + " and enter a nickname, choose a color and click Join." ;
		}
		this.setTextBody(body);
	}
	
	private String getHeading(){
		String heading = null;
		heading = "<h2 style=\"margin: 0; padding: 0;\">" + this.type_.getDescription() + " Notification</h2>"
				+ "<h3 style=\"margin: 0; padding: 0;\">GameID: " + this.gameId_ + "</h3>"
				+ "<h3 style=\"margin: 0; padding: 0;\">Nickname: " + this.nickname_ + "</h3>"
				+ "<br>";
		return heading;
	}
	
//	public String getLobbyUrl(){
//		return "http://www.secrettoaster.neilpoulin.com/lobby.jsp?gameID=" + this.gameId_;
//	}
//	
//	public String getLoginUrl(){
//		return "http://www.secrettoaster.neilpoulin.com/index.jsp?gameID=" + gameId_.toUpperCase() + "&nickname=" + nickname_;  				
//	}
}
