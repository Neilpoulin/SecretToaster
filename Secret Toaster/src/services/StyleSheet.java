package services;

import java.util.*;

public class StyleSheet {
	private final List<StyleRule> rules_ = new ArrayList<StyleRule>();
	
	public StyleSheet(){
		
	}
	
	public StyleSheet(List<StyleRule> rules){
		rules_.addAll(rules);
	}
	
	public void addRule(StyleRule rule){
		if (this.hasRule(rule)){
			StyleRule r = this.getRule(rule);
			r.update(rule);
			rule = null;
		}else{
			rules_.add(rule);
		}
	}
	
	public void addRule(String selector, String property, String value){
		StyleRule rule = new StyleRule(selector);
		rule.addProperty(property, value);
		addRule( rule );
	}
	
	public StyleRule createNewRule(String selector){
		StyleRule rule = new StyleRule(selector);
		addRule(rule);
		return rule;
	}
	
	public String getHtml(){
		String html = "<style>";
		for (StyleRule rule: rules_){
			html += rule.getHtml();
		}
		return html + "</style>";
	}
	
	public StyleRule getRule(StyleRule rule){
		for (StyleRule r : rules_){
			if ( r.equals(rule) ){
				return r;
			}
		}
		return null;
	}
	
	public StyleRule getRule(String selector){
		for (StyleRule r : rules_){
			if ( r.equals(selector) ){
				return r;
			}
		}
		return null;
	}
	
	public boolean hasRule(StyleRule rule){
		for (StyleRule r : rules_){
			if ( r.equals(rule) ){
				return true;
			}
		}
		return false;
	}
}
