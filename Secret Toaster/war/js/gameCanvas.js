window.numx = 10;
window.numy = 11;

$(document).ready(function(){
	window.activeHexes = {"start": "", "end": ""};	
	setDocumentEventHandlers();
});

function setDocumentEventHandlers(){
	$("#zoomIn").click(function(){ 
		var curScale = stage.getScale().x;
		stage.setScale(curScale +.1, curScale+.1);
		stage.draw(); 				  
	});
	
	$("#zoomOut").click(function(){
		var curScale = stage.getScale().x;
		stage.setScale(curScale - .1, curScale-.1);
		stage.draw();
	});
	 
	$("#zoomReset").click(function(){
		stage.setScale(1,1);
		stage.setPosition(0,0);	
		stage.draw();
	});
	 
	$("#showLabels").change(function(){
		if ($(this).is(":checked")){	
			game.canvas.layers.txtLayer_hex.moveToTop();
			game.canvas.layers.txtLayer_hex.show();			
		} 
		else {
			game.canvas.layers.txtLayer_hex.hide();
		}
		stage.draw();
	});
	
	$(window).resize(function(){
		var $bin = $("#board_group");
		var $canvas = $("#gameCanvas");
		var $sidebar = $("#boardControls");
		var $parent = $("#game_container");
		$canvas.outerWidth($parent.width()-$sidebar.outerWidth()-15);
		$canvas.height("100%");
		game.refresh();
	});
	
	$("#gameCanvas").mouseout(function(){
		$("body").css("cursor", "default");
	});
	
} //**End function setDocumentEventHandlers()


function oldShapeClickEvents(hex){
	var shape = hex.shape;
	var group = shape.parent;
	var shapeID = shape.attrs.id;
	shape.on("click tap touchend", function(){
		//This decides whether to make the border red or green (or, if it is a "start" or "end" hex). See the global variable "activeHexes" at the start of the document.
		var start = false;
		var end = false;
		
		if (activeHexes.start == shapeID){
			start = true;
			//console.log("start is true");				
		} else if (activeHexes.end == shapeID){
			end = true;
			//console.log("end is true");
		}
		if (activeHexes.start == "" && !end){ //if there is no start, set hex to start
			//console.log("no active start, setting it to current");
			activeHexes.start = shapeID;
			this.setStrokeWidth(4);
			this.setStroke("green");
			this.moveToTop();
			
		} else if (activeHexes.end == "" && !start){ //if there is a start but no end, set hex to the end
			//console.log("no active end, setting it to current.");
			activeHexes.end = shapeID;
			this.setStrokeWidth(4);
			this.setStroke("red");
			this.moveToTop();
		} 
		if (end){ 
			//console.log("this was selected as end, now remove active end");
			activeHexes.end = "";
			this.setStrokeWidth(1);
			this.setStroke("black");
			this.moveToBottom();
		}
		if (start){
			//console.log("this was selected as Start, now removing from active start");
			activeHexes.start = "";
			this.setStrokeWidth(1);
			this.setStroke("black");
			this.moveToBottom();
			
			if (activeHexes.end == ""){ //if there is a start but no end, set hex to the end
				//console.log("since there was no Active End, setting this to active end");
				activeHexes.end = shapeID;
				this.setStrokeWidth(4);
				this.setStroke("red");
				this.moveToTop();
			} 
		}
		stage.draw();
	}); //end mousedown
}

/**
 * 
 * @param hex
 * Called during the construction of the Game object for each hexagon. 
 */
var shapeHoverTimeout = setTimeout(function(){}, 1000);
function setHexHover(hex){
	var shape = hex.shape;
	var group = shape.parent;
	var shapeID = shape.attrs.id;

	shape.on("mouseover", function(){
		//When the mouse is over the shape, do this. 		
		var mousePos = stage.getMousePosition();
		var x = mousePos.x;
		var y = mousePos.y;			
		$("body").css("cursor", "pointer");
		
		//$("#moustTip").hide();
		
		clearTimeout(shapeHoverTimeout);				
		shapeHoverTimeout = setTimeout( function(){
			$("#mouseTip").show();
			$("#mouseTip").offset({top: y + $("#gameCanvas").offset().top+15, left: x + $("#gameCanvas").offset().left + 15});
		}, 1000);
		$("#mouseTip").html(buildTip(shapeID) + "<br> cursor (" + x + ", " + y + ") ");

	});
	
	shape.on("mousemove", function(){
		var mousePos = stage.getMousePosition();
		var x = mousePos.x;
		var y = mousePos.y;	
		$("#mouseTip").html(buildTip(shapeID) + "<br> cursor (" + x + ", " + y + ") ");
		clearTimeout(shapeHoverTimeout);				
		shapeHoverTimeout = setTimeout( function(){
			$("#mouseTip").show();
			$("#mouseTip").offset({top: y + $("#gameCanvas").offset().top+15, left: x + $("#gameCanvas").offset().left + 15});
		}, 1000);	
	});
	
	$("#game_container").mouseout(function(){
		clearTimeout(shapeHoverTimeout);
		$("#mouseTip").hide();
	});
	
	shape.on("mouseout touchend", function(){		
		clearTimeout(shapeHoverTimeout);
		$("#mouseTip").hide();
		$("body").css("cursor", "default");
	});
	
	$(document).mousemove(function(){		
		var mousePos = stage.getMousePosition() || 0; 
		var x = mousePos.x || 0;						
		var y = mousePos.y || 0;
		$("#mouseTip").offset({top: y + $("#gameCanvas").offset().top+15, left: x + $("#gameCanvas").offset().left + 15});	//this is a JQuery function
	});	
	
	function buildTip( param ){
		var shapeID = typeof(param) == "object" ? param.attrs.id : param;
		var html = "";
		var hex = getHex( param );
		var coords = getCoords( hex );
		var ownerHtml = "<span>Owner: </span>" + $("<span>").html( game.getOwner( hex ).name ).css({color: getColor( hex ) }).get()[0].outerHTML;
		var startingOwnerHtml = "<span>Starting Owner: </span>" + $("<span>").html( getStartingOwner( hex ).name ).css({color: getStartingOwner( hex ).player == null ? "GRAY" : getStartingOwner( hex ).player.color }).get()[0].outerHTML;
		
		var $table = $("<table>").addClass("tooltip")
				.append( $("<tr>")
						.append( $("<th>").html("Player") )
						.append( $("<th>").html("Knights") )
						.append( $("<th>").html("Troops") )
						.append( $("<th>").html("Alliance") )
					);
							
		var players = getPlayers();
		var troops = hex.troops;
		var knights = hex.knights;
		for (var i=0; i < players.length; i++){
			var player = players[i];
			var $row = $("<tr>").css({ color: player.color })
				.append($("<td>").html("<b>" + player.nickname + "</b>") )
				.append($("<td>").html(getKnightNames(hex, player).join(", ") ) )
				.append($( "<td>").html(getTroops(hex, player) ) )
				.append($("<td>").html( game.getAlliance( player.nickname ).name ) );
			$table.append($row);
		}
		
		html += "Hex #" + getIndex(hex) + " (" + coords.x + ", " + coords.y + ") " 
			+ "<br>" + ownerHtml 
			+ "<br>" + startingOwnerHtml 
			+ $table.get()[0].outerHTML;
		
		return html;
	} //end buildTip(shapeID)
} //**End setHexListeners() function

/*
function setActionDialog( type, knightId ){
	var hex = getHex(knightId);
	var offset = getActionDialogOffset(knightId); 
	var orderNumber = $("input[name='orders']:checked").val();
	//$("#orderTitle").val(type);
	$("#orderNumber").html("Order " +  orderNumber );
	$("#orderTitle").html( capitalizeFirst(type) );
	$("#actionDialog button").hide();
	
	if (type == "fortify"){							
		$("#fortify").show();
		$("p.troops").hide();
		$("p.location").hide();
		$("#actionDialog select.knight").empty();		
		if ( getTroops(hex.index, getUrlParameters().nickname ) >= hex.troopsToKnight ){
			$("#promote").show();
		}		
//		console.log(getProjectedKnights( getUrlParameters().nickname, hex.index, orderNumber));
		for (var i=0; i< getProjectedKnights( getUrlParameters().nickname, hex.index, orderNumber).length; i++ ){
			$("#knightSelect").append( 
				$("<option>").html( getProjectedKnights( getUrlParameters().nickname, hex.index, orderNumber)[i].name )
			);
		}
		$("#actionDialog").fadeIn().offset({top: offset.y, left: offset.x });		
		$("#knightId").html( knightId );
		$("#toId").html( "" );
	} else if ( type=="move"){
		$("#move").show();
		//$("p.location").show();
		$("p.troops").show();
		$("#toId").html( knightId );
	}
}
*/
/*
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
*/

function highlightAvailableStarts(){
	var orderNumber = $("input[name='orders']:checked").val();
	var validHexes = getValidStartHexes(getUrlParameters().nickname, Number(orderNumber) );
	for (var i=1; i < 4; i++){
		var hexes = getValidStartHexes(getUrlParameters().nickname, i );
		for (var j=0; j<hexes.length; j++){
			hexes[j].setColor(true);
		}
	}
	for (var i=0; i< validHexes.length; i++){
		validHexes[i].shape.attrs.fill = "lightyellow";
	}
	stage.draw();
}

function validOrderStart(hexParam){
	var orderNumber = $("input[name='orders']:checked").val();
	var validStart = hasProjectedKnight(getUrlParameters().nickname, hexParam, orderNumber);
	return validStart;
}

function validOrderEnd( clickedParam ){
	var startHex = getHex( localStorage.orderStart );
	var orderNumber = $("input[name='orders']:checked").val();
	var hex = getHex(clickedParam);
	
	var validEnd = isProjectedKnightNeighbor(startHex, clickedParam, orderNumber);
	return validEnd;
}


/*
function setHexClick(){
	for (var i=0; i< game.hexes.length; i++){
		var shape = game.hexes[i].shape;
		shape.on("click", function(){
			var user = game.getPlayer( getUrlParameters().nickname );
			var hex = game.getHexagon(this.attrs.id);	
			
			//if ( hasKnight(user.nickname, getIndex(this.attrs.id) ) ){
			if ( validOrderStart(this.attrs.id) ){
				var hex = getHex(this.attrs.id);
				localStorage.orderStart = hex.index;
				this.attrs.fill = "lightgreen";				
				setActionDialog( "fortify", getIndex( this.attrs.id ) );				
				for ( var i=0; i< hex.neighbors.length; i++){
					var neighbor = getHex(hex.neighbors[i]);
					neighbor.shape.attrs.fill = "lightyellow";
				}					
				stage.draw();
			//} else if( isKnightNeighbor( getUrlParameters().nickname, getIndex(this.attrs.id ) ) ){
			} else if ( validOrderEnd(this.attrs.id) ){	
				//set move command options...
				setActionDialog( "move", getIndex( this.attrs.id ) );				
				var hex = getHex(this.attrs.id);				
				for ( var i=0; i< hex.neighbors.length; i++){
					var neighbor = getHex(hex.neighbors[i]);
					//if ( ! hasKnight(getUrlParameters().nickname, neighbor) ){
					if ( !validOrderStart(neighbor) ){
						neighbor.setColor(true);
					} else {
						for (var j =0; j < neighbor.neighbors.length; j++){
							getHex( neighbor.neighbors[j] ).setColor(true);					
						}						
						if (neighbor.shape.attrs.fill == "lightgreen"){
							hex.shape.attrs.fill = "red";						
						}
					}
				}					
			} else{
				$("#actionDialog").fadeOut(200, function(){
					$("#fortifyDiv").hide(); 
					$("#moveDiv").hide();
				});				
				game.getHexagon(this.attrs.id).setColor(true);				
				for (var h=0; h<game.hexes.length; h++){
					//game.hexes[h].setColor(true);
					if ( game.hexes[h].shape.attrs.fill == "lightgreen"){
						game.hexes[h].setColor(true);
						for ( var k=0; k< game.hexes[h].neighbors.length; k++ ){
							getHex(game.hexes[h].neighbors[k]).setColor(true);
						}
						break;
					}
				}
				highlightAvailableStarts();
			}
			stage.draw();
		});
	}	
}
*/


function capitalizeFirst(string)
{
    //Simple function to capitalize the first letter of an inputted string, returns the new, capitalized string.
	return string.charAt(0).toUpperCase() + string.slice(1);
}
