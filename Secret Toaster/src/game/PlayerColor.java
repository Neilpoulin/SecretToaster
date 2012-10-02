package game;

import java.util.ArrayList;
import java.util.List;

public enum PlayerColor {
	AQUA ("#00FFFF"),
	BLUE ("#0000FF"),
	FUCHSIA ("#FF00FF"), 
	GREEN ("#008000"),
	LIME ("#00FF00"),
	MAROON ("#800000"),
	NAVY ("#000080"),
	OLIVE ("#808000"),
	PURPLE ("#800080"),
	RED ("#FF0000"),
	SILVER ("#C0C0C0"), 
	TEAL ("#008080"),
	GRAY ("#FFFFFF0F"),
	YELLOW ("#FFFF00");
	
	private final String htmlColor_;
	
	PlayerColor(String html){
		htmlColor_ = html;
	}
	
	public String getHtmlCode(){
		return htmlColor_;
	}
	
	public static List<String> getHtmlCodes( List<PlayerColor> playerColors ){
		List <String> htmlCodes = new ArrayList<String>();
		for (PlayerColor color: playerColors){
			htmlCodes.add( color.getHtmlCode() );
		}	
		return htmlCodes;
	}
	
}
