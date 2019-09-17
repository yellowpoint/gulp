var dataBox = '';
var page = 2;
var endStr = '<div class="lastTips"><i class="left-line"></i>我们是有底线的<i class="right-line"></i></div>';
var url = apiDomain + "/article/list?seat=1&page=1"
var successFun = function(data) {

	$('.news-main').empty().append(loadNewsList(data.data.list))
	//数据加载完成后显示界面
	$('body').removeClass('body-loading')
	if(data.data.list.length < 10) {
		if($('.lastTips').length == 0) {
			$('.infinite-scroll-preloader').remove();
			$('.body-main').append(endStr);
		}
		infiniteLoading = true;
	}
}
loadData(url, true, successFun)

function loadNewsList(data) {
	var dataBox = '';
	$.each(data, function(i, v) {
		var time = new Date(v.createTime)
		var m = time.getMonth() + 1
		m = m > 10 ? m : '0' + m
		var d = time.getDate()

		dataBox += `<a class="nm-item" href="${v.url}">
						<div class="nm-item-title">${v.title}</div>
						<img class="nm-item-img" src="${v.imageUrl}" />
						<div class="nm-item-intro">${v.summary}</div>
						<div class="nm-item-label">${v.categoryName}</div>
						<div class="nm-item-watched"><img src="images/creditCardCenter/watched.png" />${v.viewTime}</div>
						<div class="nm-item-time">${m}月${d}日</div>
					</a>`

	});
	return dataBox
}

//无限滚动
let infiniteScroll = function() {

	infinite($(window), $('.body-main'), 10, function() {

		let url = apiDomain + '/article/list?seat=1&page=' + page;

		infiniteLoading = true;

		let successFunc = function(data) {
			if(data.code == 200) {
				var dataList = data.data.list;
				$('.news-main').append(loadNewsList(dataList));
				if(dataList.length < 10) {
					if($('.lastTips').length == 0) {
						$('.infinite-scroll-preloader').remove();
						$('.body-main').append(endStr);
					}
					return false;
				}
				page++;
				infiniteLoading = false;

			} else {
				console.log("不是200的我不要");
				if($('.lastTips').length == 0) {
					$('.infinite-scroll-preloader').remove();
					$('.body-main').append(endStr);
				}
			}
		};
		loadData(url, true, successFunc)
	});
};
infiniteScroll()
goTop()