package servlet;

import game.Datastore;
import game.Game;
import game.Memcache;
import game.PlayerColor;

import java.io.*;
import java.util.*;

import javax.servlet.http.*;
import com.google.appengine.api.datastore.*;
import com.google.gson.*;

import net.minidev.json.*;



@SuppressWarnings("unused")
public class FindGameServlet extends HttpServlet{
	private static final long serialVersionUID = 1L;
	
	public void doPost(HttpServletRequest req, HttpServletResponse resp)
		throws IOException {
		
	} // end doPost
	
	public void doGet (HttpServletRequest req, HttpServletResponse resp)
		throws IOException {
		String gameID = req.getParameter("gameID");
		String nickname = req.getParameter("nickname");
		
		//get Game from memcache, but also check Datastore. 
		Memcache cache = new Memcache();
		Game game = cache.getGame(gameID);
	
		JSONObject respJSON = new JSONObject();
		JSONObject statusJSON = new JSONObject();
		statusJSON.put("game", "running");
		
		List<PlayerColor> availableColors = new ArrayList<PlayerColor>();
		
		if (game == null){
			//if the game does not exist	
			availableColors.addAll(Arrays.asList(PlayerColor.values()));
			
			statusJSON.put("game", "not created");
			statusJSON.put("colors", JSONValue.parse( new Gson().toJson(availableColors)) );
		} else {	
			//else the game does exist - then check for valid names	
			respJSON.put("game", JSONValue.parse(game.toJson() ) );
			if ( game.isNicknameAvailable(nickname) ){
				statusJSON.put("nickname", "available");
			} else {
				statusJSON.put("nickname", "taken");
			}
			statusJSON.put("colors", JSONValue.parse( new Gson().toJson( game.getAvailableColors() ) ) );
		}
		
		respJSON.put("status", statusJSON);
 		resp.getWriter().println( respJSON.toJSONString() );
	}
}




