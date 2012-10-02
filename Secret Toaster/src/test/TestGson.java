package test;


import game.*;

import java.io.UnsupportedEncodingException;
import java.text.*;
import java.util.*;

import javax.mail.internet.InternetAddress;
 
import net.minidev.json.*;
import org.joda.time.*;

import services.NotificationEmail;

import com.google.gson.*;


@SuppressWarnings("unused")
public class TestGson {
	
	public static void main(String[] args) throws ParseException {
		//testGame();
		//getGame("Test2");
		//testMsg();
		//remove();
		//alliance();
		//chat();
		//equalTest();
		//testcache();
		//testBoard();
		//testNeighbors();
		//buildGame();
		//orders();
		//troops();
///		email();
//		battle();
		gameState();
	}

	private static void gameState(){		
		Game game = TestGson.buildGame();		
		
		game.addGameState();
		game.addGameState();
		game.addGameState();
		
		game.setRound(1);
		game.addGameState();
		game.addGameState();
		
		game.setRound(5);
		game.addGameState();
		game.addGameState();
		game.addGameState();
		game.addGameState();
		game.addGameState();
		
		game.setRound(2);
		game.addGameState();
		game.addGameState();
		game.addGameState();
		
		
		//Set<String> keyset = game.getGameState().keySet().
		
		for (String key : game.getGameState().keySet() ){
			List<Game> roundGames =  game.getGameState().get(key);
			
			System.out.println( "GameState size for round " + key + ": " +  roundGames.size() );
		}
		
		System.out.println( game.getGameState().size() );
		System.out.println(game.toJson());
	}
	
	private static void battle() {
		Game game = buildGame();
		Hex hex = game.getBoard().getHex(55);
		Player Neil = game.getPlayer("Neil");
		Player Craig = game.getPlayer("Craig");
		Player Keith = game.getPlayer("Keith");
		Player Lynn = game.getPlayer("Lynn");
		
		game.joinAlliance(Keith, game.getAlliance(Neil));
		game.joinAlliance(Lynn, game.getAlliance(Craig));
		hex.setOwner(Craig);
		hex.setStartingOwner(Craig);
		
		int neilTroops = 400;
		int craigTroops = 300;
		hex.setTroops(Craig, craigTroops);
		hex.setTroops(Neil, neilTroops);
		for (Knight knight : Neil.getKnights()){
			knight.moveTo(game, hex);
		}
		for (Knight knight : Craig.getKnights()){
			knight.moveTo(game, hex);
		}
		
		
		println("Knights:\tlocation");
		for (Knight knight : Neil.getKnights()){
			println( knight.getName()  + "\t" + knight.getLocation() );
		}
		for (Knight knight : Craig.getKnights()){
			println( knight.getName()  + "\t" + knight.getLocation() );
		}
		println("----- ");
		println("Knights on hex:");
		for (Knight knight: hex.getKnights()){
//			println( knight.getName() );			
		}
//		println("\tNeil:");
//		println("\t" + hex.getKnights(Neil).size());
//		println("\tCraig");
//		println("\t" + hex.getKnights(Craig).size());
//		println(hex.toJson());
		println("-----");
		
		Battle battle = new Battle(game, Neil, hex);
		battle.fight();
		
		println( Neil.getNickname() + " \t (+" +  battle.getAttackerBonus() + ")\t" + neilTroops + " --> " + game.getBoard().getHex(55).getTroops(Neil).toString() 
				+ "\t" + hex.getKnights(Neil).size() );
		
		print(Craig.getNickname() + " \t (+" +  battle.getDefenderBonus() + ")\t" + craigTroops + " --> " + game.getBoard().getHex(55).getTroops(Craig).toString() 
				+ "\t" + hex.getKnights(Craig).size() );
		println("\n");
		println("Hex Owner: " + hex.getOwner().getNickname() );
		println("Hex Starting Owner: " + hex.getStartingOwner().getNickname() );
	}

	private static void print(String string){
		System.out.print(string);
	}
	
	private static void println(String string){
		System.out.println(string);
	}

	private static void email() {
		Game game = buildGame();
		Player Neil = game.getPlayer("Neil");
		Player Craig = game.getPlayer("Craig");
		System.out.println(Neil.getEmail());
		NotificationEmail email = new NotificationEmail(Neil.getNickname(), NotificationType.PLAYER_JOIN.toString(), game.getId());
		//System.out.println( email.getBodyHtml() );
		
	}



	private static void troops() {
		Game game = buildGame();
		Player Neil = game.getPlayer("Neil");
		//Hex hex = game.getBoard().getHex(45);
		//hex.setTroops(Neil, new Integer(30) );
		Player Craig = game.getPlayer("Craig");
		
		for ( Hex hex : game.getBoard().getHexes(Neil) ){
			hex.setTroops(Neil, 20 );
			hex.setTroops(Craig, 30 );
			System.out.println("Hex" + hex.getIndex() + " - Neil has: " + hex.getTroops(Neil) + " troops.");
			System.out.println("Hex" + hex.getIndex() + " - Craig has: " + hex.getTroops(Craig) + " troops.");
		}
		
	}



	public static void orders(){
		Game game = buildGame();
		Player neil = game.getPlayer("Neil");
		
		String name = "Sir Neil 0";
		
		Order order = new Order( 1, "MOVE", name, 5, 11, neil.getNickname(), 0 );
		Order order2 = new Order( 2, "FORTIFY", neil.getKnights().get(0).getName(), 32, 43, neil.getNickname(), 0 );
		neil.addOrder(order);
		neil.addOrder(order2);
		neil.getKnights().get(0).getProjectedPositions()[2] = 1111;
		Knight knight = new Knight("Neil", "Sir Neilious", 32);
		
		//System.out.println( knight.getProjectedPositions().toString() );
		//System.out.println("Order Length: " + neil.getOrders().size() );
		
		System.out.println(neil.getKnights().get(0).toJson() );
		
		for (Order o: neil.getOrders() ){			
			//System.out.println("Order Type: " + o.getType().toString() );
			for(int i=0; i< neil.getKnight( o.getKnight() ).getProjectedPositions().length; i++){
				//System.out.println("Projected.." + neil.getKnight( o.getKnight() ).getProjectedPositions()[i] );
			}
			
		}
		
	}
	
	public static void testNeighbors(){
		Game game = buildGame();
		Board board = new Board();
		List<Integer> keeps = board.getKeepIds();
		int index = 55;
		List<Integer> neighbors = board.getNeighbors(index);
		
		Hex hex = board.getHex(index);
		
		System.out.println("Neighbors for Hex (" + board.getX(index) + ", " + board.getY(index) + ")");
		for (Integer i : neighbors){
			System.out.println( "(" + board.getX( i ) + ", " + board.getY( i ) + ")" );
		}
		
		System.out.println("\nNeighbors for Hex " + index);
		for (Integer i : neighbors){
			System.out.println( "Hex " + i );
		}
		
		System.out.println("\nProperty of Hex" + index );
		int q = 0;
		for (Integer i: board.getHex(index).getNeighbors()){
			System.out.println("Hex.neighbors_[" + q +  "] = " + i );
			q++;
		}
	}
	
	public static void testBoard(){
		Game game = buildGame();
		Board board = game.getBoard();
		
		Player Neil  = game.getPlayer("Neil");
		Player Craig = game.getPlayer("Craig");
		
		for (Player player: game.getPlayers()){
		//	board.addPlayer(player);
		}
		
		for (Player player: game.getPlayers() ){
			List<Hex>PlayerHexes = board.getHexes(player);
			System.out.println(player.getNickname() + "'s Hexes: ");
			for (Hex h: PlayerHexes){
				System.out.println( h.getIndex() + "\t(" + h.getType().toString() + ")" + "\tKnights: " + h.getKnights(player) + "\tTroops: " + h.getTroops(player));
			}	
		}
		
		System.out.println("\nAll Hexes: ");
		for (Hex all : board.getHexes()){
			String nickname = "none";
			if ( all.getOwner() != null){
				nickname = all.getOwner().getNickname();
			}
			System.out.println( all.getIndex() + "\t(" + all.getType().toString() + ")\t Owner: " + nickname );
		}		
	}
	
	public static String testcache(){
		Game game = buildGame();
		Memcache cache = new Memcache();
		cache.saveGame(game);
	
		Game game2 = cache.getGame( game.getId() );
		System.out.println( game.equals(game2) );
		return Boolean.toString( game.equals(game2) );
	}
	
	public static void equalTest(){
		Game game = buildGame();
		Player Neil = game.getPlayer("Neil");
		Player Craig = game.getPlayer("Craig");
		Player Keith = game.getPlayer("Keith");
		Player Charlie = game.getPlayer("Charlie");
		Player Katie = game.getPlayer("Katie");
		Player Lynn = game.getPlayer("Lynn");
		
		Player pl = new Player("Neil", "blue");
		Alliance al = game.getAlliance(pl);
		
		System.out.println( game.getAlliance(Neil).equals( new Alliance("Test", 0) ) );
	}
	
	public static void chat(){
		Game game = buildGame();
		
		Player Neil = game.getPlayer("Neil");
		Player Craig = game.getPlayer("Craig");
		Player Keith = game.getPlayer("Keith");
		Player Charlie = game.getPlayer("Charlie");
		Player Katie = game.getPlayer("Katie");
		Player Lynn = game.getPlayer("Lynn");
		
		int index = 1;
		long date1 = 0;
		long date2 = 0;
		long chk = Long.parseLong("0");
		for (Player from: game.getPlayers()){
			for (Player to: game.getPlayers() ){
				Message msg = new Message(from, to, MessageType.GLOBAL, "message number " + Integer.toString(index));
				game.getMessages().add(msg);
				if (index == 12){
					date1 = msg.getDate();
				} else if (index == 24){
					date2 = msg.getDate();
				}
				index++;
				try { Thread.sleep(2); }catch(InterruptedException e){e.printStackTrace();}
			}
		}
		
		List<Message> newMsgs = game.getMessages(Keith, chk);
		System.out.println("There are " + newMsgs.size() + " new messages.");
		for (Message message : newMsgs ){
			System.out.println("From: " + message.getFrom().getNickname() + ", To: " + message.getTo().getNickname() + ", Date: " + message.getDate() + ", Message: " + message.getMessage() );
		}
		
		for (Message message: game.getMessages()){
			//System.out.println("From: " + message.getFrom().getNickname() + ", To: " + message.getTo().getNickname() + ", Date: " + message.getDate() + ", Message: " + message.getMessage() );
		}
		
	}
	
	public static void testMsg(){
		Player from = new Player("fromPlr", "blue");
		Player to = new Player("toPlr", "green");
		Player third = new Player("ThirdPlayer", "pink");
		
		Message msg = new Message(from, to, MessageType.PLAYER, "HELLO THERE!");
		long lastCheck = 0;
		Game game = new Game("testGame");
		game.getPlayers().add(from);
		game.getPlayers().add(to);
		game.getPlayers().add(third);
		
		game.getMessages().add(msg);
		
		//System.out.println( game.getMessages(to, lastCheck ) );
		
		
		System.out.println("msgTo: " + msg.getTo().getNickname() + ", msFrom: " + msg.getFrom().getNickname() + ", msgType: " +  msg.getType().toString() );
		
		Player test = third;
		System.out.println("hasPlayer  " + test.getNickname() + "? " + msg.hasPlayer(test) );
		System.out.println(msg.toJson());
		
		
	}
	
	
	public static void remove(){
		Game game = buildGame();
		
		System.out.println("There are : " + game.getPlayers().size() + " players in the game (" + getNames(game) + ") ");
		
		//System.out.println( game.removePlayer(game.getPlayer("Neil") ) + game.removePlayer(game.getPlayer("Keith")) + game.removePlayer("me") ) ;
		game.getPlayers().add(new Player("Charlie", "teal"));
		
		System.out.println("There are : " + game.getPlayers().size() + " players in the game (" + getNames(game) + ") ");
		
	}
	
	public static void alliance(){
		Game game = buildGame();
		
		Player Neil = game.getPlayer("Neil");
		Player Lynn = game.getPlayer("Lynn");
		Player Keith = game.getPlayer("Keith");
		Player Charlie = game.getPlayer("Charlie");
		
		Alliance newAlliance = game.getAlliance(Lynn);
		int index = 0;
		for(Player player: game.getPlayers()){
			if (index%2 == 0){
				game.joinAlliance(player, game.getAlliance("SixthTeam"));
			} else {
				game.joinAlliance(player, game.getAlliance("SecondTeam") );
			}
				
			index++;
		}
		
		
		for (Alliance alliance: game.getAlliances() ){
			String out = alliance.getName() + " (" + alliance.getMembers().size() + ") ";
			for (Player plyr: alliance.getMembers() ){
				out += plyr.getNickname() + " ";
			}
			
			System.out.println(out);
		}
		
	}
	
	public static Game buildGame(){
		Game game = new Game("testGame");
		
		game.addPlayer( new Player("Neil", "blue") );
		game.addPlayer( new Player("Craig", "green") );
		game.addPlayer( new Player("Keith", "pink") );
		game.addPlayer( "Katie", "purple" );
		game.addPlayer( "Lynn", "red" );
		game.addPlayer( "Charlie", "orange" );
		Player Neil = game.getPlayer("Neil");
		Player Craig = game.getPlayer("Craig");
		Player Lynn = game.getPlayer("Lynn");
		Player Keith = game.getPlayer("Keith");
		Player Katie = game.getPlayer("Katie");
		Player Charlie = game.getPlayer("Charlie");
		
		Neil.setEmail("Neil@neilpoulin.com");
		Craig.setEmail("craig.r.poulin@gmail.com");
		Keith.setEmail("Keithpoulin@comcast.net");
		Lynn.setEmail("lynnpoulin@comcast.net");
		Katie.setEmail("katepoulin@gmail.com");
		
		long lastCheck = 0;
		Message msg = new Message(game.getPlayer("Neil"), game.getPlayer("Keith"), MessageType.PLAYER, "HELLO THERE!");
		//System.out.println(game.toJson());
		return game;
	}
	
	public static String getNames(Game game){
		String playerNames = "";
		for (Player plyr: game.getPlayers() ){
			if ( (game.getPlayers().indexOf(plyr)) == game.getPlayers().size() - 1 ){
				playerNames += plyr.getNickname();
			} else {
				playerNames += plyr.getNickname() + ", ";
			}
		}
		return playerNames;
	}
	
	public static void testGame() {
		String gameID = "testID";
		
		Gson gson = new Gson();
				
		Game game = new Game(gameID);
		game.getPlayers().add( new Player("Neil", "BLUE") );
		game.getPlayers().add( new Player("Keith", "GREEN") );
		game.getPlayers().add( new Player("Lynn", "RED") );
		
		//game.getPlayers().remove(0);
		System.out.println( game.getPlayers().size() );
		for ( Player player: game.getPlayers() ){
			//System.out.println( gson.toJson(player) );
		}
		
		String myJson = gson.toJson( game );
		Game game2 = Game.fromJson(myJson);
		//System.out.println( myJson);
		
		//createGame ("TestGame", "NeilPoulin", PlayerColor.NAVY);
		
		game.getAvailableColors();
		
	}
	
	public static void getGame(String gameId){
		String json = "{\"id_\":\"Test2\",\"players_\":[{\"nickname_\":\"GettingMessage\",\"color_\":\"purple\",\"unassignedKnights_\":3,\"unassignedTroops_\":100}],\"alliances_\":[{\"name_\":\"The Alliance\",\"id_\":0,\"members_\":[{\"nickname_\":\"GettingMessage\",\"color_\":\"purple\",\"unassignedKnights_\":3,\"unassignedTroops_\":100}]}],\"messages_\":[]}";
		Game game = Game.fromJson(json);
		//System.out.println( game.toJson() );
		game.getAvailableColors();
	}
	
	public static void createGame(String gameID, String nickname, String color){
		Game game = new Game(gameID);
		
		Player player = new Player(nickname, color);
		game.getPlayers().add(player);
		//System.out.println( new Gson().toJson(player) );
		
		
		Alliance alliance = new Alliance("The Alliance", game.getAlliances().size() );
		alliance.getMembers().add(player);
		game.getAlliances().add( alliance );
		
	//	Datastore.saveGame(game);
		
		//resp.getWriter().println( game.toJson() );
		//System.out.println( game.toJson() );
		
		
	}
	
}
	



