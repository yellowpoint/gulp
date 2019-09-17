function layerHint(text, time) {
	layer.open({
		content: text,
		skin: 'msg',
		time: time || 2 //2秒后自动关闭 
	});
}

//错误提示,截取所有ajax请求,对结果做判断
//但像验证码的接口，本身会返回300等来判断验证码是否正确，这个时候也弹出这个就不好了；
//那就需要单独处理，不知道这个能不能根据接口名来做区别对待
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
						if(JSON.parse(xhr.response).code !== 200 && JSON.parse(xhr.response).code !== 1001) {
							tips()
						}
						//返回1001，表示token已过期，需要重新登录
						if(JSON.parse(xhr.response).code === 1001) {
							layerHint('您的登录已过期，请重新登录')
							loginLayer('body')

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
//添加点击态
try {
	document.addEventListener("touchstart", function() {}, true)
} catch(err) {}
//动态改变html的fontsize
(function changeFontSize() {
	var screenWidth = $(document).width();
	var htmlFontSize = screenWidth / 7.5;
	$("html").css("font-size", htmlFontSize);
	$(window).resize(function() {
		screenWidth = $(document).width();
		htmlFontSize = screenWidth / 7.5;
		$("html").css("font-size", htmlFontSize);
	});
})();

//获取地址栏参数
var GetQueryString = function(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r !== null) return unescape(r[2]);
	return null;
};
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

//加载数据
var loadData = function(url, async, successFunc) {
	$.ajax({
		url: url,
		type: 'GET',
		timeout: 30000,
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

//上传数据 现在只用到了上传图片
var uploadData = function(url, async, data, successFun, errorFun) {

	if(uploadImgXhr && uploadImgXhr.readyState != 4) {
		uploadImgXhr.abort();
	}
	uploadImgXhr = $.ajax({
		url: url,
		type: 'POST',
		timeout: 30000,
		async: async,
		dataType: 'json',
		crossDomain: true, // 如果用到跨域，需要后台开启CORS   zepto貌似没有这个属性
		processData: false, // 注意：不要 process data
		contentType: false, // 注意：不设置 contentType
		data: data,
		success: successFun,
		error: function(error) {
			console.log('上传失败');
			console.log(error);
			errorFun(error);
		},

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

//判断手机横竖屏状态：
function hengshuping() {
	if(window.orientation == 180 || window.orientation == 0) {
		//		alert("竖屏状态！")
	}
	if(window.orientation == 90 || window.orientation == -90) {
		alert('竖屏浏览效果更佳哟！');
	}
}
hengshuping();
window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", hengshuping, false);



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
	document.cookie = name + "=" + value + expires + "; path=/";
}
// 获取cookie
function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while(c.charAt(0) == ' ') c = c.substring(1, c.length);
		if(c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
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