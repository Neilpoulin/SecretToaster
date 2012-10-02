<!DOCTYPE>
<html>
	<head>
		<title>Rules | SecretToaster</title>
		<link type="text/css" rel="stylesheet" href="/styles/about.css"/>
		<script type="text/javascript"> //Google Analytics
			var _gaq = _gaq || [];
			_gaq.push(['_setAccount', 'UA-33466629-1']);
			_gaq.push(['_trackPageview']);
			
			(function() {
			  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			})();		
		</script>
	</head>
	<body>
		<div id="gameRules">
			<h1>About Secret Toaster</h1>
			<p class="notice">
				This game is undergoing active development and not all features may work properly. 
				Please contact Neil at <a href="mailto:neil@neilpoulin.com">neil@neilpoulin.com</a> with any questions, comments, or bug reports.
			</p>
			<p>
				SecretToaster is the code-name for development version of this online game. It is an online, multi-player game based on a board game invented by Craig Poulin in 2011. 
				It is a turn based game where each player tries to achieve his/her Victory Condition by strategically issuing orders to their Knights and creating alliances with other players.  
			</p>
			<h2 id="tableOfContents">Table of Contents</h2>
			<ol id="TOC"></ol>
		<div>	
			<h2 id="gettingStarted">Getting Started</h2>
			<p>
				To get started, visit the <a href="/lobby.jsp" target="_blank">lobby</a>. From there, you can join/create a new game, or continue one of your recent games. To join/create a new game, you will need to choose a Nickname, a Game ID and a color. 
			</p>			
			<p>
				<b>Join to a Game-in-Progress</b>: To connect to a game in progress, enter the Game ID of the game you wish to join.  
			</p>
			<p>
				<b>Create a new Game</b> To create a new game, enter a game ID you wish to use. Once you have entered your Nickname and Game ID, click search, select a color, then click the button to connect!
			</p>
			<p>
				<b>View a Sample Game</b> If you just want to see what the game looks like, you can view a <a href="/index.jsp?gameID=SAMPLE&nickname=Sample1" target="_blank">sample game here</a>.
			</p>
			<p>
				<b>Recent Games</b>The browser will remember recent games that you have joined. You will find a list of links to those games below the join screen.
			</p>
		</div>
		<div>	
			<h2 id="rulesAndGameplay">Rules and Gameplay</h2>
			<i>Choose your Knights wisely, and your allies wiselier...</i>
			
			<h3 id="startingSetup">Starting Setup</h3>
				<ul>
					<li>
						Players are given a Victory Condition they must achieve to win.
					</li>
					<li>
						Players are provided a homeland with 1 commander and 5 soldiers
					</li>
					<li>
						All other lands are neutral
					</li>
				</ul>
			
			<h3 id="keyConcepts">Key Concepts</h3>
				<p>
					The game ends when all players in an Alliance have achieved each of their Victory Conditions.
					These conditions must be held until the end of the Round. A player cannot win alone - 
					he must be allied with at least one other player. 
				</p>
				<p>
					There is no advantage to owning more land.
				</p>
				<p>
					The strategy is within deciding maneuvers and what alliances to make and break. 
				</p>
			
			<h3 id="victoryConditions">Victory Conditions</h3>
				<ul>
					<li>
						<b>Kingmaker</b> - This player must hold the center Castle. 
						Each game will have two players with this Victory Condition.
					</li>
					<li>
						<b>Expansionist 1</b> - This player must hold at least 12 lands total. 
						They must have at least 3 of the Neighboring lands on their left. 
					</li>
					<li>
						<b>Expansionist 2</b> - Like Expansionist 1, but this player must hold 3 pands of the player to their right. 
					</li>
					<li>
						<b>Defender</b> This player must hold all of their original lands
					</li>
				</ul>
				
			<h3 id="turnProcess">Turn Process</h3>
				<ol>
					<li>
						Players pass notes to negotiate in secret
					</li>
					<li>
						Players issue 3 orders. Once they are done, click "Ready".
						<ul>
							<li>
								Orders cannot be modified once you send them.
							</li>
							<li>
								Orders will be executed in sequentially.
							</li>							
						</ul> 
					</li>
					<li>
						The player who is next to issue an order will be determined randomly.
						<ul>
							<li>
								The next un-executed order for the selected player will be executed	.		
							</li>
							<li>
								If no orders remain for the selected player, a new player will be selected.
							</li>
						</ul> 
					</li>
					<li>
						The orders are executed (see below) until all orders for all players have been executed
					</li>					
				</ol>
				
			<h3 id="alliances">Alliances</h3>
				<p>
					Alliances can be declared at any time. Use the Alliances menu to view and edit current alliances. 
				</p>	
				<p>
					If an alliance is broken during a turn, a battle will break out between any former allies that occupy the same land, 
					once all other moves have been processed. 
				</p>
			
			<h3 id="orders">Orders</h3>
				<p>
					All orders include a who, what, where, and with. 
					All orders are issued to a Knight. If the specified Knight has died in battle, the order can not be fulfilled. 	
				</p>
				<ul>
					<li>
						<b>WHO</b> - any Knight in play (yours or an ally's) 
					</li>
					<li>
						<b>WHAT</b> - one of the follow ing actions:
						<ul>
							<li>
								<b>Fortify</b> - Build up defenses on current land by recruiting new troops from the local population
							</li>
							<li>
								<b>Move</b> - Move the selected Knight with a speficied number of troops
							</li>
						</ul>						
					</li>
					<li>
						<b>Where</b> - Only for move/attack: Attacks can only occur to adjacent locations, 
						but moves can be up to two owned (not neutral or other player owned) pieces of land. 
					</li>
					<li>
						<b>With</b> - Move/Attack only: Number of men to attack or more with. Only applies when a Knight remains. 
					</li>
				</ul>
				
			<h3 id="orderTypes">Order Types</h3>
				<ul>
					<li>
						<b>Fortify</b> - The Knight raisers 4 soldiers from the local population
					</li>
					<li>
						<b>Promote</b> - The Knight promotes a new Knight from the troops on his land. Requires multiple troops to promote one Knight.
					</li>
					<li>	 
						<b>Move</b> - The Knight moves into an adjacent land. If the land is unoccupied (neutral or enemy owned), 
						the commander conquers it for his Lord. A Knight may move to the land owned by an allied player but will not conquer it. 
						If the land is owned by any player in his Alliance, the Knight can move two lands in one move.
					</li>	 
					<li>
						<b>Attack</b> - Any  move onto an occupied enemy-controlled land will become an attack and a battle will ensue. 
						See the battle section for details on how a winner is determined.
					</li> 					
				</ul>
			<h3 id="battles">Battles</h3>
				<p>
					Rules are still being tweaked. See below for current calculations. Having more allies increases attack bonus. 
					Battles will rage on until one side has been vanquished.
				</p>
				<p>
					The outcome of a battle is determined the outcome of smaller "fights", until one side has no troops left. A fight is determined by the following:
					<ul>
						<li>A "die" roll (random number between 1 and 6)</li>
						<li>A bonus, determined by the number of allies the player has (+1 for each ally)</li>
						<li>The player with the smallest "attack score" (die roll + bonus) is the loser. Ties go to the defender.</li>
						<li>One troop is removed from the loser of the fight.</li>
					</ul>	
					Currently, Knights do NOT add to your attack. Once all the troops are gone, any remaining knights will be destroyed. 				 
				</p>
				
		</div>
		</div>
		<script type="text/javascript" src="/js/plugins/jquery.js"></script>
		<script type="text/javascript" src="/js/plugins/prefix-free.js"></script>
		<script type="text/javascript" src="/js/about.js"></script>
	</body>
</html>















