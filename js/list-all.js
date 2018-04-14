require.config({
  baseUrl : '../../js',
  paths :{
    jquery :'jquery',
    mui :'mui/3.7.1/mui.min',     //mui.js
    iscroll :'iscroll/5.2.0/iscroll.min'     //swiper.js
  },
  shim:{
    'iscroll':{
      deps : ['jquery'],
      exports : 'iscroll'
    }
  }
});

require(['jquery','mui','iscroll'],function($,mui,IScroll){

  //获取链接参数方法
  function getQueryStr(str){
    var LocString=String(window.document.location.href);
    var rs = new RegExp("(^|)"+str+"=([^/&]*)(/&|$)","gi").exec(LocString),tmp;
    if(tmp=rs){
      return tmp[2];
    }else{
      return "";
    }
  }

  //数组去重
  function uniqueArray(data){
    data = data || [];
    var a = {};
    for (var i=0; i<data.length; i++) {
      var v = data[i];
      if (typeof(a[v]) == 'undefined'){
        a[v] = 1;
      }
    }
    data.length=0;
    for (var i in a){
      data[data.length] = i;
    }
    return data;
  }

  /**
   *重要类名
   * choice 选中选项
   * category 全部分类名称
   * left-brand 左侧品牌
   * left-series 左侧系列
   */

  var list = {};
  var attr = decodeURI(getQueryStr('attr'));  //选项
  var b = decodeURI(getQueryStr('b'));        //品牌

  /*----------------------------请求函数----------------------------*/
  list.ajax = function(){
    var arr = [];
    var arr2 = [];
    var b;
    //数组循环出外面选中的值(请求)
    $(".option").find("a").each(function(){
      arr.push($(this).attr("value"));
    });
    //其他选项
    $(".category .category_content .on").each(function(){
      if($(this).parents(".category").hasClass("left-brand")){
        b = $(this).attr("value");
      }else{
        arr2.push($(this).attr("value"));
      }
    });
    console.log('b',b ? b : "空");
    //console.log('arr',arr.concat(arr2));
    console.log('arr2',uniqueArray(arr.concat(arr2)).join('-') ? uniqueArray(arr.concat(arr2)).join('-') : "空");
  };
  /*----------------------------请求系列----------------------------*/
  list.series = function(code){
    console.log(code);
    mui.toast('请求系列',{ duration:1000 });
    //console.log(code);
    /*
    $.ajax({
      type:'get',
      dataType:"json",
      url: '/front/search/brandSeries',
      data:{
        "brandCode":code
      },
      success: function(dt){
        console.log(dt);
        mui.toast('请求系列成功',{ duration:1000 });
      },
      error:function(){
        mui.toast('请求系列失败',{ duration:1000 });
      }
    });
    */
  };


  /*----------------------------选表结果----------------------------*/
  list.all = function(){
    var content = $(".list-all");
    //加载IScroll
    myScroll = new IScroll('.left-content .iScroll_floor',{
      scrollX: false,
      scrollY: true,
      scrollbars: 'custom',
      click: false
    });
    //头部
    content.find(".tabTitle").children("li").on("click",function(){
      $(this).toggleClass("on") && $(this).children(".ico").toggleClass("ico2");
      $(this).siblings().removeClass("on") && $(this).siblings().children(".ico").removeClass("ico2");
      content.find(".tabContent").children(".list").eq($(this).index()).toggleClass("h").siblings().addClass("h");

      if($(this).index() == 4){
        $(".list-left").removeClass("h");
        //打开弹窗的时候把外面的选项带进去,先判断里面的有没有选中，选中的情况下不再去点击
        $(".option").find("a").each(function(){
          var category = $(".category_content span[value="+$(this).attr("value")+"]");
          if(category.hasClass("on") == false){
            category.trigger("click");
          }
        });
        myScroll.refresh();//更新滚动高度
      }
    });

    //更多条件背景关闭弹窗
    var close = function(page){
      page.on("click",function(){
        content.find(".list-left").addClass("h");
        content.find(".tabTitle").children("li").eq(4).removeClass("on");
        content.find(".tabTitle").children("li").eq(4).children(".ico").removeClass("ico2");
        content.find(".tabContent").children(".list").eq(4).addClass("h");
      });
    };
    close(content.find(".list-left").children(".bj"));
    close($("#delete"));
    close($(".list-left .footer_button"));

    //头部点击选项
    content.find(".tabContent").children(".list").children("li").on("click",function(){
      var that = $(this);
      var text = that.text();
      var code = that.attr("value");

      if(that.hasClass("on") == false){
        //选择的时候把当前包含on的类名和下面选项一样的删除掉，只能单选
        that.siblings("li[class~=on]").attr("value") ? content.find(".option a[value="+that.siblings("li[class~=on]").attr("value")+"]").remove() : false;
        that.addClass("on").siblings().removeClass("on");
        content.find(".option").append("<a value="+code+">"+text+"<span>x</span></a>");
        content.find(".option").removeClass("h");
        //请求ajax
        list.ajax();
      }
      that.parents(".list").addClass("h");

    });
    //删除点击选项
    $(".option").on("click","a",function(){
      var code = $(this).attr("value");
      content.find(".tabContent").children(".list").children("li[value="+code+"]").removeClass("on");
      $(this).remove();
      //请求ajax
      list.ajax();
      if(content.find(".option").children("a").length == 0){
        content.find(".option").addClass("h");
      }
    });

  };

  /*----------------------------左侧内容----------------------------*/
  list.left = function(){
    var content = $(".list-left");
    //选择选项
    $(".category_content").find("span").unbind("click").on("click",function(){
      var text = $(this).text();
      var code = $(this).attr("value");
      if($(this).hasClass("on")){
        $(this).removeClass("on");
        content.find(".choice").children("a[value="+code+"]").remove();
        //删除外面相同的类
        $(".option").find("a[value="+code+"]").trigger("click");
      }else{
        //选择的时候把当前包含on的类名和下面选项一样的删除掉，只能单选
        $(this).siblings("span[class~=on]").attr("value") ? content.find(".choice").children("a[value="+$(this).siblings("span[class~=on]").attr("value")+"]").remove() : false;
        $(this).addClass("on").siblings().removeClass("on");
        content.find(".choice").append("<a value="+code+">"+text+"<span>x</span></a>");
        //添加外面相同的类
        $(".list-all .tabContent .list li[value="+code+"]").trigger("click");
      }
      //判断是不是点击品牌，品牌的data-index=2 其他的为0
      if($(this).parents(".category").find(".category_open").attr("data-index") == 2){
        //判断品牌选项是不是大于0,选择品牌显示系列,请求接口返回系列数据(参数品牌选中类，系列类)
        var brandOn = $(".left-brand .category_content .on");
        var series = $(".left-series");
        if(brandOn.length>0){
          series.find(".category_content").children("span").each(function(){
            $(".choice a[value="+$(this).attr("value")+"]").trigger("click");
          });
          list.series(brandOn.attr("value"));
          series.removeClass("h");
        }else{
          series.addClass("h");
          series.find(".category_content").children(".on").trigger("click");
        }
      }
      myScroll.refresh();//更新滚动高度
    });

    //删除选项
    content.find(".choice").on("click","a",function(){
      var that = $(this);
      var code = that.attr("value");
      $(".category_content").find("span[value="+code+"]").removeClass("on");
      that.remove();
      myScroll.refresh();//更新滚动高度
    });

    //点击展开全部 data-index == 2 说明是品牌页
    content.on("click",".category_title .category_open",function(){
      var that = $(this);
      if(that.attr("data-index")== 0){
        that.attr("data-index",1);
        that.parents(".category_title").siblings(".category_content").addClass("category-on");
        that.children("em").text("收起") && that.children(".arrow").addClass("arrow2");
      }else if(that.attr("data-index")== 1){
        that.attr("data-index",0);
        that.parents(".category_title").siblings(".category_content").removeClass("category-on");
        that.children("em").text("全部") && that.children(".arrow").removeClass("arrow2");
      }else if(that.attr("data-index")== 2){
        //打开全部品牌
        brand();
      }
      myScroll.refresh();//更新滚动高度
    });

    //打开全部品牌操作
    var brand = function(){
      //显示弹窗
      content.find(".list-left-brand").children(".brand-list").children(".iScroll_floor").css("height", $(window).height()-94);
      content.find(".list-left-brand").removeClass("h");
      new IScroll('.list-left-brand .iScroll_floor',{
        scrollX: false,
        scrollY: true,
        scrollbars: 'custom',
        click: false
      });
      //关闭品牌
      content.find(".list-left-brand").children(".brand-title").children(".delete").on("click",function(){
        content.find(".list-left-brand").addClass("h");
      });
      //选择品牌
      var brandName = $(".brand-name");
      brandName.unbind("click").on("click",function(){
        if($(this).hasClass("on")){
          brandName.removeClass("on")&& brandName.find(".icon").hide();
          $(this).removeClass("on") && $(this).find(".icon").hide();
        }else{
          brandName.removeClass("on")&& brandName.find(".icon").hide();
          $(this).addClass("on") && $(this).find(".icon").show();
        }
      });
      //把外面选中的品牌带进去
      $(".brand-name[value="+$(".left-brand .category_content .on").attr("value")+"]").trigger("click");

      //选择品牌确定
      content.find(".list-left-brand .brand-footer").unbind("click").on("click",function(){
        brandName.each(function(){
          if($(this).hasClass("on")){
            $(".left-brand .category_content span[value="+$(this).attr("value")+"]").trigger("click");
          }
        });
        content.find(".list-left-brand").addClass("h"); //隐藏弹窗
      });
    };

    //重置按钮
    $(".footer_cancel").on("click",function(){
      //左侧弹窗所有的选择
      var _category = $(".category_content").find("span");
      _category.removeClass("on");
      $(".choice").html("");
      //删除外面相同的类
      _category.each(function(){
        $(".option").find("a[value="+$(this).attr("value")+"]").trigger("click");
      });
    });

    //确定按钮
    $(".footer_button").on("click",function(){
      mui.toast('确定',{ duration:1000 });
      //请求ajax
      list.ajax();
    });

    //获取链接参数选项
    if(attr){
      $(".option").removeClass("h");
      $(".tabContent .list li[value="+attr+"]").trigger("click");
    }
    //获取链接参数品牌
    if(b){
      $(".left-brand .category_content span[value="+b+"]").trigger("click");
    }
    if(!attr && !b){
      //请求ajax
      list.ajax();
    }

  };

  list.init = function(){
    list.all();
    list.left();
  };
  list.init();

});


