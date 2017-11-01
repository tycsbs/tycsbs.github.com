;(function ($) {
	$(function () {
		var arr = RandomArr(10, 1, 200);
		$("#testArr").text(`原始数据：${arr}`)

		var re = BubbleSort(arr)
		// var res = BubbleSortable(arr)

		$("#Bubble").append(`排序结果1:${re}`)
		// $("#Bubble").append(`排序结果2:${res}`)

		function BubbleSort(arr) {
			console.time('排序结果')
			var len = arr.length
			for (var i = 0; i < len; i++) {
				for (var j = 0; j < len - i - 1; j++) {
					if (arr[j] > arr[j + 1]) {
						[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
					}
				}
			}
			console.timeEnd('排序结果')
			return arr
		}

		function BubbleSortable(arr) {
			console.time('排序结果2')
			var len = arr.length;
			var i = len - 1
			while (i > 0) {
				var pos = 0;
				for (var j = 0; j < i; j++) {
					if (arr[j] > arr[j + 1]) {
						pos = j;
						[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
					}
				}
				i = pos
			}
			console.timeEnd('排序结果2')
			return arr
		}
		function RandomArr(num, start, end) {
			var temp = []
			for (var i = 0; i < num; i++) {
				temp.push(Math.floor(Math.random() * Math.abs(end - start + 1)) + start)
			}
			console.log(temp)
			return temp
		}
	})
})(jQuery)
