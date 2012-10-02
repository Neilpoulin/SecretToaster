package servlet;

import java.io.IOException;
import game.*;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class OrderServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	public void doPost (HttpServletRequest req, HttpServletResponse resp) throws IOException {
		String orderString = req.getParameter("order");
		String gameID = req.getParameter("gameID");
		String nickname = req.getParameter("nickname");
		
		Order order = new Order().fromJson(orderString);
		Memcache cache = new Memcache();
		Game game = cache.getGame(gameID); 
		
		Player player = game.getPlayer(nickname);
		player.addOrder(order);
		
		game.save();
		System.out.print( player.toJson() );
		//System.out.print("Order Number: " + order.getOrderNumber() + ", Knight: " + order.getKnight() );
	}

}
