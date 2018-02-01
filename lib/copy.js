var arr = [1,'test',true,'new'];
var obj = {name:'test',desc: "test shadeCopy",deep:{test: 'hello'}};
/*浅拷贝*/

// 数组浅拷贝 -- arr.concat ， arr.slice()
var arr1 = arr.concat();
var arr2 = arr.slice();


// 对象浅拷贝
function shallowCopy(obj) {
	if (typeof obj !== 'object') return ;
	var newobj = obj instanceof Array ? [] : {};

	for(var key in obj) {
		if(obj.hasOwnProperty(key)){
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
console.info(obj1,arr3);

// 对象深拷贝 -- deepCopy;
function deepCopy (obj){
	if(typeof obj !== 'object') return ;

	var newobj = obj instanceof Array ? [] : {};

	for(var key in obj) {
		if(obj.hasOwnProperty(key)){
			newobj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key]
		}
	}
	return newobj;
}

console.log('deep',deepCopy(obj));

// jQuery extend



