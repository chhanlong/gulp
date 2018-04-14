require.config({
  baseUrl : '../../js',
  paths :{
    jquery :'jquery'
  }
});

require(['jquery'],function($){
  var list = {};
  //选表列表
  list.home = function(){
    var content = $("#list");
    //点击
    content.find(".nav").children("a").on("click",function(){
      $(this).addClass("on").siblings().removeClass("on");
    });
    //滑动
    $(window).scroll(function(){
      var t= parseInt($(document).scrollTop());
      var h= content.find('.option').innerHeight() + content.find('.recommend').innerHeight();
      if(t>h){
        content.find(".nav").addClass('scroll');
      }else{
        content.find(".nav").removeClass('scroll') && content.find(".nav").children("a").removeClass("on");
      }
    });
  };

  list.init = function(){
    list.home();
  };
  list.init();

});


