package game;

import java.util.*;

import services.NotificationEmail;

import net.minidev.json.JSONObject;
import net.minidev.json.JSONValue;

import com.google.gson.*;
import com.google.appengine.api.channel.*;

@SuppressWarnings("unused")
public class Game {
	private String id_;
	private final List<Player> players_ = new ArrayList<Player>();
	private final List<Alliance> alliances_ = new ArrayList<Alliance>();
	private final List<Message> messages_ = new ArrayList<Message>();
	private final long creationDate_ = new Date().getTime();
	private final Board board_ = new Board();
	private int allianceCount;
	private int round_ = 0;
	private int fortifyValue_ = 200;
	private final Map<String, List<Game>> gameState_ = new HashMap<String, List<Game>>();
	
	private int maxKnights = 3;
	
	public Game (String id){
		id_ = id.toUpperCase();		
	}
	
	public Game(){
		
	}
	
	public Game(Game game){
		for (Alliance a : game.getAlliances() ){
			alliances_.add(a);
		}
		board_.updateHexes(game.getBoard().getHexes() );
		for (Player player : game.getPlayers()){
			this.players_.add(player);		
		}
		this.round_ = game.getRound();
		this.allianceCount = game.allianceCount;
		this.id_ = game.getId();
	}
	
	public int getRound(){
		return round_;
	}
	
	public void setRound(int round){
		round_ = round;
	}
	
	public void finishRound(){
		boolean finished = true;
		for (Player player: players_){
			if ( player.hasOrders() ){
				finished = false;
				System.out.println("Issuing next order...");
				this.issueNextOrder();
				break;
			}
		}
		if (finished){
			System.out.println("Moving to next round...");
			round_++;
			for (Player player : players_){
				player.isReady(false);
				for (Knight knight : player.getKnights() ){
					for (int i=0; i<knight.getProjectedPositions().length; i++){
						knight.getProjectedPositions()[i] = knight.getLocation();
					}
				}
			}
			this.pushUpdate();
		} 
		this.save();
	}
	
	private void issueNextOrder() {
		int index = (int)Math.floor( Math.random()*this.players_.size() );
		Player player = this.players_.get(index);
		if ( player.hasOrders() ){
			Order order = player.getOrders().get(0);
			player.issueOrder();
			Knight knight = player.getKnight( order.getKnight() );
			Hex hexTo = this.getBoard().getHex( order.getTo() );
			Hex hexFrom = this.getBoard().getHex( order.getFrom() );
			String type = order.getType();
			if (knight == null || !knight.isAlive()){
				return;
			}
			if ( type.equalsIgnoreCase("move") ) {
				knight.moveTo(this, hexTo);
				this.moveTroops( hexFrom, hexTo, player, order.getTroops() );
				
				if (!this.getAlliance( hexTo.getOwner() ).equals( this.getAlliance(player) ) ){
					//a battle will ensue
					Battle battle = new Battle(this, player, hexTo);
					battle.fight();
//					hexTo.setOwner(player);
				} else if ( hexTo.getOwner() == null || hexTo.getOwner().getNickname().equalsIgnoreCase("System") ){
					hexTo.setOwner(player);
				}				
			} else if ( type.equalsIgnoreCase("fortify") ){
				//hexTo.setTroops(player, hexTo.getTroops(player) + this.fortifyValue_ );
				fortifyHex(player, hexTo);
			} else if (type.equalsIgnoreCase("promote") ){
					this.promoteKnight(knight, hexTo);
			}
		}
//		addGameState();
		finishRound();		
	}
	
	public void addGameState(){
		List<Game> games = this.gameState_.get( Integer.toString(round_) );		
		if ( games == null ){
			this.gameState_.put(Integer.toString(this.round_), new ArrayList<Game>() );
			games = this.gameState_.get( Integer.toString(round_) );
		}		
		games.add(new Game(this) );
	}
	
	public Map<String, List<Game>> getGameState(){
		return this.gameState_;
	}
	
	public void fortifyHex( Player player, Hex hex ){
		hex.setTroops(player, hex.getTroops(player) + this.fortifyValue_ );
	}
	
	public void promoteKnight(Knight knight, Hex hex){
		Player player = this.getPlayer(knight.getOwner() );
		int troops = hex.getTroops( player ) - hex.getTroopsToKnight();
		if ( troops >= 0){
			//String name = "Sir " + player.getNickname() + " " + player.getKnights().size();			
			//Knight newKnight = new Knight( player, name, hex.getIndex() );			
			//hex.setTroops(player, troops);
			//the hex should take care of adding knights where need be.. 
			hex.raiseKnight(player);
		} else {
			
		}
	}
	
	public void addKnight(Knight knight){
		Player player = getPlayer( knight.getOwner() );
		Hex hex = this.board_.getHex( knight.getLocation() );
		player.addKnight(knight);
		hex.getKnights().add(knight);
		player.addKnight(knight);
	}
	
	public void moveTroops(Hex from, Hex to, Player player, int troops){
		int available = from.getTroops(player);
		if (troops > available){
			troops = available;
		}
		from.setTroops(player, available - troops);
		to.setTroops(player, to.getTroops(player) + troops);
	}
	
	public long getCreationDate(){
		return creationDate_;
	}
	
	public List<Player> getPlayers() {
		return players_;
	}

	public List<Alliance> getAlliances() {
		return alliances_;
	}

	public List<Message> getMessages() {
		return messages_;
	}
	
	public String getId() {
		return id_.toUpperCase();
	}
	
	public Board getBoard(){
		return board_;
	}
	
	public String toJson(){		
		return new Gson().toJson(this);
	}

	public static Game fromJson(String json){
		return new Gson().fromJson(json, Game.class);
	}
	
	public List<PlayerColor> getAvailableColors(){
		List<PlayerColor> availableColors = new ArrayList<PlayerColor>();
		availableColors.addAll(Arrays.asList(PlayerColor.values()));
		
		List<PlayerColor> usedColors = new ArrayList<PlayerColor>();
		for (Player player: players_){
			usedColors.add( PlayerColor.valueOf( player.getColor().toUpperCase() ) );
		}
		availableColors.removeAll(usedColors);
		return availableColors;
	}
	
	public boolean isNicknameAvailable(String nickname){
		boolean available = true;
		for (Player player: players_){
			if ( player.getNickname().toUpperCase().equals(nickname.toUpperCase() ) ){
				available = false;
				break;
			}
		}
		return available;
	}
	
	public Player getPlayer(String nickname){
		Player player = null;
		for ( Player plyr : players_ ){
			if ( plyr.getNickname().equals(nickname) ){
				player = plyr;
				break;
			}
		}
		return player;
	}

	public List<Message> getMessages(Player player, long lastCheck){
		List<Message> newMessages = new ArrayList<Message>();		
		for ( Message message : this.getMessages(player) ){
			if (message.getDate() > lastCheck){
				newMessages.add(message);
			}
		}
		return newMessages;
	}
	
	public List<Message> getMessages(Player player){
		List<Message> playerMessages = new ArrayList<Message>();
		for (Message message: messages_){
			if (message.getType().equals(MessageType.GLOBAL)){
				playerMessages.add(message);
			} else if (message.getType().equals(MessageType.ALLIANCE)){
				Alliance playerAlliance = getAlliance(player);
				Alliance senderAlliance = getAlliance( message.getFrom() );
				if ( playerAlliance.getName().equals(senderAlliance.getName() ) ){
					playerMessages.add(message);
				}
			} else if (message.hasPlayer(player)){
				playerMessages.add(message);
			} 
		}
		return playerMessages;
	}	
	
	public Alliance getAlliance(String name){
		Alliance alliance = null;
		for (Alliance alnc: alliances_){
			System.out.println("checking alliance name:" + alnc.getName() );
			if ( alnc.getName().equals(name) ){
				alliance = alnc;
				System.out.println("BINGO: name " + alnc.getName() + " = " + name );
				break;
			}
		}
		return alliance;
	}
	
	public Alliance getAlliance(Player player){
		Alliance alliance = new Alliance("__System__", 999);
		alliance.getMembers().add(new Player("System", "GRAY"));
		for (Alliance alnc: alliances_){
			for (Player plyr: alnc.getMembers()){
				if (plyr.getNickname().equals(player.getNickname() ) ){
					alliance = alnc;
					break;
				}
			}			
		}
		return alliance;
	}
	
	public void joinAlliance(Player player, Alliance newAlliance){
		Alliance oldAlliance = getAlliance(player);
		for (Player plyr: oldAlliance.getMembers() ){
			if ( plyr.equals( player ) ){
				oldAlliance.getMembers().remove(plyr);
				if ( oldAlliance.getMembers().isEmpty() ){
					alliances_.remove(oldAlliance);
				}
				break;
			}
		}
		newAlliance.getMembers().add(player);
	}
	
	public void addAlliance( Alliance newAlliance ){
		this.allianceCount++;
		this.alliances_.add(newAlliance);
	}
	
	public void renameAlliance( Alliance alliance, String newName ){
		alliance.setName(newName);
	}
	
	public void renameAlliance( String oldName, String newName ){
		renameAlliance( getAlliance( oldName ), newName );
	}
	
	public void addPlayer(String nickname, String color){
		Player player = new Player(nickname, color);
		addPlayer(player);
		
	}
	
	public void addPlayer(Player player){
		NotificationType noticeType = NotificationType.PLAYER_JOIN; 
		this.allianceCount++;
		Alliance alliance = new Alliance(player.getNickname() + "\'s Alliance", this.allianceCount );
		alliance.getMembers().add(player);
		this.getPlayers().add( player );
		this.getAlliances().add(alliance);
		this.getBoard().addPlayer(player);
		
		for (Player p : players_){
			if (p.getsNotification(noticeType)){
				this.sendNotification(p, noticeType, player);
			}
		}		
	}
	
	public void removePlayer(String nickname){		
		Player player = this.getPlayer(nickname);
		this.removePlayer(player);	
	}
	
	public void removePlayer(Player player){	
		for (Player plyr: players_){
			if ( plyr.equals(player ) ){
				players_.remove(plyr);
				Alliance alliance = this.getAlliance(plyr);
				alliance.getMembers().remove(plyr);
				if (alliance.getMembers().size() == 0){
					alliances_.remove(alliance);
				}
				getBoard().removePlayer(player);
				break;
			}
		}
	}	
	
	public void removeKnight(Knight knight){
		Player owner = this.getPlayer(knight.getOwner());
		owner.removeKnight(knight);
		Hex location = board_.getHex(knight.getLocation());
		location.removeKnight(knight);
		knight.isAlive(false);
	}
	
	@Override
	public boolean equals (Object obj){
		if (this == obj){
			return true;
		}
		if (obj instanceof Game){
			Game game = (Game) obj;
			String dt = Long.toString( game.getCreationDate() );			
			return game.getId().equals( this.getId() ) && dt.equals( Long.toString( this.getCreationDate() ) );
		} else{
			return false;	
		}
	}
	
	public void pushUpdate(){
		ChannelService channelService = ChannelServiceFactory.getChannelService();
		JSONObject msg = new JSONObject();
		msg.put("command", PushType.updateGame.toString() );
		for (Player plyr : this.getPlayers() ){
			channelService.sendMessage( new ChannelMessage(this.id_.toUpperCase() + "_" + plyr.getNickname(), msg.toJSONString() ) );
		}
	}
	
	public void raiseKnight(Hex hex, Player player){
		
	}
	
	public void cache(){
		Memcache cache = new Memcache();
		cache.saveGame(this);
	}
	
	public void save(){		
		this.cache();
		Datastore.saveGame(this);
		this.pushUpdate();
	}
	public void setReady( Player player, boolean ready ){
		player.isReady(ready);
		boolean allReady = true;
		for ( Player plyr: this.players_ ){
			allReady = allReady && plyr.isReady();
		}
		if ( allReady ){
			System.out.println("Finishing Round...");
			this.finishRound();
		} else {
			System.out.println("Not all ready...");
		}
	}
	public void setReady(String nickname, boolean ready){
		Player player = this.getPlayer(nickname);
		this.setReady(player, ready);
	}
	
	public void sendNotification(Player player, NotificationType type){
		NotificationEmail email = new NotificationEmail(player, type, this);
		email.send();
	}
	
	public void sendNotification(Player player, NotificationType type, Player newPlayer){
		NotificationEmail email = new NotificationEmail(player, type, this, newPlayer);
		email.send();
	}
}





