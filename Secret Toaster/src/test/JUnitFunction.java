package test;

import java.util.*;
import java.util.List;

import game.Game;

@SuppressWarnings("unused")
public class JUnitFunction {
	public static void main(String[] args){
		Map<String, String> map = new HashMap<String, String>();
		map.put("1", "One");
		System.out.println( map.get("1").hashCode() );
	}
}
