package game;

import java.util.*;

import com.google.gson.Gson;

public class Alliance {

	private String name_;
	private int id_;
	private final List<Player> members_ = new ArrayList<Player>();
	
	public Alliance (String name, int id){
		name_ = name;
		id_ = id;
	}

	public Alliance(){
		
	}
	
	public String getName() {
		return name_;
	}
	public void setName(String name){
		name_ = name;
	}
	
	public int getId() {
		return id_;
	}

	public List<Player> getMembers() {
		return members_;
	}
	
	public String toJson(){		
		return new Gson().toJson(this);
	}
	
	public static Alliance fromJson(String json){
		return new Gson().fromJson(json, Alliance.class);
	}
	
	@Override
	public boolean equals (Object obj){
		if (this == obj){
			return true;
		}
		if (obj instanceof Alliance){
			Alliance alliance = (Alliance) obj;
			return Integer.toString( alliance.getId() ).equals( Integer.toString( this.getId() ) ) && alliance.getName().equals( this.getName() );
		} else{
			return false;	
		}
		
	}
	
}

