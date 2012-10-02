package test;

public class JUnitTest {
	
	public JUnitTest(){
		
	}
	
	public void test(Object actualResult, Object expectedResult ){
		if (actualResult == expectedResult){
			System.out.println("True");
		} else{
			System.out.println("False");
		}
	}
	
}
