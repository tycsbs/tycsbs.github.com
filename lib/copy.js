var arr = [1, 'test', true, 'new'];
var obj = {name: 'test', desc: "test shadeCopy", deep: {test: 'hello'}};
/*浅拷贝*/

// 数组浅拷贝 -- arr.concat ， arr.slice()
var arr1 = arr.concat();
var arr2 = arr.slice();


// 对象浅拷贝
function shallowCopy(obj) {
	if (typeof obj !== 'object') return;
	var newobj = obj instanceof Array ? [] : {};

	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			newobj[key] = obj[key]
		}
	}
	return newobj
}
console.log(shallowCopy(obj))

/*深拷贝*/
// 深拷贝 -- JSON.parse(JSON.stringify());
var obj1 = JSON.parse(JSON.stringify(obj));
var arr3 = JSON.parse(JSON.stringify(arr));
console.info(obj1, arr3);

// 对象深拷贝 -- deepCopy;
function deepCopy(obj) {
	if (typeof obj !== 'object') return;
	var newobj = obj instanceof Array ? [] : {};
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			newobj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key]
		}
	}
	return newobj;
}

console.log('deep', deepCopy(obj));

// jQuery extend
function extend() {
	var name, options, copy;
	var length = arguments.length;
	var i = 1;
	var target = arguments[0];

	for (; i < length; i++) {
		options = arguments[i];
		if (options != null) {
			for (name in options) {
				copy = options[name];
				if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}
	return target;
}

console.info(extend({}, obj, {extend: 'extend', deep: {nama: 'test'}}));

/*数组扁平化处理*/
var temp = [1,[2,3,[4,5,[6]]]];

function flatten(arr) {
	while(arr.some(item => Array.isArray(item))){
		arr = [].concat(...arr);
	}
	return arr;
}

console.log('flatten',flatten(temp))



