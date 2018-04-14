require.config({
  baseUrl : '../../js',
  paths :{
    jquery :'jquery',
    common : 'common',
    mui :'mui/3.7.1/mui.min',
    swiper :'swiper/3.4.2/swiper.jquery'     //swiper.js
  },
  shim :{
    'swiper':{
      deps : ['jquery'],
      exports : 'swiper'
    },
    'common':{
      deps : ['jquery'],
      exports : 'common'
    }
  }
});

require(['jquery','common','swiper','mui'],function(){

  var goods = {};
  //轮播图
  goods.banner = function(){
    //轮播小图
    new Swiper('.swiper-container-banner',{
      pagination : '.pagination',
      paginationType : 'fraction',
      prevButton:'.banner-left',    //向左
      nextButton:'.banner-right',   //向右
      loop: true,
      //autoplay : 3000,
      autoplayDisableOnInteraction : false //滑动后可以继续自动播放
    });

    //轮播大图
    var carousel = new Swiper('.swiper-container-bannerBig',{
      pagination : '.paginationBig',
      paginationType : 'fraction',
      loop: true,
      observer: true,
      observeParents: true,
      //autoplay : 3000,
      autoplayDisableOnInteraction : false //滑动后可以继续自动播放
    });

    //点击小图展开大图
    $(".swiper-container-banner").find(".swiper-slide").on("click",function(){
      carousel.slideTo($(this).index(), 1000, false);
      $("body").css({"overflow":"hidden"});
      $(".popup").show();
    });
    //关闭大图
    $(".popup").on("click",function(){
      $(".popup").hide();
      $("body").css({"overflow":"auto"});
    });
  };
  //图集
  goods.chart = function(){
    new Swiper('.swiper-container-chart',{
      slidesPerView: 2.5,
      spaceBetween : 10,
      observer: true,
      observeParents: true
    });
  };
  //点击收藏
  goods.collection = function(){
    var content = $(".goods");
    //评论点赞
    content.find(".fabulous").on("click",function(){
      var that = $(this);
      var text = Number(that.find(".num").text()) ? Number(that.find(".num").text()) : 0;
      if(that.children(".ico").hasClass("ico2")){
        if(text>1){
          text--;
          that.find(".num").text(text);
        }else{
          that.find(".num").text("0");
        }
        that.children(".ico").removeClass("ico2");
        mui.toast("取消点赞",{ duration:1000 });
      }else{
        text++;
        that.find(".num").text(text);
        that.children(".ico").addClass("ico2");
        mui.toast("点赞成功",{ duration:1000 });
      }
    });
  };
  //点击分享
  goods.share = function(){
    var content = $(".goods");
    content.find(".title-ico2").on("click",function(){
      $(".share-to").removeClass("h");
    })
  };

  goods.init = function(){
    goods.banner();
    goods.chart();
    goods.collection();
    goods.share();
  };
  goods.init();

})();
