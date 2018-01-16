function debounce(func, wait) {
	var timer;
	return function () {
		clearTimeout(timer);
		var _this = this;
		var args = arguments;
		timer = setTimeout(function () {
			func.call(_this, args)
		}, wait)
	}
}

function debounced(func, wait) {
	var timeout;
	return function () {
		var _this = this;
		var args = arguments;
		if (timeout) clearTimeout(timeout);
		var callnow = !timeout;
		if(callnow){
			func.call(_this, args)
		}
		timeout = setTimeout(function(){
			timeout = null;
		},wait);
	}
}