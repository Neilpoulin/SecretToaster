package servlet;

import game.*;
import java.io.IOException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class UpdateServlet extends HttpServlet{
	private static final long serialVersionUID = 1L;

	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException{
		String gameID = req.getParameter("gameID");		
		Memcache cache = new Memcache();
		Game game = cache.getGame(gameID);
		
		resp.getWriter().println( game.toJson() );		
	}
	
	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException{
		String gameID = req.getParameter("gameID");		
		Memcache cache = new Memcache();
		Game game = cache.getGame(gameID);
		game.pushUpdate();	
	}
}
