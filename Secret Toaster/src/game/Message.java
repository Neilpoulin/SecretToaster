package game;

import java.util.Date;

import com.google.gson.Gson;

public class Message {
	private Player from_; 
	private Player to_;
	private MessageType type_; 
	private String message_;
	private long date_ = new Date().getTime();
	
	public Message (Player from, Player to, MessageType type, String message){
		from_ = from;
		to_ = to;
		type_ = type; 
		message_ = message;
	}
	
	public Message(){
		
	}
	
	public Player getFrom() {
		return from_;
	}

	public Player getTo() {
		return to_;
	}

	public MessageType getType() {
		return type_;
	}

	public String getMessage() {
		return message_;
	}
	
	public long getDate(){
		return date_;
	}
	
	public String toJson(){		
		return new Gson().toJson(this);
	}
	
	public static Message fromJson(String json){
		return new Gson().fromJson(json, Message.class);
	}
	
	public boolean hasPlayer(Player player){
		boolean has = false;
		
		if ( player.getNickname().equals(to_.getNickname()) || player.getNickname().equals(from_.getNickname())){
			has = true;
		}

		return has;
	}
	
	public boolean equals (Object obj){
		if (this == obj){
			return true;
		}
		if (obj instanceof Message){
			Message message = (Message) obj;
			return Long.toString( message.getDate() ).equals( Long.toString( this.getDate() ) ) 
					&& message.getFrom().equals( this.getFrom() ) 
					&& message.getTo().equals( this.getTo() ) 
					&& message.getMessage().equals( this.getMessage() );
			
		} else{
			return false;	
		}
		
	}

}
