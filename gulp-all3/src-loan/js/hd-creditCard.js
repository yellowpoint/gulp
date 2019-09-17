//此信用卡页面直接借用热卖页面，这个页面未用到分页page，为了防止后面加分页，这里先不改动。只是将加载首屏数据时候，数据个数小于10这个条件去掉
var url,
	successFunc,
	dataBox,
	page,
	id,
	offScroll = false, //初始化是否显示到底了的提示
	titleData = [],
	titleId = [],
	typeId,
	titleClassName = '.swiper-page .swiper-pagination-bullet-active',
	mainClassName = '.swiper-page .swiper-slide-active',
	endStr = '<div class="lastTips"><i class="left-line"></i>我们是有底线的<i class="right-line"></i></div>',
	pageStr = '<div class="swiper-slide scrollable"><div class="pageMain"></div><div class="infinite-scroll-preloader"></div></div>',
	titleUrl = apiDomain + '/creditcard/type/list',
	mainUrl = apiDomain + '/creditcard/type/creditcard/list',
	infiniteLoading = false; //false表示现在没有进行加载更多，可以去请求接口进行加载更多的操作；反之不能

//请求顶部的标题栏
url = titleUrl;
successFunc = function(data) {
	if(data.code == 200) {
		dataBox = '';
		var typeList = data.data.typeList;
		$.each(typeList, function(i) {
			titleData[i] = typeList[i].name;
			titleId[i] = typeList[i].id;
			dataBox += pageStr;

		});
		$('.swiper-page .swiper-wrapper').empty().append(dataBox);
		//数据加载完成后显示界面
		$('.hd-noLoad').hide();
		$('.hd-hasLoad').show();

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
	typeId = $(titleClassName).attr('data-id');
	url = mainUrl + "?typeId=" + typeId + "&page=1";
	successFunc = function(data) {
		var goods = data.data.list;
		if(data.code == 200) {
			dataBox = creditCardListFuc(goods);
			$(mainClassName).find('.pageMain').append(dataBox);
			$(titleClassName).attr('data-load', "true");
			//			if(goods.length<10!offScroll) {
			if(!offScroll) {
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
infinite = function(container, content, distance, loadMore) {
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
	infinite('.swiper-page .swiper-slide-active', '.pageMain', 10, function() {
		typeId = $(titleClassName).attr('data-id');
		page = $(titleClassName).attr('data-page');
		infiniteLoading = true;
		url = mainUrl + "?typeId=" + typeId + "&page=" + page;
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
					dataBox = creditCardListFuc(goods);
					$(mainClassName).find('.pageMain').append(dataBox);

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
//infiniteScroll();

//领取pos机
function getPos() {
	$('.pos').show()
	setCookie('posFlag2', 1, 60)
	var userInfo = {};
	var $phone = $('.pos main input')
	$('body').on('click', '.pos main .close', function() {
		location.href = 'http://t.cn/RT60JPP';
		//		$('.pos').hide()
	})
	$('body').on('click', '.pos main .get', function() {

		//手机号合法则发送 成功后提示
		if(isPhoneAvailable($phone.val())) {

			userInfo.name = '信用卡弹窗';
			userInfo.mobile = $phone.val();
			$.ajax({
				url: apiDomain + '/user/profile',
				type: 'POST',
				timeout: 60000,
				async: true,
				dataType: 'json',
				data: {
					'data': JSON.stringify(userInfo)
				},
				success: function(data) {
					layer.open({
						content: '领取成功<br><br>我们将会24小时内给您电话核实身份，请注意接听',
						btn: ['关闭'],
						shadeClose: false,
						yes: function(index) {
							layer.close(index);
							//							$('.pos').hide()
							location.href = 'http://t.cn/RT60JPP';
						}
					});
				},
				error: function(error) {
					console.log('冒的数据 搞毛呀');
					console.log(error);

				}
			});

		} else {
			layerHint('请输入正确的手机号')
			$phone.focus()
		}

	})

}

////去掉之前用过的posFlag，重新开始，只显示一次
//deleteCookie('posFlag')
////显示过一次后就不显示了
//if(!getCookie('posFlag2')) {
//	getPos()
//} else {
//
//	//直接跳转到第三方的信用卡页面  还加了关闭弹窗和领取成功后的跳转，也取消了隐藏弹窗， 弹窗透明度改为了.8 原来是.4；
//	//为了防止跳转时闪出来之前的页面  ；
//	$('.hd-noLoad').show();
//	$('.hd-hasLoad').hide();
//	location.href = 'http://t.cn/RT60JPP';
//}

//直接跳转到第三方的信用卡页面  还加了关闭弹窗和领取成功后的跳转，也取消了隐藏弹窗， 弹窗透明度改为了.8 原来是.4；
//为了防止跳转时闪出来之前的页面  ；
//$('.hd-noLoad').show();
//$('.hd-hasLoad').hide();
//location.href = 'http://t.cn/RT60JPP';