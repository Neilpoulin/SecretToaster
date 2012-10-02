package game;

import com.google.gson.Gson;
import java.util.*;

import services.NotificationEmail;

public class Player {
	private String nickname_;
	private String color_;
	private int unassignedKnights_ = 2;
	private final List<Knight> knights_ = new ArrayList<Knight>();
	private int unassignedTroops_ = 100;
	private boolean ready_ = false;
	private boolean active_ = true;
	private final List<Order> orders_ = new ArrayList<Order>();
	private String email_ = null;
	private final Map<NotificationType, Boolean> notifications_ = new HashMap<NotificationType, Boolean>();	
	
	public Player(String nickname, String color){
		// knights are added at the Board level
		nickname_ = nickname;
		color_ = color;
		notifications_.put(NotificationType.PLAYER_JOIN, new Boolean(false) );		
	}
	
	public Player(){
	
	}
	
	public List<Order> getOrders(){
		return orders_;
	}
	
	public void addOrder(Order order){
		Order myOrder = this.getOrder(order);
		if ( myOrder != null ){
			myOrder.update(order);
			removeOrdersAfter(myOrder.getOrderNumber());
//			updateProjections(order);
			
		} else {
			this.orders_.add(order.getOrderNumber() - 1, order);			
		}
		updateProjections(order);
//		for (Order o : orders_){
//			String knightName = o.getKnight();
//			Knight knight = this.getKnight(knightName);
//			if (knight != null){
//				knight.getProjectedPositions()[o.getOrderNumber()-1] = o.getTo();							
//			}			
//		}
	}
	
	private void updateProjections(Order order) {
		for (Knight knight : knights_){			
			int lastPosition = knight.getProjectedPositions()[order.getOrderNumber()-1];
			if (knight.getName().equals(order.getKnight())){
				knight.getProjectedPositions()[order.getOrderNumber()-1] = order.getTo();
				lastPosition = order.getTo();
			}
			for ( int i= order.getOrderNumber()-1; i<knight.getProjectedPositions().length; i++ ){
				knight.getProjectedPositions()[i] = lastPosition;		
			}
		}
	}

	public Order getOrder(int orderNumber){
		for (Order order: this.orders_){
			if (order.getOrderNumber() == orderNumber){
				return order;
			}
		}
		return null;
	}
	
	private void removeOrdersAfter(int orderNumber){
		for (int i = 1; i < 4; i++){
			if (i > orderNumber){
				orders_.remove(getOrder(i) );
			}
		}
	}
	
	public Order getOrder(Order order){
		for (Order temp : this.orders_){
			if (temp.equals(order) ){
				return temp;
			}
		}
		return null;
	}
	
	public void issueOrder(){
		//mostly done on the game/board level
		if ( this.hasOrders() ){
			orders_.remove(0);
		}
	}
	
	public boolean hasOrders(){
		if ( orders_.size() > 0 ){
			return true;
		} else{
			return false;
		}
	}
	
	public boolean isActive(){
		return active_;
	}

	public void isActive( boolean active ){
		active_ = active;
	}
	
	public void isReady( boolean ready ){
		ready_ = ready;
	}
	
	public boolean isReady(){
		return ready_;
	}
	
	public String getNickname() {
		return nickname_;
	}

	public String getColor() {
		return color_;
	}

	public int getUnassignedKnights() {
		return unassignedKnights_;
	}

	public int getUnassignedTroops() {
		return unassignedTroops_;
	}
	
	public Knight getKnight(String name){
		Knight knight = null;
		for (Knight k:knights_){
			if ( k.getName().equals(name) ){
				return k;
			}
		}
		return knight;
	}
	
	public List<Knight> getKnights(){
		return knights_;
	}
	public void addKnight(Knight knight){
		this.knights_.add(knight);		
	}
	
	public void addKnight(String name, int location){
		Knight knight = new Knight(this, name, location);
		this.knights_.add(knight);		
	}
	
	public void addKnight(String name, Hex hex){
		Knight knight = new Knight(this, name, hex.getIndex() );
		this.knights_.add(knight);		
	}
	
	public void removeKnight(Knight knight){
		for (Knight k: knights_){
			if (k.equals(knight)){
				knights_.remove(k);
				break;
			}
		}
	}
	
	public void removeKnight(String name){
		removeKnight( this.getKnight(name) );
	}
	
	public Map<NotificationType, Boolean> getNotifications() {
		return notifications_;
	}
	
	public void updateNotification(String type, String value){
		this.updateNotification(NotificationType.valueOf(type), new Boolean( Boolean.parseBoolean(value) ) );
	}
	
	public void updateNotification(String type, boolean value){
		this.updateNotification(NotificationType.valueOf(type), new Boolean(value) );
	}
	
	public void updateNotification(NotificationType type, Boolean value){
		notifications_.put(type, value);
	}
	
	public boolean getsNotification(NotificationType type){
		return this.getNotifications().containsKey(type) && this.getNotifications().get(type).equals(new Boolean(true));
	}
	
	public String getEmail() {
		return email_;
	}

	public void setEmail(String email) {
		this.email_ = email;
	}
	
	public void sendNotification(NotificationType type, Game game){
		NotificationEmail email = new NotificationEmail(this, type, game);
		email.send();
	}
	
	public void sendNotification(NotificationType type, Game game, Player referencePlayer){
		NotificationEmail email = new NotificationEmail(this, type, game, referencePlayer);
		email.send();
	}
	
	public String toJson(){		
		return new Gson().toJson(this);
	}
	
	public static Player fromJson(String json){
		return new Gson().fromJson(json, Player.class);
	}
	
	public boolean equals (Object obj){
		if (this == obj){
			return true;
		}
		if (obj instanceof Player){
			Player player = (Player) obj;			
			return player.getNickname().equals( this.getNickname() ) && player.getColor().equals( this.getColor() );
			
		} else{
			return false;	
		}
		
	}
	
}
