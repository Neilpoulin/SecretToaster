package servlet;

import game.*;


import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

import org.joda.time.*;
import org.mortbay.util.ajax.JSON;

import net.minidev.json.*;


import com.google.appengine.api.datastore.*;
import com.google.appengine.api.channel.*;
import com.google.gson.Gson;


@SuppressWarnings("unused")
public class ChatServlet extends HttpServlet{
	private static final long serialVersionUID = 1L;
	public static ChannelService channelService = ChannelServiceFactory.getChannelService();
	
	public void doPost(HttpServletRequest req, HttpServletResponse resp)
		throws IOException {
		String msg = req.getParameter("message");
		String nickname = req.getParameter("nickname");
		String to = req.getParameter("to");
		String type = req.getParameter("type");
		String gameID = req.getParameter("gameID");
			
		sendMessage(nickname, to, type, gameID, msg);
		resp.getWriter().println( "message sent" );
	}
	
	public void doGet (HttpServletRequest req, HttpServletResponse resp)
		throws IOException {
		String gameID = req.getParameter("gameID");
		String nickname = req.getParameter("nickname");
		String lastCheck = req.getParameter("lastCheck");
				
		String response = getNewMessages(gameID, nickname, lastCheck);	
		
		resp.getWriter().println(response);
	}
	
	public String getNewMessages(String gameID, String nickname, String lastCheck ){
		//Game game = Datastore.getGame(gameID);
		Memcache cache = new Memcache();
		Game game = cache.getGame(gameID);
		if (game == null){
			game = Datastore.getGame(gameID);
			cache.saveGame(game);
		}
		
		Player player = game.getPlayer(nickname);
		long chk = Long.parseLong(lastCheck);
		List<Message> newMsgs = game.getMessages(player, chk );
		long time = 0;
		
		for (Message msg: newMsgs){
			if (msg.getDate() > time){
				time = msg.getDate();
			}
		}
		
		System.out.println("new messages for " + player == null ? "player = null" : player.getNickname()  
				+ " since " + chk + ": " + newMsgs == null ? "newMsgs = null" : newMsgs.size() );
		
		String newMessages = new Gson().toJson( newMsgs );
		String players = new Gson().toJson( game.getPlayers() );
		
		JSONObject response = new JSONObject();
		response.put("newMessages", (JSONArray)JSONValue.parse( newMessages ));
		response.put("players", (JSONArray)JSONValue.parse( players ));
		response.put("time", time);
		//response.put("game", (JSONObject)JSONValue.parse( game.toJson() ));
		
		return response.toJSONString(); 		
	}
	
	public static void sendMessage(String from, String to, String type, String gameID, String msg){
		//Game game = Datastore.getGame(gameID);
		Memcache cache = new Memcache();
		Game game = cache.getGame(gameID);
		
		String saveResp = "";
		if (game != null){
			Player fromPlayer = game.getPlayer(from);
			Player toPlayer = game.getPlayer(to);
			MessageType msgType = MessageType.valueOf( type.toUpperCase() );
			
			String keyTo = gameID.toUpperCase() + "_" + to;
			String keyFrom = gameID.toUpperCase() + "_" + from;	
			
			JSONObject outgoing = new JSONObject();
			//outgoing.put("game", (JSONObject)JSONValue.parse( game.toJson() ) );
			
			if ( msgType.equals(MessageType.PLAYER) ){
				Message message = new Message(fromPlayer, toPlayer, msgType, msg );
				game.getMessages().add(message);				
				outgoing.put("chat", (JSONObject)JSONValue.parse( message.toJson() ) );				
				channelService.sendMessage( new ChannelMessage(keyTo, outgoing.toJSONString() ));
				channelService.sendMessage( new ChannelMessage(keyFrom, outgoing.toJSONString() ));
			} else if ( msgType.equals(MessageType.ALLIANCE) ){
				for (Player plr: game.getAlliance(fromPlayer).getMembers() ){
					Message message = new Message(fromPlayer, plr, msgType, msg );
					game.getMessages().add(message);					
					outgoing.put("chat", (JSONObject)JSONValue.parse( message.toJson() ) );					
					keyTo = gameID.toUpperCase() + "_" + plr.getNickname();
					channelService.sendMessage( new ChannelMessage(keyTo, outgoing.toJSONString() ));
				}
			} else if ( msgType.equals(MessageType.GLOBAL) ){
				Message message = new Message(fromPlayer, fromPlayer, msgType, msg );
				for ( Player player: game.getPlayers() ){
					message = new Message(fromPlayer, player, msgType, msg );					
					outgoing.put("chat", (JSONObject)JSONValue.parse( message.toJson() ) );					
					keyTo = gameID.toUpperCase() + "_" + player.getNickname();
					channelService.sendMessage( new ChannelMessage(keyTo, outgoing.toJSONString() ));
				}
				game.getMessages().add(message);
			}
			//saveResp = Datastore.saveGame(game);
			cache.saveGame(game);
			
		}
	
	}
}
