package game;

public class Battle {
	private Hex hex_;
	private Game game_;
	private Player defender_;
	private Player attacker_;
	private int attackerBonus_ = 0;
	private int defenderBonus_ = 0;
	
	public Battle(){
		
	}
	public Battle(Game game, Player attacker, Hex hex){
		this.hex_ = hex;
		this.game_ = game;
		this.defender_ = hex.getOwner();
		this.attacker_ = attacker;
		this.attackerBonus_ = calculateAttackerBonus();
		this.defenderBonus_ = calculateDefenderBonus();
	}
	
	/**
	 * Initiates a fight between the players on the land specified. The winning player is returned. 
	 * 
	 * @return winning player
	 */
	public void fight(){
		while ( hasTroops(attacker_) && hasTroops(defender_) ){
			attack();
		}
		Player winner = hasTroops(attacker_) ? attacker_ : defender_;
		Player loser = !hasTroops(attacker_) ? attacker_ : defender_;
		hex_.setOwner(winner);
		for (Knight knight : hex_.getKnights(loser) ){
			knight.isAlive(false);
			game_.removeKnight(knight);			
		}
	}
	
	/**
	 * determine winner or each "die" roll / attack.
	 */
	private void attack(){
		int attackerRoll = roll() + attackerBonus_;
		int defenderRoll = roll() + defenderBonus_;
		Player loser  =  defenderRoll >= attackerRoll ? attacker_ : defender_;
		hex_.setTroops(loser, hex_.getTroops(loser) - 1);
	}
	
	public int roll(){
		return 1 + (int)(Math.random() * ((6 - 1) + 1));				
	}
	
	public boolean hasTroops(Player player){
		if ( hex_.getTroops(player) > 0){
			return true;
		}else {
			return false;
		}		
	}
	
	private int calculateAttackerBonus(){
		return calculateBonus(attacker_);
	}
	
	private int calculateDefenderBonus(){
		return calculateBonus(defender_);
	}
	
	private int calculateBonus(Player player){
		int bonus = 0;
		Alliance alliance = game_.getAlliance(player);
		int members = alliance.getMembers().size();
		
		bonus = members;
			
		return bonus;
	}
	
	public Hex getHex() {
		return hex_;
	}
	public void setHex(Hex hex_) {
		this.hex_ = hex_;
	}
	public Game getGame() {
		return game_;
	}
	public void setGame(Game game_) {
		this.game_ = game_;
	}
	public Player getDefender() {
		return defender_;
	}
	public void setDefender(Player defender_) {
		this.defender_ = defender_;
	}
	public Player getAttacker() {
		return attacker_;
	}
	public void setAttacker(Player attacker_) {
		this.attacker_ = attacker_;
	}
	public int getAttackerBonus() {
		return attackerBonus_;
	}
	public void setAttackerBonus(int attackerBonus_) {
		this.attackerBonus_ = attackerBonus_;
	}
	public int getDefenderBonus() {
		return defenderBonus_;
	}
	public void setDefenderBonus(int defenderBonus) {
		this.defenderBonus_ = defenderBonus;
	}
	
	
	
}
