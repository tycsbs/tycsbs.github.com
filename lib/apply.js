;(function () {

	// 模拟实现apply方法
	Function.prototype.apply2 = function (context, arr) {
		var context = Object(context) || window;
		// this 变换
		context.fn = this;
		// 结合eval 参数处理

		var results;
		if (!arr) {
			results = context.fn()
		}else{
			var args = [];
			for (var i = 0; i < arr.length; i++) {
				args.push('arr[' + i + ']');
			}
			results = eval('context.fn(' + args + ')');
		}

		delete  context.fn;
		return results
	};

	//test
	var foo = {
		name: 'custom apply'
	};
	function bar(desc,age) {
		return{
			name:this.name,
			desc: desc
		}
	}
	var re = bar.apply2(foo,['test',22]);
	console.log(re)

})();