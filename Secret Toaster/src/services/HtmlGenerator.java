package services;

import game.*;

public class HtmlGenerator {
	private Game game_; 
	private static StyleSheet stylesheet_ = new StyleSheet();
	
	public HtmlGenerator(Game game){
		game_ = game;
	}
	
	public HtmlGenerator(){
		
	}
	
	public StyleSheet getStyleSheet(){
		return stylesheet_;
	}
	
	public StyleRule getStyleRule(String selector){
		return stylesheet_.getRule(selector);
	}
	
	public void addStyleRule(StyleRule rule){
		stylesheet_.addRule(rule);
	}
	
	public void addStyleRule(String selector, String property, String value){
		stylesheet_.addRule(selector, property, value);
	}
	
	public void setGame(Game game){
		game_ = game;
	}
	
	public void setGame(String gameID){
		Memcache cache = new Memcache();
		game_ = cache.getGame(gameID);		
	}
	
	public Game getGame(){
		return game_;
	}
	
	public String getPlayerListHtml(boolean color, boolean bold){
		String out = "<p style=\"font-weight: bold; margin-top: .5em; margin-bottom: 0px; padding: 0px \">Players in " + this.getGame().getId() + ":<ul style=\"margin-top: 0px; margin-bottom: 0px; \">";
		for (Player player : game_.getPlayers() ){
			out += "<li style=\"position: relative; height:1.2em; padding: 3px\">" + this.getPlayerNicknameHtml(player, color, bold) + getIdleImage(player) + getReadyImage(player) + "</li>";
		}
		out += "</ul></p>";
		return out;
	}
	
	public String getPlayerNicknameHtml(Player player, boolean color, boolean bold){
		String htmlName = null;
		htmlName = player.getNickname();
		if (bold){
			htmlName = "<b>" + htmlName + "</b>";
		}
		if (color){
			htmlName = "<span style=\"color: " + player.getColor() + " \">" + htmlName + "</span>";
		}
		return htmlName;
	}
	
	public String getIdleImage(Player player){
		String out = "";
		if (!player.isActive()){
			out = getIdleImage();
		}
		return out;
	}
	
	public String getIdleImage(){
		String out = "";
		out = "<img src=\"http://www.secrettoaster.neilpoulin.com/data/icons/away.png\" title=\"idle\" style=\"max-height: 1em; margin-left: .5em; margin-bottom: -2px\">";
		return out;
	}
	
	public String getReadyImage(Player player){
		if (player.isReady()){
			return getReadyImage();
		}
		else return "";
	}
	
	public String getReadyImage(){
		return "<img src=\"http://www.secrettoaster.neilpoulin.com/data/icons/checkmark.png\" title=\"ready\" style=\"max-height: 1em; margin-left: .5em; margin-bottom: -2px\" ";
	}
	
	public String getPlayerNicknameHtml(String nickname, boolean color, boolean bold){
		return getPlayerNicknameHtml(game_.getPlayer(nickname), color, bold);
	}
	
	public String getLobbyLink(String text){
		return "<a href=\"http://www.secrettoaster.neilpoulin.com/lobby.jsp?gameID=" + game_.getId() + "\" target=\"blank\">" + text + "</a>";
	}
	
	public String getLoginLink(String text, Player player){
		return "<a href=\"http://www.secrettoaster.neilpoulin.com/index.jsp?gameID=" + game_.getId().toUpperCase() + "&nickname=" + player.getNickname() + "\" target=\"blank\">" + text + "</a>";  				
	}	
	public String getLoginLink(String text, String nickname){
		Player player = game_.getPlayer(nickname);
		return this.getLoginLink(text, player);  				
	}
}
