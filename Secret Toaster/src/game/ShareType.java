package game;

public enum ShareType {
	INVITE("Invitation"),
	SELF("Link To My Game");
	
	private String description_;
	
	ShareType(String description){
		this.description_ = description;
	}
	
	public String getDescription(){
		return this.description_;
	}
}
