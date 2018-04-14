require.config({
	baseUrl : '../../js',
	paths :{
		jquery :'jquery',
		mui :'mui/3.7.1/mui.min',  		//mui.min.js
		common :'common'     					//common.js
	},
	shim :{
		'common':{
			deps : ['jquery'],
			exports : 'common'
		}
	}
});

require(['jquery','mui','common'],function(){

	var article = {};

	//资讯文章点赞按钮和分享  1->点赞  2->QQ空间  3->腾讯空间  4->新浪微博
	article.share = function(){
		var content = $(".article-share");
		content.find(".list").children("a").on("click",function(){
			var that = $(this);
			var index = Number(that.attr("data-index"));
			var url;
			var share = {
				"href": location.href,
				"title": "匠心风范，只为精微绣腕表的东方美学",
				"description": "匠心风范，只为精微绣腕表的东方美学",
				"picture":""
			};
			if(index == 1){
				var text = Number(that.children(".text").text()) ? Number(that.children(".text").text()) : 0;
				if(that.children(".ico").children(".img").hasClass("img2")){
					if(text>1){
						text--;
						that.children(".text").text(text);
					}else{
						that.children(".text").text("赞");
					}
					that.children(".ico").children(".img").removeClass("img2");
					mui.toast("取消点赞",{ duration:1000 });
				}else{
					text++;
					that.children(".text").text(text);
					that.children(".ico").children(".img").addClass("img2");
					mui.toast("点赞成功",{ duration:1000 });
				}
			}else if(index == 2){
				//mui.toast("QQ空间",{ duration:1000 });
				url="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url="+share.href+"&title="+share.title;
				location.href = url;
			}else if(index == 3){
				//mui.toast("腾讯空间",{ duration:1000 });
				url='http://share.v.t.qq.com/index.php?c=share&a=index&appkey=221680'+"&url="+share.href+"&title="+share.description;
				location.href = url;
			}else if(index == 4){
				//mui.toast("新浪微博",{ duration:1000 });
				url='http://v.t.sina.com.cn/share/share.php?appkey=2617921517'+"&title="+share.description+"&pic="+share.picture+"&url="+share.href;
				location.href = url;
			}
		})
	};

	//评论模块
	article.comment = function(){
		//评论点赞
		$(".fabulous").on("click",function(){
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
		$(".delete").on("click",function(){
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
	article.collection = function(){
		var content = $(".comment-input");
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

	article.init = function(){
		article.share();
		article.comment();
		article.collection();
	};
	article.init();

})();
