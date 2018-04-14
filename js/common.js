/*显示延迟
function show_lazy(obj){
	if((obj.offset().top-0.9*$(window).height())<$(document).scrollTop()||obj.offset().top<$(window).height()){
		obj.removeClass('lz');
	}
}
 */
/*增加延迟
function add_lazy(ct){
	$(ct+' img.lz').each(function(){
		if($(this).attr('data')){
			$(this).attr('src',$(this).attr('data'));
			$(this).removeAttr('data');
			show_lazy($(this));
		}
	});
	$(window).scroll(function(){
		$(ct+' img.lz').each(function(){
			show_lazy($(this));
		});
	});
}
 */

/**
 * 分享插件，只需要在页面写入相同的HTML
 * 并在js里面的需要点击打开的事件写入$(".share-to").removeClass("h");
 * js 写在了common.js
 * css 写在了common.css
 */
function add_share(){
	var url;
	var share = {
		"href": location.href,
		"title": "匠心风范，只为精微绣腕表的东方美学",
		"description": "匠心风范，只为精微绣腕表的东方美学",
		"picture":""
	};
	$('.share-to .share-content .icon li').click(function(){
		if($(this).index() == 0){
			url='http://v.t.sina.com.cn/share/share.php?appkey=2617921517'+"&title="+share.description+"&pic="+share.picture+"&url="+share.href;
			location.href=url;
		}else if($(this).index() == 1){
			url='http://share.v.t.qq.com/index.php?c=share&a=index&appkey=221680'+"&url="+share.href+"&title="+share.description;
			location.href=url;
		}else if($(this).index() == 2){
			url="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url="+share.href+"&title="+share.title;
			location.href=url;
		}
	});
	$('.share-to .share-content .share_button,.share-to .share-bj').click(function(){
		$(this).parents(".share-to").addClass("h");
	});
}


/*回到顶部*/
function add_scroll(){
	$(window).scroll(function(){
		//var hh = 0;
		//var t = parseInt($(document).scrollTop());
		if($(document).scrollTop()>0){
			$('.to_top').removeClass('h');
		}else{
			$('.to_top').addClass('h');
		}
	});
	$('.to_top').click(function(){
		$("html,body").animate({scrollTop:0},800)
	});
}


function init(){
	add_share();
	add_scroll();
	//add_lazy('body');
}
$(document).ready(function(){
	init();
});