package test;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import net.minidev.json.*;
import com.google.gson.*;

@SuppressWarnings("unused")
public class TestServlet extends HttpServlet{
	private static final long serialVersionUID = 1L;
	
	public void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		String nickname = req.getParameter("nickname");
		String gameID = req.getParameter("gameID");
		String color = req.getParameter("color");
		
		/*Game game = new Game(gameID);
		
		Player player = new Player(nickname, color);
		game.getPlayers().add(player);
			
		Alliance alliance = new Alliance("The Alliance", game.getAlliances().size() );
		alliance.getMembers().add(player);
		game.getAlliances().add( alliance );
		
		Datastore.saveGame(game);	
		resp.getWriter().println( game.toJson() );*/
	}
		
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		/*String gameID = req.getParameter("gameID");
		Game game = Datastore.getGame(gameID);
		resp.getWriter().println( game.toJson() );*/	
		
		resp.getWriter().println( TestGson.testcache() );
	}
}
