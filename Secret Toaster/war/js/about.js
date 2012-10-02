$(document).ready(function(){
	buildTOC();
});

function buildTOC(){
	$TOC = $("#TOC");
	$("h2").each(function(index, obj){
		var $obj = $(obj);
		var href = "#" +  $obj.attr("id");		
		$TOC.append( $("<li>").append( $("<a>").html( $obj.html() ).attr("href", href) ).append("<ol>") );
		$obj.prepend( romanize( index + 1) + ". " ).after("<hr>");
		$obj.siblings("h3").each( function(j, h3){
			var $h3 = $(h3);
			$h3.prepend(j + 1 + ". ");
			$("#TOC > li:last").children("ol").append( $("<li>").append( $("<a>").html( $h3.html() ).attr("href", "#" + $h3.attr("id") )  ) );
		});
	});
}

function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function romanize (num) {
	if (!+num)
		return false;
	var	digits = String(+num).split(""),
		key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
		       "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
		       "","I","II","III","IV","V","VI","VII","VIII","IX"],
		roman = "",
		i = 3;
	while (i--)
		roman = (key[+digits.pop() + (i * 10)] || "") + roman;
	return Array(+digits.join("") + 1).join("M") + roman;
}