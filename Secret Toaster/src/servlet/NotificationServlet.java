package servlet;

import game.*;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class NotificationServlet extends HttpServlet{
	private static final long serialVersionUID = 1L;
	
	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		String type = req.getParameter("type");
		String preference = req.getParameter("preference");
		String gameID = req.getParameter("gameID");
		String nickname = req.getParameter("nickname");
		String email = req.getParameter("email");
	
		boolean pref = Boolean.parseBoolean(preference);
		Memcache cache = new Memcache();
		Game game = cache.getGame(gameID);
		Player player = game.getPlayer(nickname);
		player.setEmail(email);
		player.updateNotification(type, pref);
		
		game.save();
	}
}
