// 取消安卓该页面的下拉刷新
console.log("AndroidRefreshfalse");

//爱思渠道时将背景遮罩图片改变
if(getCookie('channel') == 'i4'){
	$('.headerBg').css({'background-image':'url(../../img/hotSale-bg-i4.png)','background-size':'cover'});
}
var url,
	successFunc,
	dataBox,
	page,
	id,
	offScroll = false, //初始化是否显示到底了的提示
	titleData = [],
	titleId = [],
	categoryId,
	titleClassName = '.swiper-page .swiper-pagination-bullet-active',
	mainClassName = '.swiper-page .swiper-slide-active',
	endStr = '<div class="lastTips"><i class="left-line"></i>到底啦<i class="right-line"></i></div>',
	pageStr = '<div class="swiper-slide scrollable"><div class="main"></div><div class="infinite-scroll-preloader"></div></div>',
	mainUrl = apiDomain+'/diyapi/goods/list/bycategory',
	titleUrl = apiDomain+'/diyapi/category/hot/list',
	infiniteLoading = false; //false表示现在没有进行加载更多，可以去请求接口进行加载更多的操作；反之不能
	

//请求顶部的标题栏
url = titleUrl;
successFunc = function(data) {
	if(data.code == 200) {
		dataBox = '';
		$.each(data.data, function(i) {
			titleData[i] = data.data[i].name;
			titleId[i] = data.data[i].id;
			dataBox += pageStr;

		});
		$('.swiper-page .swiper-wrapper').empty().append(dataBox);
		//数据加载完成后显示界面
		$('.dom-noLoad').hide();
		$('.dom-hasLoad').show();

	}
};
loadData(url, false, successFunc);
dataBox = '';
var pageSwiper = new Swiper('.swiper-page', {
	// 如果需要分页器
	pagination: '.swiper-pagination',
	paginationClickable: true,
	uniqueNavElements: false,
	paginationBulletRender: function(swiper, index, className) {

		return '<span class="' + className + '" data-load = "false" data-page = "2" data-id = ' + titleId[index] + '><i>' + titleData[index] + '</i></span>';
	},
	onSlideChangeEnd: function(swiper) {
		if($('.swiper-page .swiper-pagination-bullet').eq(swiper.activeIndex).attr('data-load') == "false") {
			loadPage();
		}
		infiniteScroll();
		//判断是否出现了”到底了“
		if($(mainClassName).find('.lastTips').length == 0) {
			infiniteLoading = false;
			offScroll = false;
		} else {
			infiniteLoading = true;
			offScroll = true;
		}
	},
});
//加载第一屏数据
function loadPage() {
	categoryId = $(titleClassName).attr('data-id');
	url = mainUrl + "?categoryId=" + categoryId + "&page=1";
	successFunc = function(data) {
		var goods = data.data;
		if(data.code == 200) {
			dataBox = loadGoods(goods);
			$(mainClassName).find('.main').append(dataBox);
			$(titleClassName).attr('data-load', "true");
			if(goods.length < 10 && !offScroll) {
				$(mainClassName).append(endStr);
				$(mainClassName).find('.infinite-scroll-preloader').remove();
				offScroll = true;
				infiniteLoading = true;
			}

			//限制多个page的局部滚动
			var scrollable = document.getElementsByClassName('scrollable');
			for(var i = 0; i < scrollable.length; i++) {
				new ScrollFix(scrollable[i]);
			}

		}
	};
	loadData(url, true, successFunc);
}
loadPage();
//无限加载

var infinite = function(container, content, distance, loadMore) {
	$(container).on('touchmove', function() {
		if(infiniteLoading) return;
		var that = $(container),
			pageHeight = that.find(content).height(),
			containerHeight = $(container).height();
		if(pageHeight - $(container).scrollTop() < containerHeight + distance) {
			loadMore();
		}
	});
};
//无限滚动
var infiniteScroll = function() {
	infinite('.swiper-page .swiper-slide-active', '.main', 10, function() {
		categoryId = $(titleClassName).attr('data-id');
		page = $(titleClassName).attr('data-page');
		infiniteLoading = true;
		url = mainUrl + "?categoryId=" + categoryId + "&page=" + page;
		successFunc = function(data) {
			if(data.code == 200) {
				//商品推荐数据
				var goods = data.data;
				if(goods.length == 0) {
					if(!offScroll) {
						$(mainClassName).append(endStr);
						$(mainClassName).find('.infinite-scroll-preloader').remove();
						offScroll = true;
					}
				} else {
					dataBox = loadGoods(goods);
					$(mainClassName).find('.main').append(dataBox);

					page++;
					$(titleClassName).attr('data-page', page);
					infiniteLoading = false;
				}
			} else {
				console.log("不是200的我不要");
				if(!offScroll) {
					$(mainClassName).append(endStr);
					$(mainClassName).find('.infinite-scroll-preloader').remove();
					offScroll = true;
				}
			}
		};
		loadData(url, true, successFunc);
	});
};
infiniteScroll();