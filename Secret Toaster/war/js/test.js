function isObject(arg){
	return typeof(arg) == "object";
}

function getObjectType(obj){
	return obj.constructor.name;
}

function stripAllKeys(obj){
	if ( ! isObject(obj) ){
		return obj;
	} else{	
		var newobj = {};
		for (var key_ in obj){
			if ( obj.hasOwnProperty(key_) ){
				if (obj[key_] instanceof(Array) ){
					newobj[ stripKey(key_) ] = stripArrayKeys( obj[key_] );
				}else{
					newobj[ stripKey(key_) ] = obj[key_];
				}
			}
		}
		return newobj;
	}
}

function stripArrayKeys(array){
	if ( !array instanceof(Array) ){
		return array;
	} else{
		var newarray = [];
		for (var i=0; i< array.length; i++){
			newarray.push( stripAllKeys( array[i] ) );
		}
		return newarray;
	}
	
}

function stripKey(key_){
	var lastChar = key_[key_.length - 1];
	var mykey = key_;
	if (lastChar == "_") {
		mykey = key_.slice(0, -1);
	}
	return mykey;
}