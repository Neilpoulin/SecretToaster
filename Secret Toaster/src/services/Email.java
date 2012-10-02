package services;

import java.io.UnsupportedEncodingException;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
//import javax.activation.DataHandler;
import javax.mail.Multipart;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMultipart;


public class Email {	
	private static final String adminEmail_ = "admin@neilpoulin.com";
	private static final String adminName_ = "SecretToaster Admin";
	
	private Properties props_ = new Properties();
    private Session session_ = Session.getDefaultInstance(props_, null);
	private Message msg_ = new MimeMessage(session_);
	private Multipart mp_ = new MimeMultipart();
	private MimeBodyPart htmlPart_ = new MimeBodyPart();
	private MimeBodyPart textPart_ = new MimeBodyPart();
	
	private String subject_ = "Email from SecretToaster";
	
	private String toEmail_;
	private String toName_;
	private String htmlBody_ = "<b>HTML Email from SecretToaster</b>";
	private String textBody_ = "Email from SecretToaster";
	private String htmlStyleSheet_ = "<style></style>";
	
	public Email(){
		toEmail_ = adminEmail_;
		toName_ = adminEmail_;
		initialize();
	}
	
	public Email(String toEmail){
		toEmail_ = toEmail;
		toName_ = toEmail;
		initialize();
	}
	
	private void initialize(){
		try {
			mp_.addBodyPart(htmlPart_);
			mp_.addBodyPart(textPart_);
		} catch (MessagingException e) {
			e.printStackTrace();
		}
		setMessage();
	}
	
	public void setToEmail(String toEmail){
		toEmail_ = toEmail;
	}
	
	public String getToEmail(){
		return toEmail_;
	}
	
	public void setToName(String toName){
		toName_ = toName;
	}
	
	public String getToName(){
		return toName_;
	}
	
	public void setMessage(){
		System.out.println("toEmail: " + toEmail_  + ", toName: " + toName_ );
		System.out.print(this.htmlBody_ );
		try {
			htmlPart_.setContent(htmlStyleSheet_ + htmlBody_, "text/html");
	        textPart_.setContent(textBody_, "text/plain");
	        			
			msg_.setFrom( new InternetAddress( adminEmail_, adminName_ ) );
            msg_.addRecipient(Message.RecipientType.TO, new InternetAddress(toEmail_, toName_) );
            msg_.setSubject( getSubject() );
	        msg_.setContent(mp_);
            
        } catch (AddressException e) {
            // ...
        } catch (MessagingException e) {
            // ...
        } catch (UnsupportedEncodingException e) {			
			//e.printStackTrace();
		}
	}
	
	public void setHtmlStyleSheet(String htmlStyleSheet){
		this.htmlStyleSheet_ = htmlStyleSheet;
	}
	
	public String getHtmlStyleSheet(){
		return this.htmlStyleSheet_;
	}
	
	public void setHtmlBody(String htmlBody){
		this.htmlBody_ = "<div id=\"email\">" + htmlBody + "</div>";
	}
	
	public String getHtmlBody(){
		return this.htmlBody_;
	}
	
	public String getTextBody() {
		return textBody_;
	}

	public void setTextBody(String body) {
		this.textBody_ = body;
	}

	public String getSubject() {
		return subject_;
	}

	public void setSubject(String subject) {
		this.subject_ = subject;
	}

	public static String getAdminEmail() {
		return adminEmail_;
	}

	public static String getAdminName() {
		return adminName_;
	}
	
	public void send(){
		setMessage();
		try {
			Transport.send(msg_);
		} catch (MessagingException e) {
			e.printStackTrace();
		}
	}
	
}
