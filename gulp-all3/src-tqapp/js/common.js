var isLoginRefresh = false; //通过检测ajax有1001弹出登录，登录完成后是否刷新页面，可在需要刷新的页面将其改为true
//接口的域名
//泉哥本机地址
//	var	apiDomain = '//192.168.1.10:10085';
//本地服务器地址
//	var	apiDomain = '//192.168.1.249:9081';
//测试地址
//  var	apiDomain = '//api.51app.cn/test';
//真实地址
var apiDomain = '//api.51app.cn';
var devicePlatform; //设备判断 ios或android

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
						if(JSON.parse(xhr.response).code !== 200 && JSON.parse(xhr.response).code !== 1001 && JSON.parse(xhr.response).code !== 3001) {
							tips()
						}
						//返回1001，表示token已过期，需要重新登录
						if(JSON.parse(xhr.response).code === 1001) {
							layerHint('您的登录已过期，请重新登录')
							//							loginLayer('body')
							$('body').addClass('act')
							loginLayer('body', function() {
								$('body').removeClass('act')
								//登录之后潘判断isLoginRefresh 为true则刷新页面
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
/*   js传值ios
 ==============================*/
var connectNZOCJSBridge = function(callback) {
	if(window.NZOCJSBridge) {
		callback(NZOCJSBridge);
	} else {
		document.addEventListener('NZOCJSBridgeReady', function() {
			callback(NZOCJSBridge);
		}, false);
	}
};
var sending = function(id) {
	console.log(id);
	data = {
		"click": id
	};
	connectNZOCJSBridge(function(bridge) {
		bridge.send(data, function(responseData) {});
	});
	try {
		uqWyp.notifyInteraction(id);
	} catch(err) {
		console.log("传值给ios和Android");
	}
};
var sendOC = function(sendObj) {
	console.log(sendObj);
	connectNZOCJSBridge(function(bridge) {
		bridge.send(sendObj, function(responseData) {});
	});
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
		devicePlatform = 'android’'
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
		timeout: 1800,
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

					//分享到朋友圈
					wx.onMenuShareTimeline({
						title: title, // 分享标题
						link: link, // 分享链接，该链接域名必须与当前企业的可信域名一致
						imgUrl: imgUrl, // 分享图标
						success: function() {
							// 用户确认分享后执行的回调函数

						},
						cancel: function() {
							// 用户取消分享后执行的回调函数

						}
					});
					//分享给朋友
					wx.onMenuShareAppMessage({
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
					});
					//分享到QQ
					wx.onMenuShareQQ({
						title: title, // 分享标题
						desc: desc, // 分享描述
						link: link, // 分享链接
						imgUrl: imgUrl, // 分享图标
						success: function() {
							// 用户确认分享后执行的回调函数
						},
						cancel: function() {
							// 用户取消分享后执行的回调函数
						}
					});
					//分享到腾讯微博
					wx.onMenuShareWeibo({
						title: title, // 分享标题
						desc: desc, // 分享描述
						link: link, // 分享链接
						imgUrl: imgUrl, // 分享图标
						success: function() {
							// 用户确认分享后执行的回调函数
						},
						cancel: function() {
							// 用户取消分享后执行的回调函数
						}
					});
					//分享到QQ空间
					wx.onMenuShareQZone({
						title: title, // 分享标题
						desc: desc, // 分享描述
						link: link, // 分享链接
						imgUrl: imgUrl, // 分享图标
						success: function() {
							// 用户确认分享后执行的回调函数
						},
						cancel: function() {
							// 用户取消分享后执行的回调函数
						}
					});
				});

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

//公共商品 传入包含商品的那段json，返回拼接好的数据块，用的时候外层再定义一个dataBox来存放返回出来的数据，再append到dom里，这样的话可以控制每一个地方请求成功或失败后的不同措施
//jumpType 跳转类型，如果是 1 的话则跳转到有合成图的商品详情，没有或传0则是跳转普通的商品详情
//diyType前面加了 - 的则是直接跳转到定制页面
//layout 商品布局的样式  如果为1则表示一排一个商品的布局，不传或传0则表示一排两个商品的布局
function loadGoods(goods, jumpType, layout) {

	var dataBox = '',
		sendData = '',
		sendData2 = '',
		tips = '',
		diyType = '',
		activity = '',
		jumpType = jumpType || 0,
		layout = layout || 0;
	$.each(goods, function(i) {
		//安卓手机去掉所有照片书和台历（商品部分）
		if(devicePlatform == 'android') {
			if((/\照片书/.test(goods[i].name)) || (/\台历/.test(goods[i].name))) {
				return;
			}
		}
		sendData = '\'' + goods[i].diyType + ',' + goods[i].id + ',' + jumpType + '\'';
		sendData2 = '\'-' + goods[i].diyType + ',' + goods[i].id + ',' + jumpType + '\'';

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
			dataBox += '<div class="hd-goodsBox" onclick="sending(' + sendData + ')"><div class="hd-img"><img src="' + goods[i].coverImageUrl + '" alt="' + goods[i].name + '"  /></div><div class="hd-name">' + tips + '<span>' + goods[i].name + '</span></div><div class="hd-info">' + type + activity + '<div class="hd-vieFor">马上抢</div></div><div class="hd-price">￥<i>' + (goods[i].showPrice || 0).toFixed(2) + '</i></div><s class="hd-oldPrice">￥<i>' + (goods[i].originalPrice || 0).toFixed(2) + '</i></s><div class="hd-sale">' + goods[i].soldNum + '人购买</div></div>'
		} else {
			dataBox += '<div class="hd-goodsBox" onclick="sending(' + sendData + ')"><div class="hd-goods"><div class="hd-imgBox"><img src="' + goods[i].coverImageUrl + '" alt="' + goods[i].name + '" /></div><div class="hd-name">' + tips + '<span>' + goods[i].name + '</span></div><div class="hd-info">' + type + activity + '</div><div class="hd-price">￥<i>' + goods[i].showPrice.toFixed(2) + '</i></div><div class="hd-sale">' + goods[i].soldNum + '人购买</div></div></div>';
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