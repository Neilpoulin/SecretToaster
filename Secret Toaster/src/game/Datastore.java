package game;
import java.util.Date;

import com.google.appengine.api.datastore.*;
import game.*;
import net.minidev.json.*;

@SuppressWarnings("unused")
public class Datastore {
	public static DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
	
	public static Game getGame(String gameID){
		Game game = null;
		String gameJson = null;
		
		@SuppressWarnings("deprecation")
		Query query = new Query("Games").addFilter("gameID", Query.FilterOperator.EQUAL, gameID.toUpperCase());
		Entity GameEntity = datastore.prepare(query).asSingleEntity();
		
		if (GameEntity != null){
			gameJson = ( (Text)GameEntity.getProperty("game") ).getValue();
			game = Game.fromJson(gameJson);
		}
		return game;
	}
	
	public static String saveGame(Game game){
		String status = "OK";
		String message = null;
		long date = new Date().getTime();
		
		@SuppressWarnings("deprecation")
		Query query = new Query("Games").addFilter("gameID", Query.FilterOperator.EQUAL, game.getId().toUpperCase() );
		Entity gameEntity = datastore.prepare(query).asSingleEntity();
		
		Memcache cache = new Memcache();
		Game cacheGame = cache.getGame(game.getId());
		
		if (gameEntity != null){
			if( gameEntity.getProperty("creationDate").equals(game.getCreationDate() ) ){
				gameEntity.setProperty("game", new Text( game.toJson() ) );
				message = "saved game " + game.getId();
			} else {
				status = "ERROR";
				message = "Creation date did not match with the gameID \"" + game.getId() + "\" - this game already exists.";
			}
			datastore.put(gameEntity);
		}  else if( cacheGame == null ) {
			gameEntity = new Entity("Games");
			gameEntity.setProperty("game", new Text( game.toJson() ) );
			gameEntity.setProperty("gameID", game.getId().toUpperCase() );	
			gameEntity.setProperty("creationDate", game.getCreationDate() );
			message = "Created game " + game.getId();
			datastore.put(gameEntity);
		} else {
			message = "Datastore not ready yet...";
		}
				
		JSONObject response = new JSONObject();
		response.put("status", status);
		response.put("message", message);
		response.put("date", date);
		return response.toJSONString();
	}
}
