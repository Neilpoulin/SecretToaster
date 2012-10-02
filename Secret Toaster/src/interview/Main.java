package interview;

import java.util.*;

public class Main {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		DogFactory dogFactory = new DogFactory();	
		iDog germanShepherd = dogFactory.getDog(DogType.GERMANSHEPHERD);
		iDog toyDog = dogFactory.getDog(DogType.YIPPER);
		iDog greatDane = dogFactory.getDog(DogType.GREATDANE);
		
		List<iDog> dogs = new ArrayList<iDog>();
		dogs.add(greatDane);
		dogs.add(toyDog);
		dogs.add(germanShepherd);
		
		for (iDog d : dogs){
			System.out.println( d.bark() );
		}
	}
}
