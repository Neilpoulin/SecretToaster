window.numx = 10;
window.numy = 11;
var game = null;
var eventManager = null;
var stage = null
$(document).ready(function() {
	game = new Game();
	stage = game.canvas.stage;
	eventManager = new EventManager(game);
//	setHexClick(); 
});

function GameService() {
	var mygame = null;
	this.CreateGame = function() {
		mygame = new Game();		
	};
	this.GetGame = function() {
		return mygame;
	};
}

function EventManager(mygame){
	this.game = mygame;
	this.startHex = null;
	this.endHex = null;
	this.validHexes = [];
	this.startColor = "lightgreen";
	this.endColor = "red";
	this.validColor = "lightyellow";
	this.orderNumber = 0;
	this.dialog = $("#actionDialog");
	this.moveType = "fortify";
	this.player = mygame.getPlayer(mygame.user);
}

EventManager.prototype.clear = function(){
	this.startHex = null;
	this.endHex = null;
	
	this.validHexes = this.getValidHexes();
	for (var h=0; h < this.game.hexes.length; h++){
		var hex = this.game.hexes[h];
		hex.setColor(false);
		hex.shape.setAlpha(1);
	}
//	this.highlighValidHexes();
	this.game.canvas.stage.draw();
	this.dialog.stop().fadeOut(200, function(){
		$("#fortifyDiv").hide(); 
		$("#moveDiv").hide();
	});	
}

EventManager.prototype.update = function(){
	this.setOrderNumber();
	this.clear();
	this.player = this.game.getPlayer(this.game.user);	
	if (! $("#chkReady").is(":checked") ){	
		$("input[name='orders']").button("disable");
		$("#orderRadio" + "1").button("enable");
		for (var i=0; i<this.player.orders.length; i++){
			$("#orderRadio" + (i + 2).toString() ).button("enable");
		}		
		$("input[name='orders']").button("refresh");
	} else{
		$("input[name='orders']").button("disable");
		$("input[name='orders']").button("refresh");
	}	
	var order = this.player.orders[this.orderNumber -1 ];
	if (order != null && order != undefined){
		this.startHex = this.game.getHexagon(order.from);
		this.endHex = this.game.getHexagon(order.to);
		this.moveType = order.type.toLowerCase();
		this.setDialog();
	}
	this.setValidHexes();
//	this.clear();
	this.highlighValidHexes();

}

EventManager.prototype.setOrderNumber = function(){
	if ( $("input[name='orders']:checked").length > 0 ){
		this.orderNumber = $("input[name='orders']:checked").val();
	} else {
		this.orderNumber = "0";
	}
//	this.validHexes = this.getValidHexes();
}
EventManager.prototype.setValidHexes = function(){
	this.validHexes = this.getValidHexes();
}
EventManager.prototype.getValidHexes = function(){
	return getValidHexes(this);
}

EventManager.prototype.highlighValidHexes = function(){
	highlightValidHexes(this);
}

EventManager.prototype.click = function(hexparam){
	clickHex(hexparam, this);
}
EventManager.prototype.setDialog = function(){
	setActionDialog( this );
}
EventManager.prototype.setMoveType = function(){
	this.moveType = getMoveType(this);
}
EventManager.prototype.getMoveType = function(){
	return getMoveType(this);
}
EventManager.prototype.highlightOrderHexes = function(){
	highlightOrderHexes(this);
}

function clickHex(hexparam, manager){
	var hex = getHex(hexparam);
	var validClick = false;
	for ( var i=0; i < manager.validHexes.length; i ++ ){
		if ( manager.validHexes[i].equals(hex) ){
			validClick = true;
			setClickedHex(hex, manager);
			manager.highlighValidHexes();
			break;
		}
	}
	if (!validClick){
		manager.clear();
		highlightValidHexes(manager)
//		$("input[name='orders']:checked").removeAttr("checked");
//		$("input[name='orders']").button("refresh");
//		manager.orderNumber = 0;
	}
	manager.validHexes = getValidHexes(manager);
}

function highlightValidHexes(manager){
	for (var i=0; i<manager.validHexes.length; i++){
		var hex = manager.validHexes[i];
		hex.shape.setFill(manager.validColor);
		if ( hex.equals(manager.startHex) ){
			hex.shape.setFill(manager.startColor);
		}
		if (hex.equals(manager.endHex) ){
			hex.shape.setFill(manager.endColor);
		}
//		hex.shape.setAlpha(.5);
	}
	manager.game.canvas.stage.draw();
}

function highlightOrderHexes(manager){
	if ( manager.startHex != null ){
		manager.startHex.shape.setFill(manager.startColor);
	}
	if ( manager.endHex != null){
		manager.endHex.shape.setFill(manager.endColor);
	}
	manager.game.canvas.stage.draw();
}

function setClickedHex(hexparam, manager){
	var hex = getHex(hexparam);
	
	if ( manager.startHex == null && manager.endHex == null ){
		manager.startHex = hex;
	}else if (manager.startHex != null){		
		manager.endHex = hex;
	}
	manager.setDialog();
	manager.setValidHexes();
}

function getMoveType(manager){
	if (manager.startHex == null){
		return "fortify";
	} else if (manager.endHex != null && !manager.endHex.equals(manager.startHex) ){
		return "move";
	} else {
		return "fortify";
	}
}

function getValidHexes(manager){
	var hexes = [];
	var knights = manager.game.getPlayer( manager.game.user ).knights;
	if (manager.orderNumber == 0){
		return hexes;
	}else if ( manager.startHex == null && manager.endHex == null ){		
		for (var i=0; i < knights.length; i++){
			hexes.push( getProjectedHex(knights[i], manager.orderNumber ) )
		}
	} else if ( manager.startHex != null /*&& manager.endHex == null */){
		for ( var i = 0; i < manager.startHex.neighbors.length; i++){
			var neighbor = manager.game.getHexagon( manager.startHex.neighbors[i] );
			hexes.push(neighbor);
		}
		hexes.push(manager.startHex);
	} 
	return hexes;
}

function getProjectedHex(knight, orderNumber){
	if (Number(orderNumber) == 1 ){
		return getHex(knight.location);
	}else{
		return getHex(knight.projectedPositions[ orderNumber - 1 ]);
	}
}

function setActionDialog( manager ){
	var type = manager.getMoveType();
	var knightId = manager.startHex.index;
	var orderNumber = manager.orderNumber;
	var hex = getHex(knightId);
	var offset = getActionDialogOffset(knightId); 
	$("#orderNumber").html("Order " +  orderNumber );
	$("#orderTitle").html( capitalizeFirst(type) );
	$("#actionDialog button").hide();
	if (type == "fortify"){							
		$("#fortify").show();
		$("p.troops").hide();
		$("p.location").hide();
		$("#actionDialog select.knight").empty();		
		if ( getTroops(hex.index, manager.game.user ) >= hex.troopsToKnight ){
			$("#promote").show();
		}		
//		console.log(getProjectedKnights( getUrlParameters().nickname, hex.index, orderNumber));
		for (var i=0; i< getProjectedKnights( manager.game.user, hex.index, orderNumber).length; i++ ){
			$("#knightSelect").append( 
				$("<option>").html( getProjectedKnights( manager.game.user, hex.index, orderNumber)[i].name )
			);
		}		
		$("#knightId").html( knightId );
		$("#toId").html( "" );
	} else if ( type=="move"){
		$("#move").show();
		//$("p.location").show();
		$("p.troops").show();
		$("#toId").html( manager.endHex.index );
	}
	$("#actionDialog").stop().fadeIn().offset({top: offset.y, left: offset.x });
}
function getActionDialogOffset(index){
	var hex = getHex(index);
	var yOffset = 0;
	var xOffset = getHexCenter(hex.x, hex.y).x - $("#actionDialog").width()/2 + $("#gameCanvas").offset().left;
	if (hex.index >= 50){
		yOffset = $("#gameCanvas").offset().top + getHexCenter(hex.x, hex.y).y - $("#actionDialog").height() - 3*getHexRad();					
	} else{
		yOffset = $("#gameCanvas").offset().top + getHexCenter(hex.x, hex.y).y + 2.5*getHexRad() ; //$("#actionDialog").height()
	}
	
	return {x: xOffset, y: yOffset};
}




function Game() {
	this.id = getUrlParameters().gameID;
	this.board = new Board();
	this.hexes = this.board.hexes;
	this.players = [];
	this.alliances = [];
	this.canvas = new Canvas();
	this.round = 0;
//	this.eventManager = new EventManager();
	this.user = getUrlParameters().nickname;
	var groupBoard = new Kinetic.Group();
	var groupBoardTxt = new Kinetic.Group();

	for ( var i = 0; i < this.hexes.length; i++ ){
		var hex = this.hexes[i];
		var shape = new Polygon(getCoords(i).x, getCoords(i).y);
		//var text = new Text(getCoords(i).x, getCoords(i).y);
		groupBoard.add(shape);
		//groupBoardTxt.add(text);
		hex.setShape(shape);
		setHexHover(hex);		
		//oldShapeClickEvents(hex);
	}
	this.canvas.layers.txtLayer_hex.add(groupBoardTxt);
	this.canvas.layers.txtLayer_hex.hide();
	this.canvas.layers.hexLayer_hex.add(groupBoard);
}

function Canvas() {
	// Properties
	this.stage = new Kinetic.Stage({
		container : "gameCanvas",
		width : $("#gameCanvas").width(),
		height : $("#gameCanvas").height(),
		name : "gameStage",
		draggable : true
	});
	this.layers = {};

	this.addLayer = function(options) {
		var layer = new Layer(options);
		this.stage.add(layer.layer);
		this.layers[options.name] = this.stage.children[this.stage.children.length - 1];
	}
	this.addLayer({
		name : "hexLayer_hex"
	});
	this.addLayer({
		name : "txtLayer_hex"
	});
	this.addLayer({
		name : "borderLayer"
	});
}

function Layer(options) {
	this.layer = new Kinetic.Layer(options);
}

function Board() {
	// properties
	this.hexes = [];
	this.castleId = null;
	this.keepIds = null;
	this.keepInts = null;
	this.numx = 10;
	this.numy = 11;

	// initialize hex objects
	for ( var i = 0; i < numx * numy; i++) {
		this.hexes.push(new Hexagon(i));
	}
}

function Hexagon(index) {
	// "Static" properties
	this.index = index;
	var coords = getCoords(index);
	this.x = coords.x;
	this.y = coords.y;
	this.type = "BLANK";
	this.center = getHexCenter(this.x, this.y);
	this.radius = getHexRad(this.index);
	this.shape = null;
	this.knights = [];
}

function Player(player) {
	// properties
	this.nickname = player.nickname_;
	this.color = player.color_;
	this.active = true;
	this.ready = false;
	this.knights = [];
	this.orders = [];
}

function Alliance(name) {
	this.name = name;
	this.members = [];
}

function Knight(knight_){
	var strippedKnight = stripAllKeys(knight_);
	for (var key in strippedKnight ){
		this[key] = strippedKnight[key];
	}
}

function Order(orderNumber, type, knightName, fromHex, toHex, owner, troops){
	this.orderNumber = Number(orderNumber);
	this.type = type.toUpperCase();
	this.knight = knightName;
	this.from = fromHex;
	this.to = toHex;
	this.owner = owner;
	this.troops = troops;
}

function Polygon(i, j) {
	var shape = new Kinetic.RegularPolygon({
		x : getHexCenter(i, j).x,
		y : getHexCenter(i, j).y,
		sides : 6,
		radius : getHexRad(),
		fill : "white",
		stroke : "black",
		strokeWidth : 1,
		rotationDeg : 0,
		id : i + "_" + j
	});
	shape.on("click", function(){
		eventManager.click(shape.attrs.id);
	});
	shape.hide();
	return shape;
}

function Text(i, j) {
	var shape = new Kinetic.Text({
		x : getHexCenter(i, j).x,
		y : getHexCenter(i, j).y,
		text : getIndex(i, j) /* + " (" + i + ", " + j + ")" */,
		id : i + "_" + j,
		textFill : "black",
		align : "center",
		verticalAlign : "middle"
	});
	return shape;
}

Game.prototype.push = pushGame;
Game.prototype.getIndex = getIndex;
Game.prototype.getKeepsIndexes = getKeepsIndexes;
Game.prototype.getKeeps = getKeeps;
Game.prototype.getPlayer = getPlayer;
Game.prototype.getAlliance = getAlliance;
Game.prototype.getStartingOwner = getStartingOwner;
Game.prototype.getKnights = getHexKnights;
Game.prototype.getKnightNames = getKnightNames;
Game.prototype.getTroops = getTroops;
Game.prototype.getOwner = getOwner;
Game.prototype.getKnight = getKnight;
Game.prototype.hasProjectedKnight = hasProjectedKnight;
Game.prototype.command = function(command){
	switch (command){
		case "updateGame":
			game.updateGame();
			break;
		default:
			break;
	} 
}

Game.prototype.updateGame = function( game_ ) {
	if ( game_ == null || game_ == undefined ){
		getGame();
	} else {
		this.canvas.layers.borderLayer.removeChildren();
		this.canvas.layers.borderLayer.removeChildren();
		this.updatePlayers(game_.players_);
		this.board.update(game_.board_);		
		this.updateAlliances(game_.alliances_);
		this.round = game_.round_;
		if ( $("#gameRound").html() != this.round ){
			$("input[id^='orderRadio']").removeAttr("disabled").button("refresh").eq(0).click().button("refresh");
		}
		$("#gameRound").html(this.round);		
		updateReady();
		updateIdle();
		refreshAlliances();
		this.canvas.layers.hexLayer_hex.moveToTop();
		this.canvas.layers.borderLayer.moveToTop();
		this.refresh();
		updateNotificationSettings();
		var player = this.getPlayer(getUrlParameters().nickname );
		localStorageManager.addGameLog({ gameID: this.id, nickname: player.nickname, color: player.color });
		localStorageManager.save();
		eventManager.update();
	}
}

Game.prototype.refresh = function() {
	this.canvas.layers.borderLayer.removeChildren();
	for ( var i = 0; i < this.hexes.length; i++) {
		var hex = this.hexes[i];
		hex.refresh();
	}
	this.canvas.refresh();
	this.canvas.stage.draw();
}

Game.prototype.updateAlliances = function(alliances_) {
	var updatedAlliances = [];
	for ( var i = 0; i < alliances_.length; i++) {
		var alliance_ = alliances_[i];
		var found = false;
		for ( var j = 0; j < this.alliances.length; j++) {
			var alliance = this.alliances[j];
			if (alliance.equals(alliance_)) {
				alliance.update(alliance_);
				found = true;
				updatedAlliances.push(alliance);
				break;
			}
		}
		if (!found) {
			var aly = new Alliance(alliance_.name_);
			aly.updateMembers(alliance_.members_);
			updatedAlliances.push(aly);
		}
		this.alliances = updatedAlliances;
	}
}

Game.prototype.updatePlayers = function(players_) {
	if (players_ != undefined || players_ != null) {
		for ( var i = 0; i < players_.length; i++) {
			var player_ = players_[i];
			var found = false;
			for ( var j = 0; j < this.players.length; j++) {
				var player = this.players[j];
				if (player.equals(player_)) {
					player.update(player_);
					found = true;
					break;
				}
			}
			if (!found) {
				this.players.push(new Player(player_));
			}
		}
	}
}

Game.prototype.getHexagon = function(arg1, arg2) {
	var index = this.getIndex(arg1, arg2);
	var hex = null;
	if ("board" in game) {
		if ("hexes" in game.board) {
			var hexes = game.board.hexes;
			hex = hexes[index];
		}
	}
	return hex;
}

Game.prototype.getPlayers = function(param) {
	if (param instanceof Array) {
		findPlayers(param);
	} else if (typeof (param) == "string") {
		var list = param.split(",");
		findPlayers(list, this);
	} else if (param == undefined || param == null) {
		return this.players;
	} else {
		return null;
	}

	function findPlayers(params, mygame) {
		var Players = [];
		for ( var i = 0; i < params.length; i++) {
			Players.push(mygame.getPlayer($.trim(params[i])));
		}
		return Players;
	}
}

Canvas.prototype.refresh = function() {
	var inputW = $("#gameCanvas").width();
	var inputH = $("#gameCanvas").height();
	stage.setSize(inputW, inputH);
	var rad = getHexRad();
	var newWidth = 2 * rad * (numx - 1.29);
	$("#gameCanvas").height(2 * rad * (numy - 1.5 - Math.sqrt(3)));
	$("#gameCanvas").width(newWidth);
	stage.setSize(newWidth, $("#gameCanvas").height());
//	stage.draw();
}


Layer.prototype.add = function(shape) {
	this.layer.add(shape);
}

Board.prototype.update = function(board_) {
	this.updateHexes(board_.hexes_);
	// any other functions to update stuff
};

Board.prototype.updateHexes = function(hexes_) {
	for ( var i = 0; i < hexes_.length; i++) {
		var hex_ = hexes_[i];
		var hex = this.hexes[i];
		if (hex == undefined) {
			hex = new Hexagon(i);
		}
		hex.update(hex_);
	}
};

Hexagon.prototype.setRadius = function() {
	this.radius = getHexRad(this.index);
}
Hexagon.prototype.setCenter = function() {
	this.center = getCenter(this.x, this.y);
}
Hexagon.prototype.setColor = function(draw) {
	if (draw == undefined){
		draw = true;
	}
	setColor(this, draw);
}
Hexagon.prototype.getColor = function(){
	return getColor(this);
}

Hexagon.prototype.setShape = function(shape) {
	this.shape = shape;
}
Hexagon.prototype.refresh = function() {
	this.ownerBorders();
	this.center = getHexCenter(this.x, this.y);
	this.radius = getHexRad(this.index);
	this.shape.setX(this.center.x);
	this.shape.setY(this.center.y);
	this.shape.setRadius(this.radius);
//	this.shape.setFill( this.getColor() );
}

Hexagon.prototype.ownerBorders = function(){
	setOwnerBorders(this);
}

Hexagon.prototype.getKnightNames = function(player){
	return getKnightNames(this, player);
}

Hexagon.prototype.getKnights = function(player) {
	return getKnights(this, player);
}

Hexagon.prototype.getHexKnights = function(){
	return getHexKnights(this);
}

Hexagon.prototype.getTroops = function(player) {
	return getTroops(this, player);
}

Hexagon.prototype.equals = function(hexagon){
	if ( hexagon instanceof Hexagon && this.index == hexagon.index ){
		return true;
	}else {
		return false;
	}
}

Hexagon.prototype.update = function(hex_) {
	for ( var key in hex_) {
		var mykey = strip(key);
		if (mykey == "owner" || mykey == "startingOwner") {
			this[mykey] = game.getPlayer(hex_[key].nickname_);
		} else if( mykey == "knights" ){
			//this[mykey] = stripArrayKeys(hex_[key]);
			this[mykey] = this.getHexKnights();
		} else {
			this[mykey] = hex_[key];
		}		
	}
	this.setColor(true);
	
}

Player.prototype.equals = function(player) {
	if (player != null && (player.nickname_ == this.nickname || player.nickname == this.nickname) ) {
		return true;
	} else {
		return false;
	}
}

Player.prototype.getKnights = function(hex){
	return getKnights(hex, this.nickname);
}

Player.prototype.getOrder = function(orderNumber){
	return getOrder(this.nickname, orderNumber );
}

Player.prototype.saveOrder = function(order){
	saveOrder(this.nickname, order);
}

Player.prototype.update = function(player_) {
	var strippedPlayer = stripAllKeys(player_);
	for (var key in strippedPlayer){
		if (key == "knights"){
			var knights_ = player_.knights_;
			for (var i=0; i< knights_.length; i++){
				var knight_ = knights_[i];
				var found = false;
				for (var j = 0; j < this.knights.length; j++){
					var knight = this.knights[j];
					if ( knight.name == knight_.name_ ){
						found = true;
						knight.update( knight_ );
						break;
					}
				}		
				if (!found){
					this.knights.push( new Knight(knight_ ) );
				}
			}			
		} else if ( key == "orders"){
			var orders_ = player_.orders_;
			var remove = [];
			if (orders_.length < this.orders.length){
				for (var i=0; i<this.orders.length; i++){
					var orderNumber = this.orders[i].orderNumber;
					var found = false;
					for (var j=0; j < orders_.length; j++){
						if (orderNumber == orders_[j].orderNumber_){
							found = true;
							break;
						}
					}
					if (!found){
						remove.push(i);
					}
				}
			}
			remove.reverse();
			for (var i=0; i<remove.length; i++){
				this.orders.splice( remove[i], 1 );
			}
			
			for (var i=0; i<orders_.length; i++){
				var order_ = orders_[i];
				var found = false;
				for (var j=0; j < this.orders.length; j++){
					var order = this.orders[j];
					if ( order.orderNumber == order_.orderNumber_ ){
						found = true;
						order.update( order_ );
						break;
					}
				}
				if (!found){
					this.orders.push( new Order( order_.orderNumber_, order_.type_, order_.knight_, order_.from_, order_.to_, order_.owner_ ) );
				}
			}
		}
		else{
			this[key] = strippedPlayer[key];
		}
	}
}

Alliance.prototype.updateMembers = function(members_) {
	var members = [];
	for ( var i = 0; i < members_.length; i++) {
		members.push(game.getPlayer(members_[i]));
	}
	this.members = members;
}
Alliance.prototype.equals = function(alliance_) {
	var allianceName = "name" in alliance_ ? alliance_.name : alliance_.name_;
	if (allianceName == this.name) {
		return true;
	} else {
		return false;
	}
}
Alliance.prototype.update = function(alliance_) {
	for ( var key in alliance_) {
		var lastChar = key[key.length - 1];
		var mykey = key;
		if (lastChar == "_") {
			mykey = key.slice(0, -1);
		}
		if (mykey == "members") {
			this.updateMembers(alliance_.members_);
		} else {
			this[mykey] = alliance_[key];
		}
	}
}

Knight.prototype.update = function( knight_ ){
	var strippedKnight = stripAllKeys(knight_);
	for ( var key in strippedKnight ){
		this[key] = strippedKnight[key];
	}
}

Order.prototype.update = function( order ){
	for ( var key in order ){
		this[ strip(key) ] = order[key];
	}
}


function strip(key) {
	var lastChar = key[key.length - 1];
	var mykey = key;
	if (lastChar == "_") {
		mykey = key.slice(0, -1);
	}
	return mykey;
}

function setColor(hex, draw){
	var color = "GRAY";
	try {
		color = getColor(hex).toUpperCase();
	} catch (e) {

	}
	if (color != "GRAY") {
		color = "white";
	} else {
		color = "lightgray";
	}
	if (hex.type != "BLANK") {
		hex.shape.attrs.fill = color;
		hex.shape.show();
	} else {
		hex.shape.hide();
	}

	hex.shape.attrs.fill = color;
	if (draw){
		stage.draw();
	}
}


function setOwnerBorders(hex){
	var borders = game.canvas.layers.borderLayer;
	for ( var dir = 0; dir < 6; dir++) {
		if (hex.type != 'BLANK') {
			var neighbor = hex.neighbors[dir];
			if (getOwner(hex).name != getOwner(neighbor).name
					&& "owner" in hex && hex.owner != null
					&& hex.owner != undefined) {
				if ("color" in hex.owner) {
					borders
						.add(borderLine(hex.x, hex.y, dir, hex.owner.color));
				}
			}
		}
	}
	function borderLine(i, j, dir, color) {
		rad = getHexRad() - 3; // sets radius with an offset
		var x = getHexCenter(i, j).x;
		var y = getHexCenter(i, j).y;
		var xrad = Math.sqrt(3) * rad / 2; // x offset for left and right
											// points
		var yrad = rad / 2; // y offset for left and right points
		var end = []; // array to be used for endpoints

		if (dir == 0) {
			end = [ x, y - rad, x + xrad, y - yrad ]
		} else if (dir == 1) {
			end = [ x + xrad, y - yrad, x + xrad, y + yrad ]
		} else if (dir == 2) {
			end = [ x + xrad, y + yrad, x, y + rad ]
		} else if (dir == 3) {
			end = [ x, y + rad, x - xrad, y + yrad ]
		} else if (dir == 4) {
			end = [ x - xrad, y + yrad, x - xrad, y - yrad ]
		} else if (dir == 5) {
			end = [ x - xrad, y - yrad, x, y - rad ]
		}
		return border = new Kinetic.Line({
			points : [ end[0], end[1], end[2], end[3] ],
			stroke : color,
			strokeWidth : 4,
			lineCap : "round"
		});
	}
}

function getPlayerIndexes(player) {
	// pass in a player object or a nickname to get an array of indexes of the
	// hexes that belong to that player
	var nickname = player;
	if (typeof (player) == "object" && "name" in player) {
		nickname = player.name.toUpperCase();
	} else if (typeof (player) == "object" && "nickname_" in player) {
		nickname = player.nickname_.toUpperCase();
	} else {
		return null;
	}
	var playerHexes = [];
	if (game != undefined && game != null) {
		if ("board_" in game) {
			var hexes = game.hexes_;
			for ( var i = 0; i < hexes.length; i++) {
				var hex = hexes[i];
				if ("owner_" in hex) {
					if (hex.owner.nickname.toUpperCase() == nickname) {
						playerHexes.push(hex.index_);
					}
				}
			}
		}
	}
	return playerHexes;
}

function getPlayerHexes(player) {
	// returns an array of hex objects that are owned by the passed player. You
	// can pass a player object or a string nickname.
	return getHexes(getPlayerIndexes(player));
}

function getHexes(array) {
	// pass in an array of integers to get an array of hex objects, or nothing
	// to get all
	var result = [];
	if (array instanceof Array) {
		for ( var i = 0; i < array.length; i++) {
			var hex = game.hexes[array[i]];
			result.push(hex);
		}
	} else if (typeof (array) == "string") {
		array = array.split(",");
		for ( var i = 0; i < array.length; i++) {
			var index = $.trim(array[i]);
			// index = typeof(index) == "number" ? index : null;
			var hex = game.getHexagon(index);
			if (hex != null && hex != undefined) {
				result.push(hex);
			} else {
				alert("could not get hexagon with parameter: '" + index + "'");
			}
		}
	} else {
		result = game.hexes;
	}

	return result;
}


function getKeepsIndexes() {
	// get the indexes of the keeps in the game
	var keeps = [];
	var hexes = game.hexes;
	for ( var i = 0; i < hexes.length; i++) {
		var hex = hexes[i];
		if (hex.type == "KEEP") {
			keeps.push(hex.index);
		}
	}
	return keeps;
}


function getKeeps() {
	return getHexes(getKeepsIndexes());
}

// this function is useless
function getPlayers() {
	// get a list of the players in the game (objects)
	var players = [];
	if (game != undefined && game != null) {
		if ("players" in game) {
			players = game.players;
		}
	}
	return players;
}

function getPlayer(param) {
	// get a player object by passing in a nickname
	var nickname = null;
	if (typeof (param) == "object") {
		if ("name" in param) {
			nickname = param.name
		} else if ("nickname_" in param) {
			nickname = param.nickname_;
		} else if ("nickname" in param) {
			nickname = param.nickname;
		}
	} else if (typeof (param) == "string") {
		nickname = param;
	}
	var player = null;
	if (game != undefined && game != null) {
		if ("players" in game) {
			var players = game.players;
			for ( var i = 0; i < players.length; i++) {
				var plyr = players[i];
				if (plyr.nickname.toUpperCase() == nickname.toUpperCase()) {
					player = plyr;
				}
			}
		}
	}
	return player;
}

function getAlliance(player) {
	// get the alliance a player belongs to by passing a nickname or a player
	// object
	var nickname = player instanceof Player ? player.nickname : player;
	var result = null;
	if ("alliances" in game) {
		var alliances = game.alliances;
		for ( var i = 0; i < alliances.length; i++) {
			var alliance = alliances[i];
			for ( var j = 0; j < alliance.members.length; j++) {
				var member = alliance.members[j];
				if (member.nickname.toUpperCase() == nickname.toUpperCase()) {
					result = alliance;
				}
			}
		}
	}
	return result;
}

function getAlliances() {
	// get an array of the alliances in the game (objects)
	var alliances = [];
	if (game != undefined && game != null) {
		if ("alliances" in game) {
			alliances = game.alliances;
		}
	}
	return alliances;
}
function getHex(arg1, arg2) {
	// get the hex object by passing in an index (integer) or a shape object
	var index = getIndex(arg1, arg2);
	var hex = null;
	if (game != undefined && game != null) {
		if ("board" in game) {
			if ("hexes" in game.board) {
				var hexes = game.board.hexes;
				hex = hexes[index];
			}
		}
	}
	return hex;
}

function getNeighborsIndexes(param) {
	// get an array of indexes that are the neighbors of the passed hexagon
	// index or hex object
	var result = [];
	var index = (typeof (param) == "object") ? param.index : param;
	if (game != undefined && game != null) {
		if ("board" in game) {
			var hex = game.board.hexes[index];
			result = hex.neighbors;
		}
	}
	return result;
}

function getColor(arg1, arg2) {
	// get the color for the selected hex by passing an integer index or a hex
	// object
	var result = null;
	var index = getIndex(arg1, arg2)
	if (game != undefined && game != null) {
		if ("board" in game) {
			var hex = game.board.hexes[index];
			if ("owner" in hex && hex.owner != null) {
				result = hex.owner.color;
			} else {
				result = "GRAY";
			}
		}
	}
	return result;
}

function getHexType(param) {
	var result = null;
	var index = (typeof (param) == "object") ? param.index : param;
	if (game != undefined && game != null) {
		if ("board" in game) {
			var hex = game.board.hexes[index];
			if ("type" in hex) {
				result = hex.type;
			}
		}
	}
	return result;
}

function getNeighbors(param) {
	// get an array of hexes that are the neighbors of the passed hex index of
	// hex object
	return getHexes(getNeighborsIndexes(param));
}


function getIndex(arg1, arg2) {
	var x = null;
	var y = null;
	if (arg1 instanceof Hexagon) {
		return arg1.index;
	} else if (arg1 == null && arg2 == null) {
		return null;
	} else if (typeof (arg1) == "object" && "index" in arg1) {
		return arg1.index_;
	} else if (typeof (arg1) == "object" && !"index" in arg1) {
		if (arg1.shapeType != undefined) {
			var coords = arg1.attrs.id.split("_");
			x = Number(coords[0]);
			y = Number(coords[1]);
		}
	} else if (typeof (arg1) == "number" && arg2 == undefined) {
		return arg1;
	} else if (typeof (arg1) == "number" && typeof (arg2) == "number") {
		x = arg1;
		y = arg2;
	} else if (typeof (arg1) == "string" && arg1.indexOf("_") != -1) {
		// if it's a shape ID
		var coords = arg1.split("_");
		x = Number(coords[0]);
		y = Number(coords[1]);
	} else if (typeof (arg1) == "string" && arg1.indexOf(",") != -1) {
		var coords = arg1.split(",");
		var x = Number(coords[0]);
		var y = Number(coords[1]);
	} else if (!isNaN(Number(arg1)) && arg2 == undefined) {
		return Number(arg1);
	} else if (!isNaN(Number(arg1)) && !isNaN(Number(arg2))) {
		x = Number(arg1);
		y = Number(arg2);
	} else {
		return null;
	}

	return y * numx + x;
}

function getCoords(arg1, arg2) {
	var index = getIndex(arg1, arg2);
	var x = index % numx;
	var y = Math.floor(index / numx);
	return {
		x : x,
		y : y
	};
}

function getShapeId(shape) {
	return shape.attrs.id;
}

function getOwner(arg1, arg2) {
	var hex = null;
	hex = getHex(arg1, arg2);
	var nickname = "System";
	var owner = null;
	if (hex != null && "owner" in hex && hex.owner != null) {
		owner = hex.owner;
		nickname = owner.nickname;
	}

	return {
		player : owner,
		name : nickname
	};
}

function getStartingOwner(arg1, arg2) {
	var hex = getHex(arg1, arg2);
	var owner = hex.startingOwner;
	var nickname = "System";
	if (owner != undefined) {
		nickname = owner.nickname;
	}
	return {
		player : owner,
		name : nickname
	};
}

function hasKnight(player, hex){
	return getKnights(hex, player).length > 0;	
}

function hasProjectedKnight(p, h, orderNumber){
	return getProjectedKnights(p, h, orderNumber).length > 0;
}

function getProjectedKnights( p, h, orderNumber){
	var hex = getHex(h);
	var player = getPlayer(p);
	var knights = [];
	for (var i=0; i<player.knights.length; i++){
		var knight = player.knights[i];		
		if ( orderNumber == 1 && hasKnight(player, hex) ){			
//			for (var j=0; j<getKnights(hex, player).length; j++){
//				knights.push(knight);
//			}
			knights = getKnights(hex, player);
		} else if ( knight.projectedPositions[orderNumber-2] == hex.index){			
			knights.push(knight);
		}	
	}
	return knights;
}

function isProjectedKnightNeighbor( start, clicked, orderNumber ){
	var startHex = getHex(start);
	var clickedHex = getHex(clicked);
	for ( var i=0; i< startHex.neighbors.length; i++){
		if (clickedHex.index == startHex.neighbors[i]){
			return true;
		}
	}
	return false;
}

function getValidStartHexes(p, orderNumber){
	var hexes = [];
	var player = getPlayer(p);
	for (var i=0; i<player.knights.length; i++){
		var knight = player.knights[i];
		if (orderNumber == 1){
			hexes.push(getHex(knight.location) );
		} else{
			hexes.push( getHex(knight.projectedPositions[orderNumber - 2] ) );
		}
	}
	return hexes;
}

function isKnightNeighbor(player, clickedIndex){
	var knights = getKnights(null, player);
	var valid = false;
	for( var i=0; i< knights.length; i++){
		var knightHex = getHex(knights[i].location);
		for ( var j = 0; j < getHex(knights[i].location).neighbors.length; j++){
			var neighbor = knightHex.neighbors[j];
			if (neighbor == clickedIndex){
				valid = true;
				break;
			}
			if (valid){
				break;
			}
		}
	}
	return valid;
}

function getHexKnights(h){
	var hex = getHex(h);
	var players = game.getPlayers();
	var hexKnights = [];
	if (h == null || h == undefined){
		return getAllKnights();
	}
	for (var i=0; i< players.length; i++){
		var player = players[i];
		var knights = player.knights;
		for (var j=0; j<knights.length; j++){
			if ( knights[j].location == hex.index ){
				hexKnights.push( knights[j] );
			}
		}
	}
	return hexKnights;
}

function getAllKnights(){
	var players = game.getPlayers();
	var knights = [];
	for (var i=0; i< players.length; i++ ){
		var player = players[i];
		for (var j=0; j<player.knights.length; j++){
			knights.push( player.knights[j] );
		}
	}
	return knights;
}

function getKnights(hex, player) {
	var h = getHex(hex);
	var p = getPlayer(player);
	if (h != null && p != null) {
		var knights = [];
		for ( var i = 0; i < h.knights.length; i++) {
			var knight = h.knights[i];
			if (knight.ownerNickname == p.nickname){
				knights.push(knight);
			}
		}
		return knights;
	} else if (h == null || h == undefined){
		return p.knights;
	}
	else{
		return [];
	}
}
function getKnightNames(hex, player){
	var knights = getKnights(hex, player); 
	var names = [];
	if (knights.length == 0){
		return ["-"];
	}
	for (var i=0; i< knights.length; i++){
		names.push(knights[i].name);
	}
	return names;
}

function getKnight(name){
	var knights = getAllKnights();
	if ( name instanceof(Knight) ){
		return name;
	}
	
	for (var i=0; i<knights.length; i++){
		var knight = knights[i];
		if (knight.name == name){
			return knight; 
			break;
		}
	}
	return null;
}

function getTroops(hex, player) {
	var h = getHex(hex);
	var p = getPlayer(player);
	if (h != null && p != null) {
		for ( var i = 0; i < h.troops.length; i++) {
			if (p.nickname in h.troops[i]) {
				return h.troops[i][p.nickname];
			}
		}
	}
	return 0;
}

function getHexRad() {
	var $sidebar = $("#boardControls");
	var $parent = $("#game_container");
	var availableWidth = $parent.width() - $sidebar.width() - 15;
	var availableHeight = $sidebar.height() - 15;
	var radmx = (availableWidth / numx / 2); // this is the minimum radius to
												// a centerpoint on an edge
												// based on width
	var radx = radmx * (2 / Math.sqrt(3)); // this is the resulting hex radius
											// based on radmx
	var rady = (availableHeight / (numy - numy / 2.15 / Math.sqrt(3)) / 2); 
	var rad;
	// sets the radius at the smaller of radx and rady
	if (radx > rady) {
		rad = rady;
	} else {
		rad = radx;
	}
	return Number(rad);
} // **End of function getHexRad();


function getOrder(nickname, orderNumber){
	var player = game.getPlayer(nickname);
	orderNumber = Number(orderNumber);
	for (var i=0; i<player.orders.length; i++){
		var order = player.orders[i];
		if ( order.orderNumber == orderNumber ){
			return order;
		}
	}
	return null;
}

function hasOrder(player, orderNumber){
	return getOrder(player, orderNumber) == null ? false : true;
}

function saveOrder(player, order){
	if ( !hasOrder(player, order.orderNumber) ){
		game.getPlayer(player).orders.push(order);
	} else if (order instanceof Order){
		var playerOrder = getOrder(player, order.orderNumber);
		playerOrder.update(order);
	}
}

function getHexCenter(i, j) {
	var rad = Number(getHexRad());
	var centerx;
	var radm = Math.sqrt(3) * rad / 2; // radm is the distance from center to midpoint on an edge
	if (j % 2 == 0) { // the center point in the x-dimension varies based on the row if j is 0 or even
		centerx = 2 * i * radm + radm;
	} else {
		centerx = 2 * i * radm;
	}
	var centery = j * (rad + rad / 2); // the center point in the y-dimension
	var result = {
		x : centerx,
		y : centery
	};
	return result;
}

function getGame(){
	var gameID = request.gameID;
	$.ajax({
		url: "/updateGame",
		type: "GET",
		data: {
			gameID: gameID,
		},
		dataType: "json",
		success: function(resp){
			console.log(resp);
			game.updateGame(resp);
		}
	});
}

function pushGame(){
	var gameID = request.gameID;
	$.ajax({
		url: "/updateGame",
		type: "POST",
		data: {
			gameID: gameID,
		},
		dataType: "json",
		success: function(resp){ }
	});
}

function postActive(active){
	active = active.toString();
	$.ajax({
		url: "/idle",
		type: "POST",
		data: {
			nickname: request.nickname,
			gameID: request.gameID,
			active: active,
		}, dataType: "json",
		success: function(resp){
			game.updateGame(resp);
			if ( active == "true" ){
				sendSystemMsg( "<b>" + request.nickname + "</b> is active" );
			} else {
				sendSystemMsg( "<b>" + request.nickname + "</b> is idle" );
			}
		}
	});	
}









