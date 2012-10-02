package game;

public enum NotificationType {
	PLAYER_JOIN("Player Join"), 
	PLAYER_QUIT("Player Quit"), 
	PLAYER_IDLE("Player Idle"), 
	PLAYER_READY("Player Ready"), 
	PLAYER_ACTIVE("Player Active"), 
	GAME_ROUNDSTART("Round Starting");
	
	private final String description_;
	NotificationType(String description){
		description_ = description;
	}
	
	public String getDescription(){
		return description_;
	}
}
