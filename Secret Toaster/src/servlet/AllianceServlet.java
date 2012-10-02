package servlet;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import game.*;


public class AllianceServlet extends HttpServlet{
	private static final long serialVersionUID = 1L;
	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		String nickname	= req.getParameter("nickname");
		String gameID = req.getParameter("gameID");
		String allianceName = req.getParameter("allianceName");
		String newName = req.getParameter("newName");
		String action = req.getParameter("action");
		
		Memcache cache = new Memcache();
		Game game = cache.getGame(gameID);
		
		if ( action.equals("join") ){
			game = join( game, nickname, gameID, allianceName );
		} else if ( action.equals("rename") ){
			game.getAlliance( game.getPlayer(nickname) ).setName( newName );
		} else {
			
		}
		
		cache.saveGame(game);
		resp.getWriter().println( game.toJson() );
	}

	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		String gameID = req.getParameter("gameID");
		
		Memcache cache = new Memcache();
		Game game = cache.getGame(gameID);
		
		resp.getWriter().println( game.toJson() );
	}
	
	private Game join( Game game, String nickname, String gameID, String allianceName ){
		Player player = game.getPlayer(nickname);
		Alliance newAlliance = game.getAlliance(allianceName);
		if ( newAlliance == null ){
			newAlliance = new Alliance(allianceName, game.getAlliances().size() );
			game.addAlliance(newAlliance);
		}
		game.joinAlliance(player, newAlliance);
		return game;
	}
	
}

