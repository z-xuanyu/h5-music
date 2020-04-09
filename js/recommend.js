/*
 * @Author: your name
 * @Date: 2020-04-09 18:48:40
 * @LastEditTime: 2020-04-09 19:01:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /h5-music/js/recommend.js
 */
window.onload = function () {
  //获取元素节点
  let recWrap = $(".recommend-wrap ul")[0];
  let control = $('.control')[0];
  //创建空数组存储数据
  let songId = []; // 歌曲id
  let songImg = []; //歌曲图片
  let songName = [];
  //获取歌单数据
  $.get(
    "http://121.42.14.221:3000/personalized/newsong",
    function ({
      result
    }) {
      let songItem = "";
      result.forEach((item, index) => {
        songId.push(item.id);
        songImg.push(item.song.album.picUrl);
        songName.push(item.name);
        songItem += `
                <li>
                    <a href="#" class="playing">
                        <div class="song-item">
                            <div class="song-img">
                                <img src="${item.song.album.picUrl}">
                            </div>
                            <div class="song-info">
                                <h5 class="song-title">${item.name}</h5>
                                <div class="singer">夏日入侵企划-极恶都市</div>
                            </div>
                        </div>
                        <div class="song-play">
                            <span class="iconfont icon-bofang"></span>
                            <span class="iconfont icon-caidan-dian"></span>
                        </div>
                    </a>
                </li>
            `;
      });
      //添加数据
      recWrap.innerHTML = songItem;
      //创建播放控件
      window._audio = document.createElement("audio");
      //获取播放节点
      let playing = [...$(".playing")];
      playing.forEach((item, index) => {
        item.onclick = function () {
          //播放控件显示出来
          control.style.display = "block";
          //获取播放Id
          $.get(
            `http://121.42.14.221:3000/song/url?id=${songId[index]}`,
            function ({
              data
            }) {
              _audio.src = data[0].url;
              _audio.play();
            }
          );
          //改变音乐控件内容
          control.innerHTML = `
                <a href="../src/play.html?id=${songId[index]}" class="control-wrap">
                    <div class="song-content">
                        <div class="song-img">
                            <img src="${songImg[index]}">
                        </div>
                        <div class="song-info">
                            <h5 class="song-name">${
                              songName[index]
                            }</h5>
                            <div class="song-des">横滑可以切换上下一首哦</div>
                        </div>
                    </div>
                    <div class="song-play">
                        <span class="iconfont icon-bofang1"></span>
                        <span class="iconfont icon-bofangliebiao"></span>
                    </div>
                </a>
            `;
        };
      });
    }
  );
}