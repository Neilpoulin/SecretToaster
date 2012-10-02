package interview;

public class DogFactory {
	public iDog getDog(DogType type){
		iDog dog = null;
		
		switch(type){
			case GERMANSHEPHERD:
				dog = new GermanShepherd();
			break;
			case GREATDANE:
				dog = new GreatDane();
				break;
			case YIPPER:
				dog = new Yipper();
				break;
		}
		return dog;
	}
}
