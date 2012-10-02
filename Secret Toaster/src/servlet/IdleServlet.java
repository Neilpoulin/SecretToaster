package servlet;

import game.Game;
import game.Memcache;
import game.Player;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class IdleServlet  extends HttpServlet{
	private static final long serialVersionUID = 1L;
	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		String gameID = req.getParameter("gameID");
		String nickname = req.getParameter("nickname");
		String activeString = req.getParameter("active");
		boolean active = Boolean.parseBoolean(activeString);
		
		Memcache cache = new Memcache();
		Game game = cache.getGame(gameID);
		Player player = game.getPlayer(nickname);
		player.isActive(active);
		game.save();
		
		//resp.getWriter().println( game.toJson() );
	}
	
	public void doGet( HttpServletRequest req, HttpServletResponse resp) throws IOException{
		
	}
}
