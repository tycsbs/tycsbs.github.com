;(function () {
	Function.prototype.bind2 = function (context) {
		//兼容 确保context 是函数
		if(typeof this !== 'function'){
			throw new Error('Function.prototype.bind2 - what is trying to be bound is not callable')
		}
		//存储this
		var self = this;
		// 获取参数
		var args = Array.prototype.slice.call(arguments,1);

		// 给最终返回的函数做构造函数
		var FNOP = function () {};
		var FBound = function () {
			//获取构造函数中的参数
			var bindArgs = Array.prototype.slice.call(arguments);
			return self.apply(this instanceof FNOP ? this : context,args.concat(bindArgs))
		}

		FNOP.prototype = this.prototype;
		FBound.prototype = new FNOP();

		return FBound;

	}
})();