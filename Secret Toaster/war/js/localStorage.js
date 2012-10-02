function LocalStorageManager(){
	this.emailAddress = localStorage.emailAddress == undefined ? "" : localStorage.emailAddress;
	this.emailName = localStorage.emailName == undefined ? "" : localStorage.emailName;
	this.recentGames = [];
	var logs = getLocalStorageRecentGames();
	for (var i=0; i < logs.length; i++){
		addGameLog(this, logs[i] );
	}
}

function GameLog( params ){
	this.gameID = params.gameID;
	this.nickname = params.nickname;
	if (params.date != undefined){
		this.date = params.date;
	} else {
		this.date = new Date().getTime();
	}
	
	if (params.color != undefined){
		this.color = params.color;
	} else {
		this.color = "GRAY";
	}
}

LocalStorageManager.prototype.getGameLog = function(gameID, nickname){
	return getGameLog(this, gameID, nickname);
}

LocalStorageManager.prototype.getActiveGameLog = function(){
	return getActiveGameLog(this);
}

LocalStorageManager.prototype.addGameLog = function(log){
	addGameLog(this, log);
	this.save();
}

LocalStorageManager.prototype.save = function(){
	saveLocalStorage(this);
}

LocalStorageManager.prototype.removeGameLog = function(obj){
	removeGameLog( this, obj );
}

GameLog.prototype.equals = function(obj){
	return obj.nickname == this.nickname && obj.gameID == this.gameID;
}

GameLog.prototype.update = function(params){	
	for (var key in params){
		this[key] = params[key];
	}
	this.date = new Date().getTime();
}

function saveLocalStorage(manager){
	for (var key in manager){
		if ( manager.hasOwnProperty(key) ){
			if (typeof(manager[key]) == "object"){
				localStorage[key] = JSON.stringify( manager[key] );
			} else {
				localStorage[key] = manager[key];
			}
		}	
	}
}

function getActiveGameLog(manager){
	var params = function() {
		var query_string = {};
		var query = window.location.search.substring(1);
		var vars = query.split("&");
		for ( var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			// If first entry with this name
			if (typeof query_string[pair[0]] === "undefined") {
				query_string[pair[0]] = pair[1];
				// If second entry with this name
			} else if (typeof query_string[pair[0]] === "string") {
				var arr = [ query_string[pair[0]], pair[1] ];
				query_string[pair[0]] = arr;
				// If third or later entry with this name
			} else {
				query_string[pair[0]].push(pair[1]);
			}
		}
		return query_string;
	}();
	return getGameLog(manager, params.gameID, params.nickname);
}

function getGameLog(manager, gameID, nickname){
	for (var i=0; i< manager.recentGames.length; i++){
		if ( manager.recentGames[i].equals({gameID: gameID, nickname: nickname}) ){
			return manager.recentGames[i];
		}
	}
	return null;
}

function addGameLog(manager, log){
	var found = false;
	if (log.gameID == undefined || log.nickname == undefined){
		return null;
	}
	for ( var i=0; i<manager.recentGames.length; i++ ){
		if ( manager.recentGames[i].equals(log) ){
			found = true;
			if ( manager.recentGames[i].equals( getActiveGameLog(manager) ) ){
				getActiveGameLog(manager).update(log);
			}
			break;
		}
	}
	if (!found){
		manager.recentGames.push( new GameLog( log ) );
	}
	manager.save();
}

function removeGameLog(manager, log){
	for ( var i = 0; i < manager.recentGames.length; i++){
		if ( manager.recentGames[i].equals(log) ){
			manager.recentGames.splice(i, 1);
			break;
		}
	}
	manager.save();
}

function getLocalStorageRecentGames(){
	try{
		return JSON.parse( localStorage.recentGames );
	}catch(e){
		return [];
	}
}