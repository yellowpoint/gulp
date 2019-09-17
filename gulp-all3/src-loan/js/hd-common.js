//添加点击态
try {
	document.addEventListener("touchstart", function() {}, true)
} catch(err) {}

//接口的域名
//泉哥本机地址
//	 var apiDomain = '//192.168.1.10:10085/loanapi';
//小马哥本机地址
//var apiDomain = '//192.168.1.194:8080/loanapi';
//线上测试地址
//var apiDomain = '//47.97.23.154:10078/loanapi'
//真实地址
var apiDomain = '//api.51app.cn/loanapi';

//注意 贷款的channel再cookie里面用的是channel_loan
//channel为全局变量，其他地方要判断渠道的时候 直接取就好，不要再去url或是cookie里面判断
var channel = ''


/*   js传值ios
 ==============================*/

//获取地址栏参数
var GetQueryString = function(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r !== null) return unescape(r[2]);
	return null;
};
if(GetQueryString('channel') == '') {
	channel = ''
	deleteCookie('channel_loan')

} else {
	//与腾趣cookie中的channel同名故贷款的改为channel_loan
	channel = GetQueryString('channel') || getCookie('channel_loan') || '';
	if(channel && channel != 'null') {
		//不要存时间，让它关闭浏览器就消失，这个的作用也就是页面跳转的时候方便传值
		setCookie('channel_loan', channel)
	} else {
		deleteCookie('channel_loan')
		channel = ''
	}
}


//动态改变html的fontsize
(function changeFontSize() {
	var screenWidth = $(window).width();
	var htmlFontSize = screenWidth / 7.5;
	$("html").css("font-size", htmlFontSize);
	$(window).resize(function() {
		screenWidth = $(window).width();
		htmlFontSize = screenWidth / 7.5;
		$("html").css("font-size", htmlFontSize);
	});
})();

//检测设备
function checkDevice() {
	var u = navigator.userAgent;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	if(isAndroid) {
		return('android');
	}
	if(isiOS) {
		return('ios');
	}
}
var devicePlatform = checkDevice();
//加载数据
var loadData = function(url, async, successFunc) {
	$.ajax({
		url: url,
		type: 'GET',
		timeout: 60000,
		async: async,
		dataType: 'json',
		data: {},
		success: successFunc,
		error: function(error) {
			console.log('冒的数据 搞毛呀');
			console.log(error);

		}
	});
};

var ajaxPost = function(url, data, successFunc, errorFunc, async) {
	$.ajax({
		url: url,
		type: 'POST',
		timeout: 60000,
		async: async || true,
		dataType: 'json',
		data: data,
		success: successFunc,
		error: function(error) {
			console.log('冒的数据 搞毛呀');
			console.log(error);
			if(errorFunc) {
				errorFunc()
			}

		}
	});
};

//无限加载
var infiniteLoading = false;
var infinite = function(container, content, distance, loadMore) {
	container.on('scroll', function() {
		if(infiniteLoading) return;
		var pageHeight = content.height(),
			containerHeight = container.height();
		if(pageHeight - container.scrollTop() < containerHeight + Number(distance)) {
			loadMore();
		}
	});
};

//回到顶部
var goTop = function(scrollArea) {
	var $goTop = $('#goTop');
	//	var $scrollArea = scrollArea ? $(scrollArea):$(window);
	$(window).on("scroll", function() {
		var top = $(window).scrollTop();
		if(top > 300) $goTop.show();
		if(top <= 300) $goTop.hide();
	});

	function scrollTo(who, target) {
		var nowTop = $(who).scrollTop(),
			timer = null,
			speed;
		speed = Math.round(nowTop / 20);
		timer = window.setInterval(function() {
			nowTop = nowTop - speed;
			if(nowTop <= target) {
				$(who).scrollTop(target);
				$goTop.hide();
				window.clearInterval(timer);
				return false;
			}
			$(who).scrollTop(nowTop);
		}, 20);
	}
	$goTop.on("click", function() {
		scrollTo(window, 1);
	});

};

/*原生交互 开始*/
//传网页的链接
function showWeb(data) {
	try {
		window.webkit.messageHandlers.showWeb.postMessage({
			"url": data,
			"className": "CRInfoWebViewController"
		});
	} catch(err) {
		console.log(data);
	}
}

//传json
function showJson(data) {
	try {
		window.webkit.messageHandlers.showJson.postMessage(data);
	} catch(err) {
		console.log(data);
	}
}

//点击立即申请 传弹窗上信息 不改的话就传空
function showPop(data) {
	try {
		window.webkit.messageHandlers.showPop.postMessage(data);
	} catch(err) {
		console.log(data);
	}
}

//传数据接口地址
function showList(data) {
	try {
		window.webkit.messageHandlers.showList.postMessage(data);
	} catch(err) {
		console.log(data);
	}
}

//backPress 返回按钮 ;customServicePress 客服
function buttonPress(data) {
	try {
		window.webkit.messageHandlers.buttonPress.postMessage(data);
	} catch(err) {
		console.log(data);
	}

}
/*原生交互 结束*/
//判断是否为手机号
function isPhoneAvailable(phone) {
	return /^1\d{10}$/.test(phone)
}

var ScrollFix = function(elem) {
	var startY, startTopScroll;
	elem = elem || document.querySelector(elem);
	if(!elem) {
		return;
	}
	elem.addEventListener('touchstart', function(event) {
		startY = event.touches[0].pageY;
		startTopScroll = elem.scrollTop;

		if(startTopScroll <= 0)
			elem.scrollTop = 1;

		if(startTopScroll + elem.offsetHeight >= elem.scrollHeight)
			elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
	}, false);
};

/**
 * 设置cookie
 * @param {string} name  键名
 * @param {string} value 键值
 * @param {integer} days cookie周期
 */
function setCookie(name, value, days) {
	if(days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	} else {
		var expires = "";
	}
	document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}
// 获取cookie
function getCookie(name) {
	var nameEQ = encodeURIComponent(name) + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while(c.charAt(0) == ' ') c = c.substring(1, c.length);
		if(c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
	}
	return null;
}
// 删除cookie
function deleteCookie(name) {
	setCookie(encodeURIComponent(name), "", -1);
}

//贷款列表
function loanListFuc(loanList) {
	var dataBox = '';
	$.each(loanList, function(i, v) {
		var tips = (!v.labelImageUrl) ? '' : '<img class="tips" src=' + v.labelImageUrl + ' alt="推荐"/>'
		var remark = (!v.remark) ? '' : v.remark;
		var slogan = (!v.slogan) ? '' : '<div class="slogan">' + v.slogan + '</div>';
		var info = (!v.interestRate) ? '<div class="remark type2"><span>' + remark + '</span></div>' : '<div class="info">' + v.periodUnit + '利率<i>' + v.interestRate + '%</i></div>' + '<div class="remark"><span>' + remark + '</span></div>';

		dataBox += '<div class="productItem loanItem" data-id="' + v.id + '" data-url="' + v.url + '"><img class="logo" src="' + v.iconImageUrl + '" alt="logo" /><div class="name">' + v.name + '</div><div class="limit"><i>' + v.minAmount + '-' + v.maxAmount + '</i><span>额度范围</span></div><div class="line"></div>' + info + slogan + tips + '</div>'

	});
	return dataBox;
}
//信用卡列表
function creditCardListFuc(loanList) {
	var dataBox = '';
	$.each(loanList, function(i, v) {
		var tips = (!v.labelImageUrl) ? '' : '<img class="tips" src=' + v.labelImageUrl + ' alt="推荐"/>'
		var slogan = (!v.slogan) ? '' : '<div class="slogan">' + v.slogan + '</div>';
		var intro = v.intro ? v.intro.split('\n').join('<br>') : ''; //介绍添加换行

		dataBox += '<div class="creditCard loanItem" data-id="' + v.id + '" data-url="' + v.webUrl + '"><div class="main"><div class="name">' + v.name + '</div><img class="showImg" src="' + v.imageUrl + '" alt="' + v.name + '" /><div class="limit"><i>' + v.maxAmount + '</i>万最高额度</div><div class="intro">' + intro + ' </div></div>' + slogan + tips + ' </div>'

	});
	return dataBox;
}

//信用卡中心公共产品列表
function commonProductListFuc(data, nametype) {
	//nameType 产品名字展示的类型，不传的话就是 “银行名-信用卡名”，传入为1的话则只有信用卡名
	var dataBox = '';
	var nameType = nametype || 0;

	$.each(data, function(i, v) {
		var tips = (!v.labelImageUrl) ? '' : '<img class="cpl-item-tips" src=' + v.labelImageUrl + ' alt="推荐"/>';
		var slogan = (!v.slogan) ? '' : '<div class="cpl-item-slogan">' + v.slogan + '</div>';
		var intro = ''
		var name = nameType == 1 ? v.name : (v.bankName + ' - ' + v.name)
		var laber = ''
		$.each(v.label.split(','), function(j, k) {
			if(k) {
				laber += '<span>' + k + '</span>';
			}
		})
		$.each(v.intro.split('\n'), function(j, k) {
			if(k) {
				intro += '<div>' + k + '</div>'
			}
		})

		dataBox += '<a class="cpl-item clearfix" href="' + v.webUrl + '"><div class="cpl-item-name">' + name + '<img src="images/creditCardCenter/level/' + v.level + '.png" /></div>' + slogan + '<div class="cpl-item-img"><img src="' + v.imageUrl + '" /></div><div class="cpl-item-intro">' + intro + '</div><div class="cpl-item-label">' + laber + '</div>' + tips + '</a>'

	});
	return dataBox;
}
//添加点击统计，将贷款id传给后台
//2017年12月14日 16:15:43 取消了调用接口来统计，后台给的链接格式为https://api.51app.cn/loanapi/loan/url?url=**；已经包含统计功能
//为减小改动，防止后期又有变化，其他暂时都不动
$('body').on('click', '.loanItem', function() {
	var id = $(this).attr('data-id');
	var url = $(this).attr('data-url');

	window.location.href = url;

	//	$.ajax({
	//		url: '//api.51app.cn/loanapi/loan/jump?loanId=' + id,
	//		type: 'GET',
	//		timeout: 60000,
	//		async: true,
	//		dataType: 'json',
	//		data: {},
	//		success: function(data) {
	//
	//		},
	//		error: function(error) {
	//			console.log('冒的数据 搞毛呀');
	//			console.log(error);
	//
	//		}
	//	});
	//	setTimeout(function() {
	//		window.location.href = url;
	//	}, 200)

})

//微信jsdk,分享 ;参数分别为标题，链接，图标，说明(不传则和标题一样)
function wxShare(title, link, imgUrl, desc) {

	var desc = desc || title;
	var url = '//api.51app.cn/diyapi/account/jssdk/signature?url=' + encodeURIComponent(location.href.split('#')[0]),
		successFunc = function(data) {
			try {
				if(data.code == 200) {
					data = data.data;
					wx.config({
						debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
						timestamp: data.timestamp, // 必填，生成签名的时间戳
						nonceStr: data.nonceStr, // 必填，生成签名的随机串
						signature: data.signature, // 必填，签名，见附录1
						jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
					});
					wx.ready(function() {
						var shareConfig = {
							title: title, // 分享标题
							desc: desc, // 分享描述
							link: link, // 分享链接
							imgUrl: imgUrl, // 分享图标
							type: '', // 分享类型,music、video或link，不填默认为link
							dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
							success: function() {
								// 用户确认分享后执行的回调函数
							},
							cancel: function() {
								// 用户取消分享后执行的回调函数
							}
						}
						//分享到朋友圈
						wx.onMenuShareTimeline(shareConfig);
						//分享给朋友
						wx.onMenuShareAppMessage(shareConfig);
						//分享到QQ
						wx.onMenuShareQQ(shareConfig);
						//分享到腾讯微博
						wx.onMenuShareWeibo(shareConfig);
						//分享到QQ空间
						wx.onMenuShareQZone(shareConfig);
					});

				}

			} catch(e) {
				console.log('微信jssdk参数的接口又gg啦')
			}

		};

	$.ajax({
		url: url,
		type: 'GET',
		timeout: 30000,
		async: true,
		dataType: 'json',
		data: {},
		success: successFunc,
		error: function(error) {
			console.log('冒的数据 搞毛呀');
			console.log(error);
		}
	});

}

//2s消失的文字提示框
function layerHint(text, time) {
	layer.open({
		content: text,
		skin: 'msg',
		time: time || 2
	});
}



function handleChannel() {

	var channelUrl = ''
	if(location.search.indexOf('channel') > -1) {
		return false;
	}
	channelUrl = location.href + (location.search.indexOf('?') > -1 ? '&' : '?') + 'channel=' + channel

	history.replaceState('channel', '', channelUrl)
}
handleChannel()

;
(function() {
	//ajax是否是我们的，不是的话则不添加channel参数
	var ajaxIsOwn = true;
	try {
		hookAjax({
			//拦截回调
			onreadystatechange: function(xhr) {
				//      console.log("onreadystatechange called: %O",xhr)
			},
			onload: function(xhr) {
				//      console.log("onload called: %O",xhr)
			},
			//拦截函数 
			//只拦截我们自己的接口 都是有 51app的；免得对其他接口有影响，如fundebug的
			//那那些测试时的接口都只是ip没有51app就也被排除了，那就用apiDomain这个变量吧
			open: function(arg) {

				ajaxIsOwn = true;
				if(String(arg).indexOf(apiDomain) == -1) {
					ajaxIsOwn = false;
					return
				}

				//添加GET请求的参数，防止对post请求的干扰故做判断
				if(arg[0] == 'GET') {
					arg[1] += (arg[1].indexOf('?') > -1 ? '&' : '?') + 'channel=' + channel
				}

			},
			send: function(arg) {
				//这个arg与open里面的arg不一样，这个只有参数
				if(!ajaxIsOwn) {
					return
				}
				//添加post请求的参数
				//post请求没有参数的话 arg[0]为null，此时就只有channel参数
				//get请求时，也会执行这里，还好发现对get请求无影响
				if(arg[0]) {
					arg[0] += '&channel=' + channel
				} else {
					arg[0] = 'channel=' + channel
				}
			}
		})
	} catch(e) {
		console.log('没加载commonPlgin js')
	}
})();

//模板弹窗 关闭按钮
$('body').on('click', '.popup-template .pTemplate-main .pTemplate-close ', function() {
	$(this).closest('.popup-template').fadeOut()
})


//$(window).on('unload', function () {
////资源销毁代码
//alert("页面你关闭1")
//console.log("页面你关闭1")
//});
//
//$(document).on('visibilitychange', function () {
//if (document.visibilityState == 'hidden') {
//  //资源销毁代码
//  alert("页面你关闭2")
//console.log("页面你关闭2")
//}
//});

//window.onbeforeunload = function(event){    
//  return '您可能有数据没有保存'; 
//};