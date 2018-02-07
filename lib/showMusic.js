(function () {
	var audio = document.querySelector('#audio');
	var btn = document.querySelector('#btn');
	var box = document.querySelector('#box');
	var canvas = document.querySelector('#canvas');
	var ctx = canvas.getContext('2d');
	window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

	var timer;
	var cWidth = box.clientWidth;
	var cHeight = box.clientHeight;
	btn.addEventListener('click', function () {
		// var src = 'http://ws.stream.qqmusic.qq.com/107192078.m4a?fromtag=46';
		// audio.setAttribute('src','lib/ganshang.mp3');
		load2('lib/bc.mp3');
		// test('http://ws.stream.qqmusic.qq.com/107192078.m4a?fromtag=46');
		// render()

	})
	var stop = document.querySelector('#stop');
	var xhr = new XMLHttpRequest();

	var audioContext = new AudioContext();
	var analyser = audioContext.createAnalyser();
	var size = 128;
	analyser.fftSize = size * 2;

	function load(url) {
		xhr.open("GET", url);
		xhr.responseType = 'arraybuffer';
		xhr.onload = function () {
			audioContext.decodeAudioData(xhr.response, function (buffer) {
				var bufferSource = audioContext.createBufferSource();
				bufferSource.buffer = buffer;
				bufferSource.connect(audioContext.destination);
				// bufferSource.start(0)
				bufferSource[bufferSource.start ? "start" : "noteOn"](0)
			}, function (err) {
				console, log(err)
			})
		}
		xhr.send();
	}

	function load2(url) {
		audio.src = url;
		audio.addEventListener('canplaythrough', function () {
			render()
		})
	}

	function render() {
		audio.play();

		var audioSource = audioContext.createMediaElementSource(audio);
		var gainNode = audioContext.createGain();
		var barW = 4;
		var gap = 1;
		canvas.width = cWidth;
		canvas.height = cHeight;

		var line = ctx.createLinearGradient(0, 0, 0, cHeight);
		line.addColorStop(0, "red");
		line.addColorStop(0.7, "orange");
		line.addColorStop(1, "green");
		var barNum = Math.round(cWidth / (barW + gap));
		ctx.fillStyle = line;
		var w = cWidth / barNum;
		audioSource.connect(analyser);
		analyser.connect(audioContext.destination);
		var audioArr = new Uint8Array(analyser.frequencyBinCount);


		var can = document.getElementById("mycanvas");
		var context1 = can.getContext("2d");
		var g1 = context1.createRadialGradient(200, 150, 0, 200, 150, 100);
		g1.addColorStop(0.1, 'rgb(255,0,0)');
		g1.addColorStop(1, 'rgb(50,0,0)');
		context1.fillStyle = g1;

		timer = requestAnimationFrame(function fn() {
			ctx.clearRect(0, 0, cWidth, cHeight);
			context1.clearRect(0, 0, 600, 400);
			/*获取音频*/

			analyser.getByteFrequencyData(audioArr);
			/*画布操作*/
			// var max = 0;
			for (var i = 0; i < barNum; i++) {
				var v = audioArr[i] / 256 * cHeight * 0.9;
				ctx.fillRect(w * i, cHeight - v, w * 0.6, v);
				draw(context1,audioArr[i] / 120)
				// if(max < audioArr[i]) max = audioArr[i]
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

	function draw(context,scale) {
		context.beginPath();
		context.arc(200, 150, 60 * scale , 0, Math.PI * 2, true);
		context.closePath();
		context.fill();
	}

})();