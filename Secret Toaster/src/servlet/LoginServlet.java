package servlet;

import game.*;


import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.minidev.json.JSONObject;
import net.minidev.json.JSONValue;

import com.google.appengine.api.channel.*;

public class LoginServlet extends HttpServlet{
	private static final long serialVersionUID = 1L;
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		ChannelService channelService = ChannelServiceFactory.getChannelService();		
		String nickname	= req.getParameter("nickname");
		String gameID = req.getParameter("gameID");
		String color = req.getParameter("color");
		
		Memcache cache = new Memcache();
		Game game = cache.getGame(gameID);		
		game.addPlayer(nickname, color);
		Player player = game.getPlayer(nickname);
		
		String status = Datastore.saveGame(game); //this needs to be updated
		cache.saveGame(game);
		
		JSONObject msg = new JSONObject();
		msg.put("login", (JSONObject) JSONValue.parse( player.toJson() ) );
		System.out.println( nickname + " logged in. " );	
		for (Player plyr : game.getPlayers() ){
			if ( plyr.isActive() ){
				channelService.sendMessage( new ChannelMessage(gameID.toUpperCase() + "_" + plyr.getNickname(), msg.toJSONString() ) );	
			}
			if (plyr.getsNotification(NotificationType.PLAYER_JOIN)){
				plyr.sendNotification(NotificationType.PLAYER_JOIN, game, player);
			}
		}				
		resp.getWriter().println(status);
	} 
	
	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {}
}
