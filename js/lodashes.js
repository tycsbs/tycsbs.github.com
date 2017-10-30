;(function (_) {
	var wrapper = document.querySelector('#wrapper')
	{
		let arr = [1, 2, 3, 4, 5, 6, 7]
		let res = _.chunk(arr, 2)
		console.log('chunk', res)
	}
	{
		let arr = [1, '2', 3, '', false]
		let res = _.compact(arr)
		console.log('compact', res)
	}
	{
		let array = [1];
		let res = _.concat(array, 2, [3], [[4]]);
		console.log('concat', res)
	}
	{
		let array = [1, 2, 3];
		let res = _.difference(array, [4, 3]);
		console.log('difference', res)
	}
	{
		let array = [1.2, 2.2, 3.2];
		let res = _.differenceBy(array, [1.4, 2.7], Math.floor);
		console.log('differenceBy', res)
	}
	{
		let array = [1, 2, 3, 4];
		let res = _.drop(array, 2);
		console.log('drop', res)
	}
	{
		let array = [1, 2, 3, 4];
		let res = _.dropRight(array, 2);
		console.log('dropRight', res)
	}
	{
		let users = [
			{'user': 'barney', 'active': true},
			{'user': 'fred', 'active': true},
			{'user': 'pebbles', 'active': false}
		];
		let res = _.dropRightWhile(users, function (o) {
			return o.active
		});
		console.log('dropRightWhile', res)
	}
	{
		let array = [1, 2, 3, 4];
		let res = _.fill(array, null, 1, 3);
		console.log('fill', res)
	}
	{
		let array = [1, 2, 3, 4];
		let res = _.findLastIndex(array, function (item) {
			return item === 2
		});
		console.log('findIndex', res)
		console.log('head', _.head(array))
	}
	{
		let res = _.fromPairs([['fred', 30], ['barney', 40]]);
		console.log('fromPairs', res)
	}
})(window._);
