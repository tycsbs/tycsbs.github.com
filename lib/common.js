/*通用的事件绑定函数*/
function listen(el, type, cb) {
	if (el.attachEvent) {
		// ie
		el.attachEvent('on' + type, function () {
			return function (event) {
				window.event.cancelBubble = true;
				el.attachEvent = [cb.apply(context)]
			}
		}(context), false)
	} else{
		el.addEventListener(type, function (event) {
			event.stopPropagation();
			cb.apply(this)
		})
	}
}

// listen('click',function(){})