package game;

import java.lang.reflect.Field;
import java.util.*;
import net.minidev.json.JSONObject;
import com.google.gson.*;

@SuppressWarnings("unused")
public class Order{
	private int orderNumber_;
	private String type_;
	private String knight_;
	private int from_;
	private int to_;
	private String owner_;
	private int troops_;
	
	public Order(int orderNumber_, String type_, String knight_, int from_,
			int to_, String owner_, int troops_) {
		super();
		this.orderNumber_ = orderNumber_;
		this.type_ = type_;
		this.knight_ = knight_;
		this.from_ = from_;
		this.to_ = to_;
		this.owner_ = owner_;
		this.troops_ = troops_;
	}

	public int getTroops() {
		return troops_;
	}

	public void setTroops(int troops) {
		this.troops_ = troops;
	}

	public Order(){
		
	}
	
	public int getOrderNumber() {
		return orderNumber_;
	}
	
	public void setOrderNumber(int orderNumber) {
		this.orderNumber_ = orderNumber;
	}

	public String getType() {
		return type_;
	}
	public void setType(String type) {
		this.type_ = type;
	}

	public String getKnight() {
		return knight_;
	}

	public void setKnight(String knight) {
		this.knight_ = knight;
	}

	public int getFrom() {
		return from_;
	}

	public void setFrom(int from) {
		this.from_ = from;
	}
	public int getTo() {
		return to_;
	}
	public void setTo(int to) {
		this.to_ = to;
	}

	public String getOwner() {
		return owner_;
	}
	public void setOwner(String owner) {
		this.owner_ = owner;
	}

	public boolean equals(Order order){
		return this.orderNumber_ == order.getOrderNumber();
	}
	
	public void update(Order newOrder){
		this.from_ = newOrder.getFrom();
		this.knight_ = newOrder.getKnight();
		this.orderNumber_ = newOrder.getOrderNumber();
		this.owner_ = newOrder.getOwner();
		this.to_ = newOrder.getTo();
		this.type_ = newOrder.getType();
	}
	
	public String toJson(){
		return new Gson().toJson(this);
	}
	
	public Order fromJson(String json){
		Gson gson =  new Gson();
		Order order = gson.fromJson(json, Order.class);
		return order;
	}
}