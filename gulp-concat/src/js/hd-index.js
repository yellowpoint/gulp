//首页顶部轮播图
function topSwiper() {
	var topBanner = new Swiper('.swiper-topBanner', {
		loop: true,
		autoplay: 4000,
		speed: 500,
		autoplayDisableOnInteraction: false,
		pagination: '.swiper-pagination',
		spaceBetween: 20,
	});
}
//首页广播轮播
function broadcastSwiper() {
	var broadcast = new Swiper('.swiper-broadcast', {
		loop: true,
		direction: 'vertical',
		autoplay: 3000,
		speed: 1000,
		onlyExternal: true,
	});
}

var dataBox = '',
	url, successFunc;
url = '//api.51app.cn/loanapi/home';
//url = 'homeData.json';
successFunc = function(data) {
	var bannerList = data.data.bannerList ,
		loanList = data.data.loanList ,
		adList = data.data.adList ;

	dataBox = '';

	//热门的五个贷款
	$.each(adList, function(i, v) {
		var v = v.loan;
		if(i == 4) {
			return
		}
		var slogan = v.slogan == null ? '' : v.slogan
		var tips = (v.labelImageUrl == null || v.labelImageUrl == '') ? '' : '<img class="tips" src='+ v.labelImageUrl +' alt="推荐"/>'

		dataBox += '<div class="item" onclick="window.location.href=\'' + v.url + '\'"><img src="' + v.iconImageUrl + '" alt="logo"><div class="name">' + v.name + '</div><div class="specialty">' + slogan + '</div>' + tips + '</div>';

	})
	$('.index .hotProduct .firstRow').empty().append(dataBox);
	$('.index .hotProduct .secondRow').attr('onclick', "window.location.href='"+bannerList[0].loan.url+"'")
	$('.index .hotProduct .secondRow img').attr('src', bannerList[0].imageUrl)

	//推荐产品
	dataBox = loanListFuc(loanList);

	$('.productList').empty().append(dataBox);

	//数据加载完成后显示界面
	$('.hd-noLoad').hide();
	$('.hd-hasLoad').show();
}
loadData(url, true, successFunc);

function infiniteLoadingFunc() {
	var page = 1,
		dataBox = '',
		url, successFunc;
	//无限加载
	$(window).on('scroll', function() {
		if($('body').scrollTop() + window.innerHeight >= $('body').find('.containerBox').height()) {
			if(!infiniteLoading) {
				infiniteLoading = true;
				url = 'homeData.json';
				successFunc = function(data) {
					var loanList = data.data.loanList;

					if(loanList.length < 10) {
						infiniteLoading = true;
						$('.infinite-scroll-preloader').remove()
						if($('.containerBox').find('.lastTips').length == 0) {
							$('.containerBox').append("<div class='lastTips'><i class='left-line'></i>到底啦<i class='right-line'></i></div>");
						}
					} else {
						dataBox = loanListFuc(loanList);
						$('.productList').append(dataBox);
						page++;
						infiniteLoading = false;
					}

				}
				loadData(url, true, successFunc);
			}

		}
	})
}
//infiniteLoadingFunc()

function loanListFuc(loanList) {
	var dataBox = '';
	$.each(loanList, function(i, v) {
		var tips = (v.labelImageUrl == null || v.labelImageUrl == '')  ? '' : '<img class="tips" src='+ v.labelImageUrl +' alt="推荐"/>'

		dataBox += '<div class="productItem" onclick="window.location.href=\'' + v.url + '\'"><img class="logo" src="' + v.iconImageUrl + '" alt="logo"><div class="name">' + v.name + '</div><div class="limit">' + v.minAmount + '-' + v.maxAmount + '</div><div class="info">成功率<i>' + v.successRate + '%</i><b></b>' + v.periodUnit + '利率<i>' + v.interestRate + '%</i></div><img class="apply" src="images/index-apply.png" alt="急速申请">' + tips + '</div>'

	});
	return dataBox;
}

goTop()
