//this file initializes the hex, player, and alliance arrays, which are global variables
//call assignHexGroup(n) for each player when they join, using their player number
//some functions could also be used during gameplay
//this initialization involves the random assignment of players to land - it should be run server-side

window.hex = [];
window.player = [];
window.alliance = [];
window.hexGroup = [];

$(document).ready(function(){
	initializeHexArray();
	initializePlayers();
	initializeAlliances();
});

//creates default, blank objects for each board location
//hex objects are stored in an array with the location determined by (x + numx*y) - e.g. if numx = 11, location 4_2 would be hex[26]
function initializeHexArray(){
	
	var numx = Number($("#numx").val());	//sets numx to assigned number of hexes in the x direction
	var numy = Number($("#numy").val());	//sets numy to assigned number of hexes in the y direction
	
	for (var i = 0; i < numx; i++){
		for (var j = 0; j < numy; j++){
			var m = i+numx*j;
			hex[m] = {
				"hexType" : 'blank',	//identifies type of space; 'blank', 'keep', 'land', 'shortcut'
									//after creating the default objects for all locations, we can implement a function to update this as needed for all hexes
				"startingOwner" : player[0],
				"owner" : player[0],	//an object for each player would probably make this expand better
				"location" : [i,j],
				"neighbors" : {
					"NE" : [],
					"E" : [],
					"SE" : [],
					"SW" : [],
					"W" : [],
					"NW" : []
				}, //when the game is not full, these would be updated for "shortcuts"
				"locationName" : 'Blackwater Bay',	//this should not be the same of each location; pull from list of random names?
				"soldiers" : [100,0,0,0,0,0,0], //soldier array corresponds to neutral, players 1-6
				"knights" : [0,0,0,0,0,0,0] //knight array corresponds to neutral, players 1-6
			}	
		}
	}
};

//creates default, blank objects for each player
function initializePlayers(){
	for (var i = 0; i < 7; i++){
		player[i] = {
			"landStart" : [],	//the "home territory" minus keep; set in function assignHexGroup
			"keepStart" : 0,	//the "home keep", set in function assignHexGroup
			"color" : 'white',
			"alliance" : i,	//starts each player in their own alliance slot
			"unassignedSoldiers" : 100,	//each player starts with 100 unassigned soldiers
			"unassignedKnights" : 3,	//each player starts with 3 unassigned knights
		}
	}
};

function initializeAlliances(){
	for (var i = 0; i < 7; i++){
		alliance[i] = [player[i]]	//each alliance is an array of players; to start, each array have only one player
	}
}


//hexGroup objects list the lands and keep in each starting territory (requires numx = 11 and numy = 11)
//hexGroup[0] is the NE territory, the array continues clockwise, locations are described by their hex[x] value
//"assigned" will be updated to 1 when a hexGroup is assigned to a player
hexGroup = [
        		{
        			"assigned" : 0,
        			"land" : [getHex(6,1),getHex(7,1),getHex(5,2),getHex(7,2),getHex(6,3),getHex(7,3)],
        			"keep" : getHex(6,2)
        		},
        		{
        			"assigned" : 0,
        			"land" : [getHex(7,4),getHex(8,4),getHex(7,5),getHex(9,5),getHex(7,6),getHex(8,6)],
        			"keep" : getHex(8,5)
        		},
        		{
        			"assigned" : 0,
        			"land" : [getHex(6,7),getHex(7,7),getHex(5,8),getHex(7,8),getHex(6,9),getHex(7,9)],
        			"keep" : getHex(6,8)
        		},
        		{
        			"assigned" : 0,
        			"land" : [getHex(3,7),getHex(4,7),getHex(2,8),getHex(4,8),getHex(3,9),getHex(4,9)],
        			"keep" : getHex(3,8)
        		},
        		{
        			"assigned" : 0,
        			"land" : [getHex(1,4),getHex(2,4),getHex(1,5),getHex(3,5),getHex(1,6),getHex(2,6)],
        			"keep" : getHex(2,5)
        		},
        		{
        			"assigned" : 0,
        			"land" : [getHex(3,1),getHex(4,1),getHex(2,2),getHex(4,2),getHex(3,3),getHex(4,3)],
        			"keep" : getHex(3,2)
        		}];

//this function takes the coordinates of a hex and provides the hex[x] value
function getHex(i,j) {
	var numx = Number($("#numx").val());	//sets numx to assigned number of hexes in the x direction
	return (i+numx*j);
}

//this function takes the hex[x] value and provides the coordinates
function getHexCoor(x) {
	var numx = Number($("#numx").val());	//sets numx to assigned number of hexes in the x direction
	i = x%numx;
	j = Math.floor(x/numx);
	return [i,j];
}


//function to randomly assign a hex group, input is player number (1-6)
//this should be run when a player joins - not sure how that works

function assignHexGroup(n) {
	var i = Math.floor((Math.random()*6)); 			//assigns random number 0-6
	
	for (var count = 0; count < 6; count++){		//runs max 6 iterations, will try hexGroup[i] first, then increase until one is available
		if (hexGroup[i].assigned == 0){
			player[n].landStart = hexGroup[i].land;	//updates player object
			player[n].keepStart = hexGroup[i].keep;	//updates player object
			setHexType(hexGroup[i].land,'land');	//updates hexGroup as land
			setHexType(hexGroup[i].keep,'keep');	//updates keep as keep 
			assignHexes(hexGroup[i].land,n,1);		//updates the hexes as player n starting lands
			assignHexes(hexGroup[i].keep,n,1);		//updates the hexes as player n starting lands
			hexGroup[i].assigned = 1;				//sets hexGroup as assigned
			count = 6;								//ends for loop before 6 iterations
		}
		else if (i == 5) {i=0;}
		else {i++}
	}
}

//updates the hex[x].type object property with the string setType for an array of hexes
//inputs: an array of hex location values (in hex[x] form), string to update those hex objects
//lots of variable names here - should any be changed for clarity?
function setHexType(hexArray,setType) {
	for (var i = 0; i < hexArray.length; i++){	//execute for all items in the input array
		hex[hexArray[i]].hexType = setType;		//update object property
	}
}

//updates the hex[x].owner object property with the new owner's player number
//inputs: an array of hex location values (in hex[x] form), the player number
//starting should be 1 if the startingOwner property should be updated as well (only during inital set up), otherwise 0
function assignHexes (hexArray,num,starting) {
	for (var i = 0; i < hexArray.length; i++) {		//execute for all items in the input array
		hex[hexArray[i]].owner = player[num];		//update object property
		if (starting == 1) {
			hex[hexArray[i]].startingOwner = player[num];
		}
	}
}



//ADD: when game starts, function to update hex neighbor properties


//ADD: when game starts, function to update hexTypes for neutral locations and shortcuts
