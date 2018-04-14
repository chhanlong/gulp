require.config({
	baseUrl : '../../js',
	paths :{
		jquery :'jquery',
		swiper :'swiper/3.4.2/swiper.jquery',     //swiper.js
		preload : 'w-preload/0.0.2/w-preload.jquery'  //懒加载js
	},
	shim :{
		'swiper':{
			deps : ['jquery'],
			exports : 'swiper'
		},
		'preload':{
			deps : ['jquery'],
			exports : 'preload'
		}
	}
});

require(['jquery','preload','swiper'],function(){

	var home = {};
	//轮播图
	home.banner = function(){
		new Swiper('.swiper-container-banner',{
			pagination : '.swiper-pagination',
			paginationType : 'fraction',
			direction: 'horizontal',
			spaceBetween : 10,
			loop: true,
			slidesPerView : 1.1,
			centeredSlides : true,
			autoplay : 3000,
			autoplayDisableOnInteraction : false //滑动后可以继续自动播放
		});
	};
	//导航
	home.nav = function(){
		new Swiper('.swiper-container-nav',{
			slidesPerView: 5.2,
			observer: true,
			observeParents: true
		})
	};
	//加载底部
	home.footer = function(){
		$.ajax({
			method:"get",
			url:"../common/footer.html",
			dataType:"html",
			success:function(data){
				$('#footer').prepend(data);
			}
		});
	};
	home.head = function(){
		$.ajax({
			method:"get",
			url:"../common/head.html",
			dataType:"html",
			success:function(data){
				$('#head').prepend(data);
				home.nav();
			}
		});
	};

	home.init = function(){
		home.head();
		home.banner();
		home.footer();
		/*
		 *TODO by lty 20170615
		 *图片预处理调用方法
		 */
		$("img").wPreLoad( "data-wpps" );
	};
	home.init();

})();
