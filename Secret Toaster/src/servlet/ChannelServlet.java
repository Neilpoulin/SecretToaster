package servlet;

import game.Game;
import game.Memcache;

import javax.servlet.http.*;
import java.io.IOException;
import com.google.appengine.api.datastore.*;
import net.minidev.json.*;
import org.joda.time.*;
import com.google.appengine.api.channel.*;

@SuppressWarnings("unused")
public class ChannelServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	public void doPost (HttpServletRequest req, HttpServletResponse resp) throws IOException {
		String nickname = req.getParameter("nickname");
		String gameID = req.getParameter("gameID");
		String message = req.getParameter("message");
		
		gameID = gameID.toUpperCase();
		
		String key = gameID.toUpperCase() + "_" + nickname;
		
		JSONObject newMessage = new JSONObject();
		
		newMessage.put("from", nickname);
		newMessage.put("message", message);
		newMessage.put("gameID", gameID);	
		
		ChannelService channelService = ChannelServiceFactory.getChannelService();
		channelService.sendMessage(new ChannelMessage(key, newMessage.toJSONString() ));			
	}
	
	public void doGet (HttpServletRequest req, HttpServletResponse resp) throws IOException {
		String gameID = req.getParameter("gameID");
		String nickname = req.getParameter("nickname");
		
		gameID = gameID.toUpperCase();
		Memcache cache = new Memcache();
		Game game = cache.getGame(gameID);
		
		String tokenString = gameID.toUpperCase() + "_" + nickname;
		JSONObject JSONresponse = new JSONObject();
		ChannelService channelService = ChannelServiceFactory.getChannelService();
		String token = channelService.createChannel(tokenString);			
		JSONresponse.put("token", token);
		resp.getWriter().println( JSONresponse.toJSONString() );
	}
}
