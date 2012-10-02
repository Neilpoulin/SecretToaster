package game;


import com.google.gson.Gson;

public class Knight {
	private String name_;
	private String ownerNickname_;
	private int location_ = 0;
	private boolean alive_ = true;
	private int[] projectedPositions_ = {0, 0, 0};
	
	public Knight(String nickname, String name, int location){		
		name_ = name;
		ownerNickname_ = nickname;
		location_ = location;
		for (int i=0; i<projectedPositions_.length; i++){
			projectedPositions_[i] = location_;
		}
	}
	
	public Knight(Player owner, String name, int location){
		name_ =  name;
		ownerNickname_ = owner.getNickname();
		location_ = location;
		for (int i=0; i<projectedPositions_.length; i++){
			projectedPositions_[i] = location_;
		}
	}
	
	public Knight(){
		
	}

	public String getName() {
		return name_;
	}

	public void setName(String name) {
		this.name_ = name;
	}

	public String getOwner() {
		return ownerNickname_;
	}

	public void setOwner(String owner) {
		this.ownerNickname_ = owner;
	}
	
	public void setOwner(Player owner) {
		this.ownerNickname_ = owner.getNickname();
	}
	
	public void setLocation(int location){
		this.location_ = location;
	}
	public void setLocation(Hex hex){
		this.location_ = hex.getIndex();
	}
	
	public int getLocation(){
		return this.location_;
	}
	
	public String toJson(){		
		return new Gson().toJson(this);
	}
	
	public boolean isAlive(){
		return alive_;
	}
	
	public void isAlive(boolean alive){
		this.alive_ = alive;
	}
	
	public void moveTo(Game game, Hex hexTo){		
		Hex fromHex = game.getBoard().getHex(this.location_);
		for (Knight knight : fromHex.getKnights()){
			if (knight.equals(this)){
				fromHex.getKnights().remove(knight);
				break;
			}
		}
		hexTo.getKnights().add(this);
		this.setLocation(hexTo);
	}
	
	
	public static Knight fromJson(String json){
		return new Gson().fromJson(json, Knight.class);
	}

	public int[] getProjectedPositions() {
		return projectedPositions_;
	}
	
	public boolean equals(Knight knight){
		return knight.getName() == this.name_ && knight.getOwner() == this.getOwner();
	}
	
}
