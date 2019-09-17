//微信jsdk 1.3.2开始
;!function(){
	function loadScript(url) {
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = url;
		document.body.appendChild(script);
	}
loadScript("../../js/lib/jweixin-1.3.2.min.js")
	}()
//微信jsdk 1.3.2结束


var isLoginRefresh = false; //通过检测ajax有1001弹出登录，登录完成后是否刷新页面，可在需要刷新的页面将其改为true
//接口的域名
//泉哥本机地址
//	var	apiDomain = '//192.168.1.10:10085';
//袁琪本机地址
//	var	apiDomain = '//192.168.1.177:8080';
//本地服务器地址
//	var	apiDomain = '//192.168.1.249:9081';
//测试地址
//  var	apiDomain = '//api.51app.cn/test';
//真实地址
var apiDomain = '//api.51app.cn';
var devicePlatform; //设备判断 ios或android

//渠道推广 先从url上面取，没有再去cookie去取，防止在支付后后台返回的链接里面没有带channel
//如果取到的channel和cookie里的不一样也再去判断
var channel = GetQueryString('channel') || getCookie('channel') || 'etime';
var themeColor = getCookie('themeColor');
if(!themeColor || channel!== getCookie('channel')) {
	if(channel == 'i4') {
		themeColor = '#236ee7'
	}else {
		themeColor = '#ff4f4f'
	}
}
setCookie('channel', channel)
setCookie('themeColor', themeColor)
$('.themeColor').css('background-color',themeColor);

function layerHint(text, time) {
	layer.open({
		content: text,
		skin: 'msg',
		time: time || 2 //2秒后自动关闭 
	});

}

//错误提示,截取所有ajax请求,对结果做判断  这个只有jq才有用
//但像验证码的接口，本身会返回300等来判断验证码是否正确，这个时候也弹出这个就不好了；
//那就需要单独处理，根据接口名来做区别对待
function errorTips() {
	! function(t) {
		function r(i) {
			if(n[i]) return n[i].exports;
			var o = n[i] = {
				exports: {},
				id: i,
				loaded: !1
			};
			return t[i].call(o.exports, o, o.exports, r), o.loaded = !0, o.exports
		}
		var n = {};
		return r.m = t, r.c = n, r.p = "", r(0)
	}([function(t, r) {
		! function(t) {
			t.hookAjax = function(t) {
				function r(t) {
					return function() {
						return this.hasOwnProperty(t + "_") ? this[t + "_"] : this.xhr[t]
					}
				}

				function n(r) {
					return function(n) {
						var i = this.xhr,
							o = this;
						return 0 != r.indexOf("on") ? void(this[r + "_"] = n) : void(t[r] ? i[r] = function() {
							t[r](o) || n.apply(i, arguments)
						} : i[r] = n)
					}
				}

				function i(r) {
					return function() {
						var n = [].slice.call(arguments);
						if(!t[r] || !t[r].call(this, n, this.xhr)) return this.xhr[r].apply(this.xhr, n)
					}
				}
				return window._ahrealxhr = window._ahrealxhr || XMLHttpRequest, XMLHttpRequest = function() {
					this.xhr = new window._ahrealxhr;
					for(var t in this.xhr) {
						var o = "";
						try {
							o = typeof this.xhr[t]
						} catch(t) {}
						"function" === o ? this[t] = i(t) : Object.defineProperty(this, t, {
							get: r(t),
							set: n(t)
						})
					}
				}, window._ahrealxhr
			}, t.unHookAjax = function() {
				window._ahrealxhr && (XMLHttpRequest = window._ahrealxhr), window._ahrealxhr = void 0
			}
		}(window)
	}]);

	hookAjax({

		onload: function(xhr) {
			var flag = true;
			var speUrlArr = [];
			var speUrl1 = '/login'; //登录接口会返回其他code，因此排除登录相关的两个接口
			speUrlArr.push(speUrl1)

			var speUrl2 = '/order/remind'; //提醒发货接口会返回其他code，因此排除
			speUrlArr.push(speUrl2)

			var speUrl3 = '/group/trade/detail'; //查询拼团接口会返回其他code，因此排除
			speUrlArr.push(speUrl3)	
			
			var speUrl4 = '/user/agency/info'; //微信个人信息页面查询 会返回3040
			speUrlArr.push(speUrl4)	
			for(var i in speUrlArr) {
				if(new RegExp(speUrlArr[i]).test(xhr.responseURL)) {
					flag = false;
				}
			}

			function tips() {
				if($('.layui-m-layermain').length > 0) {
					setTimeout(function() {
						layerHint('哎呀，服务器有点问题，请刷新重试')
					}, 2000)
				} else {
					layerHint('哎呀，服务器有点问题，请刷新重试')
				}

			}

			if(xhr.status !== 200) {
				tips()
			} else {
				if(flag) {
					if(xhr.response[0] == "{") {
						//3001是抽奖页面用户没有次数后返回的 这里也排除
						if(JSON.parse(xhr.response).code !== 200 && JSON.parse(xhr.response).code !== 1001 && JSON.parse(xhr.response).code !== 3001&& JSON.parse(xhr.response).code !== 1) {
							tips()
						}
						//返回1001，表示token已过期，需要重新登录
						if(JSON.parse(xhr.response).code === 1001) {
							layerHint('您的登录已过期，请重新登录')
							loginLayer('body', function() {
								//登录之后判断isLoginRefresh 为true则刷新页面
								if(isLoginRefresh) {
									history.go(0)
								}
							})

						}
					}
				}

			}

		}

	})

}
errorTips();

//初始化fastclick
FastClick.attach(document.body);

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
/*   js传值ios   为减小改动直接改为纯web跳转
 ==============================*/
var sending = function(id) {
	console.log(id);
	var dataArr = id.split(',')
	//如果传入的里面有http则跳转第二个参数的链接 ;(urlType,url)
	//如果没有则是跳转商品详情，如果有第三位参数且不为0则跳转有合成图的商品详情;(goodsType,goodsId)或者 (goodsType,goodsId,topicItemGoodsId)
	if(id.indexOf('http') > -1) {
		if(dataArr[0].indexOf('http') > -1) {
			location.href = '../' + dataArr[0].split('v1/html/')[1];
		} else {
			location.href = '../' + dataArr[1].split('v1/html/')[1];
		}

	} else {

		if(id.indexOf('searchInput') > -1) {
			//跳转搜索结果页面
			location.href = '../main/searchResult.html?key=' + (dataArr[1] || '');
		} else {
			var goodsType = dataArr[0];
			var goodsId = dataArr[1];
			var topicItemGoodsId = dataArr[2];
			if(topicItemGoodsId && topicItemGoodsId != '0') {
				location.href = '../main/goodsDetail_materialPriority.html?topicItemGoodsId=' + topicItemGoodsId + '&goodsId=' + goodsId;
			} else {
				location.href = '../main/goodsDetail.html?goodsId=' + goodsId + '&diyType=' + goodsType;
			}
		}

	}

};

//获取地址栏参数
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = decodeURI(window.location.search.substr(1)).match(reg);
	if(r !== null) return unescape(r[2]);
	return null;
};
// 转为unicode 编码  
function encodeUnicode(str) {
	var res = [];
	for(var i = 0; i < str.length; i++) {
		res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
	}
	return "\\u" + res.join("\\u");
}

// unicode解码  
function decodeUnicode(str) {
	str = str.replace(/\\/g, "%");
	return unescape(str);
}
//检测设备
(function checkDevice() {
	var u = navigator.userAgent;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	if(isAndroid) {
		devicePlatform = 'android'
		return('android');
	}
	if(isiOS) {
		devicePlatform = 'ios'
		return('ios');
	}
})()

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
		error: function(error, textStatus) {
			console.log('冒的数据 搞毛呀');
			console.log(error);

			if(textStatus == 'timeout') {
				//超时的处理
				layer.open({
					content: '请求数据超时，请刷新页面',
					btn: ['确定'],
					yes: function(index) {
						location.reload()
						layer.close(index);

					}
				})

			}

		}
	});
};

//上传数据 
var uploadData = function(url, async, data, successFun, errorFun) {
	$.ajax({
		url: url,
		type: 'POST',
		timeout: 60000,
		async: async,
		dataType: 'json',
		data: data,
		success: successFun,
		error: function(error) {
			console.log('上传失败');
			console.log(error);
			errorFun(error);
		}

	});

};

//回到顶部
var goTop = function() {
	var $goTop = $('.gotoTop')
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
		if(devicePlatform == "ios") {
			scrollTo(window, 1);
		} else {
			$(window).scrollTop(1);
		}
	});
};

//原生判断是否含有某个类名
var js_hasClass = (function() {
	var div = document.createElement("div");
	if("classList" in div && typeof div.classList.contains === "function") {
		return function(elem, className) {
			return elem.classList.contains(className);
		};
	} else {
		return function(elem, className) {
			var classes = elem.className.split(/\s+/);
			for(var i = 0; i < classes.length; i++) {
				if(classes[i] === className) {
					return true;
				}
			}
			return false;
		};
	}
})();

// RGB 转16进制
var rgbToHex = function(rgb) {
	// rgb(x, y, z)
	var color = rgb.toString().match(/\d+/g); // 把 x,y,z 推送到 color 数组里
	// var hex = "#";
	var hex = ""; //后台不需要 # 号

	for(var i = 0; i < 3; i++) {
		// 'Number.toString(16)' 是JS默认能实现转换成16进制数的方法.
		// 'color[i]' 是数组，要转换成字符串.
		// 如果结果是一位数，就在前面补零。例如： A变成0A
		hex += ("0" + Number(color[i]).toString(16)).slice(-2);
	}
	return hex;
};

// 16进制 转 RGB
var hexToRgb = function(hex) {
	var rgb = [];

	hex = hex.substr(1); //去除前缀 # 号

	if(hex.length === 3) { // 处理 "#abc" 成 "#aabbcc"
		hex = hex.replace(/(.)/g, '$1$1');
	}

	hex.replace(/../g, function(color) {
		rgb.push(parseInt(color, 0x10)); //按16进制将字符串转换为数字
	});

	return "rgb(" + rgb.join(",") + ")";
};

//获取原生元素的绝对x坐标（不是相对与浏览器的，是相对是document的那个）
function getElementLeft(element) {
	var actualLeft = element.offsetLeft;
	var current = element.offsetParent;
	while(current !== null) {
		actualLeft += current.offsetLeft;
		current = current.offsetParent;
	}
	return actualLeft;
}
//获取原生元素的绝对y坐标（不是相对与浏览器的，是相对是document的那个）
function getElementTop(element) {
	var actualTop = element.offsetTop;
	var current = element.offsetParent;
	while(current !== null) {
		actualTop += current.offsetTop;
		current = current.offsetParent;
	}
	return actualTop;
}

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
	setCookie(name, "", -1);
}

//添加图片后缀，改变大小，img是传入图片地址，w是想要的宽度，不传就默认200，最大4000多，最大返回原图大小
//https://help.aliyun.com/document_detail/44688.html?spm=5176.doc44957.6.939.V31dMk
function addImgSuffix(img, w) {
	var w = w || 200;
	return img + '?x-oss-process=image/resize,w_' + w;
}

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

wxShare('腾趣商城',location.href,'https://api.51app.cn/webPage/tq/web/img/logo.png')

//加减计算
function accAdd(arg1, arg2) {
	var r1, r2, m, c;
	try {
		r1 = arg1.toString().split(".")[1].length;
	} catch(e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	} catch(e) {
		r2 = 0;
	}
	c = Math.abs(r1 - r2);
	m = Math.pow(10, Math.max(r1, r2));
	if(c > 0) {
		var cm = Math.pow(10, c);
		if(r1 > r2) {
			arg1 = Number(arg1.toString().replace(".", ""));
			arg2 = Number(arg2.toString().replace(".", "")) * cm;
		} else {
			arg1 = Number(arg1.toString().replace(".", "")) * cm;
			arg2 = Number(arg2.toString().replace(".", ""));
		}
	} else {
		arg1 = Number(arg1.toString().replace(".", ""));
		arg2 = Number(arg2.toString().replace(".", ""));
	}
	return(arg1 + arg2) / m;
}

function accSub(arg1, arg2) {
	var r1, r2, m, n;
	try {
		r1 = arg1.toString().split(".")[1].length;
	} catch(e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	} catch(e) {
		r2 = 0;
	}
	m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
	n = (r1 >= r2) ? r1 : r2;
	return((arg1 * m - arg2 * m) / m).toFixed(n);
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

//判断是否有表情，有则返回true
function isEmojiCharacter(substring) {

	for(var i = 0; i < substring.length; i++) {
		//		console.log(substring[i].charCodeAt())
		//发现有些表情没有检测到；后来添加的;后面的爱心 国旗等表情的编码是65039
		if(substring[i].charCodeAt() >= 55356 && substring[i].charCodeAt() <= 65039) {
			return true;
		}

		var hs = substring.charCodeAt(i);
		if(0xd800 <= hs && hs <= 0xdbff) {
			if(substring.length > 1) {
				var ls = substring.charCodeAt(i + 1);
				var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
				if(0x1d000 <= uc && uc <= 0x1f77f) {
					return true;
				}
			}
		} else if(substring.length > 1) {
			var ls = substring.charCodeAt(i + 1);
			if(ls == 0x20e3) {
				return true;
			}
		} else {
			if(0x2100 <= hs && hs <= 0x27ff) {
				return true;
			} else if(0x2B05 <= hs && hs <= 0x2b07) {
				return true;
			} else if(0x2934 <= hs && hs <= 0x2935) {
				return true;
			} else if(0x3297 <= hs && hs <= 0x3299) {
				return true;
			} else if(hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030 ||
				hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b ||
				hs == 0x2b50) {
				return true;
			}
		}
	}

}

//判断手机号是否有效
function isPhoneAvailable(phone) {
	var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
	if(!myreg.test(phone)) {
		return false;
	} else {
		return true;
	}
}


//公共商品 传入包含商品的那段json，返回拼接好的数据块，用的时候外层再定义一个dataBox来存放返回出来的数据，再append到dom里，这样的话可以控制每一个地方请求成功或失败后的不同措施
//topicItemGoodsId 商品详情中间层预设图片id，没有或传0则是跳转普通的商品详情，除此之外的话则跳转到有合成图的商品详情，
//diyType前面加了 - 的则是直接跳转到定制页面
//layout 商品布局的样式  如果为1则表示一排一个商品的布局，不传或传0则表示一排两个商品的布局
function loadGoods(goodsList, layout) {
	var dataBox = '',
		sendData = '',
		sendData2 = '',
		tips = '',
		diyType = '',
		activity = '',
		goods = [],
		topicItemGoodsId = 0,
		layout = layout || 0,
		coverImageUrl,
		type;

	$.each(goodsList, function(i) {

		//如果是包了一层的goodsList，则取出topicItemGoodsId  商品图片也取外层的
		if(goodsList[i].goods) {
			topicItemGoodsId = goodsList[i].id || 0;
			coverImageUrl = goodsList[i].coverImageUrl;
			goods[i] = goodsList[i].goods;
		} else {
			goods[i] = goodsList[i];
			coverImageUrl = goods[i].coverImageUrl
		}

		//安卓手机去掉所有照片书和台历（商品部分）
		if(devicePlatform == 'android') {
			if((/\照片书/.test(goods[i].name)) || (/\台历/.test(goods[i].name))) {
				return;
			}
		}
		sendData = '\'' + goods[i].diyType + ',' + goods[i].id + ',' + topicItemGoodsId + '\'';
		sendData2 = '\'-' + goods[i].diyType + ',' + goods[i].id + ',' + topicItemGoodsId + '\'';

		//	diyType:1精品,2刻字,3图印,4刻印,5台历,6冲印,7照片书
		//	activityLabel:1零元购,2免费领取,3新品,4满减
		switch(Number(goods[i].diyType)) {

			case 1:
				type = '<img class="hd-type" src="../../img/type/1.png" alt="精品"/>';
				break;
			case 2:
				type = '<img class="hd-type" src="../../img/type/2.png" alt="刻字"/>';
				break;
			case 3:
				type = '<img class="hd-type" src="../../img/type/3.png" alt="图印"/>';
				break;
			case 6:
				type = '<img class="hd-type" src="../../img/type/6.png" alt="冲印"/>';
				break;
			default:
				type = '';
				break;
		}

		tips = goods[i].nameIconImageUrl ? '<img class="hd-tips" src="' + goods[i].nameIconImageUrl + '" />' : '';
		activity = goods[i].activityName ? '<div class="hd-activity">' + goods[i].activityName + '</div>' : '';

		if(layout == 1) {
			dataBox += '<div class="hd-goodsBox" onclick="sending(' + sendData + ')"><div class="hd-img"><img src="' + coverImageUrl + '" alt="' + goods[i].name + '"  /></div><div class="hd-name">' + tips + '<span>' + goods[i].name + '</span></div><div class="hd-info">' + type + activity + '<div class="hd-vieFor">马上抢</div></div><div class="hd-price">￥<i>' + (goods[i].showPrice || 0).toFixed(2) + '</i></div><s class="hd-oldPrice">￥<i>' + (goods[i].originalPrice || 0).toFixed(2) + '</i></s><div class="hd-sale">' + goods[i].soldNum + '人购买</div></div>'
		} else {
			dataBox += '<div class="hd-goodsBox" onclick="sending(' + sendData + ')"><div class="hd-goods"><div class="hd-imgBox"><img src="' + coverImageUrl + '" alt="' + goods[i].name + '" /></div><div class="hd-name">' + tips + '<span>' + goods[i].name + '</span></div><div class="hd-info">' + type + activity + '</div><div class="hd-price">￥<i>' + (goods[i].showPrice || 0).toFixed(2) + '</i></div><div class="hd-sale">' + goods[i].soldNum + '人购买</div></div></div>';
		}

	});

	if(layout == 1) {
		dataBox = '<div class="hd-commonGoodsList2 clearfix">' + dataBox + '</div>';
	} else {
		dataBox = '<div class="hd-commonGoodsList clearfix">' + dataBox + '</div>';
	}

	setTimeout(function() {
		$('.hd-commonGoodsList .hd-goodsBox .hd-imgBox img').css("opacity", "1");
	}, 200);

	return dataBox;

}

//判断是否是iponeX 如果高度是724则是在微信里面，下面没有状态栏，底部栏需要往上顶
function isIphoneX(){
//	var screenWidth = window.screen.width; 
//	var screenHeight = window.screen.height;
	if(devicePlatform=='ios' && $(window).height()=='724'){
		return true;
	}else{
		var channel = GetQueryString('channel') || getCookie('channel') || 'etime';
		if ($(window).height()=='690' && channel == 'i4') {
			return true;
		} else if($(window).height()=='690' && channel == 'i4N'){
			return true;
		}else{
			return false;
		}
	}
}
