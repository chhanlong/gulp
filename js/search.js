require.config({
  baseUrl : '../../js',
  paths :{
    jquery :'jquery',
    mui :'mui/3.7.1/mui.min'     //mui.js
  }
});

require(['jquery','mui'],function(){

  var search = {};
  var content = $(".search");

  //获取链接参数方法
  function getQueryStr(str){
    var LocString=String(window.document.location.href);
    var rs = new RegExp("(^|)"+str+"=([^/&]*)(/&|$)","gi").exec(LocString),tmp;
    if(tmp=rs){
      return tmp[2];
    }else{
      return false;
    }
  }

  search.delete = function(){
    //清空搜索历史
    content.find(".delete").on("click",function(){
      mui.toast("点击了清空按钮",{ duration:1000 });
    });

    //根据是否输入东西来决定清除按钮是否要存在
    content.find(".search-input").on("input propertychange", function(){
      var _clean = content.find(".search-ico");
      //根据是否输入东西来决定清除按钮是否要存在
      if($(this).val()){
        _clean.removeClass("h");
      }else{
        _clean.addClass("h");
      }
    });

    //搜索事件请求按钮
    var toSearchBtn = function(_this){
      //判断输入框是否为空
      if(!$.trim(_this.val())){
        _this.focus();
        return false;
      }
      //输入内容后跳转到搜索结果页
      var _winUrl = "search-list.html?kw=" + content.find(".search-input").val();
      window.location.href = _winUrl;
    };

    //搜索按钮事件 -- 点击搜索按钮后记录搜索历史
    content.find(".search-input").bind('search', function () { //移动端右下角搜索按钮
      toSearchBtn($(this));
    }).bind('keydown', function (e) {
      // 绑定键盘enter事件
      var key = e.which;
      if (key === 13) {
        e.preventDefault();
        toSearchBtn($(this));
      }
    });

    //输入框右侧的删除按钮
    content.find(".search-ico").on("click",function(){
      $(this).siblings(".search-input").val("");
      $(this).addClass("h");
    });

  };

  //搜索结果页
  search.result = function(){
    var kw = decodeURI(getQueryStr('kw'));
    var search = $(".search-list");
    //把链接上的内容赋值到输入框
    search.find(".search-input").val(kw);
    //tab切换
    search.find(".tabTitle").children("li").on("click",function(){
      $(this).addClass("on").siblings().removeClass("on");
      search.find(".tabContent").children(".list").eq($(this).index()).removeClass("h").siblings().addClass("h")
    })
  };

  search.init = function(){
    search.delete();
    search.result();
  };
  search.init();

});


