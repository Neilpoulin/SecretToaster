package game;

import java.util.*;

import com.google.gson.Gson;

public class Board {
	private final int numx_ = 10;
	private final int numy_ = 11;
	private final List<Hex> hexes_ = new ArrayList<Hex>();
	private final int[] keepInts_ = {23, 26, 52, 58, 83, 86};
	private final List<Integer> keepIds_ = new ArrayList<Integer>();
	private final int castleId_ = 55; 
	
	public Board(){
		initializeHexes();
		buildKeepList();
	}
	
	private void buildKeepList(){
		for (int i = 0; i< keepInts_.length; i++){
			keepIds_.add(new Integer(keepInts_[i] ) );
		}
	}
	
	public void updateHexes( List<Hex> newHexes){
		for ( Hex newHex : newHexes ){
			Hex oldHex = this.getHex(newHex);
			this.hexes_.remove(oldHex);
			this.hexes_.add(newHex);
		}
	}
	
	public Hex getHex( Hex hex ){
		return getHex( hex.getIndex() );
	}
	
	private void initializeHexes(){
		for (int i=0; i < numx_ * numy_; i++){
			Hex hex = new Hex(i);
			for (int j=0; j < keepInts_.length; j++){
				int keepIndex = keepInts_[j];				
				if (i == keepIndex){					
					hex.setType(HexType.KEEP);
				} 		
			}
			if( i == castleId_){
				hex.setType(HexType.CASTLE);
			} 
			hexes_.add(hex);			
		}
		for ( Hex hex: this.getHexes() ){
			hex.getNeighbors().clear();
			List<Integer> neighbors = this.getNeighbors(hex);
			hex.getNeighbors().addAll( neighbors ) ;
			int index = hex.getIndex();
			
			if ( hex.getType().equals(HexType.KEEP) || hex.getType().equals(HexType.CASTLE) ){
				for (Integer i: neighbors){
					Hex h = this.getHex(i);
					h.setType(HexType.LAND);
				}
			} else if( index == 35 || index == 46 || index == 75 || index == 63 || index == 43 || index == 66){
				this.getHex(index).setType(HexType.LAND);
			}			
		}	
	}
	
	public List<Integer> getNeighbors(Hex hex){
		return getNeighbors( hex.getIndex() );
	}
	
	public List<Integer> getNeighbors(int index){
		List<Integer> neighbors = new ArrayList<Integer>();
		List<Hex> temp = new ArrayList<Hex>();
		int x = getX(index);
		int y = getY(index);		
		if (y % 2 != 0){
			temp.add( getHex( getIndex(x, y-1) ) );
			temp.add( getHex( getIndex(x+1, y) ) );		
			temp.add( getHex( getIndex(x, y+1) ) );		
			temp.add( getHex( getIndex(x-1, y+1) ) );
			temp.add( getHex( getIndex(x-1, y) ) );	
			temp.add( getHex( getIndex(x-1, y-1) ) );
		}else {			
			temp.add( getHex( getIndex(x+1, y-1) ) );
			temp.add( getHex( getIndex(x+1, y) ) );			
			temp.add( getHex( getIndex(x+1, y+1) ) );
			temp.add( getHex( getIndex(x, y+1) ) );
			temp.add( getHex( getIndex(x-1, y) ) );
			temp.add( getHex( getIndex(x, y-1) ) );
		}	
		for (Hex h: temp){
			try{
				neighbors.add( new Integer( h.getIndex() ) );
			} catch(NullPointerException e){
				neighbors.add(null);
			}
			
			
		}	
		return neighbors;
	}
	
	public List<Hex> getKeeps(){
		List<Hex> keeps = new ArrayList<Hex>();
		for (Hex hex: hexes_){
			if ( hex.getType() == HexType.KEEP ){				
				keeps.add(hex);
			}
		}
		return keeps;
	}
	
	public Hex getHex(int index){
		Hex hex = null;
		for (Hex h: hexes_){
			if (h.getIndex() == index ){
				hex = h;
				break;
			}
		}
		return hex;
	}
	
	public Hex getHex(Integer index){
		int i = index.intValue();
		Hex hex = null;
		for (Hex h: hexes_){
			if ( h.getIndex() == i ){
				hex = h;
				break;
			}
		}
		return hex;
	}
	
	public Integer getX(Hex hex){
		return getX( hex.getIndex() );
	}
	
	public Integer getY(Hex hex){
		return getY( hex.getIndex() );
	}
	
	public Integer getX(Integer index){
		Integer result = null;
		if (index != null){
			int x = index.intValue() % numx_;
			result = new Integer(x);
		}
		return result;
	}
	
	public Integer getY(Integer index){
		Integer result = null;
		if (index != null){
			int y = (int)Math.floor(index.intValue()/numx_);
			result = new Integer( y );			
		}	
		return result;
	}
	
	public int getIndex(int x, int y){
		return x + numx_*y;
	}

	public int getNumx() {
		return numx_;
	}

	public int getNumy() {
		return numy_;
	}


	public int[] getKeepInts() {
		return keepInts_;
	}
	
	public String toJson(){		
		return new Gson().toJson(this);
	}
		
	public List<Integer> getKeepIds(){
		return keepIds_;
	}
	
	public int getCastleId(){
		return castleId_;
	}
	
	public Hex getCastle(){
		return this.getHex(castleId_);
	}
	
	public List<Hex> getHexes() {
		return hexes_;
	}
	
	public List<Hex> getHexes(Player player){
		List<Hex> playerHexes = new ArrayList<Hex>();
		for (Hex hex: hexes_){
			
			if ( hex.getOwner() != null){
				if ( hex.getOwner().equals(player) ){
					playerHexes.add(hex);
				}
			}			
		}
		return playerHexes;
	}
	
	public void changeOwner(Hex hex, Player player){
		hex.setOwner(player);
	}
	
	public void removePlayer(Player player){
		for (Hex hex: hexes_){
			if (hex.getOwner() != null){
				if ( hex.getOwner().equals(player) ){
					hex.setOwner(null);
				}
			}
				
		}
	}
	public void addPlayer(Player player){
		Hex keep = getRandomFreeKeep();
		keep.setStartingOwner(player);
		keep.setOwner(player);
		String knightName = "";
		knightName = "Sir " + player.getNickname() + " " + new Integer( player.getKnights().size() ).toString();
		Knight knight = new Knight(player, knightName, keep.getIndex() );
	
		player.addKnight(knight);
		Map <String, Integer> troops = new HashMap<String, Integer>();
		//Map <String, List<Knight> > knights = new HashMap<String, List<Knight> >();
		List<Knight> knights = new ArrayList<Knight>();
		
		troops.put(player.getNickname(), new Integer( player.getUnassignedTroops() ) );
		knights.add(knight);
		
		keep.getTroops().add( troops );
		keep.getKnights().addAll( knights );
		
		for (Integer integer: getNeighbors(keep) ){
			Hex hex = getHex( integer.intValue() );
			hex.setStartingOwner(player);
			hex.setOwner(player);
			Map <String, Integer> tr = new HashMap<String, Integer>();			
			tr.put(player.getNickname(), new Integer(0) );			
			hex.getTroops().add(tr);
		}
	}
	
	public Hex getRandomFreeKeep(){
		List<Hex> keeps = getFreeKeeps();
		int index = (int)Math.floor( Math.random()*keeps.size() );		
		return keeps.get(index);
	}
	
	public List<Hex> getFreeKeeps(){
		List<Hex> free = new ArrayList<Hex>();
		for (int i=0; i < keepInts_.length; i++){
			int id = keepInts_[i];
			if (getHex(id).getStartingOwner() == null || getHex(id).getStartingOwner().getNickname().equalsIgnoreCase("system") ){
				free.add( getHex(id) );
			}
		}
		return free;
	}
	
}
