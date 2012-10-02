package game;

import java.util.*;

import net.sf.jsr107cache.*;

public class Memcache {
	private Cache cache;
	public Memcache(){	
	    try {
	        CacheFactory cacheFactory = CacheManager.getInstance().getCacheFactory();
	        cache = cacheFactory.createCache(Collections.emptyMap());
	    } catch (CacheException e) {
	        // ...
	    }
	}
	
	public void saveGame(Game game){
		cache.put(game.getId().toUpperCase(), game.toJson() );
	}
	
	public Game getGame(String gameID){
		Game game = null;
		if ( cache.get(gameID.toUpperCase() ) != null ){
			game =  Game.fromJson( (String)cache.get(gameID.toUpperCase() ) );
		} else {
			game = Datastore.getGame(gameID);
		}
		
		return game;
	}
	
}
