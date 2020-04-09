/*
 * @Author: xuanyu
 * @Date: 2020-04-09 18:48:40
 * @LastEditTime: 2020-04-09 18:54:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /h5-music/js/main.js
 */
window.onload = function () {
  //rem mobile adaptation
  (function () {
    var styleNode = document.createElement("style");
    var w = document.documentElement.clientWidth / 16;
    styleNode.innerHTML = `html{font-size:${w}px!important}`;
    document.head.appendChild(styleNode);
  })();
  //get data
  //get element
  let swiperWrapper = $(".swiper-wrapper")[0]; //the is banners element
  let recommendItem = $(".recommend-list > ul ")[0];
  //获取首页banner图片
  $.get("http://121.42.14.221:3000/banner", function ({
    banners
  }) {
    let swiperWrap = "";
    banners.forEach((item, index) => {
      swiperWrap += `
            <div class="swiper-slide">
                <img src="${item.imageUrl}">
            </div>`;
    });
    swiperWrapper.innerHTML = swiperWrap;
    //banner control start
    new Swiper(".swiper-container", {
      autoplay: 2000,
      pagination: ".swiper-pagination",
      paginationClickable: true
    });
    //banner control end
  });
  //banner data end
  //recommend song list start
  $.get("http://121.42.14.221:3000/personalized", function ({
    result
  }) {
    let recommendList = "";
    result.forEach((item, index) => {
      console.log(result);
      if (index < 6) {
        recommendList += `
              <li>
                  <a href="#">
                      <div class="recommend-img">
                          <img src="${item.picUrl}">
                      </div>
                      <h6>${item.name}</h6>
                  </a>
              </li>`;
      }
    });
    recommendItem.innerHTML = recommendList;
  });
}