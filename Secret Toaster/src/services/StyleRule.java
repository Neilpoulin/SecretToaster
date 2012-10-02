package services;

import java.util.*;

public class StyleRule {
	private String selector_;
	private final Map<String, String> properties_ = new HashMap<String, String>();
	
	public StyleRule(String selector){
		selector_ = selector;
	}
	
	public void setSelector(String selector){
		selector_ = selector;
	}
	
	public String getSelector(){
		return selector_;
	}
	
	public Map<String, String> getProperties(){
		return properties_;
	}
	
	public void addProperty(String property, String value){
		properties_.put(property, value);
	}
	
	public String getHtml(){
		String out = selector_ + "{";
		for (Map.Entry<String, String> entry: properties_.entrySet() ){
			String property = entry.getKey();
			String value = entry.getValue();
			out += property + " : " + value + ";";
		}
	    return out + "}";
	}
	
	public void update(StyleRule rule){
		this.properties_.putAll(rule.getProperties());
	}
	
	public boolean equals(String selector){
		return  selector.equals(this.getSelector());
	}
	
	public boolean equals(StyleRule rule){
		return  rule.getSelector().equals(this.getSelector());
	}
}
