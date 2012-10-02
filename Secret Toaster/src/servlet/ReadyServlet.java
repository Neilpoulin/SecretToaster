package servlet;

import game.*;



import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class ReadyServlet  extends HttpServlet{
	private static final long serialVersionUID = 1L;
	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		String gameID = req.getParameter("gameID");
		String nickname = req.getParameter("nickname");
		String readyString = req.getParameter("ready");
		boolean ready = Boolean.parseBoolean(readyString);
		
		Memcache cache = new Memcache();
		Game game = cache.getGame(gameID);
		game.setReady(nickname, ready);
		game.save();
		
		for (Player player: game.getPlayers()){
			if (player.getsNotification(NotificationType.PLAYER_READY)){
				player.sendNotification(NotificationType.PLAYER_READY, game, game.getPlayer(nickname));
			}
		}
		
	}
	
	public void doGet( HttpServletRequest req, HttpServletResponse resp) throws IOException{
		
	}
}
