;(function(){

	/*模拟实现call方法*/
	Function.prototype.call2 = function(context){
		var context = Object(context) || window;
		context.fn = this;

		//参数处理
		var args = [];
		for(var i = 1; i< arguments.length; i++){
			args.push('arguments['+i+']');
		}
		//处理有返回值的函数
		var result = eval('context.fn('+args+')');
		delete context.fn;
		return result;
	}

	// test
	var foo = {
		value:1
	};
	function bar(name,age){
		return {
			value:this.value,
			name:name,
			age: age
		}
	}

	var obj = bar.call2(foo,'baisong',25);
	/*{
		value:'1',
		name: 'baisong',
		age: 25
	}*/


})();