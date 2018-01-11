(function (Window, $) {

    var basic_config = {
        g_tk: 5381,
        uin: 0,
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0
    };
    var emptyLineNum = 10;
    var lyric_url = 'https://api.darlin.me/music/lyric/';
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
    // var lyric_url_api = 'https://api.darlin.me/music/lyric/202773258';
    var musiclist = [];
    var isPlaying;
    var cur_play_index;
    var currenttime;
    var total_time;
    var loc = 0;
    var slidePercent = 0
    var Dom = {
        $singerDetailBox: $("#singer_detail_box"),
        $lyricWrapper: $("#lyric_wrapper"),
        $lyricBox: $("#lyric_box"),
        $miniWrapper: $('#miniWrapper'),
        $playBox: $('#play_box'),
        $playboxCloser: $("#player-box-close"),
        $singerList: $("#singer_list"),
        $singerListHash: $("#singer_hash"),
        $player: $("#player"),
        $playerBtn: $(".player-hook"),
        $sliderBtn: $("#sliderBtn"),
        $slider : $("#slider")
    };
    var audio = document.querySelector("#audio");
    var playState = false;
    var touch_msg = {}
    $(function () {

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
                var strHash = "";
                for (var i in maplist) {
                    var curItems = maplist[i].items;
                    var temp_name = maplist[i].title;
                    var temp_hash = temp_name == HOTNAME ? "热" : temp_name;
                    var temp_hash_id = temp_name == HOTNAME ? "hot" : temp_name;
                    singerStr += `<li id="hash_${temp_hash_id}" class="singer-category">${maplist[i].title}</li>`;
                    strHash += `<li data-id="#hash_${temp_hash_id}">${temp_hash}</li>`;
                    for (var j in curItems) {
                        singerStr += `<li data-id=${curItems[j].id} data-singer=${curItems[j].name} class="singer-select-hook">
                    <img class="avatar" src=${curItems[j].avatar}>
                    <span class="singer-name">${curItems[j].name}</span>
                    </li>`
                    }
                }
                Dom.$singerListHash.html(strHash);
                Dom.$singerList.html(singerStr)
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
        Dom.$singerListHash.on('click', 'li', function (e) {
            e.preventDefault();
            var id = $(this).data("id");
            var scrollH = ($(id).offset().top | 0 ) - Dom.$singerList.offset().top + Dom.$singerList.scrollTop();
            $("#scroll_list").animate({scrollTop: scrollH});
        });
        Dom.$singerList.on('click', '.singer-select-hook', function () {

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
                        lis += `<li class="song-hook" data-index="${ret[i].curindex}">
						<div class="item-left">
						<span class="music-name">${ret[i].songsData.songname}</span>
						<span class="music-info">${ret[i].songsData.singer}</span>
						</div><div class="item-right">${format(ret[i].songsData.duration)}</div>
						</li>`

                    }
                    musiclist = ret;
                    Dom.$singerDetailBox
                        .empty()
                        .html(avatar + '<div class="scroll-pages"><div class="scroll"><ul class="singer-muisic-list" id="music_list">' + lis + '</div></div></ul><span class="closer" id="singer-detail-close"><i class="glyphicon glyphicon-log-out"></i></span>')
                        .fadeIn();
                })
        });


        Dom.$singerDetailBox.on('click', '.song-hook', function () {
            cur_play_index = $(this).data("index");
            playMusic(cur_play_index);
            Dom.$playBox.fadeIn();
            Dom.$miniWrapper.fadeOut();

        });
        Dom.$singerDetailBox.on('click', "#singer-detail-close", function (e) {
            e.preventDefault();
            Dom.$singerDetailBox.fadeOut();
        });

        /*监听是音乐播放器的状态*/
        setInterval(function () {
            if (isPlaying) {
                if (audio.paused) {
                    Dom.$player.children('i').removeClass('glyphicon-pause').addClass('glyphicon-play-circle');
                    $("#albumn").removeClass('rotate-albumn');

                    isPlaying = false;
                }
            }
            if (audio.ended) {
                $("#next").trigger('click')
            }
        }, 1000);
        /*播放进度*/
        var progress;
        var prevLine = 0;
        var prevLyric = "";
        audio.addEventListener('canplay', function () {
            playState = true;
            isPlaying = false
            $("#player").trigger("click")
        });
        audio.addEventListener('pause ended', function () {
            playState = false;
        });
        audio.addEventListener("timeupdate", function () {
            if(slidePercent > 0 ){
                this.currentTime = slidePercent * total_time;
                slidePercent = 0
            }
             currenttime = this.currentTime;
            progress = ((currenttime / total_time).toFixed(4)) * 100;
            var circleProgress = (100 - progress) * Math.PI;
            $("#circle_progress").attr("stroke-dashoffset", circleProgress);
            var formatTime = format(currenttime);
            var sliderWidth = $("#slider").width();
            $("#cur_time").text(formatTime);
            $("#end_time").text(format(total_time));
            if (!touch_msg.initial) {
                $("#sliderTrack").css("width", progress + '%');
                Dom.$sliderBtn.css("left", (((progress / 100) * sliderWidth) - 3) + 'px');
            }
            /*歌词高亮*/
            var lyric_lis = Dom.$lyricBox.children('li');
            if (lyric_lis.length) {
                var liHeight = lyric_lis[0].clientHeight;
                var cur_line = findCurNum(currenttime, lyric_lis);
                var li = lyric_lis[cur_line];
                var $li = $(li);
                var thisLyric = $li.text().toString();
                if (thisLyric.length > 1 && thisLyric != prevLyric) {
                    if (cur_line > prevLine) {
                        $li.addClass('active').siblings().removeClass();
                        var pos = li.offsetTop;
                        if (Dom.$lyricWrapper.css("display") != 'none' && cur_line > 9) {
                            loc = (cur_line - 9) * liHeight;
                            Dom.$lyricBox.animate({scrollTop: loc})
                        }
                    }
                    prevLine = cur_line
                }
            }
        });

        Dom.$sliderBtn[0].addEventListener('touchstart', function (e) {
            touch_msg.initial = true;
            touch_msg.startX = e.touches[0].pageX;
            touch_msg.left = +Dom.$sliderBtn.css("left").split("px")[0]
        });
        Dom.$sliderBtn[0].addEventListener('touchmove', function (e) {
            if (!touch_msg.initial) {
                return
            }
            var delta = e.touches[0].pageX - touch_msg.startX;
            var offset_width = Math.min(Dom.$slider.width() - 3, Math.max(0, touch_msg.left + delta));
            $("#sliderTrack").css("width", offset_width + 'px');
            Dom.$sliderBtn.css("left", (offset_width - 3) + 'px');
        });
        Dom.$sliderBtn[0].addEventListener('touchend', function () {
            touch_msg.initial = false;
            slidePercent = +(Dom.$sliderBtn.css("left").split("px")[0]) / Dom.$slider.width();
            $("#player").trigger("click")
        });
        /*播放器控制板事件*/
        $("#player,#miniPlayer").on('click', function () {
            if (!playState) {
                return
            }
            if (isPlaying) {
                audio.pause();
                $("#miniPlayer").children('i').removeClass('glyphicon-pause').addClass('glyphicon-play');
                $("#player").children('i').removeClass('glyphicon-pause').addClass('glyphicon-play');
                $("#albumn,#mini_avatar").addClass('pause-albumn')
            } else {
                audio.play();
                $("#miniPlayer").children('i').removeClass('glyphicon-play').addClass('glyphicon-pause');
                $("#player").children('i').removeClass('glyphicon-play').addClass('glyphicon-pause');
                $("#albumn,#mini_avatar").removeClass('pause-albumn');
                if (Dom.$lyricWrapper.css("display") === "none") {
                    Dom.$lyricBox.animate({scrollTop: 0});
                }
                loc = 0;
            }
            isPlaying = !isPlaying;
        });
        $("#prve").on('click', function () {

            if (cur_play_index == 0) {
                cur_play_index = musiclist.length
            }
            cur_play_index--;
            playMusic(cur_play_index);
            Dom.$lyricBox.animate({scrollTop: 0});
            Dom.$player.children('i').addClass('glyphicon-pause').removeClass('glyphicon-play-circle');

        });
        $("#next").on('click', function () {
            if (cur_play_index == musiclist.length - 1) {
                cur_play_index = -1
            }
            cur_play_index++;
            playMusic(cur_play_index);
            Dom.$lyricBox.animate({scrollTop: 0});
            Dom.$player.children('i').addClass('glyphicon-pause').removeClass('glyphicon-play-circle');

        });
        $("#ramdom").on('click', function () {
            var temp_max = musiclist.length - 1;
            var ramdom_cur = Math.ceil(Math.random() * temp_max);
            playMusic(ramdom_cur);
            Dom.$lyricBox.animate({scrollTop: 0});
            Dom.$player.children('i').addClass('glyphicon-pause').removeClass('glyphicon-play-circle');

        });
        $("#lyricBtn,.lyr-box").click(function (e) {
            e.preventDefault();
            Dom.$lyricWrapper.fadeIn();
            Dom.$miniWrapper.fadeIn();
            var lis = Dom.$lyricBox.children('li');
            var li_height = lis[0].clientHeight;
            loc = (prevLine - 9) * li_height;
            lis.eq(prevLine).addClass('active');
            Dom.$lyricBox.animate({scrollTop: loc})
        });
        /*歌词面板*/
        Dom.$lyricWrapper.click(function (e) {
            e.preventDefault();
            $(this).fadeOut();
            Dom.$miniWrapper.fadeOut();
            return false
        });
        /*播放器头像点击事件*/
        $("#song_avatar").click(function (e) {
            e.preventDefault();
            Dom.$playboxCloser.trigger('click')
        });
        $("#mini_avatar").click(function (e) {
            e.preventDefault();
            if (Dom.$lyricWrapper.css("display") != "none") {
                Dom.$lyricWrapper.trigger('click')
            } else {
                Dom.$miniWrapper.fadeOut();
                Dom.$playBox.fadeIn();
            }

        });
        /*关闭按钮*/
        Dom.$playboxCloser.click(function (e) {
            e.preventDefault();
            Dom.$playBox.fadeOut();
            Dom.$miniWrapper.fadeIn();
            Dom.$singerDetailBox.fadeIn();
        });
    });

    function findCurNum(time, lines) {
        var len = lines.length;
        time = time * 1000;
        for (var i = 0; i < len; i++) {
            var linetime = $(lines[i]).data("time");
            if (linetime && time < +linetime) {
                return i - 1;
            }
        }
        return len - emptyLineNum - 1;
    }

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

	var box = document.querySelector('#chartbox');
	var canvas = document.querySelector('#canvas');
	var ctx = canvas.getContext('2d');
	window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
	var timer ;
	var cWidth = box.clientWidth;
	var cHeight = box.clientHeight;

	function render(){
		// audio.play();
		var audioContext = new AudioContext();
		var analyser = audioContext.createAnalyser();
		var size = 128;
		analyser.fftSize = size * 4;
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

	function playMusic(index) {
        var cur_play_info = musiclist[index].songsData;
        var singer = cur_play_info.singer;
        var albumname = cur_play_info.albumname;
        var url = cur_play_info.url;
        var songname = cur_play_info.songname;
        var image = cur_play_info.image;
        var songid = cur_play_info.songid;
        total_time = cur_play_info.duration;
        $("#song_avatar,#play_box,#albumn,#mini_avatar").css({
            background: 'url(' + image + ') center center',
            backgroundSize: 'cover'
        });
        $("#song_info,#mini_song_info").html(`<h5>${songname}</h5><h6>${singer}<span class="pd-5">/</span>${albumname}</h6>`);
        $("#songname").text(songname);
        $("#albumn,#mini_avatar").addClass('rotate-albumn');
        $("#audio").attr({
            src: url
        });
        /*可视化*/
		// render();


        getSongLyric(lyric_url + songid, {})
            .then(function (data) {
                var lyric = Base64.decode(data.lyric)
                    .split('[')
                    .slice(5)
                    .map(str => {
                        let t = str.split(']');
                        return {[t[0]]: [[calcTime(t[0])], t[1]]}
                    })
                    .reduce((a, b) => {
                        // var ret = {...a, ...b}
                        return Object.assign({}, a, b);
                    });
                var lyric_text = "";
                var lyric_key = "";
                for (var k in lyric) {
                    lyric_key = lyric[k][0][0] || 0;
                    lyric_text += `<li data-time="${lyric_key}">${lyric[k][1]}</li>`
                }
                /*让滚动条额外增半屏高度*/
                for (var i = 0; i < emptyLineNum; i++) {
                    lyric_text += '<li></li>'
                }
                Dom.$lyricBox.html(lyric_text)
            });
        isPlaying = false;
    }

    function calcTime(time) {
        var temp = time.split(":");
        return temp[0] * 60 * 1000 + temp[1] * 1000
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
