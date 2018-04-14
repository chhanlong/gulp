require.config({
  baseUrl : '../../js',
  paths :{
    jquery :'jquery',
    mui :'mui/3.7.1/mui.min'     //mui.js
  }
});

require(['jquery','mui'],function(){

  var member = {};
  //首页
  member.index = function(){
    var content = $(".member-index");
    content.find(".head").on("click",function(){
      location.href = "https://m.wbiao.cn/member/login/";
    })
  };

  //意见反馈
  member.opinion = function(){
    var content = $(".member-opinion");
    content.find("#give").on("click",function(){
      var proposal = content.find("#proposal");  //意见反馈
      var input = content.find("#input");        //联系方式
      if(proposal.val() == ""){
        mui.toast('意见反馈不能为空',{ duration:1000 });
        return false;
      }else if(input.val() == ""){
        mui.toast('联系方式不能为空',{ duration:1000 });
        return false;
      }
      mui.toast('您的意见已成功提交',{ duration:1000 });
    })
  };

  //设置
  member.rewrite = function(){
    var content = $(".member-rewrite");
    //清理缓存
    content.find(".cache").on("click",function(){
      mui.toast('清理缓存',{ duration:1000 });
    });
    //关于我们
    content.find(".user").on("click",function(){
      mui.toast('关于我们',{ duration:1000 });
    });
    //打分评分
    content.find(".score").on("click",function(){
      mui.toast('打分评分',{ duration:1000 });
    });
    //退出登录
    content.find(".button").on("click",function(){
      mui.confirm(' ', "您确定要退出登录吗？",['取消', '确定'], function(e) {
        if (e.index === 1) {
          location.href = "../member/index.html";
        }else {
          //mui.toast("点击了否",{ duration:1000 });
        }
      });
    });

  };

  //收藏
  member.collection = function(){
    var content = $(".member-collection");
    //tab切换
    content.find(".tab-title").children("li").on("click",function(){
      $(this).addClass("on").siblings().removeClass("on");
      content.find(".tab-content").children(".list").eq($(this).index()).removeClass("h").siblings().addClass("h");
    });
    /**
     * 参数 cancel取消  edit 编辑  select 全选  no-select 取消全选
     *
     * 第一步：点击编辑
     * 先判断有没有数据
     * 返回上一页按钮隐藏，取消按钮出现，
     * 编辑按钮隐藏，全选按钮出现，
     * 可选打钩按钮出现
     * 删除按钮出现
     *
     * 第二步：点击取消
     * 取消按钮隐藏，返回上一页按钮出现
     * 全选按钮隐藏且取消全选按钮隐藏，编辑按钮出现
     * 可选打钩按钮隐藏
     * 可选打钩按钮全部去除选中状态
     * 删除按钮隐藏 && 删除按钮去除类名
     *
     * 第三步：点击全选
     * 可选打钩按钮选中
     * 全选按钮隐藏，取消全选按钮显示
     * 删除按钮增加类名
     *
     * 第四步：点击取消全选
     * 可选打钩按钮全部取消选中
     * 取消全选隐藏，全选按钮显示
     * 删除按钮去除类名
     *
     * 第五步：点击选项
     * 可选打钩按钮切换类名
     * 判断当前有没有选中的按钮，有选中删除按钮加上类名，没有删除按钮去除类名
     *
     * 第五步：删除按钮
     * 遍历判断有没有包含类名，包含类名删除
     */

    var edit = content.find("#edit");     //编辑
    var cancel = content.find("#cancel"); //取消
    var select = content.find("#select"); //全选
    var noSelect = content.find("#no-select");  //取消全选

    /*腕表 -> 发现 -> 文章 -> 全部 */
    editContent(content.find(".surface"),content.find(".surface").children(".list-li"));
    editContent(content.find(".discover"),content.find(".discover").children(".list-li"));
    editContent(content.find(".news"),content.find(".news").children(".list-li"));
    editContent(content.find(".whole"),content.find(".whole").children(".list-li"));

    function editContent(surface,sChildren){
      //点击编辑
      edit.on("click",function(){
        if(sChildren.length == 0){
          mui.toast('暂无数据',{ duration:1000 });
          return false
        }
        content.find(".title-ico").addClass("h") && cancel.removeClass("h");
        edit.addClass("h") && select.removeClass("h");
        sChildren.children(".choice").removeClass("h");
        surface.children(".button").removeClass("h");
      });
      //点击取消
      cancel.on("click",function(){
        cancel.addClass("h") && content.find(".title-ico").removeClass("h");
        select.addClass("h") && noSelect.addClass("h") && edit.removeClass("h");
        sChildren.children(".choice").addClass("h");
        sChildren.children(".choice").removeClass("choice2");
        surface.children(".button").addClass("h") && surface.children(".button").removeClass("button-on");
      });
      //点击全选
      select.on("click",function(){
        sChildren.children(".choice").addClass("choice2");
        select.addClass("h") && noSelect.removeClass("h");
        surface.children(".button").addClass("button-on");
      });
      //点击取消全选
      noSelect.on("click",function(){
        sChildren.children(".choice").removeClass("choice2");
        noSelect.addClass("h") && select.removeClass("h");
        surface.children(".button").removeClass("button-on");
      });
      //点击选项
      sChildren.find(".choice").on("click",function(){
        $(this).toggleClass("choice2");
        if(sChildren.children(".choice2").length >0){
          surface.children(".button").addClass("button-on");
        }else{
          surface.children(".button").removeClass("button-on");
        }
      });
      //删除按钮
      surface.children(".button").on("click",function(){
        sChildren.children(".choice").each(function(){
          if($(this).hasClass("choice2")){
            $(this).parents(".list-li").remove();
            mui.toast('删除成功',{ duration:1000 });
          }
        })
      });
    }

    //发现频道点赞
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



  member.init = function(){
    member.index();
    member.opinion();
    member.rewrite();
    member.collection();
  };
  member.init();

});




