package servlet;

import java.io.IOException;
import services.*;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ShareEmailServlet extends HttpServlet{
	private static final long serialVersionUID = 1L;
	
	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		String toEmail = req.getParameter("toEmail");
		String toName = req.getParameter("toName");
		String type = req.getParameter("type");
		String fromName = req.getParameter("fromName");
		String fromEmail = req.getParameter("fromEmail");
		String gameID = req.getParameter("gameID");
		String nickname = req.getParameter("nickname");
		
//		System.out.println("ShareEmailServlet:");
//		System.out.println("type:" + type);
//		System.out.println("toEmail:" + toEmail);
//		System.out.println("fromEmail:" + fromEmail);
		
		ShareEmail email = new ShareEmail(toEmail, toName, fromEmail, fromName, type, gameID, nickname);
		email.send();	
	}

}
