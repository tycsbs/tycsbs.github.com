;(function (win) {
	var api,EchartsModule,DataGridModule,ArraySort;
	EchartsModule = (function () {
		var ec_array = {};
		var init = function (con, opt) {
			opt = opt ? opt : {};
			var mychart;
			mychart = echarts.getInstanceByDom(document.getElementById(con));
			if(mychart){
				this.resetChart(con, opt)
			}else{
				mychart = echarts.init(document.getElementById(con));
				var option = {
					title: {
						text: '',
						x: 'center',
						textStyle: {
							fontSize: 16,
							fontFamily: 'Microsoft YaHei'
						}
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					legend: {
						top: 8
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: (function () {
							var arr = [];
							for (var i = 1; i < 24; i++) {
								arr.push(`${i}:00`)
							}
							return arr
						})()
					},
					yAxis: {
						type: 'value',
						scale: true,
						splitNumber: 5
					},
					grid: {
						top: 60,
						bottom: 26,
						left: 60,
						right: 80
					},
					color: ["#096", "#5ecedd", "#9388a6", "#bb0f45"],
					series: []
				};
				option = $.extend(true, {}, option, opt);
				mychart.setOption(option);
				ec_array[con] = option;
			}
		};
		var resetChart = function (id, seiresObj) {
			var charts = echarts.getInstanceByDom(document.getElementById(id));
			if (charts) {
				var options = ec_array[id];
				options = $.extend(true, {}, options, seiresObj);
				charts.setOption(options);
				charts.resize()
			}
		};
		var resizeChart = function () {
			for (var key in ec_array) {
				var charts = echarts.getInstanceByDom(document.getElementById(key));
				if(charts){
					charts.resize();
				}
			}
		};
		return {
			initOrRefresh: init,
			resetChart: resetChart,
			resizeChart: resizeChart
		}
	})();
	DataGridModule = (function(){
		var gridboxArray = [];
		var init = function(id, set){
			var optionSet = {
				striped: true,
				fitColumns: true,
				rownumbers: true,
				singleSelect: true,
				loadMsg: '数据加载中...',
				pagination: false,
				fit: false
			};
			var option = $.extend({}, optionSet, set);
            gridboxArray.push(id);
			$(id).datagrid(option);
		}
		var resizeGrid = function(){
			var len = gridboxArray.length;
			if(len){
                for(var i = 0;i < len;i++){
                	$(gridboxArray[i]).datagrid('resize')
                }
			}

		};
		return {
			init:init,
            resizeGrid:resizeGrid
		}
	})();
	ArraySort = (function(){
		var insertSort = function(array){
			for (var i = 1; i < array.length; i++) {
				var key = array[i];
				var j = i - 1;
				while (j >= 0 && array[j] > key) {
					array[j + 1] = array[j];
					j--;
				}
				array[j + 1] = key;
			}
			return array;
		}
		var xAxisSort = function(arr1,arr2){
			var temp = _.union(arr1,arr2);
			var tempFormat = []
			_.map(temp,function (value) {
				var item = value.split(":")[0];
				if(item.length < 2){
					value = '0'+ value
				}
				tempFormat.push(value)
            })
			return this.insertSort(tempFormat)
		}
		return {
			insertSort:insertSort,
			xAxisSort:xAxisSort
		}
	})();

	api = {
		EchartsModule: EchartsModule,
		DataGridModule:DataGridModule,
		ArraySort:ArraySort
	};
	win.api = api
})(window);
