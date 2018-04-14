require.config({
  baseUrl : '../../js',
  paths :{
    jquery :'jquery',
    mui :'mui/3.7.1/mui.min',     //mui.js
    common : 'common'
  },
  shim :{
    'common':{
      deps : ['jquery'],
      exports : 'common'
    }
  }
});

require(['jquery','common','mui'],function(){

  var discovery = {};
  /**
   * 发现列表请求JS
   */
  discovery.fabulous = function(){
    var content = $(".discovery-list");
    //改变视频大小
    content.find("iframe").height(250);
    content.find("iframe").width("100%");
    //评论点赞
    content.find(".fabulous").on("click",function(){
      var that = $(this);
      var text = Number(that.children(".text").text()) ? Number(that.children(".text").text()) : 0;
      if(that.children(".ico").hasClass("ico2")){
        if(text>1){
          text--;
          that.children(".text").text(text);
        }else{
          that.children(".text").text("赞");
        }
        that.children(".ico").removeClass("ico2");
        mui.toast("取消点赞",{ duration:1000 });
      }else{
        text++;
        that.children(".text").text(text);
        that.children(".ico").addClass("ico2");
        mui.toast("点赞成功",{ duration:1000 });
      }
    });
  };

  /**
   * 发现详情请求JS
   */
    //评论模块
  discovery.comment = function(){
    var content = $(".discovery-details");
    //评论点赞
    content.find(".fabulous").on("click",function(){
      var that = $(this);
      var text = Number(that.children(".text").text()) ? Number(that.children(".text").text()) : 0;
      if(that.children(".ico").hasClass("ico2")){
        if(text>1){
          text--;
          that.children(".text").text(text);
        }else{
          that.children(".text").text("赞");
        }
        that.children(".ico").removeClass("ico2");
        mui.toast("取消点赞",{ duration:1000 });
      }else{
        text++;
        that.children(".text").text(text);
        that.children(".ico").addClass("ico2");
        mui.toast("点赞成功",{ duration:1000 });
      }
    });
    //点击删除
    content.find(".delete").on("click",function(){
      mui.confirm(' ', "确定删除此评论吗？",['取消', '确定'], function(e) {
        if (e.index === 1) {
          mui.toast("点击了是",{ duration:1000 });
        } else {
          mui.toast("点击了否",{ duration:1000 });
        }
      });
    });
  };

  //底部输入框收藏
  discovery.collection = function(){
    var content = $(".comment-input");
    //点赞
    content.find(".fabulous-bottom").on("click",function(){
      var that = $(this);
      var text = Number(that.children(".text").text()) ? Number(that.children(".text").text()) : 0;
      if(that.children(".ico").hasClass("ico2")){
        if(text>1){
          text--;
          that.children(".text").text(text);
        }else{
          that.children(".text").text("赞");
        }
        that.children(".ico").removeClass("ico2");
        mui.toast("取消点赞",{ duration:1000 });
      }else{
        text++;
        that.children(".text").text(text);
        that.children(".ico").addClass("ico2");
        mui.toast("点赞成功",{ duration:1000 });
      }
    });
    //收藏
    content.find(".collection").on("click",function(){
      var that = $(this);
      if(that.children(".ico").hasClass("ico2")){
        that.children(".ico").removeClass("ico2");
        mui.toast("取消收藏",{ duration:1000 });
      }else{
        that.children(".ico").addClass("ico2");
        mui.toast("收藏成功",{ duration:1000 });
      }
    });
    //分享
    content.find(".share").on("click",function(){
      $(".share-to").removeClass("h");
    });
    //输入框聚焦
    content.find(".left").children("input").focus(function(){
      content.find(".right").hide() && content.find(".rightButton").removeClass("h");
    });
    //输入框失焦
    content.find(".left").children("input").blur(function(){
      setTimeout(function(){
        content.find(".right").show() && content.find(".rightButton").addClass("h");
      },200);
    });
    //点击发表按钮
    content.find(".rightButton").on("click",function(){
      var val = content.find(".left").children("input").val();
      mui.toast(val,{ duration:1000 });
    });
  };

  discovery.init = function(){
    discovery.comment();
    discovery.collection();
    discovery.fabulous();
  };
  discovery.init();

});




