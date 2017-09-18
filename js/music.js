(function (Window, $) {

	var basic_config = {
		g_tk: 5381,
		uin: 0,
		inCharset: 'utf-8',
		outCharset: 'utf-8',
		notice: 0

	};
	var musiclist = [];
	var isPlaying;
	var cur_play_index;
	var currenttime;
	var total_time;
	$(function () {
		var music_config = {
				jsonpCallback: 'MusicJsonCallback',
				loginUin: 0,
				hostUin: 0,
				format: 'jsonp',
				platform: 'yqq',
				needNewCode: 0
			},
			music_url = 'https://szc.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_tag_conf.fcg';
		var config_data = Object.assign({}, basic_config, music_config);

		var singer_config = {
				jsonpCallback: 'GetSingerListCallback',
				channel: 'singer',
				page: 'list',
				key: 'all_all_all',
				pagesize: 100,
				pagenum: 1,
				loginUin: 0,
				hostUin: 0,
				format: 'jsonp',
				platform: 'yqq',
				needNewCode: 0
			},
			singer_url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';
		var config_singer_data = Object.assign(basic_config, singer_config);
		var HOTNAME = "热门";

		var singer_detail_config = {
			jsonpCallback: 'MusicJsonCallbacksinger_track',
			loginUin: 0,
			hostUin: 0,
			format: 'jsonp',
			platform: 'yqq',
			needNewCode: 0,
			// singermid:002J4UUk29y8BY
			order: 'listen',
			begin: 0,
			num: 30,
			songstatus: 1
		};
		var singer_detail_url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';
		var config_singer_detail_data = Object.assign({}, basic_config, singer_detail_config);
		var lyric_config = {
			g_tk: 5381,
			jsonpCallback: 'MusicJsonCallback_lrc',
			loginUin: 0,
			hostUin: 0,
			callback: 'MusicJsonCallback_lrc',
			format: 'jsonp',
			platform: 'yqq',
			needNewCode: 0,
			pcachetime: +new Date(),
			inCharset: 'utf8',
			outCharset: 'utf-8',
			notice: 0

		};
		var lyric_url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric.fcg';
		var lyric_url_api = 'https://api.darlin.me/music/lyric/202773258';
		// var config_lyric_data = Object.assign({}, basic_config, lyric_config);
		// var config_lyric_data = $.extend({}, basic_config, lyric_config);


		getSingerList(singer_url, config_singer_data)
			.then(function (data) {
				var singer = data.data.list;

				var map = {
					hot: {
						title: HOTNAME,
						items: []
					}
				};
				singer.forEach(function (item, index) {
					if (index < 10) {
						map.hot.items.push({
							id: item.Fsinger_mid,
							name: item.Fsinger_name,
							avatar: `//y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
						})
					}
					var key = item.Findex;
					if (!map[key]) {
						map[key] = {
							title: key,
							items: []
						}
					}
					map[key].items.push({
						id: item.Fsinger_mid,
						name: item.Fsinger_name,
						avatar: `//y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
					});
					// map[key].items.push(new singer(item.Fsinger_mid,item.Fsinger_name))
				});
				//解决map有序列表处理
				var hot = [], ret = [];
				for (var k in map) {
					var temp = map[k];
					if (temp.title.match(/[a-zA-Z]/)) {
						ret.push(temp)
					} else if (temp.title == HOTNAME) {
						hot.push(temp)
					}
				}
				ret.sort(function (a, b) {
					return a.title.charCodeAt(0) - b.title.charCodeAt(0)
				});
				var maplist = hot.concat(ret);
				var singerStr = "";
				for (var i in maplist) {
					var curItems = maplist[i].items;
					singerStr += `<li class="singer-category">${maplist[i].title}</li>`
					for (var j in curItems) {
						singerStr += `<li data-id=${curItems[j].id} data-singer=${curItems[j].name} class="singer-select-hook">
                    <img class="avatar" src=${curItems[j].avatar}>
                    <span class="singer-name">${curItems[j].name}</span>
                    </li>`
					}
				}
				$("#singer_list").html(singerStr)
			});


		/* getMusicList(music_url, config_data)
		 .then(function (data) {
		 var datas = data.data.categories;
		 var temp = "";
		 for (var k in datas) {
		 if (datas[k].usable) {

		 var str = "", child = "";
		 var title = datas[k].categoryGroupName;
		 var items = datas[k].items;
		 str += '<span>' + title + '</span>';
		 for (var i in items) {
		 child += '<li data-categoryid="' + items[i].categoryId + '">' + items[i]["categoryName"] + '</li>'
		 }
		 temp += '<li>' + str + '<ul>' + child + '</ul></li>'
		 }
		 }

		 $("#music_category").html(temp)
		 });
		 */

		$("#singer_list").on('click', '.singer-select-hook', function () {

			var sid = $(this).data("id");
			var singer = $(this).data("singer");
			config_singer_detail_data.singermid = sid;
			var avatar = `<div class="avatar-box" style="background-image:url('//y.gtimg.cn/music/photo_new/T001R300x300M000${sid}.jpg?max_age=2592000')"><span>${singer}</span></div>`;
			getSingerDetailList(singer_detail_url, config_singer_detail_data)
				.then(function (data) {
					var songs = data.data.list;
					var ret = [];
					songs.forEach(function (item, index) {
						ret.push({
							songsData: {
								singer: singerFilter(item.musicData.singer),
								albumname: item.musicData.albumname,
								songid: item.musicData.songid,
								songname: item.musicData.songname,
								mid: item.musicData.songmid,
								image: `//y.gtimg.cn/music/photo_new/T002R300x300M000${item.musicData.albummid}.jpg?max_age=2592000`,
								duration: item.musicData.interval,
								url: `http://ws.stream.qqmusic.qq.com/${item.musicData.songid}.m4a?fromtag=46`
							},
							curindex: index
						})
					});
					var len = ret.length;
					var lis = "";
					for (var i = 0; i < len; i++) {
						lis += `<li class="song-hook" data-index="${ret[i].curindex}"><span class="music-name">${ret[i].songsData.songname}</span><span class="music-info">${ret[i].songsData.singer}</span></li>`

					}
					musiclist = ret;
					$("#singer_detail_box")
						.empty()
						.html(avatar + '<div class="scroll-pages"><div class="scroll"><ul class="singer-muisic-list" id="music_list">' + lis + '</div></div></ul><span class="closer" id="singer-detail-close"><i class="glyphicon glyphicon-log-out"></i></span>')
						.fadeIn();
				})
		});
		var $singerDetailBox = $("#singer_detail_box");
		$singerDetailBox.on('click', "#singer-detail-close", function (e) {
			e.preventDefault();
			$singerDetailBox.fadeOut();
		});
		$("#player-box-close").click(function (e) {
			e.preventDefault();
			$('#play_box').fadeOut();
		});
		$singerDetailBox.on('click', '.song-hook', function () {
			cur_play_index = $(this).data("index");
			playMusic(cur_play_index);
			$("#play_box").fadeIn();

		});

		var audio = document.querySelector("#audio");
		$("#player").on('click', function () {
			var _this = this;
			if (isPlaying) {
				audio.pause();
				$(_this).children('i').removeClass('glyphicon-pause').addClass('glyphicon-play-circle')
				$("#albumn").removeClass('rotate-albumn')
			} else {
				audio.play();
				$(_this).children('i').removeClass('glyphicon-play-circle').addClass('glyphicon-pause')
				$("#albumn").addClass('rotate-albumn')
			}
			isPlaying = !isPlaying;
		});
		$("#prve").on('click', function () {

			if (cur_play_index == 0) {
				cur_play_index = musiclist.length
			}
			cur_play_index--;
			playMusic(cur_play_index);
			$("#player").children('i').addClass('glyphicon-pause').removeClass('glyphicon-play-circle');

		});
		$("#next").on('click', function () {
			if (cur_play_index == musiclist.length - 1) {
				cur_play_index = -1
			}
			cur_play_index++;
			playMusic(cur_play_index);
			$("#player").children('i').addClass('glyphicon-pause').removeClass('glyphicon-play-circle');

		});
		$("#ramdom").on('click', function () {
			var temp_max = musiclist.length - 1;
			var ramdom_cur = Math.ceil(Math.random() * temp_max)
			playMusic(ramdom_cur);
			$("#player").children('i').addClass('glyphicon-pause').removeClass('glyphicon-play-circle');

		});
		/*监听是音乐播放器的状态*/
		setInterval(function () {
			if (isPlaying) {
				if (audio.paused) {
					// if(!playIcon.hasClass('glyphicon-pause')){
					$("#player").children('i').removeClass('glyphicon-pause').addClass('glyphicon-play-circle');
					// }
					// if($("#albumn").hasClass('rotate-albumn')){
					$("#albumn").removeClass('rotate-albumn');
					// }
					isPlaying = false;
				}
			}
			if (audio.ended) {
				$("#next").trigger('click')
			}
		}, 1000);
		/*播放进度*/
		var progress;
		var loc = 0;
		audio.addEventListener("timeupdate", function () {
			currenttime = this.currentTime;
			progress = ((currenttime / total_time).toFixed(4)) * 100;
			var formatTime = format(currenttime)
			$("#cur_time").text(formatTime);
			$("#end_time").text(format(total_time));
			$("#sliderTrack").css("width", progress + '%');

			/*歌词高亮*/

			var lyric_lis = $("#lyric_box").children('li');

			for (var i = 0; i < lyric_lis.length; i++) {
				var $li = $(lyric_lis[i]);
				var $litime = $li.data("time").substring(0, 5);
				if ($litime == formatTime) {
					$li.addClass('active').siblings().removeClass();
					/*滚动*/
					var pos = $li.offset().top;
					console.log(pos);
					if (pos > 350) {
						loc += 35;
						$("#lyric_box").animate({scrollTop: loc})
					}
					break;
				}
			}
		});
		$("#lyricBtn,.lyr-box").click(function (e) {
			e.preventDefault();
			$("#lyric_wrapper").fadeIn()
		});
		$("#lyric_wrapper").click(function () {
			$(this).fadeOut()
		})
	});

	function format(time) {
		time = time | 0;
		var minite = time / 60 | 0;
		var second = time % 60;
		if (second.toString().length < 2) {
			second = "0" + second;
		}
		if (minite.toString().length < 2) {
			minite = "0" + minite;
		}
		return minite + ":" + second;
	}

	var lyric_url = 'https://api.darlin.me/music/lyric/'

	function playMusic(index) {

		var cur_play_info = musiclist[index].songsData;
		var singer = cur_play_info.singer;
		var albumname = cur_play_info.albumname;
		var url = cur_play_info.url;
		var songname = cur_play_info.songname;
		var image = cur_play_info.image;
		var songid = cur_play_info.songid;
		total_time = cur_play_info.duration;
		$("#song_avatar,#play_box,#albumn").css({
			background: 'url(' + image + ') center center',
			backgroundSize: 'cover'
		});
		$("#song_info").html(`<h5>${singer}</h5><h6>${albumname}</h6>`);
		$("#songname").text(songname);
		$("#albumn").addClass('rotate-albumn');
		$("#audio").attr({
			src: url
		});

		getSongLyric(lyric_url + songid, {})
			.then(function (data) {
				var lyric = Base64.decode(data.lyric)
					.split('[')
					.slice(5)
					.map(str => {
						let t = str.split(']')
						return {[t[0]]: [[t[0]], t[1]]}
					})
					.reduce((a, b) => {
						return {...a, ...b}
					});
				var lyric_text = "";
				for (var key in lyric) {
					lyric_text += `<li data-time="${lyric[key][0][0]}">${lyric[key][1]}</li>`
				}
				$("#lyric_box").html(lyric_text)
			})
		isPlaying = false;
		$("#player").trigger('click')
	}

	function singerFilter(singArr) {
		if (!singArr) {
			return ''
		}
		var str = [];
		for (var k in singArr) {
			str.push(singArr[k].name)
		}
		return str.join('/')
	}

	function getSingerList(url, data) {
		// url = param(url, data);
		return new Promise(function (resolve, reject) {
			$.ajax({
				url: url,
				data: data,
				dataType: 'jsonp',
				jsonp: "GetSingerListCallback",
				jsonpCallback: "GetSingerListCallback",
				success: function (data) {
					resolve.call(this, data);
				},
				error: function (err) {
					reject.call(this, err)
				}
			})
		})
	}

	function getMusicList(url, data) {
		// url = param(url, data);
		return new Promise(function (resolve, reject) {
			$.ajax({
				url: url,
				data: data,
				dataType: 'jsonp',
				jsonp: "MusicJsonCallback",
				jsonpCallback: "MusicJsonCallback",
				success: function (data) {
					resolve.call(this, data);
				},
				error: function (err) {
					reject.call(this, err)
				}
			})
		})
	}

	function getSingerDetailList(url, data) {
		// url = param(url, data);
		return new Promise(function (resolve, reject) {
			$.ajax({
				url: url,
				data: data,
				dataType: 'jsonp',
				jsonp: "MusicJsonCallbacksinger_track",
				jsonpCallback: "MusicJsonCallbacksinger_track",
				success: function (data) {
					resolve.call(this, data);
				},
				error: function (err) {
					reject.call(this, err)
				}
			})
		})
	}

	function getSongLyric(url, data) {

		return new Promise(function (resolve, reject) {

			$.ajax({
				url: url,
				data: data,
				dataType: 'jsonp',
				// jsonp: "MusicJsonCallback_lrc",
				// jsonpCallback: "MusicJsonCallback_lrc",
				success: function (data) {
					resolve.call(this, data);
				},
				error: function (err) {
					reject.call(this, err)
				}
			})
		})
	}

	/* function param(url, data) {
	 var temp = "";
	 for (var key in data) {
	 var value = data[key] !== undefined ? data[key] : "";
	 temp += '&' + key + "=" + encodeURIComponent(value);
	 }
	 temp ? temp.substring(1) : "";
	 return url += (url.indexOf('?') < 0) ? '?' : "&" + temp;
	 }*/

	function MusicJsonCallback() {
	}

	function GetSingerListCallback() {
	}

	function MusicJsonCallbacksinger_track() {
	}

	function MusicJsonCallback_lrc() {
	}
})(Window, jQuery);
