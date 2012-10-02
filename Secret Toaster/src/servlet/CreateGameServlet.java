package servlet;

import java.io.IOException;

import javax.servlet.http.*;

import net.minidev.json.*;

import game.*;

public class CreateGameServlet extends HttpServlet{
	private static final long serialVersionUID = 1L;

	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		String nickname	= req.getParameter("nickname");
		String gameID = req.getParameter("gameID");
		String color = req.getParameter("color");
		
		Game game = new Game(gameID);
		Player player = new Player(nickname, color);
		game.addPlayer(player);
	
		String status = Datastore.saveGame(game);
		Memcache cache = new Memcache();
		cache.saveGame(game);
		
		JSONObject response = (JSONObject)JSONValue.parse(status);
		response.put("game", (JSONObject)JSONValue.parse( game.toJson() ) );
		resp.getWriter().println( response.toJSONString() );
	} 
	
	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {}
}

