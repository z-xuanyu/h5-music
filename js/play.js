
window.onload = function(){
    //获取元素
    let playWrap = $(".play-wrap")[0]; //整个页面容器
    let tips = $(".play-tips")[0];
    let disc = $('.disc')[0];  //光碟旋转
    let currentTime = $('.play-time')[0];  //进度条开始时间轴
    let duration = $('.play-time')[1]; // 进度条结束时间
    let progress = $('.progress-wrap')[0];
    let playing = $(".playing")[0]; //播放暂停按钮
    let proBg = $(".progress-bg")[0];   //进度条背景
    let proBar = $(".progress-bar")[0]; //进度条圆点
    let songName = $(".back-song-name .song-name")[0]; //
    let oLyr = $(".song-lyrics-wrap")[0];
    let olyric = $(".song-lyrics")[0];
    let mark = true; //播放与暂停
    let mark2 = true; // 歌词控制
    //提取当前的ID
    (function(str){
        if(!str.includes('?')) return;
        let arr  = str.split("?")[1].split("&");
        arr.forEach((item,index) =>{
          let dataArr = item.split("=");
          if(dataArr[0]=='id'){
            localStorage.setItem(dataArr[0],dataArr[1]);
          }
        })
    })(location.href);
    //把本地ID存储到一个对象中
    let datas = {};
    datas.id = localStorage.getItem('id');
    //创建audio标签
    window._audio = document.createElement("audio");

    //获取歌曲的详细信息
    $.ajax({
      url: `http://121.42.14.221:3000/song/detail?ids=${datas.id}`,
      success:function({songs}){
        let picUrl = songs[0].al.picUrl;
        disc.innerHTML = `<img src="${picUrl}" alt="">`;
        songName.innerHTML = `<h5>${songs[0].name}</h5><div class="name">${songs[0].ar[0].name}</div>`;
      }
    });

    //获取歌曲播放
    $.ajax({
      url: `http://121.42.14.221:3000/song/url?id=${datas.id}`,
      success: function({data:[{url}]}) {
        disc.style.animation = "disc 10s linear infinite";
        _audio.src = url;
        _audio.play();
        //监听音乐是否播放完成
        _audio.addEventListener('enden',function(){
          disc.style.animation = "";  //如果音乐播放完，停止转动
        })
        //监听播放
        _audio.addEventListener('timeupdate',function(){
          nowTime();
        })
        //获取播放时间
        function nowTime(){
          //总时间
          duration.innerHTML = time(_audio.duration);
          currentTime.innerHTML = time(_audio.currentTime);

          //进度条
         let n = _audio.currentTime / _audio.duration;
         proBar.style.left = n * (progress.offsetWidth - proBar.offsetWidth) / 3.375 / 8 + 'rem';
         proBg.style.width = n * (progress.offsetWidth - proBar.offsetWidth) / 3.375 / 8 + 'rem';
        }

        //处理时间函数
        function time(cTime){
          cTime = parseInt(cTime);
          let m = zero(Math.floor(cTime % 3600 / 60));
          let s = zero(Math.floor(cTime % 60));
          return `${m}:${s}`
        }
        // 两位数时间格式
        function zero(num) {
          return num < 10 ? '0' + num : '' + num;
        }

        //音乐暂停播放控件
        playing.onclick = function(){
          if (mark) {
            _audio.pause();
            playing.className = "playing iconfont icon-icon-zanting";
            disc.style.animation = "";
          } else {
            _audio.play();
            playing.className = "playing iconfont icon-iconzanting";
            disc.style.animation = "disc 10s linear infinite";
          }
          mark = !mark;
          return false;
        }

        //歌词移动
        //点击歌词
        olyric.onclick = function() {
          //歌词的显示与隐藏
          if (mark2) {
            olyric.style.opacity = "1";
            disc.style.opacity = "0";
            tips.style.opacity = "0";
          } else {
            olyric.style.opacity = "0";
            disc.style.opacity = "1";
            tips.style.opacity = "1";
          }
          mark2 = !mark2;

          //获取歌词的详细信息
          $.ajax({
            url: `http://121.42.14.221:3000/lyric?id=${datas.id}`,
            success: function({ lrc: { lyric } }) {
              //歌词切割处理
              let data = lyric.split("[");
              //遍历切割出来的数组
              data.forEach((item, index) => {
                if (!item) return;
                let dataArr = item.split("]");
                let timeArr = dataArr[0].split(".")[0].split(":");
                let lyricStr = dataArr[1];
                let timer = timeArr[0] * 60 + timeArr[1] * 1;
                //创建歌词标签
                let p = document.createElement("p");
                p.className = "lyr" + timer;
                p.innerHTML = lyricStr;
                oLyr.appendChild(p);
              });

              //获取歌词标签所有的P标签
              let pArr = [...$(".song-lyrics p")];
              _audio.addEventListener("timeupdate", function() {
                let currentTime = parseInt(_audio.currentTime);
                pArr.forEach((item, index) => {
                  if (item.className == "lyr" + currentTime) {
                    oLyr.style.marginTop = -(item.offsetTop / 30) + "rem";
                    if (index > 0) {
                      pArr[index - 1].style.color = "#8e8383";
                    }

                    item.style.color = "#fff";
                  }
                });
              });
            }
          });
        };
      }
    })
}