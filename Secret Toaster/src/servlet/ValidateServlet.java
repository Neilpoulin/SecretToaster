package servlet;

import java.io.IOException;
import game.*;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ValidateServlet extends HttpServlet{
	private static final long serialVersionUID = 1L;
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		String gameID = req.getParameter("gameID");
		String nickname = req.getParameter("nickname");
		boolean valid = true;
		Memcache cache = new Memcache();
		Game game = cache.getGame(gameID);
		if ( game != null ){
			Player player = game.getPlayer(nickname);
			if ( player == null ){
				valid = false;
			}
		} else {
			valid = false;
		}
		
		if (! valid){
			resp.getWriter().println(valid);
		} else {
			resp.getWriter().println(valid);
		}
	}

}
