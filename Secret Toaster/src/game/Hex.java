package game;

import java.util.*;

import com.google.gson.Gson;

public class Hex {
	private int index_;
	private Player owner_ = new Player("System", "gray");
	private Player startingOwner_ = new Player("System", "gray");
	private final List<Map<String, Integer>> troops_ = new ArrayList<Map<String, Integer>>();
	private final List<Knight> knights_ = new ArrayList<Knight>();
	private final List<Integer> neighbors_ = new ArrayList<Integer>();
	private String name_ = null;
	private HexType type_ = HexType.BLANK; 
	
	private int troopsToKnight = 100;
	
	public Hex(int index){
		index_ = index;
	}
	
	public Hex(){
		
	}
	
	public int getIndex() {
		return index_;
	}

	public void setIndex(int index) {
		this.index_ = index;
	}

	public Player getOwner() {
		return owner_;
	}

	public void setOwner(Player owner) {
		this.owner_ = owner;
	}

	public Player getStartingOwner() {
		return startingOwner_;
	}

	public void setStartingOwner(Player startingOwner) {
		this.startingOwner_ = startingOwner;
	}

	public List<Map<String, Integer>> getTroops() {
		return troops_;
	}
	
	public Integer getTroops(Player player){
		Integer troops = new Integer(0);
		for (Map<String, Integer> map: troops_){
			if ( map.containsKey( player.getNickname() ) ){
				troops = map.get( player.getNickname() );
			}
		}
		return troops;
	}
	
	public void setTroops(Player player, int troops){
		setTroops( player, new Integer(troops) );
	}
	
	public void setTroops(Player player, Integer troops){
		boolean found = false;
		for (Map<String, Integer> map: troops_){
			if ( map.containsKey( player.getNickname() ) ){
				found = true;
				map.put(player.getNickname(), troops);
			} 
		}
		if (!found){
			Map<String, Integer> myMap = new HashMap<String, Integer>();
			myMap.put(player.getNickname(), troops);
			troops_.add(myMap);
		}
	}
	
	public void raiseKnight(Player player){
		if ( this.getTroops(player) >= troopsToKnight ){
			int troops = this.getTroops(player) - troopsToKnight;
			this.setTroops(player, troops);
			String knightName = "";
			knightName = "Sir " + player.getNickname() + " " + new Integer(player.getKnights().size()).toString();
			Knight knight = new Knight(player, knightName, this.index_);
			this.knights_.add( knight );
			player.addKnight(knight);
		}
	}
	
	public int getTroopsToKnight() {
		return troopsToKnight;
	}

	public List<Knight> getKnights() {
		return knights_;
	}
	
	public List<Knight> getKnights(Player player){
		List<Knight> knights = new ArrayList<Knight>();
		for (Knight knight : knights_){
			if ( knight.getOwner().equals( player.getNickname() ) ){
				knights.add(knight);
			}
		}
		return knights;
	}
	
	public void removeKnight(Knight knight){
		for (Knight k: knights_){
			if (k.equals(knight)){
				knights_.remove(k);
				break;
			}
		}
	}
	
	public List<Integer> getNeighbors() {
		return neighbors_;
	}

	public String getName() {
		return name_;
	}

	public void setName(String name) {
		this.name_ = name;
	}

	public HexType getType() {
		return type_;
	}

	public void setType(HexType type) {
		this.type_ = type;
	}
	
	@Override
	public boolean equals (Object obj){
		if (this == obj){
			return true;
		}
		if (obj instanceof Hex){
			Hex hex = (Hex) obj;
			return Integer.toString( hex.getIndex() ).equals( Integer.toString( this.getIndex() ) );
		} else{
			return false;	
		}	
	}
	
	public String toJson(){		
		return new Gson().toJson(this);
	}
}
