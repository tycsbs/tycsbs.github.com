(function(){
	var audio = document.querySelector('#audio');
	var btn = document.querySelector('#btn');
	var box = document.querySelector('#box');
	var canvas = document.querySelector('#canvas');
	var ctx = canvas.getContext('2d');
	window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;


	var timer ;
	var cWidth = box.clientWidth;
	var cHeight = box.clientHeight;
	btn.addEventListener('click',function(){
		// var src = 'http://ws.stream.qqmusic.qq.com/107192078.m4a?fromtag=46';
		// audio.setAttribute('src','lib/ganshang.mp3');
		load('lib/ganshang.mp3');
		render()

	})
	var stop = document.querySelector('#stop');
	var xhr = new XMLHttpRequest()

	function load(url){
		xhr.open("GET",url);
		xhr.responseType = 'arraybuffer';
		xhr.onload = function(){
			console.log(xhr.response);
		}
		xhr.send();
	}
	function render(){
		audio.play();
		var audioContext = new AudioContext();
		var analyser = audioContext.createAnalyser();
		var size = 128;
		analyser.fftSize = size * 2;
		var audioSource = audioContext.createMediaElementSource(audio);

		var barW = 10;
		var gap = 2;
		canvas.width = cWidth;
		canvas.height = cHeight;

		var line = ctx.createLinearGradient(0,0,0,cHeight);
		line.addColorStop(0,"red");
		line.addColorStop(0.7,"orange");
		line.addColorStop(1,"green");
		var barNum = Math.round(cWidth / (barW + gap));
		ctx.fillStyle = line;
		var w = cWidth / barNum;
		audioSource.connect(analyser);
		analyser.connect(audioContext.destination);

		timer = requestAnimationFrame(function fn() {
			ctx.clearRect(0,0,cWidth,cHeight);
			/*获取音频*/
			var audioArr = new Uint8Array(analyser.frequencyBinCount);
			analyser.getByteFrequencyData(audioArr);
			/*画布操作*/
			for (var i = 0; i< barNum; i++){
				var v = audioArr[i] / 256 * cHeight * 0.9;
				ctx.fillRect(w * i,cHeight - v,w*0.6,v)
			}
			timer = requestAnimationFrame(fn)
		})
	}

	/*stop.addEventListener('click',function(){
		audio.pause();
		var audioContext = new AudioContext();
		var analyser = audioContext.createAnalyser();
		// ctx.clearRect(0,0,cWidth,cHeight);
		/!*获取音频*!/
		var audioArr = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(audioArr);
		cancelAnimationFrame(timer)
	})*/



})();