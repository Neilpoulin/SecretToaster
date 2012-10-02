package servlet;

import game.Datastore;
import game.Game;
import game.Memcache;
import game.Message;
import game.MessageType;
import game.NotificationType;
import game.Player;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.channel.*;

import net.minidev.json.JSONObject;
import net.minidev.json.JSONValue;

public class LogoutServlet extends HttpServlet{
	private static final long serialVersionUID = 1L;
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		ChannelService channelService = ChannelServiceFactory.getChannelService();
		//ChannelPresence presence = channelService.parsePresence(req);
		
		String nickname	= req.getParameter("nickname");
		String gameID = req.getParameter("gameID");
		String saveStatus = null;
		
		//Game game = Datastore.getGame(gameID);
		Memcache cache = new Memcache();
		Game game = cache.getGame(gameID);
		
		//Set the message to send to have the browser remove the player from the game
		Player player = game.getPlayer(nickname);
		JSONObject msg = new JSONObject();
		msg.put("logout", (JSONObject) JSONValue.parse( player.toJson() ) );
		
		//set the chat message to display (System message)
		JSONObject outgoing = new JSONObject();
		Player fromPlayer = new Player("System", "gray");
		Message newMsg = new Message(fromPlayer, player, MessageType.GLOBAL, "<b>" + nickname + "</b> has quit the game.");
		outgoing.put("chat", (JSONObject)JSONValue.parse( newMsg.toJson() ));
		
		for (Player plyr : game.getPlayers() ){
			channelService.sendMessage( new ChannelMessage(gameID.toUpperCase() + "_" + plyr.getNickname(), msg.toJSONString() ) );
			channelService.sendMessage( new ChannelMessage(gameID + "_" + player.getNickname(), outgoing.toJSONString() ) );
			if (plyr.getsNotification(NotificationType.PLAYER_QUIT)){
				plyr.sendNotification(NotificationType.PLAYER_QUIT, game, player);
			}
		}		
			
		JSONObject response = new JSONObject();
		response.put("save", saveStatus);
		response.put("logout", game.getPlayer(nickname).toJson() );
		
		game.removePlayer(nickname);
		saveStatus = Datastore.saveGame(game);
		cache.saveGame(game);
		
		resp.getWriter().println( response.toJSONString() );				
	} 
	
	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {}
}
