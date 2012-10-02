package servlet;

import javax.servlet.http.*;
import java.io.IOException;
import com.google.appengine.api.datastore.*;

import net.minidev.json.*;

import org.joda.time.*;
import com.google.appengine.api.channel.*;

import game.*;
import services.NotificationEmail;
import servlet.IdleServlet;;

@SuppressWarnings("unused")
public class ChannelLog extends HttpServlet {
	private static final long serialVersionUID = 1L;

	public void doPost (HttpServletRequest req, HttpServletResponse resp) throws IOException {
		String action = "connected";
	
		ChannelService channelService = ChannelServiceFactory.getChannelService();
		ChannelPresence presence = channelService.parsePresence(req);
		
		String client = presence.clientId(); 
		int index = client.indexOf("_");
		String gameID = client.substring(0, index );
		String nickname = client.substring(index + 1);
		
		Memcache cache = new Memcache();
		Game game = cache.getGame(gameID);
		JSONObject outgoing = new JSONObject();
		
		if (req.getRequestURI().contains("disconnected")){		
			Player fromPlayer = new Player("System", "gray");
			System.out.println(nickname + " disconnected");
			game.getPlayer(nickname).isActive( false );
			for (Player player : game.getPlayers() ){
				if ( player.isActive() && !player.getNickname().equalsIgnoreCase(nickname) ){
					Message newMsg = new Message(fromPlayer, player, MessageType.GLOBAL, "<b>" + nickname + "</b> has gone idle.");
					outgoing.put("chat", (JSONObject)JSONValue.parse( newMsg.toJson() ));	
					channelService.sendMessage( new ChannelMessage(gameID + "_" + player.getNickname(), outgoing.toJSONString() ) );					
				}
				if ( player.getsNotification(NotificationType.PLAYER_IDLE) ){
					player.sendNotification(NotificationType.PLAYER_IDLE, game, game.getPlayer(nickname) );
				}
			}		
		} else {			
			Player fromPlayer = new Player("System", "gray");
			System.out.println(nickname + " connected");
			for (Player player : game.getPlayers() ){					
				if ( player.isActive() && !player.getNickname().equalsIgnoreCase(nickname) ){
					Message newMsg = new Message(fromPlayer, player, MessageType.GLOBAL, "<b>" + nickname + "</b> is active.");
					outgoing.put("chat", (JSONObject)JSONValue.parse( newMsg.toJson() ));				
					channelService.sendMessage( new ChannelMessage(gameID + "_" + player.getNickname(), outgoing.toJSONString() ) );
				}	
				if ( player.getsNotification(NotificationType.PLAYER_ACTIVE) ){
					player.sendNotification(NotificationType.PLAYER_ACTIVE, game, game.getPlayer(nickname) );
				}
			}
			game.getPlayer(nickname).isActive( true );
//			game.getPlayer(nickname).isReady( false );
			if ( gameID.equalsIgnoreCase("Sample") ){
				Player system = new Player("SecretToaster Admin", "Red");
				system.setEmail("neil@neilpoulin.com");
				NotificationEmail email = new NotificationEmail(system, NotificationType.PLAYER_ACTIVE, game, game.getPlayer(nickname) );
				email.send();
			}
		}
		game.save();
		System.out.println( "MyPlayer is active? " +  game.getPlayer(nickname).isActive() );
	}
}

