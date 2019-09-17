//自动消失的弹窗
function layerHint(text, time) {
	layer.open({
		content: text,
		skin: 'msg',
		time: time || 2 //2秒后自动关闭 
	});
}

//错误提示,截取所有ajax请求,对结果做判断
function errorTips(){
	!function(t){function r(i){if(n[i])return n[i].exports;var o=n[i]={exports:{},id:i,loaded:!1};return t[i].call(o.exports,o,o.exports,r),o.loaded=!0,o.exports}var n={};return r.m=t,r.c=n,r.p="",r(0)}([function(t,r){!function(t){t.hookAjax=function(t){function r(t){return function(){return this.hasOwnProperty(t+"_")?this[t+"_"]:this.xhr[t]}}function n(r){return function(n){var i=this.xhr,o=this;return 0!=r.indexOf("on")?void(this[r+"_"]=n):void(t[r]?i[r]=function(){t[r](o)||n.apply(i,arguments)}:i[r]=n)}}function i(r){return function(){var n=[].slice.call(arguments);if(!t[r]||!t[r].call(this,n,this.xhr))return this.xhr[r].apply(this.xhr,n)}}return window._ahrealxhr=window._ahrealxhr||XMLHttpRequest,XMLHttpRequest=function(){this.xhr=new window._ahrealxhr;for(var t in this.xhr){var o="";try{o=typeof this.xhr[t]}catch(t){}"function"===o?this[t]=i(t):Object.defineProperty(this,t,{get:r(t),set:n(t)})}},window._ahrealxhr},t.unHookAjax=function(){window._ahrealxhr&&(XMLHttpRequest=window._ahrealxhr),window._ahrealxhr=void 0}}(window)}]);


hookAjax({

	onload: function(xhr) {
			var flag = true;
			var speUrlArr = [];
			var speUrl1 = '/login';  //登录接口会返回其他code，因此排除登录相关的两个接口
			speUrlArr.push(speUrl1)
			
			var speUrl2 = '/order/remind';  //提醒发货接口会返回其他code，因此排除
			speUrlArr.push(speUrl2)
			
			var speUrl3 = 'trade/order/detail'
			speUrlArr.push(speUrl3)
			
			var speUrl4 = 'trade/preorder/confirm'
			speUrlArr.push(speUrl4)
			
			var speUrl5 = 'user/agency/info'
			speUrlArr.push(speUrl5)
			
			var speUrl6 = 'trade/preorder/modify'
			speUrlArr.push(speUrl6)
			for(var i in speUrlArr ){
				if(new RegExp(speUrlArr[i]).test(xhr.responseURL)){
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
			if (flag) {
				if (xhr.response[0] == "{") {
					if(JSON.parse(xhr.response).code !== 200) {
						tips()
					}
				}
			}
			
			
		}

	}
})

}
errorTips();



//初始化fastclick
//FastClick.attach(document.body);

//动态改变html的fontsize
function changeFontSize() {
	var Width = document.documentElement.clientWidth || document.body.clientWidth;
	if (Width >= 750) {
		document.documentElement.style.fontSize = 750 / 7.5 + "px";
	} else {
		document.documentElement.style.fontSize = Width / 7.5 + "px";
	};
};
changeFontSize();


//获取地址栏参数
var GetQueryString = function(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r !== null) return unescape(r[2]);
	return null;
};

//渠道号
var channel = GetQueryString('channel') || getCookie('channel') || 'etime';
setCookie('channel',channel)
//token
var token = getCookie('token');
//var token = 'a8546b4bb0eb4329a5c313207a83f8b3';
//setCookie('token',token,10)

//订单id
var tradeOrderId = GetQueryString('tradeOrderId');
//回到顶部
var goTop = function() {
	$('.page-content').on("scroll", function() {
		var top = $('.page-content').scrollTop();
		if (top > 300) {
			$(".gotoTop").show()
		};
		if (top <= 300) {
			$(".gotoTop").hide()
		};
	});

	function scrollTo(who, target) {
		var nowTop = $(who).scrollTop(),
			timer = null,
			speed;
		speed = Math.round(nowTop / 20);
		timer = window.setInterval(function() {
			nowTop = nowTop - speed;
			if (nowTop <= target) {
				$(who).scrollTop(target);
				$(".gotoTop").hide();
				window.clearInterval(timer);
				return false;
			}
			$(who).scrollTop(nowTop);
		}, 20);
	}
	$('.gotoTop').on("click", function() {
		scrollTo('.page-content', 1);
	});

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




//加载数据
var loadData = function(url, successFunc,data,errorFunc) {
	$.ajax({
		url: url,
		type: 'POST',
		timeout: 60000,
		async: true,
		dataType: 'json',
		data: data||{},
		success: successFunc,
		error: function(error) {
			console.log('木有数据');
			errorFunc(error);
		}
	});
};

//传值给后端
var sendBack = function(data,url) {
	$.ajax({
		url: url, 
		type: 'POST',
		timeout: 0,
		async: true,
		data: data, 
		beforeSend: function() {
			//可加入loading的效果
		},
		success: function(data) {
		},
		error: function(data) {
			console.log("修改失败")
		}
	})

}

//传值给后端并刷新地址栏
var addSendBack = function(data,url) {
	$.ajax({
		url: url, 
		type: 'POST',
		timeout: 0,
		async: true,
		data: data, 
		dataType: 'json',
		beforeSend: function() {
			//可加入loading的效果
		},
		success: function(data) {
			ADDress();
		},
		error: function(data) {
			console.log("地址修改失败")
		}
	})

}

var loadData1 = function(url, successFunc,data) {
	$.ajax({
		url: url,
		type: 'GET',
		timeout: 60000,
		async: true,
		dataType: 'json',
		data: data||{},
		success: successFunc,
		error: function(error) {
			console.log('木有数据');
		}
	});
};


//URL公共部分
var apiHost = '//api.51app.cn';
//var apiHost = '//192.168.1.249:9081';

//解决全局滚动和局部滚动问题 ，现在还没解决
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


//获取cookie
function getCookie(name){ 
	var strCookie=document.cookie; 
	var arrCookie=strCookie.split("; "); 
	for(var i=0;i<arrCookie.length;i++){ 
		var arr=arrCookie[i].split("="); 
		if(arr[0]==name)return arr[1]; 
	} 
return ""; 
}

//判断是否有表情，有则返回true
function isEmojiCharacter(substring) {
	for(var i = 0; i < substring.length; i++) {
		
		if(substring[i].charCodeAt()>=55356 && substring[i].charCodeAt()<=65039){
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
$('body').on('keyup','input,textarea',function(){
	var that = $(this);
	var orderMsg = that.val();
	
		//判断是否有表情，有则返回true
		if(isEmojiCharacter(orderMsg)) {

			layer.open({
			    content: '请输入汉字或英文',
			    skin: 'msg',
			    time: 2 //2秒后自动关闭
			  });
			that.val('');
			return false;
		}
});
		
		
/*   处理时间戳
==============================*/
function getLocalTime(nS) {     
   return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, "").replace(/上午|下午/g, "").replace(/\//g, "-");      
}  		
		
//加载购物车数量，如果没有登录,不显示数量
function loadShopCarNum(){
	var url,successFunc,dataBox,errorFunc,data;
	url = apiHost + '/diyapi/trade/cart/num?token=' + getCookie('token');
	successFunc = function(data){
		if(data.code == 200){
			if(data.data > 99) {
				data.data = '99+';
			}
			dataBox = '<b>'+ data.data +'</b>';
			$('.toCustumised .toolbar-inner .goShopCar').empty().append(dataBox)	
		}
		
	}
	loadData1(url, successFunc,data);
}		

//判断商品数量，如果等于1，则将减号图片换掉
function isShowSubtract(){
	var length = $('.page .total-num').length;
	for(var i=0;i<length;i++){
		if($('.total-num').eq(i).find('input').val() <= 1){
			$('.total-num').eq(i).find('.subtract img').attr('src','img/ap-subtract-disabled.png')
			$('.total-num').eq(i).find('.subtract').removeClass('op-l');
		}else{
			$('.total-num').eq(i).find('.subtract img').attr('src','img/ap-subtract.png');
			$('.total-num').eq(i).find('.subtract').addClass('op-l');
		}
	}
	
}

//加载talkingData需要的数据    //在点击提交订单时调用，不能在页面加载时调用，防止后面订单数据进行修改
var loadTalkingData = function(tradeOrderId){
	var arr=[];
	var data = {
		'tradeOrderId':tradeOrderId
	}
	$.ajax({
		url: apiHost + '/diyapi/trade/preorder/detail',
		type: 'POST',
		timeout: 0,
		async: false,
		data: data,
		dataType: 'json',
		beforeSend: function() {},
		success: function(data) {
			//统计下订单数据
			var goodsList = data.data.tradeOrder.goodsList;
			$.each(goodsList, function(i) {
				var strData = {
					"id": goodsList[i].id,
					"name": goodsList[i].name,
					"category": goodsList[i].name,
					"unitPrice": goodsList[i].price,
					"count": goodsList[i].num
				}
				arr.push(strData)
			})
		},
		error: function(data) {
			console.log('请求数据失败')
		}
	})
	return arr;
}


function timeTodate(time) {
	var date = new Date(time);
	Y = date.getFullYear() + '-';
	M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	D = (date.getDate()<10?'0'+date.getDate():date.getDate()) + ' ';
	h = (date.getHours()<10?'0'+date.getHours():date.getHours()) + ':';
	m = (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()) + ':';
	s = date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
	return(Y + M + D + h + m + s);
}

//加载首页数据
var loadHome = function() {
	window.localStorage.setItem('isComfirm',1);
	var channel= GetQueryString('channel') || 'etime';
//	//将channel存入cookie
//	setCookie('channel',channel)
	var url, successFunc, dataBox, dataBox1, dataBox2;
	var page = $('.page');
	$.each(page, function(n) {
		var pageName = page.eq(n).attr('data-page');
		if (pageName == "index-1") { //加载首页数据
			$('.hd-noLoad').show();
			url = apiHost+'/diyapi/home/channel?channel='+channel;
			successFunc = function(data) {
				
				if (data.code == 200) {
					//首页背景图
					dataBox='';
					var myreg1 = /^.*.jpg$/;
					var myreg2 = /^.*.png$/;
					if (myreg1.test(data.data.homeBgImageUrl) || myreg2.test(data.data.homeBgImageUrl)) {
						dataBox = '<img src="'+ data.data.homeBgImageUrl +'" />'
					}else{
						dataBox = '<img src="img/topBg.png" />'
					}
					$('.topBg').empty().append(dataBox);
					
					var banners = data.data.banners,
					goods = data.data.goods;
					//banner数据
					dataBox = "";
					dataBox1 = "";
					$.each(banners, function(i) {
						if(banners[i].url){
							dataBox += '<div class="swiper-slide"><a class="external" href="' + banners[i].url + '"><img src="' + banners[i].imageUrl + '" alt="banner" /></a></div>'
						}else{
							dataBox += '<div class="swiper-slide"><a class="external" href="goodDetail.html?channel='+ channel +'&goodsId=' + banners[i].goodsId + '"  class="external"><img src="' + banners[i].imageUrl + '" alt="banner" /></a></div>'
						}
						
					});
					
//					$('.index-swiper-container .swiper-wrapper').empty().append(dataBox);
					
					dataBox1 = '<div class="swiper-wrapper">'+ dataBox +'</div><div class="swiper-pagination"></div>';
					
					$('.index-swiper-container').empty().append(dataBox1);
					$('.hd-noLoad').hide();
					
					 
					 	var mySwiper = new Swiper('.index-swiper-container', {
						  pagination: '.swiper-pagination',
						  paginationHide: false,
						  paginationClickable: true,
						  autoplay: 2000,
						  loop:'true',
						  autoplayDisableOnInteraction: false
						});
					
					
					
					//首页商品数据
					dataBox = "";
					$.each(goods, function(i) {
						dataBox += '<div class="content-block tablet-inset" data-goodsId="'+ goods[i].goodsId +'"><div class="content-block-inner"><a class="external" href="goodDetail.html?channel='
									+channel+'&goodsId=' + goods[i].goodsId + '" class="goodLink"><div class="goodImg index-GoodImg"><img src="' +goods[i].imageUrl + '" alt="精品图" /></div><div class="goodText"><p class="goodName">' + goods[i].name + '</p><div class="buyerMsg"><span class="buyerNum"><img src="img/giftIcon.png"/>'
									+ goods[i].soldNum +'人定制</span><span class="description">'+ goods[i].tagline +'</span></div></div></a></div></div>';
					})
					$('.goods').empty().append(dataBox);
				}else if(data.code == 1001){
						loginLayer('body')
						return;
					}
				
			};
			loadData(url, successFunc);

		} 

	});

};


//购物车页面加载数据
var refreshCar = function() {
	var url, successFunc, dataBox, dataBox1, dataBox2;
	token = getCookie('token');
	var page = $('.page');
	$.each(page, function(n) {
		var pageName = page.eq(n).attr('data-page');
		if (pageName == "index-2") {
			$('.hd-noLoad').show();
			var data={
				'token':token
			}
			url = apiHost+'/diyapi/trade/cart/list';
			successFunc = function(data) {
				if (data.code == 200) {
					var address = data.data.address,
					orderCount = data.data.orderCount,
					couponCount = data.data.couponCount;
					if (data.data.length!=0) {
						$('#view-2 .addCar').show();
						dataBox = "";
						dataBox += '<div class="page-content infinite-scroll _js-limitdrag haveDone" id="page-content" data-ptr-distance="55" style="top: -44px;"><div class="cus-page" style="min-height:101%"><div class="cus-page-inner">'
						
						$.each(data.data, function(i) {
							var shopcartBasicList = data.data[i].shopcartList;
							var merchantBasic = data.data[i].merchant;
							dataBox += '<ul class="car-list list-block" style="display: block;">';
							dataBox += '<li class="_fm-f-14 car-title"><label><span class="check-box _fm-left do selectOne" data-op="selectOne"><i class="_fm-check-1" style="top: 0px;">&nbsp;</i></span></label><span class="shopName">' + merchantBasic.name + '</span><span class="_fm-right _fm-rel edit do right-txt" data-op="editOne">编辑</span></li>';
							$.each(shopcartBasicList, function(j) {
								var priceWechat = toDecimal2(shopcartBasicList[j].priceWechat); //将拿到的金额强制转换成带两位小数的浮点型
								var goodPrice1 = priceWechat.split(".")[0];
								var goodPrice2 = priceWechat.split(".")[1];
								dataBox += '<li class="list-elem swipeout" data-id="' + shopcartBasicList[j].id + '" data-select="' 
										+ shopcartBasicList[j].isSelected + '"><div class="showImgBox" style="display:none">'
										
								$.each(shopcartBasicList[j].previewImageList,function(n){
									dataBox += '<img src="' + shopcartBasicList[j].previewImageList[n].imageUrl + '"/>'
								})
								dataBox += '</div><div class="goods-content _fm-clearfix swipeout-content"><div class="check-box _fm-left do" data-op="selectOne"><i class="_fm-check-1">&nbsp;</i></div><div class="_fm-img _fm-rel _fm-left"><div class="img-inner"><img class="lazy-loaded" data-src="' 
										+ shopcartBasicList[j].previewImageList[0].imageUrl + '" alt="" src="' + shopcartBasicList[j].previewImageList[0].imageUrl + '"></div></div><div class="goods-msg  _fm-rel"><h2 class="_fm-f-14 _fm-ellipsis">' 
										+ shopcartBasicList[j].goodsName + '</h2><div class="price-count _fm-abs _fm-bz _fm-lz"><span class="count-num _fm-left" data-size="16px">￥<span style="font-size: 16px">'
										+ goodPrice1 + '.</span>' + goodPrice2 + '</span><div class="count total-num"><div class="subtract op-l"><img src="img/ap-subtract.png"></div>	<input disabled="" type="text" value="'
										+shopcartBasicList[j].num+'" name="number" pattern="[0-9]*" maxlength="4" class="num">	<div class="add op-r"><img src="img/ap-add.png"></div></div></div><p class="style _fm-overhide"><span>'
										+ shopcartBasicList[j].goodsStyleDesc + '</span></p><p class="style _fm-overhide styleEdit" data-goodsStyleId="'+ shopcartBasicList[j].goodsStyleId +'"><i><img src="img/edit.png" alt=""/></i><span style="width:3.4rem!important">'
										+ shopcartBasicList[j].goodsStyleDesc + '</span></p></div></div><div class="swipeout-actions-right"><a href="#" class="swipeout-delete">删除</a></div></li>'
								
							});
							dataBox += '</ul>'

						});

						dataBox += '</div></div>'
						$('#view-2 .page').empty().append(dataBox);
						isShowSubtract();
						$('.hd-noLoad').hide();
						
//										<div class="total-num _fm-right _js-formatminus haveDone"><span class="op-l _fm-left _fm-rel do" data-op="editNum">-</span><span class="num">'
//										+ shopcartBasicList[j].num + '</span><span class="op-r _fm-right _fm-rel do" data-op="editNum">+</span></div>
										
						
						var scrolltop = localStorage.getItem('scrolltop');
//						window.localStorage.removeItem('scrolltop')
						if(scrolltop){
							$('#view-2 #page-content').scrollTop(Number(scrolltop));
						}else{
							$('#view-2 #page-content').scrollTop = 0;
						}
						
						//如果list-elem属性data-select为true,则默认选中
						var listLength = $('#view-2 .page .car-list .list-elem').length;
						for(var i=0;i<listLength;i++){
							if($('#view-2 .page .car-list .list-elem').eq(i).attr("data-select")=='true'){
								$('#view-2 .page .car-list .list-elem').eq(i).find('._fm-check-1').addClass('active-choose')
							}else{
								$('#view-2 .page .car-list .list-elem').eq(i).find('._fm-check-1').removeClass('active-choose')
							}
							
							var active = $('#view-2 .page .car-list .list-elem').eq(i).parents('.car-list').find('.list-elem').length;
							var activeChoose = $('#view-2 .page .car-list .list-elem').eq(i).parents('.car-list').find('.list-elem').find('.active-choose').length;
							var allActive = $('#view-2 .page .car-list .list-elem').eq(i).parents('.page').find('.list-elem').length;
							var allActiveChoose = $('#view-2 .page .car-list .list-elem').eq(i).parents('.page').find('.list-elem').find('.active-choose').length;
							if (activeChoose == active) {
								$('#view-2 .page .car-list .list-elem').eq(i).parents('.car-list').find('.car-title').find('._fm-check-1').addClass('active-choose');
							} else {
								$('#view-2 .page .car-list .list-elem').eq(i).parents('.car-list').find('.car-title').find('._fm-check-1').removeClass('active-choose');
							};
							if (allActiveChoose == allActive) {
								$('#view-2 .chooseAll ._fm-check-1').addClass('active-choose');
							} else {
								$('#view-2 .chooseAll ._fm-check-1').removeClass('active-choose');
							};
						}
						priceMount();    //计算价格
					} else {
						$('#view-2 .addCar').hide();
						dataBox = "";
						dataBox1 = "";
						url = apiHost+'/diyapi/goods/recommend';
						successFunc = function(data) {
							if (data.code == 200) {
								dataBox1 = "";
								$.each(data.data, function(i) {
									dataBox1 += '<div class="recomendGood"><a class="external recomendGoodLink" href="goodDetail.html?goodsId='+ data.data[i].id  +'&channel='+ channel +'"><img src="' + data.data[i].coverImageUrl + '"><div class="recomend-text"><div><h1>'
									+ data.data[i].name + '</h1><p>' + (data.data[i].tagline || "定制方显品味") + '</p></div></div></a></div>'
								});
								dataBox = '<div class="page-content emptyCar-page"><div style="min-height:101%"><div class="content-block tablet-inset emptyCar"><div class="content-block-inner"><img src="img/emptyCar.png" alt="空购物车" /><div class="goToShopDiv"><a href="#" class="goToShop">去定制</a></div></div></div><div class="content-block-title recomend-title"><span class="recomend-noColor">为您推荐</span><a class="change">换一批<img src="img/refresh.png" /></a></div><div class="content-block" style="width: 7.3rem;box-shadow: inherit;"><div class="content-block-inner" style="background-color: #EDEDED;"><div class="Recommend"><div class="RecommendList">' + dataBox1 + '</div></div></div></div></div></div>';
								$('#view-2 .page').empty().append(dataBox);
								$('.hd-noLoad').hide();
							}
						}
						loadData(url, successFunc);
					}

				}else if(data.code == 1001){
						loginLayer('body')
						return;
					}
			};
			loadData(url, successFunc,data);
		}

	});
}



//'我的'页面加载
var loadMy = function(){
	token = getCookie('token');
	var url, successFunc, dataBox, dataBox1, dataBox2;
	var page = $('.page');
	$.each(page, function(n) {
		var pageName = page.eq(n).attr('data-page');
		if (pageName == "index-3") { //我的页面数据加载
				$('.hd-noLoad').show();
				var data={
					'token':token,
					'channel':channel
				}
				url = apiHost+'/diyapi/user/my';
				successFunc = function(data) {
						
					if (data.code == 200) {
						var orderCount = data.data.orderCount,
						couponCount = data.data.couponCount;
						dataBox = "";
						dataBox1 ="";
						if (data.data.isAgency == true) {
								//代理
							dataBox = '<div class="srevice"><a href="Customer-service.html" class="external"><img src="img/service.png" alt="客服icon" /></a></div><div class="userHead"><a href="#" style="background:url('
									+ data.data.head +') center no-repeat;background-size: cover;"><img src="img/phoneIcon.png" alt="手机icon" class="phoneIcon" /></a></div><p class="userName">'
									+ (data.data.alias|| "") + '</p><p class="userPhoneNum" style="color:#fff!important;text-align: center" data-mobile="'+ (data.data.mobile || "") +'">'+ (data.data.mobile || "") +'</p><div class="content-block"><div class="content-block-inner content-block-first"><div class="list-block order-list-block"><ul><li class="myTitle"><a href="#"><div class="myOrder"><i class="myAgent"><img src="img/myAgentIcon.png"></i><span>代理收益</span></div></a></li><div class="tabbar tabbar-labels tabbar-labels-fixed Order-tabbar"><div class="toBeOrder"><a href="#" class="tab-link myAgentCount"><i class="icon"></i><span class="tabbar-label">我的账户</span></a><a href="#" class="tab-link agentMoney"><i class="icon"></i><span class="tabbar-label">代理收益</span></a><a href="#" class="tab-link"> <i class="icon"></i><span class="tabbar-label"></span></a></div></div></ul></div></div></div><div class="content-block content-block-first"><div class="content-block-inner"><div class="list-block order-list-block" style="padding-bottom:0.2rem"><ul><li class="myTitle"><div class="myOrder"><i class="myOrderIcon"><img src="img/myOrderIcon.png"/></i><span>我的订单</span></div></li><li><div class="tabbar tabbar-labels tabbar-labels-fixed Order-tabbar"><div class="toBeOrder"><a href="myOrder.html?channel='
									+ channel +'&status=0" class="tab-link toBePay"><i class="icon"><span class="badge bg-red">'+ orderCount.unPay + '</span></i><span class="tabbar-label">待付款</span></a><a href="myOrder.html?channel='+ channel +'&status=1" class="tab-link toBeShip"><i class="icon"><span class="badge bg-red">' 
									+ orderCount.unDelive + '</span></i><span class="tabbar-label">待发货</span></a><a href="myOrder.html?channel='+ channel +'&status=2" class="tab-link toBeRecive"> <i class="icon"><span class="badge bg-red">'
									+ orderCount.unReceive + '</span></i><span class="tabbar-label">待收货</span></a></div></div></li></ul></div></div></div><div class="content-block content-block-second"><div class="content-block-inner" id="tan"><div class="list-block order-list-block" style="padding-bottom:0.2rem"><ul><li class="myTitle"><div class="myOrder"><i class="myCoupon"><img src="img/myCoupon.png"/></i><span>我的礼券</span></div></li><li><div class="tabbar tabbar-labels tabbar-labels-fixed Order-tabbar"><div class="toBeOrder"><a href="#" class="tab-link allCoupon"><i class="icon"></i><span class="tabbar-label">全部</span></a><a href="#" class="tab-link canUsing"><i class="icon"><span class="badge bg-red">' 
									+ couponCount.valid + '</span></i><span class="tabbar-label">可使用</span></a><a href="#" class="tab-link overdue"> <i class="icon"><span class="badge bg-red">' + couponCount.expired + '</span></i><span class="tabbar-label">已过期</span></a></div></div></li></ul></div></div></div>'
						} else{
								//普通用户
							dataBox = '<div class="srevice"><a href="Customer-service.html" class="external"><img src="img/service.png" alt="客服icon" /></a></div><div class="userHead"><a href="#" style="background:url('
									+ data.data.head +') center no-repeat;background-size: cover;"><img src="img/phoneIcon.png" alt="手机icon" class="phoneIcon" /></a></div><p class="userName">'
									+ (data.data.alias|| "") + '</p><p class="userPhoneNum" style="color:#fff!important;text-align: center" data-mobile="'+ (data.data.mobile || "") +'">'+ (data.data.mobile || "") +'</p><div class="content-block content-block-first"><div class="content-block-inner"><div class="list-block order-list-block" style="padding-bottom:0.2rem"><ul><li class="myTitle"><div class="myOrder"><i class="myOrderIcon"><img src="img/myOrderIcon.png"/></i><span>我的订单</span></div></li><li><div class="tabbar tabbar-labels tabbar-labels-fixed Order-tabbar"><div class="toBeOrder"><a href="myOrder.html?channel='
									+ channel +'&status=0" class="tab-link toBePay"><i class="icon"><span class="badge bg-red">'+ orderCount.unPay + '</span></i><span class="tabbar-label">待付款</span></a><a href="myOrder.html?channel='+ channel +'&status=1" class="tab-link toBeShip"><i class="icon"><span class="badge bg-red">' 
									+ orderCount.unDelive + '</span></i><span class="tabbar-label">待发货</span></a><a href="myOrder.html?channel='+ channel +'&status=2" class="tab-link toBeRecive"> <i class="icon"><span class="badge bg-red">'
									+ orderCount.unReceive + '</span></i><span class="tabbar-label">待收货</span></a></div></div></li></ul></div></div></div><div class="content-block content-block-second"><div class="content-block-inner" id="tan"><div class="list-block order-list-block" style="padding-bottom:0.2rem"><ul><li class="myTitle"><div class="myOrder"><i class="myCoupon"><img src="img/myCoupon.png"/></i><span>我的礼券</span></div></li><li><div class="tabbar tabbar-labels tabbar-labels-fixed Order-tabbar"><div class="toBeOrder"><a href="#" class="tab-link allCoupon"><i class="icon"></i><span class="tabbar-label">全部</span></a><a href="#" class="tab-link canUsing"><i class="icon"><span class="badge bg-red">' 
									+ couponCount.valid + '</span></i><span class="tabbar-label">可使用</span></a><a href="#" class="tab-link overdue"> <i class="icon"><span class="badge bg-red">' + couponCount.expired + '</span></i><span class="tabbar-label">已过期</span></a></div></div></li></ul></div></div></div>'
						}
								
						if(data.data.address){
							var address = data.data.address;
							dataBox1 = '<div class="content-block"><div class="content-block-inner content-block-first"><div class="list-block order-list-block"><ul><li class="myTitle"><a href="#"><div class="myOrder"><i class="reciveAdress"><img src="img/reciveAdress.png"/></i><span>收货地址</span></div></a></li><li class="myReciveAdress"><a href="#"><p><span class="province">'
									+ address.provinceName + '</span><span class="city">' + address.cityName + '</span><span class="area">' + address.countyName + '</span><span class="detailAdress">' + address.address + '</span></p></a></li></ul></div></div></div>'
						}else{
							dataBox1 = '<div class="content-block no-address"><div class="content-block-inner content-block-first"><div class="list-block order-list-block"><ul><li class="myTitle"><a href="#"><div class="myOrder"><i class="reciveAdress"><img src="img/reciveAdress.png"/></i><span>收货地址</span></div></a></li><li class="myReciveAdress"><div style="margin: 0 auto;text-align: center;line-height: 1.1rem;"><a href="editAddress.html" style="font-size: 0.3rem;display: inline-block;line-height: 1.1rem;color:#007aff!important">新增收货地址</a></div> </li></ul></div></div></div>'
						}
//						<a href="#" class="tab-link downAppBox"><i class="icon"></i><span class="tabbar-label">下载APP</span></a>   //暂时去掉下载app
						dataBox2 = '<div class="content-block"><div class="content-block-inner content-block-first"><div class="list-block order-list-block"><ul><li class="myTitle"><a href="#"><div class="myOrder"><i class="downApp"><img src="img/myOther.png"/></i><span>其它</span></div></a></li><div class="tabbar tabbar-labels tabbar-labels-fixed Order-tabbar"><div class="toBeOrder"><a href="#" class="tab-link groupCus"><i class="icon"></i><span class="tabbar-label">团体定制</span></a><a href="#" class="tab-link"> <i class="icon"></i><span class="tabbar-label"></span></a><a href="#" class="tab-link"> <i class="icon"></i><span class="tabbar-label"></span></a></div></div></ul></div></div></div>'
					}else if(data.code == 1001){
						loginLayer('body')
						return;
					}
					//						<li style="margin: 0 auto;line-height: 1.1rem;"><a href="#" class="downloadAppBtn" style="margin: 0 auto;padding-left: 0.5rem;line-height: 1.1rem;display: block;font-size: 0.26rem;"><p>乐乐定制 一家专门做定制的平台</p></a></li>
					$('.myPage .page-content').empty().append(dataBox+dataBox1+dataBox2);
					$('.hd-noLoad').hide();
					//如果数量为0，则将小角标去掉
					if(orderCount.unPay==0){
						$('#view-3 .toBePay .icon').find('.badge').hide();
					}else{
						$('#view-3 .toBePay .icon').find('.badge').show();
					}
					
					if(orderCount.unDelive==0){
						$('#view-3 .toBeShip .icon').find('.badge').hide();
					}else{
						$('#view-3 .toBeShip .icon').find('.badge').show();
					}
					
					if(orderCount.unReceive==0){
						$('#view-3 .toBeRecive .icon').find('.badge').hide();
					}else{
						$('#view-3 .toBeRecive .icon').find('.badge').show();
					}
					
					if(couponCount.valid==0){
						$('#view-3 .canUsing .icon').find('.badge').hide();
					}else{
						$('#view-3 .canUsing .icon').find('.badge').show();
					}
					
					if(couponCount.expired==0){
						$('#view-3 .overdue .icon').find('.badge').hide();
					}else{
						$('#view-3 .overdue .icon').find('.badge').show();
					}
						
				};
				loadData(url, successFunc,data);
			};
		})
 	}

//检测设备
function checkDevice() {
    var u = navigator.userAgent;
//  var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
//  var isWechat = ua.match(/MicroMessenger/i) == 'micromessenger';//在微信中打开
    if (isAndroid) {
        return ('android');
    }
    if (isiOS) {
        return ('ios');
    }
//  if (isWechat) {
//      return ('wechat');
//  }
}
var devicePlatform = checkDevice();

//判断是否是微信浏览器中打开
//判断是否微信登陆
function isWeiXin() {
	var ua = window.navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		return  true;
	} else {
		return  false;
	}
}
var deviceBrowser = isWeiXin();


//购物车为空的时候点击去定制按钮跳转
$('#view-2 .page').on('click','.goToShop',function(){
	window.location.href="index.html?channel="+channel+'&source='+localStorage.getItem('source');
})

//所有下拉刷新当前页面
$(document).on('pageInit', function(e) {
	$('.pull-to-refresh-content').on('refresh', function(e) {
		mainView.router.reloadPage(mainView.url);
		myApp.pullToRefreshDone();
	});
});

// “我的” 页面 点击优惠券
$('#view-3 .page').on('click', '.content-block-second', function() {
	myApp.alert('您暂时没有可用优惠券！', '优惠券');
});

/* 浏览器返回 */
$('body .page').on('touchstart', '._js-historyback', function() {
	mainView.router.back();
});

//金额强制保留2位小数
function toDecimal2(x) {
	var f = parseFloat(x);
	if (isNaN(f)) {
		return false;
	}
	var f = Math.round(x * 100) / 100;
	var s = f.toString();
	var rs = s.indexOf('.');
	if (rs < 0) {
		rs = s.length;
		s += '.';
	}
	while (s.length <= rs + 2) {
		s += '0';
	}
	return s;
}


//购物车页面编辑按钮
$('.styleEdit').hide();
$('.page').on('click', '.edit', function() {
	if($(this).text()=="完成"){
		$(this).text('编辑')
		for (var i = 0; i < $(this).parent('li').siblings('li').length; i++) {
			$(this).parents('li').siblings('li').eq(i).children('div').find('.style').eq(0).show();
			$(this).parents('li').siblings('li').eq(i).children('div').find('.style').eq(1).hide();

		}
	}else if($(this).text()=="编辑"){
		$(this).text('完成')
		for (var i = 0; i < $(this).parent('li').siblings('li').length; i++) {
			$(this).parents('li').siblings('li').eq(i).children('div').find('.style').eq(1).show();
			$(this).parents('li').siblings('li').eq(i).children('div').find('.style').eq(0).hide();
		}
	}
})



//首次加载页面
window.onload = function() {
	loadHome(); //加载首页
	goTop();   //返回顶部
	var tab = GetQueryString('tab');   //从定制页面跳转到购物车页面
	if(tab == "link2"){
		$('.toolbar .tab-link2 .tabbar-demo-icon-2').click();
	}
};


//购物车首页点击事件

//购物车预览图 弹窗+轮播
$('#view-2 .page').on('click', '.lazy-loaded', function(){
	var length = $(this).parents('.goods-content').siblings('.showImgBox').find('img').length;
	var layerContent;
	layerContent = '<div class="swiper-container swiper-init layer-container" data-space-between="0" data-pagination=".swiper-pagination">';
	layerContent += '<div class="swiper-wrapper">';
	 for (var i=0;i<length;i++) {
	 	var imgUrl = $(this).parents('.goods-content').siblings('.showImgBox').find('img').eq(i).attr('src');
		layerContent += '<div class="swiper-slide"><a href="#"><img src="'+imgUrl+'" alt="banner" class="layerImg" style="display:block;padding:0"></a></div>';
	 }	
	 layerContent += '</div><div class="swiper-pagination"></div></div>';
	layer.open({
		type: 1,
		skin: '', //样式类名
		closeBtn: 0, //不显示关闭按钮
		anim: 2,
		shadeClose: true, //开启遮罩关闭
		content: layerContent
	})
	var sWidth = $(window).width();
	$('.layui-m-layercont').css({'width':sWidth+'px'});
	$('.layerImg').css({'width':sWidth+'px'});
	$('.swiper-slide').css({'width':sWidth+'px'});
	var mySwiper = myApp.swiper('.swiper-container', {
		pagination: '.swiper-pagination'
	}); 
})


//点击刷新空购物车推荐商品
//var clickCount = 0;
//window.localStorage.setItem("clickCount",clickCount)
$('#view-2 .page').on('click','.change',function(){
//	clickCount++;
//	window.localStorage.setItem("clickCount",clickCount);
	var url, successFunc, dataBox, dataBox1;
	dataBox = "";
	dataBox1 = "";
	url = apiHost+'/diyapi/goods/recommend?token='+token;
	successFunc = function(data) {
		if (data.code == 200) {
			dataBox1 = "";
//			var clickCount = window.localStorage.getItem('clickCount');
//				if(clickCount == 1){
//					dataBox1 += '<div class="moreGoods"><img src="img/moreGoods.png" /></div>';
//					var length = data.data.length;
//					for(var i=0;i<length-1;i++){
////						dataBox1 += '<div class="recomendGood"><img src="' + data.data[i].coverImageUrl + '"><div class="recomend-text"><div><h1>' + data.data[i].name + '</h1><p>' + data.data[i].tagline + '</p></div></div></div>'
//						
//					dataBox1 += '<div class="recomendGood"><a class="external recomendGoodLink" href="goodDetail.html?goodsId='+ data.data[i].id  +'&channel='+ channel +'"><img src="' + data.data[i].coverImageUrl + '"><div class="recomend-text"><div><h1>'
//									+ data.data[i].name + '</h1><p>' + (data.data[i].tagline || "定制方显品味") + '</p></div></div></a></div>'
//					}
//				}else{
					$.each(data.data, function(i) {
//						dataBox1 += '<div class="recomendGood"><img src="' + data.data[i].coverImageUrl + '"><div class="recomend-text"><div><h1>' + data.data[i].name + '</h1><p>' + data.data[i].tagline + '</p></div></div></div>'
						dataBox1 += '<div class="recomendGood"><a class="external recomendGoodLink" href="goodDetail.html?goodsId='+ data.data[i].id  +'&channel='+ channel +'"><img src="' + data.data[i].coverImageUrl + '"><div class="recomend-text"><div><h1>'
									+ data.data[i].name + '</h1><p>' + (data.data[i].tagline || "定制方显品味") + '</p></div></div></a></div>'
//					}
					});
//				}
				}
			
			dataBox = '<div class="page-content emptyCar-page"><div class="content-block tablet-inset emptyCar"><div class="content-block-inner"><img src="img/emptyCar.png" alt="空购物车" /><div class="goToShopDiv"><a href="#" class="goToShop">去定制</a></div></div></div><div class="content-block-title recomend-title"><span class="recomend-noColor">为您推荐</span><a class="change">换一批<img src="img/refresh.png" /></a></div><div class="content-block" style="width: 7.3rem;box-shadow: inherit;"><div class="content-block-inner" style="background-color: #EDEDED;"><div class="Recommend"><div class="RecommendList">' + dataBox1 + '</div></div></div></div></div>';
			$('#view-2 .page').empty().append(dataBox);
		}
//	}
	loadData(url, successFunc);
})

$('body').on('click','.moreGoods',function(){
	window.location.href = "https://api.51app.cn/diyapi/channel/todownload?channel="+channel+'&token='+token;
	$('.toolbar').hide();
})

//每操作一次都刷新购物车
var sendRefresh= function(data){
	$.ajax({
		url: apiHost+"/diyapi/trade/cart/modify", 
		type: 'POST',
		timeout: 0,
		async: true,
		data: data, 
		beforeSend: function() {
			//可加入loading的效果
		},
		success: function(data) {
			refreshCar()      //修改成功后刷新购物车
		},
		error: function(data) {
			console.log("购物车修改失败")
		}
	})
}


//每操作一次传给后台但不刷新购物车
var sendNoRefresh= function(data){
	$.ajax({
		url: apiHost+"/diyapi/trade/cart/modify", 
		type: 'POST',
		timeout: 0,
		async: true,
		data: data, 
		beforeSend: function() {
			//可加入loading的效果
		},
		success: function(data) {
		},
		error: function(data) {
			console.log("购物车修改失败")
		}
	})
}
//删除购物车数据
var deleteCar= function(data){
	$.ajax({
		url: apiHost+"/diyapi/trade/cart/delete", 
		type: 'POST',
		timeout: 0,
		async: true,
		data: data, 
		beforeSend: function() {
			//可加入loading的效果
		},
		success: function(data) {
			refreshCar()      //修改成功后刷新购物车
		},
		error: function(data) {
			console.log("购物车修改失败")
		}
	})
}

//单选
var priceArr = [];
var numArr = [];

//选择商家
$('#view-2 .page').on('click', '.car-title .check-box', function() {
	var scrolltop = $('#view-2 #page-content').scrollTop();
	localStorage.setItem('scrolltop',scrolltop);  //存储滚动条位置
	
	var length = $(this).parents('.car-title').siblings('.list-elem').length;
	if ($(this).find('._fm-check-1').hasClass('active-choose')) {
		$(this).parents('.car-title').siblings('.list-elem').find('._fm-check-1').removeClass('active-choose');
		$(this).find('._fm-check-1').removeClass('active-choose');
		priceMount();
		for (var i = 0; i < length; i++) {
			var elem = $(this).parents('.car-title').siblings('.list-elem')[i];
			elem.setAttribute("data-select", false);
			var isSelect = elem.getAttribute("data-select");
			var id = elem.getAttribute("data-id");
			var data = {
				"isSelected": isSelect,
				"id": id
			};
			sendNoRefresh(data);
		}
	} else {
		$(this).parents('.car-title').siblings('.list-elem').find('._fm-check-1').addClass('active-choose');
		$(this).find('._fm-check-1').addClass('active-choose');
		priceMount();
		for (var i = 0; i < length; i++) {
			var elem = $(this).parents('.car-title').siblings('.list-elem')[i];
			elem.setAttribute("data-select", true);
			var isSelect = elem.getAttribute("data-select");
			var id = elem.getAttribute("data-id");
			var data = {
				"isSelected": isSelect,
				"id": id
			};
			sendNoRefresh(data);
		}
	}

	var active = $(this).parents('.cus-page-inner').find('.car-list').length;
	var activeChoose = $(this).parents('.cus-page-inner').find('.car-title').find('.active-choose').length;
	if (activeChoose == active) {
		$('#view-2 .chooseAll ._fm-check-1').addClass('active-choose');
	} else {
		$('#view-2 .chooseAll ._fm-check-1').removeClass('active-choose');
	};
	

});


//选择商品
$('#view-2 .page').on('click', '.list-elem .check-box', function() {
	var scrolltop = $('#view-2 #page-content').scrollTop();
	localStorage.setItem('scrolltop',scrolltop);  //存储滚动条位置
	
	
	if ($(this).find('._fm-check-1').hasClass('active-choose')) {
		$(this).find('._fm-check-1').removeClass('active-choose');
		var elem = $(this).parents('.list-elem');
		elem.attr("data-select", "false");
	} else {
		$(this).find('._fm-check-1').addClass('active-choose');
		var elem = $(this).parents('.list-elem');
		elem.attr("data-select", "true");
	}
	priceMount();
	var active = $(this).parents('.car-list').find('.list-elem').length;
	var activeChoose = $(this).parents('.car-list').find('.list-elem').find('.active-choose').length;
	var allActive = $(this).parents('.page').find('.list-elem').length;
	var allActiveChoose = $(this).parents('.page').find('.list-elem').find('.active-choose').length;
	if (activeChoose == active) {
		$(this).parents('.car-list').find('.car-title').find('._fm-check-1').addClass('active-choose');
	} else {
		$(this).parents('.car-list').find('.car-title').find('._fm-check-1').removeClass('active-choose');
	};
	if (allActiveChoose == allActive) {
		$('.chooseAll ._fm-check-1').addClass('active-choose');
	} else {
		$('.chooseAll ._fm-check-1').removeClass('active-choose');
	};
	var isSelect = $(this).parents('.list-elem').attr("data-select");
	var id = $(this).parents('.list-elem').attr("data-id");
	var data = {
		"isSelected": isSelect,
		"id": id
	};
	sendNoRefresh(data);
});

//全选
$('#view-2').on('click', '.addCar .chooseAll', function() {
	var scrolltop = $('#view-2 #page-content').scrollTop();
	localStorage.setItem('scrolltop',scrolltop);  //存储滚动条位置
	
	var length = $('#view-2 .list-elem').length;
	var isChoose = $(this).find('i');
	if (isChoose.hasClass('active-choose')) {
		$('#view-2 ._fm-check-1').removeClass('active-choose');
		for (var i = 0; i < length; i++) {
			var elem = $('.list-elem')[i];
			elem.setAttribute("data-select", false);
			var isSelect = elem.getAttribute("data-select");
			var id = elem.getAttribute("data-id");
			var data = {
				"isSelected": isSelect,
				"id": id
			};
			sendNoRefresh(data);
		}
	} else {
		$('#view-2 ._fm-check-1').addClass('active-choose');
		for (var i = 0; i < length; i++) {
			var elem = $('.list-elem')[i];
			elem.setAttribute("data-select", true);
			var isSelect = elem.getAttribute("data-select");
			var id = elem.getAttribute("data-id");
			var data = {
				"isSelected": isSelect,
				"id": id
			};
			sendNoRefresh(data);
		}
	};
	priceMount();    //计算价格
});

//数量加
$('#view-2 .page').on('click', '.op-r', function() {
	isShowSubtract();
	var scrolltop = $('#view-2 #page-content').scrollTop();
	localStorage.setItem('scrolltop',scrolltop);  //存储滚动条位置
	
	var id = $(this).parents('.list-elem').attr("data-id");
	var val = $(this).siblings('.num').val()
	var newVal = Number(val) + 1;
	val = newVal;
	$(this).siblings('.num').val(val);
	var data = {
		"num": val,
		"id": id
	};
	isShowSubtract();
	sendNoRefresh(data);
	priceMount();    //计算价格
})

//数量减
$('#view-2 .page').on('click', '.op-l', function() {
	isShowSubtract();
	var scrolltop = $('#view-2 #page-content').scrollTop();
	localStorage.setItem('scrolltop',scrolltop);  //存储滚动条位置
	
	var id = $(this).parents('.list-elem').attr("data-id");
	var val = $(this).siblings('.num').val();
	if (val == '1') {

	} else {
		var newVal = Number(val) - 1;
		val = newVal;
		$(this).siblings('.num').val(val);
	};
	var data = {
		"num": val,
		"id": id
	};
	isShowSubtract();
	sendNoRefresh(data);
	priceMount();    //计算价格
})

//计算价格
function priceMount() {
	var totalPrice = 0,
		totalNum = 0;
	var allChoose = $('.list-elem').length;
	var allMoney = [],
		numArr = [];
	for (var i = 0; i < allChoose; i++) {
		var choose = $('.list-elem').eq(i).find('._fm-check-1');
		var isChoose = $('.list-elem').eq(i).find('._fm-check-1').hasClass('active-choose');
		if (isChoose) {
			var priceHtml = $('.list-elem').eq(i).find('.count-num').text();
			var price = Number(priceHtml.split('￥')[1]);
			var numHtml = $('.list-elem').eq(i).find('.num').val();
			var num = Number(numHtml);
			var all = price * num;
			allMoney.push(all);
			numArr.push(num);
		}
	}
	for (var i in allMoney) {
		totalPrice += allMoney[i];
	}
	for (var i in numArr) {
		totalNum += numArr[i];
	}
	$('.count-all i').text(Number(totalNum));
	var Total = toDecimal2(totalPrice);
	var Total1 = Total.split('.')[0];
	var Total2 = Total.split('.')[1];
	$('.count-num i i').html(Total1+'.<i class="iSmall">'+ Total2 +'</i>');

}


//购物车滑动删除
$('._js-shoppingCarList .page').on('click','.swipeout-delete',function(){
	var scrolltop = $('#view-2 #page-content').scrollTop();
	localStorage.setItem('scrolltop',scrolltop);  //存储滚动条位置
	
	var id = $(this).parents('.list-elem').attr('data-id');   //获取当前商品购物车id
	var data = {
			'id': id,
		};
		deleteCar(data);
})


//结算
$('#view-2').on('click', '.toPayMent', function() {
	window.localStorage.setItem('isComfirm', 1);
	var scrolltop = $('#view-2 #page-content').scrollTop();
	localStorage.setItem('scrolltop',scrolltop);  //存储滚动条位置
	
	var toPayLength = $('.list-elem .active-choose').length;
	var arr =[];
	if (toPayLength) {
		for(var i=0;i<toPayLength;i++){
			var id = $('.list-elem .active-choose').eq(i).parents('.list-elem').attr('data-id');
			arr.push(id);
		}
		var data = {
			'cartIds' : String(arr),
			'channel':channel,
			'token':token
		}
	var url = apiHost+"/diyapi/trade/preorder";
		$.ajax({
			url: url,
			type: 'POST',
			timeout: 0,
			async: true,
			data: data, 
			dataType:'json',
			success: function(data) {
				var tradeOrderId = data.data.tradeOrder.id;
				window.location.href='orderConfirm.html?channel='+channel+'&tradeOrderId='+tradeOrderId;
				
			},
			error: function(data) {
				console.log("修改失败")
			}
		})
	} else {
		myApp.alert('您什么都没有选中哦！','购物车');
		$('#view-2 .toPayMent').css("opacity", .5)
		setTimeout(function() {
			$('#view-2 .toPayMent').css("opacity", 1)
		}, 1000)
	}
})





//收货地址列表
var ADDress = function(){
	var url, successFunc, dataBox, dataBox1, dataBox2;
	var page = $('.page');
	url = apiHost+'/diyapi/user/address/list?token='+token;
	successFunc = function(data) {
					
		if (data.code == 200){
			dataBox = "";
			dataBox1 = "";
			dataBox2 = "";
			var data = data.data;
			var arr =[];
			var dataLength = data.length;
			$.each(data,function(i){
				if(data[i].isDefault == false){
					arr.push(data[i].isDefault)
				}
				if(data[i].isDefault){
					dataBox += '<section class="order-address do active _fm-block _fm-overhide" data-id="'+ data[i].id +'" data-isDefault="'+data[i].isDefault+'" style="background-color:#fff;">';
					dataBox += '<div class="msg">';
					dataBox += '<p class="_fm-overhide _fm-f-15">';
					dataBox += '<span class="name _fm-left _fm-ellipsis" style="color:#ff5252">'+data[i].name+'</span>';
					dataBox += '<span class="mobile" style="color:#ff5252">'+ data[i].phone +'</span></p>';
					dataBox += '<div class="address _fm-overhide" style="color:#666">';
					dataBox += '<i class="province" data-add="'+data[i].province+'" style="color:#666">'+ (data[i].provinceName||"")+'</i>&nbsp;';
					dataBox += '<i class="city" data-add="'+data[i].city+'" style="color:#666">'+ (data[i].cityName||"")+'</i>&nbsp;';
					dataBox += '<i class="county" data-add="'+data[i].county+'" style="color:#666">'+ data[i].countyName+'</i>&nbsp;<i class="aDDress" style="color:#666">'+ data[i].address +'</i>';			 
					dataBox += '</div></div><div class="msgOpera"><div class="left-ico _fm-left isDefault" data-isDefault="'+ data[i].isDefault +'" style="color:#666">';
					dataBox += '<span class="_fm-check-1 de active-choose" style="float:left">&nbsp;</span><span style="float:left;color:#575757;line-height:0.4rem">设为默认地址</span></div>';
				}else{
					dataBox += '<section class="order-address do active _fm-block _fm-overhide" data-id="'+ data[i].id +'" data-isDefault="'+data[i].isDefault+'" style="background-color:#fff;">';
					dataBox += '<div class="msg">';
					dataBox += '<p class="_fm-overhide _fm-f-15">';
					dataBox += '<span class="name _fm-left _fm-ellipsis" style="color:#666">'+data[i].name+'</span>';
					dataBox += '<span class="mobile" style="color:#575757">'+ data[i].phone +'</span></p>';
					dataBox += '<div class="address _fm-overhide" style="color:#666">';
					dataBox += '<i class="province" data-add="'+data[i].province+'" style="color:#666">'+ (data[i].provinceName||"")+'</i>&nbsp;';
					dataBox += '<i class="city" data-add="'+data[i].city+'" style="color:#666">'+ (data[i].cityName||"")+'</i>&nbsp;';
					dataBox += '<i class="county" data-add="'+data[i].county+'" style="color:#666">'+ data[i].countyName+'</i>&nbsp;<i class="aDDress" style="color:#666">'+ data[i].address +'</i>';			 
					dataBox += '</div></div><div class="msgOpera"><div class="left-ico _fm-left isDefault" data-isDefault="'+ data[i].isDefault +'" style="color:#666">';
					dataBox += '<span class="_fm-check-1 de" style="float:left">&nbsp;</span><span style="float:left;color:#575757;line-height:0.4rem">设为默认地址</span></div>';
			}
				
				dataBox += '<div class="right-ico _fm-right do deleteAddr" style="color:#575757"><span class="_fm-inline _fm-rel _fm-txtcenter">&nbsp;</span>删除</div><div class="right-ico _fm-right do editAddr" data-op="editAddr"><a href="modifyAddress.html" style="color:#575757"><span class="_fm-inline _fm-rel _fm-txtcenter">&nbsp;</span>编辑</a></div></div></section>';
			})
			$('.pages .address-list').empty().append(dataBox);
			if(arr.length == dataLength){
				$('.pages .address-list .order-address').eq(0).attr('data-isDefault',true);
				$('.pages .address-list .order-address').eq(0).find('.name').css('color','#ff5252');
				$('.pages .address-list .order-address').eq(0).find('.mobile').css('color','#ff5252');
				$('.pages .address-list .order-address').eq(0).find('.isDefault').attr('data-isDefault',true);
				$('.pages .address-list .order-address').eq(0).find('.isDefault').find('._fm-check-1').addClass('active-choose');
			}
		}
	};
	loadData(url, successFunc);
}
	
	
//选择收货地址
var chooseAddress = function(){
	var chooseAddressId = localStorage.getItem("chooseAddressId");
	var url, successFunc, dataBox, dataBox1, dataBox2;
	var page = $('.page');
	url = apiHost+'/diyapi/user/address/list?token='+token;
	successFunc = function(data) {
					
		if (data.code == 200){
			dataBox = "";
			dataBox1 = "";
			dataBox2 = "";
			var data = data.data;
			$.each(data,function(i){
				dataBox += '<section class="order-address do active _fm-block _fm-overhide" data-id="'+ data[i].id +'" data-isDefault="'+data[i].isDefault+'" style="background-color:#fff;">';
				dataBox += '<div class="AddressChooseIcon"><span class="_fm-check-1 active-choose" style="margin-top:10px;">&nbsp;</span></div><div class="msg" style="float:left;width:5.5rem;">';
				dataBox += '<p class="_fm-overhide _fm-f-15">';
				dataBox += '<span class="name _fm-left _fm-ellipsis" style="color:#666">'+data[i].name+'</span>';
				dataBox += '<span class="mobile" style="color:#666">'+ data[i].phone +'</span></p>';
				dataBox += '<div class="address _fm-overhide" style="color:#666">';
				dataBox += '<i class="province" data-add="'+data[i].province+'" style="color:#666">'+ (data[i].provinceName||"")+'</i>&nbsp;';
				dataBox += '<i class="city" data-add="'+data[i].city+'" style="color:#666">'+ (data[i].cityName||"")+'</i>&nbsp;';
				dataBox += '<i class="county" data-add="'+data[i].county+'" style="color:#666">'+ (data[i].countyName||"")+'</i>&nbsp;<i class="aDDress" style="color:#666">'+ data[i].address +'</i>';			 
				dataBox += '</div></div><div class="right-ico _fm-right do editAddr editAddr1" data-op="editAddr"><a href="useAddress.html" style="color:#666"><span class="_fm-inline _fm-rel _fm-txtcenter">&nbsp;</span></a></div></section>';
			})
			
			$('.pages .address-list').empty().append(dataBox); 
			 var length = $('.address-list .order-address').length;
			for (var j=0;j<length;j++) {
				var id = $('.address-list .order-address').eq(j).attr('data-id');
				if(chooseAddressId ==  id){
					$('.address-list .order-address').eq(j).find('.AddressChooseIcon').show().parents('.order-address').siblings('.order-address').find('.AddressChooseIcon').hide();
					$('.address-list .order-address').eq(j).find('.msg').addClass('chooseActive').parents('.order-address').siblings('.order-address').find('.msg').removeClass('chooseActive');
				}
				
			}
		}else if(data.code == 1001){
						loginLayer('body')
						return;
					}
	};
	loadData(url, successFunc);
}
	

//防止键盘弹出时，定位的元素被顶起来
function inputFouc() {
	var wHeight = window.innerHeight; //获取初始可视窗口高度 
	window.addEventListener('resize', function() { //监测窗口大小的变化事件 
		var hh = window.innerHeight; //当前可视窗口高度 
		var viewTop = $(window).scrollTop(); //可视窗口高度顶部距离网页顶部的距离 
		if(wHeight > hh) { //可以作为虚拟键盘弹出事件 
			$('body .save-use').css('position', 'static');
			$('body .save-useMask').css('position', 'static');
			$('body .confirm-toolBar').css('position', 'static');
			$('body .confirming').css('position', 'static');
		} else { //可以作为虚拟键盘关闭事件 
			$('body .save-use').css('position', 'absolute');
			$('body .save-useMask').css('position', 'absolute');
			$('body .confirm-toolBar').css('position', 'absolute');
			$('body .confirming').css('position', 'absolute');
		}
		wHeight = hh;
	});
}

//地址栏 设为默认地址开关
var switchClick = function(){
	if($('.xl-checkbox').hasClass('xl-checkBox-active')){
		$(".xl-switch input").attr("checked",'true');
		$('.xl-checkSlide').css('-webkit-transform','translateX(0rem)')
		$('.xl-checkbox').removeClass('xl-checkBox-active')
	}else{
		$(".xl-switch input").removeAttr("checked");
		$('.xl-checkSlide').css('-webkit-transform','translateX(0.4rem)')
		$('.xl-checkbox').addClass('xl-checkBox-active')
	}
}

//F7 各个页面内容
$(document).on('page:init', function(e) {
	var page = e.detail.page;
	
	//新增收货地址页面
	if (page.name === 'editAddress') {
//		inputFouc();   //检测键盘是否弹起
		var myreg = /^1(3|4|5|7|8)\d{9}$/;
		var myApp = new Framework7({
			modalButtonOk: "确定",
		});
		
		//每一个input都需要有值，才能点击保存
		function CanBeSave1() {
			var length = $(".val").length;
			var flag = 0;
			for (var i = 0; i <length; i++) {
				var temp = $(".val").eq(i).val().length;
				if(temp == 0) {
					
					$('.save-use').show();
					$('.save-useMask').hide();
					flag = 1;
					break;
				}else{
					var mobile = $('.editAddress .mobile').val();
					if (myreg.test(mobile)&& mobile.length == 11) {
						flag = 0;
					}else{
						flag = 1;
					}
				}
				
				if(flag == 0){
					$('.save-use').hide();
					$('.save-useMask').show();
				}else{
					$('.save-use').show();
					$('.save-useMask').hide();
				}
			};
		};
		CanBeSave1();



		$('.val').on("input propertychange",function(){
			CanBeSave1();
		});
		
		
		$('.save-useMask').on('click',function(){
			$('.save-use').show();
			$('.save-useMask').hide();
			var phone = $('.editAddress .mobile').val();
			var name = $('.editAddress .name').val();
			var Bianma = $('.editAddress #value1').val();
			var Value = Bianma.split(',');
			var otherAddress = $('.editAddress .otherAddress').val();
			var isDefault = $('.xl-switch input').is(':checked');
			
			var data = {
				'token':token,
				'name':name,
				'phone':phone,
				'province' : Value[0],
				'city' : Value[1],
				'county' : Value[2],
				'address' : otherAddress,
				'isDefault' : isDefault
			}
			$.ajax({
				url: apiHost+'/diyapi/user/address/add',  
				type: 'POST',
				timeout: 0,
				async: true,
				data: data, 
				dataType: 'json',
				beforeSend: function() {
					//可加入loading的效果
				},
				success: function(data) {
					ADDress();
					if(tradeOrderId){
						var phone = $('.editAddress .mobile').val();
						var name = $('.editAddress .name').val();
						var address =  $('.editAddress .edit-address').find('._js-provincePicker').val();
						var addressCode =  $('.editAddress .edit-address').find('#value1').val();
						
						var province = address.split(',')[0];
						var city = address.split(',')[1];
						var county = address.split(',')[2];
						var otherAddress = $('.editAddress .otherAddress').val();
						var provinceCode = addressCode.split(',')[0];
						var cityCode = addressCode.split(',')[1];
						var countyCode = addressCode.split(',')[2];
			
						//将数据存储到localStorage中
						window.location.href='orderConfirm.html?channel='+channel+'&tradeOrderId='+tradeOrderId;
//						loadOrderComfirm();
					}else{
						mainView.router.back();
						loadMy();
					}
				},
				error: function(data) {
					console.log("地址修改失败")
				}
			})
		})
		
		//启动省市三级联动
		var area1 = new LArea();
		area1.init({
			'trigger': '#demo1', //触发选择控件的文本框，同时选择完毕后name属性输出到该位置
			'valueTo': '#value1', //选择完毕后id属性输出到该位置
			'keys': {
				id: 'value',
				name: 'text'
			}, //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
			'type': 2, //数据源类型
			'data': [provs_data, citys_data, dists_data]
		});
	}
	
	//新增收货地址+保存并使用 页面
	if (page.name === 'editAddress1') {
//		inputFouc();   //检测键盘是否弹起
		var myreg = /^1(3|4|5|7|8)\d{9}$/;
		var myApp = new Framework7({
			modalButtonOk: "确定",
		});
		
		//每一个input都需要有值，才能点击保存
		function CanBeSave0() {
			var length = $(".val").length;
			var flag = 0;
			for (var i = 0; i <length; i++) {
				var temp = $(".val").eq(i).val().length;
				if(temp == 0) {
					
					$('.save-use').show();
					$('.save-useMask').hide();
					flag = 1;
					break;
				}else{
					var mobile = $('.editAddress1 .mobile').val();
					if (myreg.test(mobile)&& mobile.length == 11) {
						flag = 0;
					}else{
						flag = 1;
					}
				}
				
				if(flag == 0){
					$('.save-use').hide();
					$('.save-useMask').show();
				}else{
					$('.save-use').show();
					$('.save-useMask').hide();
				}
			};
		};
		CanBeSave0();



		$('.val').on("input propertychange",function(){
			CanBeSave0();
		});
		
		
		$('.save-useMask').on('click',function(){
			$('.save-use').show();
			$('.save-useMask').hide();
			var phone = $('.editAddress1 .mobile').val();
			var name = $('.editAddress1 .name').val();
			var Bianma = $('.editAddress1 #value1').val();
			var Value = Bianma.split(',');
			var otherAddress = $('.editAddress1 .otherAddress').val();
			var isDefault = $('.xl-switch input').is(':checked');
			
			var data = {
				'token':token,
				'name':name,
				'phone':phone,
				'province' : Value[0],
				'city' : Value[1],
				'county' : Value[2],
				'address' : otherAddress,
				'isDefault' : isDefault
			}
			$.ajax({
				url: apiHost+'/diyapi/user/address/add',  
				type: 'POST',
				timeout: 0,
				async: true,
				data: data, 
				dataType: 'json',
				beforeSend: function() {
					//可加入loading的效果
				},
				success: function(data) {
					ADDress();
					if(tradeOrderId){
						var phone = $('.editAddress1 .mobile').val();
						var name = $('.editAddress1 .name').val();
						var address =  $('.editAddress1 .edit-address').find('._js-provincePicker').val();
						var addressCode =  $('.editAddress1 .edit-address').find('#value1').val();
						
						var province = address.split(',')[0];
						var city = address.split(',')[1];
						var county = address.split(',')[2];
						var otherAddress = $('.editAddress1 .otherAddress').val();
						var provinceCode = addressCode.split(',')[0];
						var cityCode = addressCode.split(',')[1];
						var countyCode = addressCode.split(',')[2];
			
						var id = data.data.id;
						//将数据存储到localStorage中
						localStorage.setItem("chooseAddressId",id);
						window.location.href='orderConfirm.html?channel='+channel+'&tradeOrderId='+tradeOrderId;
//						loadOrderComfirm();
					}else{
						mainView.router.back();
						loadMy();
					}
				},
				error: function(data) {
					console.log("地址修改失败")
				}
			})
		})
		
		//启动省市三级联动
		var area1 = new LArea();
		area1.init({
			'trigger': '#demo1', //触发选择控件的文本框，同时选择完毕后name属性输出到该位置
			'valueTo': '#value1', //选择完毕后id属性输出到该位置
			'keys': {
				id: 'value',
				name: 'text'
			}, //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
			'type': 2, //数据源类型
			'data': [provs_data, citys_data, dists_data]
		});
	}
	
	//新增收货地址+登录页面
	if (page.name === 'eiditAddressLogin') {
//		inputFouc();   //检测键盘是否弹起
		var myreg = /^1(3|4|5|7|8)\d{9}$/;
		var myApp = new Framework7({
			modalButtonOk: "确定",
		});
		
		//每一个input都需要有值，才能点击保存
		function CanBeSave1() {
			var length = $(".val").length;
			var flag = 0;
			for (var i = 0; i <length; i++) {
				var temp = $(".val").eq(i).val().length;
				if(temp == 0) {
					$('.save-use').show();
					$('.save-useMask').hide();
					flag = 1;
					break;
				}else{
					var mobile = $('.editAddress .mobile').val();
					if (myreg.test(mobile)&& mobile.length == 11) {
						flag = 0;
					}else{
						flag = 1;
					}
				}
				
				if(flag == 0){
					$('.save-use').hide();
					$('.save-useMask').show();
				}else{
					$('.save-use').show();
					$('.save-useMask').hide();
				}
			};
		};
		CanBeSave1();

		

		$('.val').on("input propertychange",function(){
			CanBeSave1();
		});
		
		$('.test-phone .userTelNum').on("input propertychange", function() {
			var time = 60;
			var userTelNum = $('.test-phone .userTelNum').val();
			if (myreg.test(userTelNum)) {
				if($('.sendingCode').hasClass('xl-act')){
					$('.sendingCode').removeClass('xl-act');
					$('.sendingCode').addClass('sendingCodeNow');
				}else{
					$('.sendingCode').addClass('sendingCodeNow');
				}
			}else{
				$('.sendingCode').addClass('xl-act');
				$('.sendingCode').removeClass('sendingCodeNow');
			}
			
		})	
		
		var timer60;
		$('.test-phone').on('click','.sendingCodeNow',function(){
			clearTimeout(timer60);
			var Num = $('.userTelNum').val();
			var data = {
				'mobile':Num
			};
			var Sending = function(data){
				var url,data,successFunc;
				url = apiHost+'/diyapi/user/login/code';
				successFunc = function(data){
					if(data.code==3002){
						layer.open({
						    content: '发送的太频繁了啦，请稍后再试！',
						    skin: 'msg',
						    time: 1 //1秒后自动关闭
						  });
						return false;
					}else if(data.code==3001){
						layer.open({
						    content: '发送失败，请重新发送验证码！',
						    skin: 'msg',
						    time: 1 //1秒后自动关闭
						  });
						return false;
					}else if(data.code== 200){
						$('.sendingCode').html('<i>60</i>&nbsp;S');
						$('.sendingCode').addClass('sendingCodeNow');
						$('.sendingCode').removeClass('xl-act');
						time = 60;
						timer60 = setInterval(function(){
							time--;
							$('.sendingCode i').text(time);
							if(time==1){
								$('.sendingCode').removeClass('xl-act');
								$('.sendingCode').addClass('sendingCodeNow');
								$('.sendingCode').html('发送验证码');
								clearTimeout(timer60);
								time = 60;
							}
						},1000)
						layer.open({
						    content: '正在发送验证码，请稍后',
						    skin: 'msg',
						    time: 1 //1秒后自动关闭
						});
					}
				};
				loadData(url,successFunc,data);
			}
			Sending(data);
		})
		
		$('.save-useMask').on('click',function(){
			$('.save-use').show();
			$('.save-useMask').hide();
			//地址信息
			var phone = $('.editAddress .mobile').val();
			var name = $('.editAddress .name').val();
			var Bianma = $('.editAddress #value1').val();
			var Value = Bianma.split(',');
			var otherAddress = $('.editAddress .otherAddress').val();
			var isDefault = $('.xl-switch input').is(':checked');
			//验证信息
			var userTelNum = $('.editAddress .userTelNum').val();
			var userCode = $('.editAddress .userCode').val();
			var temporaryToken = getCookie('temporaryToken');//临时token
			if(userCode==''){
			$('.bindNow button').attr("disabled",'disabled');
				layer.open({
				    content: '请输入验证码！',
				    skin: 'msg',
				    time: 1 //1秒后自动关闭
				  });
			}
			var data = {
				'code':userCode,
				'mobile':userTelNum,
				'channel':channel,
				'token':temporaryToken
			}
			var sendCode = function(data){
			var url,data,successFunc;
			url = apiHost+'/diyapi/user/login';
			successFunc = function(data){
				if(data.code== 3011){
					layer.open({
					    content: '验证码不存在或已失效，请重新发送！',
					    skin: 'msg',
					    time: 1 //1秒后自动关闭
					  });
					  $('.sendCode').removeClass('codeTimeOut');
						$('.sendCode').html('发送验证码');
						time = 60;
						layer.open({
						    content: '校验失败，请输入正确的验证码！',
						    skin: 'msg',
						    time: 1 //1秒后自动关闭
						  });
					return false;
				}else if(data.code==3013){
					layer.open({
					    content: '验证码验证错误超过次数限制，请1分钟后重试',
					    skin: 'msg',
					    time: 1 //2秒后自动关闭
					  });
					  
					$('.sendCode').removeClass('codeTimeOut');
					$('.sendCode').html('发送验证码');
					time = 60;
					layer.open({
					    content: '校验失败，请输入正确的验证码！',
					    skin: 'msg',
					    time: 1 //1秒后自动关闭
					  });  
					return false;
				}else if(data.code== 3012){
					setTimeout(function(){
						$('.sendCode').removeClass('codeTimeOut');
						$('.sendCode').html('发送验证码');
						time = 60;
						layer.open({
						    content: '校验失败，请输入正确的验证码！',
						    skin: 'msg',
						    time: 1 //1秒后自动关闭
						  });
						  
						return false;
					},100)
				}else if(data.code== 200){
					
//					if (data.data.isFirstLogin) {
//						TDH5SDK.account.register(data.data.easeUsername);  //talkingData统计注册
//					} else{
//						TDH5SDK.account.login(data.data.easeUsername);    //talkingData统计登录
//					}
//					
					//登录成功后，后端返回token，将token存入cookie  
					token = data.data.token;
					setCookie('token',token,10);
					var data = {
						'token':token,
						'name':name,
						'phone':phone,
						'province' : Value[0],
						'city' : Value[1],
						'county' : Value[2],
						'address' : otherAddress,
						'isDefault' : isDefault
					}
					$.ajax({
						url: apiHost+'/diyapi/user/address/add',  
						type: 'POST',
						timeout: 0,
						async: true,
						data: data, 
						dataType: 'json',
						beforeSend: function() {
							//可加入loading的效果
						},
						success: function(data) {
							ADDress();
							if(tradeOrderId){
								var phone = $('.editAddress .mobile').val();
								var name = $('.editAddress .name').val();
								var address =  $('.editAddress .edit-address').find('._js-provincePicker').val();
								var addressCode =  $('.editAddress .edit-address').find('#value1').val();
								
								var province = address.split(',')[0];
								var city = address.split(',')[1];
								var county = address.split(',')[2];
								var otherAddress = $('.editAddress .otherAddress').val();
								var provinceCode = addressCode.split(',')[0];
								var cityCode = addressCode.split(',')[1];
								var countyCode = addressCode.split(',')[2];
					
								var id = data.data.id;
								//将数据存储到localStorage中
								localStorage.setItem("chooseAddressId",id);
								window.location.href='orderConfirm.html?channel='+channel+'&tradeOrderId='+tradeOrderId;
		//						loadOrderComfirm();
							}else{
								mainView.router.back();
								loadMy();
							}
						},
						error: function(data) {
							console.log("地址修改失败")
						}
					})
				}
			};
			loadData(url,successFunc,data);
		}
		sendCode(data);
		})
		
		//启动省市三级联动
		var area1 = new LArea();
		area1.init({
			'trigger': '#demo1', //触发选择控件的文本框，同时选择完毕后name属性输出到该位置
			'valueTo': '#value1', //选择完毕后id属性输出到该位置
			'keys': {
				id: 'value',
				name: 'text'
			}, //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
			'type': 2, //数据源类型
			'data': [provs_data, citys_data, dists_data]
		});
	}
	
	
	
	//修改收货地址页面
	if (page.name === 'modifyAddress') {
//		inputFouc();   //检测键盘是否弹起
		var myreg = /^1(3|4|5|7|8)\d{9}$/;
		var myApp = new Framework7({
			modalButtonOk: "确定",
		});
		
		//获取localStorage中缓存的数据
		var id = localStorage.getItem("id"),
		name = localStorage.getItem("name"),
		phone = localStorage.getItem("phone"),
		province = localStorage.getItem("province"),
		city = localStorage.getItem("city"),
		county = localStorage.getItem("county"),
		provinceCode = localStorage.getItem("provinceCode"),
		cityCode = localStorage.getItem("cityCode"),
		countyCode = localStorage.getItem("countyCode"),
		address = localStorage.getItem("address"),
		isDefault = localStorage.getItem("isDefault");
		//默认值
		$('.modifyAddress .edit-address').find('.name').val(name);
		$('.modifyAddress .edit-address').find('.mobile').val(phone);
		$('.modifyAddress .edit-address').find('._js-provincePicker').val(province+','+city+','+county);
		$('.modifyAddress .edit-address').find('#value1').val(provinceCode+','+cityCode+','+countyCode);
		$('.modifyAddress .edit-address').find('.otherAddress').val(address);
		if(isDefault == 'true'){
			$('.xl-switch input[type=checkbox]').attr('checked','checked')
			$('.xl-checkSlide').css('-webkit-transform','translateX(0.4rem)')
    		$('.xl-checkbox').addClass('xl-checkBox-active')
		}else{
			$('.xl-switch input[type=checkbox]').removeAttr('checked')
			$('.xl-checkSlide').css('-webkit-transform','translateX(0rem)')
    		$('.xl-checkbox').removeClass('xl-checkBox-active')
		}
		
		//每一个input都需要有值，才能点击保存
		function CanBeSave2() {
			var length = $(".val").length;
			var flag = 0;
			for (var i = 0; i <length; i++) {
				var temp = $(".val").eq(i).val().length;
				if(temp == 0) {
					$('.save-use').show();
					$('.save-useMask').hide();
					flag = 1;
					break;
				}else{
					var mobile = $('.modifyAddress .mobile').val();
					if (myreg.test(mobile) && mobile.length == 11) {
						flag = 0;
					}else{
						flag = 1;
					}
				}
				if(flag == 0){
					$('.save-use').hide();
					$('.save-useMask').show();
				}else{
					$('.save-use').show();
					$('.save-useMask').hide();
				}
			};
			
			
		};
		CanBeSave2();

		$('.val').on("input propertychange",function(){
			CanBeSave2();
		});
		
		
		
		$('.save-useMask').on('click',function(){
			$('.save-use').show();
			$('.save-useMask').hide();
			window.localStorage.removeItem('isDefault');
			var phone = $('.modifyAddress .mobile').val();
			var name = $('.modifyAddress .name').val();
			var Bianma = $('.modifyAddress #value1').val();
			var Value = Bianma.split(',');
			var otherAddress = $('.modifyAddress .otherAddress').val();
			var isDefault = $('.xl-switch input').is(':checked');
			
			var data = {
				'id':id,
				'token':token,
				'name':name,
				'phone':phone,
				'province' : Value[0],
				'city' : Value[1],
				'county' : Value[2],
				'address' : otherAddress,
				'isDefault' : isDefault
			}
			addSendBack(data,apiHost+'/diyapi/user/address/modify')
			mainView.router.back();
			if(GetQueryString(tradeOrderId)){
				loadOrderComfirm();
			}
			
		})
		
		//启动省市三级联动
		var area1 = new LArea();
		area1.init({
			'trigger': '#demo1', //触发选择控件的文本框，同时选择完毕后name属性输出到该位置
			'valueTo': '#value1', //选择完毕后id属性输出到该位置
			'keys': {
				id: 'value',
				name: 'text'
			}, //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
			'type': 2, //数据源类型
			'data': [provs_data, citys_data, dists_data]
		});
	}
	
	
	//保存并使用收货地址页面
	if (page.name === 'useAddress') {
//		inputFouc();   //检测键盘是否弹起
		var myreg = /^1(3|4|5|7|8)\d{9}$/;
		var myApp = new Framework7({
			modalButtonOk: "确定",
		});
		//获取localStorage中缓存的数据
		var id = localStorage.getItem("id"),
		name = localStorage.getItem("name"),
		phone = localStorage.getItem("phone"),
		province = localStorage.getItem("province"),
		city = localStorage.getItem("city"),
		county = localStorage.getItem("county"),
		provinceCode = localStorage.getItem("provinceCode"),
		cityCode = localStorage.getItem("cityCode"),
		countyCode = localStorage.getItem("countyCode"),
		address = localStorage.getItem("address"),
		isDefault = localStorage.getItem("isDefault");
		if(isDefault == 'true'){
			$('.xl-switch input[type=checkbox]').attr('checked','checked')
			$('.xl-checkSlide').css('-webkit-transform','translateX(0.4rem)')
    		$('.xl-checkbox').addClass('xl-checkBox-active')
		}else{
			$('.xl-switch input[type=checkbox]').removeAttr('checked')
			$('.xl-checkSlide').css('-webkit-transform','translateX(0rem)')
    		$('.xl-checkbox').removeClass('xl-checkBox-active')
		}
			
		//默认值
		$('.modifyAddress .edit-address').attr('data-id',id)
		$('.modifyAddress .edit-address').find('.name').val(name);
		$('.modifyAddress .edit-address').find('.mobile').val(phone);
		$('.modifyAddress .edit-address').find('._js-provincePicker').val(province+','+city+','+county);
		$('.modifyAddress .edit-address').find('._js-provincePicker').attr('data-province',province);
		$('.modifyAddress .edit-address').find('._js-provincePicker').attr('data-city',city);
		$('.modifyAddress .edit-address').find('._js-provincePicker').attr('data-county',county);
		$('.modifyAddress .edit-address').find('#value1').val(provinceCode+','+cityCode+','+countyCode);
		$('.modifyAddress .edit-address').find('#value1').attr('data-provinceCode',provinceCode);
		$('.modifyAddress .edit-address').find('#value1').attr('data-cityCode',cityCode);
		$('.modifyAddress .edit-address').find('#value1').attr('data-countyCode',countyCode);
		$('.modifyAddress .edit-address').find('.otherAddress').val(address);
		
		//每一个input都需要有值，才能点击保存
		function CanBeSave3() {
			var length = $(".val").length;
			var flag = 0;
			for (var i = 0; i <length; i++) {
				var temp = $(".val").eq(i).val().length;
				if(temp == 0) {
					$('.save-use').show();
					$('.save-useMask').hide();
					flag = 1;
					break;
				}else{
					var mobile = $('.modifyAddress .mobile').val();
					if (myreg.test(mobile) && mobile.length == 11) {
						flag = 0;
					}else{
						flag = 1;
					}
				}
				if(flag == 0){
					$('.save-use').hide();
					$('.save-useMask').show();
				}else{
					$('.save-use').show();
					$('.save-useMask').hide();
				}
			};
			
			
		};
		CanBeSave3();

		$('.val').on("input propertychange",function(){
			CanBeSave3();
		});
		

		$('.save-useMask').on('click',function(){
			$('.save-use').show();
			$('.save-useMask').hide();
			window.localStorage.removeItem('isDefault');
			var phone = $('.modifyAddress .mobile').val();
			var name = $('.modifyAddress .name').val();
			var Bianma = $('.modifyAddress #value1').val();
			var Value = Bianma.split(',');
			var otherAddress = $('.modifyAddress .otherAddress').val();
			var isDefault = $('.xl-switch input').is(':checked');
			
			var data = {
				'id':id,
				'token':token,
				'name':name,
				'phone':phone,
				'province' : Value[0],
				'city' : Value[1],
				'county' : Value[2],
				'address' : otherAddress,
				'isDefault' : isDefault
			}
			$.ajax({
				url: apiHost+'/diyapi/user/address/modify', 
				type: 'POST',
				timeout: 0,
				async: true,
				data: data, 
				dataType: 'json',
				beforeSend: function() {
					//可加入loading的效果
				},
				success: function(data) {
					var id = $('.modifyAddress .edit-address').attr("data-id");
		
					//将数据存储到localStorage中
					localStorage.setItem("chooseAddressId",id);
					
					window.location.href='orderConfirm.html?channel='+channel+'&tradeOrderId='+tradeOrderId;
					
				},
				error: function(data) {
					console.log("地址修改失败")
				}
			})
		})
		
		//启动省市三级联动
		var area1 = new LArea();
		area1.init({
			'trigger': '#demo1', //触发选择控件的文本框，同时选择完毕后name属性输出到该位置
			'valueTo': '#value1', //选择完毕后id属性输出到该位置
			'keys': {
				id: 'value',
				name: 'text'
			}, //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
			'type': 2, //数据源类型
			'data': [provs_data, citys_data, dists_data]
		});
	}
	
	
	
	//收货地址列表
	if (page.name === 'address') {
		$('.address').on('click','.deleteAddr',function(){
		    var id = $(this).parents('.order-address').attr('data-id');
		    layer.open({
		    content: '确定删除该收货地址吗？'
		    ,btn: ['删除', '取消']
		    ,yes: function(index){
				var isDefault = $(this).parent('.order-address').attr('data-isDefault');
				var data = {
					'id':id,
				}
				addSendBack(data,apiHost+'/diyapi/user/address/delete');
				$(this).parents('.order-address').hide();
				layer.close(index);
		    }
		})
	})
		
		//设为默认地址
		$('.pages .address').on('click','.isDefault',function(){
			var id = $(this).parents('.order-address').attr("data-id");
			var elem = $(this).parents('.order-address');
				elem.attr("data-isDefault","true");
			$(this).parents('.order-address').siblings('.order-address').attr("data-isDefault","false");
			if($(this).parents('.order-address').attr('data-isDefault')=="true"){
				$(this).find('._fm-check-1').addClass('active-choose').parents('.order-address').siblings('.order-address').find('._fm-check-1').removeClass('active-choose');
				$(this).parents('.order-address').find('.name').css('color','#ff5252').parents('.order-address').siblings('.order-address').find('.name').css('color','#575757');
				$(this).parents('.order-address').find('.mobile').css('color','#ff5252').parents('.order-address').siblings('.order-address').find('.mobile').css('color','#575757');
			}else{
				$(this).find('._fm-check-1').removeClass('active-choose').parents('.order-address').siblings('.order-address').find('._fm-check-1').addClass('active-choose');
				$(this).parents('.order-address').find('.name').css('color','#575757').parents('.order-address').siblings('.order-address').find('.name').css('color','#ff5252');
				$(this).parents('.order-address').find('.mobile').css('color','#575757').parents('.order-address').siblings('.order-address').find('.mobile').css('color','#ff5252');
			}
			var isDefault = $(this).parents('.order-address').attr('data-isDefault');
			var data = {
				'id':id,
				'isDefault':isDefault
			}
			$.ajax({
				url: apiHost+'/diyapi/user/address/modify', 
				type: 'POST',
				timeout: 0,
				async: true,
				data: data, 
				dataType: 'json',
				beforeSend: function() {
					//可加入loading的效果
				},
				success: function(data) {
				},
				error: function(data) {
					console.log("地址修改失败")
				}
			})
			return
		})
		
		$('.pages .address').on('click','.editAddr',function(){
			var phone = $(this).parents('.order-address').find('.mobile').text();
			var name = $(this).parents('.order-address').find('.name').text();
			var province = $(this).parents('.order-address').find('.province').text();
			var city = $(this).parents('.order-address').find('.city').text();
			var county = $(this).parents('.order-address').find('.county').text();
			var otherAddress = $(this).parents('.order-address').find('.aDDress').text();
			var isDefault = $(this).parents('.order-address').attr('data-isDefault');
			var provinceCode = $(this).parents('.order-address').find('.province').attr("data-add");
			var cityCode = $(this).parents('.order-address').find('.city').attr("data-add");
			var countyCode = $(this).parents('.order-address').find('.county').attr("data-add");
			var isDefault = $(this).parents('.order-address').find('.isDefault').attr("data-isDefault");
			if($(this).siblings('.isDefault').find('.de').hasClass('active-choose')){
				localStorage.setItem("isDefault",true);
			}else{
				localStorage.setItem("isDefault",false);
			}
			
			var id = $(this).parents('.order-address').attr("data-id");

			//将数据存储到localStorage中
			localStorage.setItem("id",id);
			localStorage.setItem("name",name);
			localStorage.setItem("phone",phone);
			localStorage.setItem("province",province);
			localStorage.setItem("city",city);
			localStorage.setItem("county",county);
			localStorage.setItem("provinceCode",provinceCode);
			localStorage.setItem("cityCode",cityCode);
			localStorage.setItem("countyCode",countyCode);
			localStorage.setItem("address",otherAddress);
			
			
		})
		
	}
	
	
	//选择收货地址页面
if (page.name === 'chooseAddress') {
		chooseAddress();
		//设为收货地址
		$('.pages .address').on('click','.msg',function(){
			var id = $(this).parents('.order-address').attr("data-id");
			var phone = $(this).parents('.order-address').find('.mobile').text();
			var name = $(this).parents('.order-address').find('.name').text();
			var province = $(this).parents('.order-address').find('.province').text();
			var city = $(this).parents('.order-address').find('.city').text();
			var county = $(this).parents('.order-address').find('.county').text();
			var otherAddress = $(this).parents('.order-address').find('.aDDress').text();
			var provinceCode = $(this).parents('.order-address').find('.province').attr("data-add");
			var cityCode = $(this).parents('.order-address').find('.city').attr("data-add");
			var countyCode = $(this).parents('.order-address').find('.county').attr("data-add");
			$(this).parents('.order-address').find('.AddressChooseIcon').show().parents('.order-address').siblings('.order-address').find('.AddressChooseIcon').hide();
			$(this).parents('.order-address').find('.msg').addClass('chooseActive').parents('.order-address').siblings('.order-address').find('.msg').removeClass('chooseActive');
			
			//将数据存储到localStorage中
			localStorage.setItem("chooseAddressId",id);
//			loadOrderComfirm();
			window.location.href='orderConfirm.html?channel='+channel+'&tradeOrderId='+tradeOrderId;
		})
		
		$('.pages .address').on('click','.editAddr',function(){
			var isDefault = $(this).parents('.order-address').attr('data-isdefault')
			window.localStorage.setItem('isDefault',isDefault)
			
			var phone = $(this).parents('.order-address').find('.mobile').text();
			var name = $(this).parents('.order-address').find('.name').text();
			var province = $(this).parents('.order-address').find('.province').text();
			var city = $(this).parents('.order-address').find('.city').text();
			var county = $(this).parents('.order-address').find('.county').text();
			var otherAddress = $(this).parents('.order-address').find('.aDDress').text();
			var isDefault = $(this).parents('.order-address').attr('data-isDefault');
			var provinceCode = $(this).parents('.order-address').find('.province').attr("data-add");
			var cityCode = $(this).parents('.order-address').find('.city').attr("data-add");
			var countyCode = $(this).parents('.order-address').find('.county').attr("data-add");
//			var isDefault = $(this).parents('.order-address').find('.isDefault').attr("data-isDefault");
			var id = $(this).parents('.order-address').attr("data-id");

			//将数据存储到localStorage中
			localStorage.setItem("id",id);
			localStorage.setItem("name",name);
			localStorage.setItem("phone",phone);
			localStorage.setItem("province",province);
			localStorage.setItem("city",city);
			localStorage.setItem("county",county);
			localStorage.setItem("provinceCode",provinceCode);
			localStorage.setItem("cityCode",cityCode);
			localStorage.setItem("countyCode",countyCode);
			localStorage.setItem("address",otherAddress);
//			localStorage.setItem("isDefault",isDefault);
		})
	}

		//物流追踪页面
		if (page.name === 'expressTracking') {
			var data = {
				'tradeOrderId':tradeOrderId,
				'token':token
			}
			loadExpress(data);
			var loadExpress = function(data) {
				$('.hd-noLoad').show();
				var url, successFunc, dataBox;
				url = apiHost+'/diyapi/trade/order/trace';
				successFunc = function(data) {
					if (data.code == 200) {
						var data = data.data;
						dataBox="";
						dataBox ='<div class="expressConHead"><img src="'+ data.companyLogo +'" alt="快递图片" /></div><div class="expressCon"><div class="expressName">物流公司：<i>'
								+ (data.expressCompany||"") +'</i></div><div class="expressNum">物流单号：<span>'+ (data.expressNo||"") +'</span><textarea rows="1" cols="20" id="expressNum" >'
								+ (data.expressNo||"") +'</textarea><input type="button" class="copy" onClick="copy()" value="复制" /><div class="textMask">'+ (data.expressNo||"") +'</div></div></div>'
						$('.expressTracking-msg').empty().append(dataBox);
						
						dataBox = "";
						var traceList = data.traceList;
						$.each(traceList, function(i) {
							dataBox += '<li><div class="tracking"><i class="pointBox"></i><i class="line"></i></div><div class="expProcess"><p class="processText">'
										+ traceList[i].station +' </p><p class="processTime">'+ traceList[i].time +' </p></div></li>'
						})
						$('.expressList ul').empty().append(dataBox);
						
						//动态获取左边线的长度
						var aLi = $('.expressList ul li');
						for (var i = 0; i < aLi.size(); i++) {
							var liHeight = aLi.eq(i).height();
							$('.tracking .line').eq(i).css("height", liHeight)
						}
						//物流状态
						if(data.state==3){
							$('.expressList ul li').eq(0).find('.pointBox').css("background-image","url(img/recive.png)")
						}
						if(data.state==2 ||data.state==4){
							$('.expressList ul li').eq(0).find('.pointBox').css("background-image","url(img/now.png)")
						}
						
						$('.hd-noLoad').hide();
					}
				};
				loadData(url, successFunc,data);
			}
			
		}
		
		
		//代理"我的账户"页面
		if (page.name === 'agentAccount') {
			$('.toolbar').hide();
			var data = {
				'token':token
			};
			var loadAgentAccount = function(data){
				$('.hd-noLoad').show();
				var url, successFunc, dataBox;
				url = apiHost+'/diyapi/user/profit/detail';
				successFunc = function(data) {
					if (data.code == 200) {
//						var balance = toDecimal2(data.data.balance);
						var cashableBalance = toDecimal2(data.data.cashableBalance);
						$('#agentAccount .totalMoney .cashNum').text(cashableBalance)
						$('.hd-noLoad').hide();
					}
				}
				loadData(url, successFunc,data);
			}
			loadAgentAccount(data);
			
			$('body').on('click','.cashDetail',function(){
				mainView.router.loadPage('transDetails.html');
			})
			
		}
		
		//代理提现页面
		if (page.name === 'withdrawals') {
			$('.toolbar').hide();
//			var agentMoney = localStorage.getItem('agentMoney');
//			if (agentMoney == 1) {
//				
//			}else{
//				$('body .navbar-inner').find('.back').removeClass('agentMoneyBack');
//				localStorage.removeItem('agentMoney');
//			}
			$('body').on('click','.agentMoneyBack',function(){
				$('body .navbar-inner').find('.back').addClass('agentMoneyBack')
				localStorage.removeItem('agentMoney');
				mainView.router.back();
				$('.toolbar').show();
			})
			$('body').on('click','.withTips',function(){
				layer.open({
					content: '订单确认收货后，15天后未退款的订单，订单方可转入已结算收益，已结算的订单收益金额转入账户余额~',
					btn: '好的',
					shadeClose: false,
					yes: function(index) {
						layer.close(index);
					}
				});
			})
			
			var loadWithdrawals = function(data){
				$('.hd-noLoad').show();
				var data = {
					'token':token
				};
				var url, successFunc, dataBox;
				url = apiHost+'/diyapi/user/profit/detail';
				successFunc = function(data) {
					if (data.code == 200) {
						$('.hd-noLoad').hide();
						var cashableBalance = toDecimal2(data.data.cashableBalance);
						var cashedAmount = toDecimal2(data.data.cashedAmount);
						var uncashableBalance = toDecimal2(data.data.uncashableBalance);
						$('.withdrawals-top .canBeTake').text(cashableBalance);
						$('.withdrawals-top .takeMoneyBox .isTaked p').text(cashedAmount);
						$('.withdrawals-top .takeMoneyBox .willBeTake p').text(uncashableBalance);
						if($('.withdrawalsListTab span').eq(0).hasClass('active')){
							$('body .uncashableProfitList').show();
							$('body .cashableProfitList').hide();
						}else{
							$('body .uncashableProfitList').hide();
							$('body .cashableProfitList').show();
						}
						
						dataBox = '';
						var uncashableProfitList = data.data.uncashableProfitList;
						$.each(uncashableProfitList, function(i) {
							var month = uncashableProfitList[i].month;
							var profitAmount = toDecimal2(uncashableProfitList[i].profitAmount);
							dataBox += '<li class="moneyDetail" data-status="0" data-month="'+ month +'"><div class="monthLeft"><div class="monthTime">'+ month.split('-')[0] +'年'+ month.split('-')[1] +'月</div><div class="monthKind">未结算收益</div></div><div class="monthright">+'
									+ profitAmount +'<i class="goRight"></i></div></li>'
						});
						$('body .uncashableProfitList').empty().append(dataBox);
						
						dataBox = '';
						var cashableProfitList = data.data.cashableProfitList;
						$.each(cashableProfitList, function(i) {
							var month = cashableProfitList[i].month;
							var profitAmount = toDecimal2(cashableProfitList[i].profitAmount);
							dataBox += '<li class="moneyDetail" data-status="1" data-month="'+ month +'"><div class="monthLeft"><div class="monthTime">'+ month.split('-')[0] +'年'+ month.split('-')[1] +'月</div><div class="monthKind">已结算收益</div></div><div class="monthright">+'
									+ profitAmount +'<i class="goRight"></i></div></li>'
						});
						$('body .cashableProfitList').empty().append(dataBox);
						
						
						$('body').on('click','.withdrawalsListTab span',function(){
							$('.withdrawalsListTab span').removeClass('active')
							$(this).addClass('active');
							if($('.withdrawalsListTab span').eq(0).hasClass('active')){
								$('body .uncashableProfitList').show();
								$('body .cashableProfitList').hide();
							}else{
								$('body .uncashableProfitList').hide();
								$('body .cashableProfitList').show();
							}
						})
						$('.hd-noLoad').hide();
					}
				}
				loadData(url, successFunc,data);
			}
			loadWithdrawals();
			
			//代理商 “日收益明细”
			$('#view-3').on('click','.moneyDetail',function(){
				var month = $(this).attr('data-month');
				setCookie('month',month);
				var status = $(this).attr('data-status');
				setCookie('status',status);
				mainView.router.loadPage('dayCash.html');
			})
			
			//点击“立即提现”
			$('body').on('click','.takeNow',function(){
				if($('.withdrawals-top .canBeTake').text() == 0 ||$('.withdrawals-top .canBeTake').text() == null){
					layerHint('您的可提现余额不足以提现哦，赶紧先去推广赚钱吧！');
					return;
				}else{
					mainView.router.loadPage('takeCash.html');
				}
			})
		}
		
		
			//代理日收益
		if (page.name === 'dayCash') {
			$('.hd-noLoad').show();
			var month = getCookie('month');
			setCookie('month',month,-1);
			var status = getCookie('status');
			setCookie('status',status,-1);
			var data = {
				'token':token,
				'month':month,
				'status':status
			}
			var url, successFunc, dataBox, dataBox1;
			url = apiHost+'/diyapi/user/profit/month/detail';
//			url = 'http://192.168.1.249:9081/diyapi/user/profit/month/detail';
			successFunc = function(data){
				if (data.code == 200) {
					var sumAmount = toDecimal2(data.data.sumAmount);
					var month = data.data.month;
					$('.dayCashTop .dayCashNum h1').text(sumAmount);
					$('.dayCashTop .dayCashNum p').text(month);
					var profitDailyList = data.data.profitDailyList;
					var dataBox = '';
					$.each(profitDailyList, function(i) {
						var date = profitDailyList[i].date;
						var profitAmount = toDecimal2(profitDailyList[i].profitAmount);
						var profitList = profitDailyList[i].profitList;
						dataBox += '<div class="dayaItem"><div class="dayTitle"><span>'+ date +'</span><span>共计'+ profitAmount +'元</span></div><ul>'
						$.each(profitList, function(j) {
							var intro = profitList[j].intro;
							var createTime = (profitList[j].createTime).split(' ')[1];
							var saleAmount = toDecimal2(profitList[j].saleAmount);
							var profitAmount = toDecimal2(profitList[j].profitAmount);
							dataBox += '<li><div class="dayLeft"><div class="dayTime">'+ intro +'</div><div class="dayKind"><span>'+ createTime +'</span><span>￥'+ saleAmount +'</span></div></div><div class="dayight" style="color:#00b900">+'+ profitAmount +'<i class="goRight"></i></div></li>'
						});
						dataBox += '</ul></div>'
					});
					$('body .dayCash-list').empty().append(dataBox);
					$('.hd-noLoad').hide();
				}
			}
			loadData(url, successFunc,data);
		}
		
		
		//代理"马上提现"页面
		if (page.name === 'takeCash') {
			$('.tabbar').css('z-index',4999);
			$('.toolbar').hide();
			if(devicePlatform == 'android') {
				inputFouc();   //检测键盘是否弹起
			}
			var Takelength = $('#withdrawals .withdrawals-top .canBeTake').length;
			var all = $('#withdrawals .withdrawals-top .canBeTake').eq(Takelength-1).text();
			var dataBox = '可提现余额￥'+ all +'<span class="allTake">全部提现</span>';
			$('.takeDetail .remain').empty().append(dataBox)
			$('.takeDetail .remain').on('click','.allTake',function(){
				$('.takeDetail .inputCash').val(all);
			})
			
			
			//选择付款方式
			$('body').on('click','.chooseChannel .pay-method .method-elem',function(){
				$(this).addClass('active').siblings('.method-elem').removeClass('active');
			})
			
			$('#takeCash').on('click','.confirming',function(){
				var amount = $('#takeCash .inputCash').val();
				var cash = toDecimal2(Number($('.takeDetail .inputCash').val()));
				if (cash == '0.00') {
					layerHint('您的提现金额不能少于0哦！');
					return;
				} else if(cash == '' || cash == 'false'){
					layerHint('您的提现金额不能为空哦！');
					return;
				}else if(Number(amount) > Number(all)){
					layerHint('您的提现金额不能超过'+ all +'元哦！');
					$('#takeCash .inputCash').val('');
					return;
				}else{
					var url,data,successFunc;
					url = apiHost+'/diyapi/user/agency/info';
					data = {
						'token':token
					};
					successFunc = function(data){
						if(data.code == 200){
							var withdrawChannel;
							var len = $('#takeCash .pay-method .method-elem').length;
							for(var i=0;i<len;i++){
								if ($('#takeCash .pay-method .method-elem').eq(i).hasClass('active')) {
									withdrawChannel = $('#takeCash .pay-method .method-elem').eq(i).attr('data-method');
								}
							}
							if(withdrawChannel == 'wx'){
								if (data.data.isBindWx == false) {
									layerHint('您还没有绑定微信哦，赶紧去绑定吧！');
									setTimeout(function(){
										if (data.data.isBindAliapy == false && data.data.isBindWx == false) {
											localStorage.setItem('bind','both');
											mainView.router.loadPage('bindWithdrawAcount.html');
										} else if(data.data.isBindAliapy == false && data.data.isBindWx == true){
											localStorage.setItem('bind','Aliapy');
											mainView.router.loadPage('bindWithdrawAcount.html');
										}else if(data.data.isBindAliapy == true && data.data.isBindWx == false){
											localStorage.setItem('bind','wx');
											mainView.router.loadPage('bindWithdrawAcount.html');
										}
									},1000)
								} else{
									mainView.router.loadPage('smsCheck.html');
								}
							}else if(withdrawChannel == 'alipay'){
								if (data.data.isBindAliapy == false) {
										layerHint('您还没有绑定支付宝哦，赶紧去绑定吧！');
										setTimeout(function(){
											if (data.data.isBindAliapy == false && data.data.isBindWx == false) {
												localStorage.setItem('bind','both');
												mainView.router.loadPage('bindWithdrawAcount.html');
											} else if(data.data.isBindAliapy == false && data.data.isBindWx == true){
												localStorage.setItem('bind','Aliapy');
												mainView.router.loadPage('bindWithdrawAcount.html');
											}else if(data.data.isBindAliapy == true && data.data.isBindWx == false){
												localStorage.setItem('bind','wx');
												mainView.router.loadPage('bindWithdrawAcount.html');
											}
										},1000)
								} else{
									mainView.router.loadPage('smsCheck.html');
								}
							}
						}
					}
					loadData(url,successFunc,data)
				}
			})
			
			$('body').on('click','.takeCa',function(){
				$('.tabbar').css('z-index',5001);
				$('.toolbar').show();
			})
		}
		
		
		//绑定提现账号 页面
		if(page.name == 'bindWithdrawAcount'){
			$('.tabbar').css('z-index',4999);
			$('.toolbar').hide();
			var dataBox,dataBox1,bind;
			bind = localStorage.getItem('bind');
			localStorage.removeItem('bind');
			if(bind == 'Aliapy'){
				dataBox = '<li class="method-elem active" data-method="alipay"><img class="ico" src="img/zhifubao.png" alt="支付宝"><div class="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1>支付宝支付</h1></div></li>'
				dataBox1 = '<input type="text" name="" id="" placeholder="请输入需要绑定的支付宝账号" />';
			}else if(bind == 'wx'){
				dataBox = '<li class="method-elem active" data-method="wx"><img class="ico" src="img/wechat.png" alt="微信"><div class="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1>微信支付</h1></div></li>'
				dataBox1 = '<input type="text" name="" id="" placeholder="请输入需要绑定的微信账号" />';
			}else {
				dataBox = '<li class="method-elem active" data-method="wx"><img class="ico" src="img/wechat.png" alt="微信"><div class="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1>微信支付</h1></div></li><li class="method-elem" data-method="alipay"><img class="ico" src="img/zhifubao.png" alt="支付宝"><div class="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1>支付宝支付</h1></div></li>'
				dataBox1 = '<input type="text" name="" id="" placeholder="请输入需要绑定的支付宝账号或者微信账号" />'
			}
			$('#bindWithdrawAcount .pay-method').empty().append(dataBox);
			$('#bindWithdrawAcount .bindNum div').empty().append(dataBox1);
			var method;
			$('#bindWithdrawAcount .bindNum input').on('input propertychange',function(){
				var value = $('#bindWithdrawAcount .bindNum input').val();
				var len = $('#bindWithdrawAcount .pay-method .method-elem').length;
				for (var i=0;i<len;i++) {
					if($('#bindWithdrawAcount .pay-method .method-elem').eq(i).hasClass('active')){
						method = $('#bindWithdrawAcount .pay-method .method-elem').eq(i).attr('data-method');
					}
				}
//				if(method == 'alipay'){
//					var pattern1 = '/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/';
//					var pattern2 = '/^0?(13[0-9]|15[012356789]|18[0123456789]|14[0123456789]|17[0123456789])[0-9]{8}$/';
//					if (pattern1.test(value) && pattern2.test(value)){
//						console.log('弹窗')
//					 } else {
//						 layerHint("请输入正确的支付宝账号！")
//						 return;
//					 }
//				}else if(method == 'wx'){
//					var pattern = '/^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}+$/';
//					if (/^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}+$/.test(value)){
//						console.log('弹窗')
//					 } else {
//						 layerHint("请输入正确的微信账号！")
//						 return;
//					 }
//				}
			})
			
			$('#bindWithdrawAcount').on('click','.next button',function(){
				var value1 = $('#bindWithdrawAcount .bindNum input').val();
				var value2 = $('#bindWithdrawAcount .confirmBindNum input').val();
				if (value1 == value2) {
					
					$('#bindWithdrawAcount .bindLayer').show();
					$('#bindWithdrawAcount .mask').show();
					var mobile = $('#view-3 .userPhoneNum').attr('data-mobile')
					$('#bindWithdrawAcount .bindLayer .telNum').text('+86 '+mobile);
					if(devicePlatform == 'android') {
						inputFouc();   //检测键盘是否弹起
					}
					//发送验证码
					var timer60;
					var smsSending = function(data){
						var url,data,successFunc;
						url = apiHost+'/diyapi/user/login/code';
						successFunc = function(data){
							if(data.code==3002){
								layerHint('发送的太频繁了啦，请稍后再试！')
								return false;
							}else if(data.code==3001){
							  	layerHint('发送失败，请重新发送验证码！')
								return false;
							}else if(data.code== 200){
								$('#bindWithdrawAcount .getCode').html('<i>60</i>&nbsp;S');
								$('#bindWithdrawAcount .getCode').addClass('codeTimeOut');
								$('#bindWithdrawAcount .getCode').removeClass('getCoding');
								time = 60;
								timer60 = setInterval(function(){
									time--;
									$('#bindWithdrawAcount .codeTimeOut i').text(time);
									if(time==1){
										$('#bindWithdrawAcount .getCode').removeClass('codeTimeOut');
										$('#bindWithdrawAcount .getCode').addClass('getCoding');
										$('#bindWithdrawAcount .getCode').html('发送验证码');
										clearTimeout(timer60);
										time = 60;
									}
								},1000)
								layerHint('正在发送验证码，请稍后')
							}
						};
						loadData(url,successFunc,data);
					}
					
					//验证 验证码
					var smsChecking1 = function(data){
						var bindChannel = data.bindChannel;
						var url,data,successFunc;
						url = apiHost+'/diyapi/user/bind/account';
		//				url = 'http://192.168.1.249:9081/diyapi/user/withdraw';
						successFunc = function(data){
							if(data.code== 3011){
								layerHint('验证码不存在或已失效，请重新发送！')
								$('#bindWithdrawAcount .getCode').addClass('getCoding');
								$('#bindWithdrawAcount .getCode').html('发送验证码');
								time = 60;
								layerHint('校验失败，请输入正确的验证码！')
								return false;
							}else if(data.code==3013){
								  layerHint('验证码验证错误超过次数限制，请1分钟后重试');
								  $('#bindWithdrawAcount .getCode').addClass('getCoding');
								  $('#bindWithdrawAcount .getCode').html('发送验证码');
								  time = 60;
								layerHint('校验失败，请输入正确的验证码！')
								return false;
							}else if(data.code== 3012){
								setTimeout(function(){
									$('#bindWithdrawAcount .getCode').html('发送验证码');
									$('#bindWithdrawAcount .getCode').addClass('getCoding');
									time = 60;
								  	layerHint('校验失败，请输入正确的验证码！');
									return false;
								},100)
							}else if(data.code== 2001){
								setTimeout(function(){
									$('#bindWithdrawAcount .getCode').html('发送验证码');
									$('#bindWithdrawAcount .getCode').addClass('getCoding');
									time = 60;
								  	layerHint('参数错误！');
									return false;
								},100)
							}else if(data.code== 3040){
								setTimeout(function(){
									$('#bindWithdrawAcount .getCode').html('发送验证码');
									$('#bindWithdrawAcount .getCode').addClass('getCoding');
									time = 60;
								  	layerHint('您还不是代理用户哦！');
									return false;
								},100)
							}else if(data.code== 200){
								if (bindChannel == 'wx') {
									layerHint('您已成功绑定微信提现账户！');
								} else if(bindChannel == 'alipay'){
									layerHint('您已成功绑定支付宝提现账户！');
								}
								mainView.router.back();
							}else{
								setTimeout(function(){
									$('#bindWithdrawAcount .getCode').html('发送验证码');
									$('#bindWithdrawAcount .getCode').addClass('getCoding');
									time = 60;
								  	layerHint('提现失败，请重新操作');
									return false;
								},100)
							}
						};
					loadData(url,successFunc,data);
					}
					
					//发送验证码
					$('#bindWithdrawAcount').on('click','.getCode',function(){
						if($(this).hasClass('getCoding')){
							var data = {
								'mobile':mobile
							}
							smsSending(data);
						}else{
							layerHint('请勿重复发送验证码');
							return false;
						}
						
					})
					
					//点击确定
					$('#bindWithdrawAcount').on('click','.comfirm button',function(){
						var bindAccount = $('#bindWithdrawAcount .bindNum input').val();
						var code =  $('#bindWithdrawAcount .bindLayer .userCode').val();
						if($(this).hasClass('bindAct')){
							var data = {
								'mobile':mobile,
								'code':code,
								'bindChannel':method,
								'bindAccount':bindAccount
							}
							smsChecking1(data);
						}else{
							layerHint('请勿重复发送验证码');
							return false;
						}
						
					})
					
					$('#bindWithdrawAcount .checkCode input').on("input propertychange", function() {
						if ($('#bindWithdrawAcount .userCode').val().length==6) {
							$('#bindWithdrawAcount .comfirm button').addClass('bindAct');
						}else{
							$('#bindWithdrawAcount .comfirm button').removeClass('bindAct');
						}
					})	
					
					
					
					//fenge
					
					
				} else{
					layerHint("两次输入不一致，请重新输入！");
					$('#bindWithdrawAcount .confirmBindNum input').val('');
					return;
				}
			})
			
			
			
			
			
		}
		
		
		//提现时 手机号验证
		if (page.name === 'smsCheck') {
			$('.toolbar').hide();
//			$('.tabbar').css('z-index',4999);
			if(devicePlatform == 'android') {
				inputFouc();   //检测键盘是否弹起
			}
			var mobile = $('#view-3 .userPhoneNum').attr('data-mobile')
			$('#smsCheck .smsNum span').text(mobile)
			
			//发送验证码
			var smsSending = function(data){
				var url,data,successFunc;
				url = apiHost+'/diyapi/user/login/code';
//				url = 'http://192.168.1.249:9081/diyapi/user/login/code';
				successFunc = function(data){
					if(data.code==3002){
						layerHint('发送的太频繁了啦，请稍后再试！')
						return false;
					}else if(data.code==3001){
					  	layerHint('发送失败，请重新发送验证码！')
						return false;
					}else if(data.code== 200){
						$('.getCode').html('<i>60</i>&nbsp;S');
						$('.getCode').addClass('codeTimeOut');
						$('.getCode').removeClass('getCoding');
						time = 60;
						timer60 = setInterval(function(){
							time--;
							$('.codeTimeOut i').text(time);
							if(time==1){
								$('.getCode').removeClass('codeTimeOut');
								$('.getCode').addClass('getCoding');
								$('.getCode').html('发送验证码');
								clearTimeout(timer60);
								time = 60;
							}
						},1000)
						layerHint('正在发送验证码，请稍后')
					}
				};
				loadData(url,successFunc,data);
			}
			
			//验证 验证码
			var smsChecking = function(data){
				var url,data,successFunc;
				url = apiHost+'/diyapi/user/withdraw';
//				url = 'http://192.168.1.249:9081/diyapi/user/withdraw';
				successFunc = function(data){
					if(data.code== 3011){
						layerHint('验证码不存在或已失效，请重新发送！')
						$('.getCode').addClass('getCoding');
						$('.getCode').html('发送验证码');
						time = 60;
						layerHint('校验失败，请输入正确的验证码！')
						return false;
					}else if(data.code==3013){
						  layerHint('验证码验证错误超过次数限制，请1分钟后重试');
						  $('.getCode').addClass('getCoding');
						  $('.getCode').html('发送验证码');
						  time = 60;
						layerHint('校验失败，请输入正确的验证码！')
						return false;
					}else if(data.code== 3012){
						setTimeout(function(){
							$('.getCode').html('发送验证码');
							$('.getCode').addClass('getCoding');
							time = 60;
						  	layerHint('校验失败，请输入正确的验证码！');
							return false;
						},100)
					}else if(data.code== 3045){
						setTimeout(function(){
							$('.getCode').html('发送验证码');
							$('.getCode').addClass('getCoding');
							time = 60;
						  	layerHint('您的余额不足！');
							return false;
						},100)
					}else if(data.code== 3046){
						setTimeout(function(){
							$('.getCode').html('发送验证码');
							$('.getCode').addClass('getCoding');
							time = 60;
						  	layerHint('提款金额必须大于0');
							return false;
						},100)
					}else if(data.code== 3047){
						setTimeout(function(){
							$('.getCode').html('发送验证码');
							$('.getCode').addClass('getCoding');
							time = 60;
						  	layerHint('您还没有绑定支付宝哦');
							return false;
						},100)
					}else if(data.code== 3048){
						setTimeout(function(){
							$('.getCode').html('发送验证码');
							$('.getCode').addClass('getCoding');
							time = 60;
						  	layerHint('您还没有绑定微信哦');
						  	mainView.router.loadPage('bindWithdrawAcount.html');
							return false;
						},100)
					}else if(data.code== 200){
//						$.ajax({
//                          url: apiHost + '/diyapi/user/withdraw',
//                          type: 'POST',
//                          data: data,
//                          dataType: 'json',
//                          cache: false,
//                          timeout: "60000",
//                          success: function(data) {
//                          	if(data.code == 200){
	                        		layerHint('您已成功申请提现！');
									mainView.router.loadPage('tackCashSuceed.html');
//                          	}
//                          }
//                      });
					}else{
						setTimeout(function(){
							$('.getCode').html('发送验证码');
							$('.getCode').addClass('getCoding');
							time = 60;
						  	layerHint('提现失败，请重新操作');
							return false;
						},100)
					}
				};
			loadData(url,successFunc,data);
			}
			
			$('#smsCheck').on('click','.getCode',function(){
				if($(this).hasClass('getCoding')){
					var data = {
						'mobile':mobile
					}
					smsSending(data);
				}else{
					layerHint('请勿重复发送验证码');
					return false;
				}
				
			})
			
			$('#smsCheck').on('click','.confirming',function(){
				var code = $('#smsCheck .smsCode input').val();
				if (code) {
					var amount = $('#takeCash .inputCash').val();
					var withdrawChannel;
					var len = $('#takeCash .pay-method .method-elem').length;
					for(var i=0;i<len;i++){
						if ($('#takeCash .pay-method .method-elem').eq(i).hasClass('active')) {
							withdrawChannel = $('#takeCash .pay-method .method-elem').eq(i).attr('data-method');
						}
					}
					var data = {
						'mobile':mobile,
						'code':code,
						'amount':amount,
						'withdrawChannel':withdrawChannel
					}
					smsChecking(data)
				} else{
					layerHint('请勿重复发送验证码');
					return false;
				}
				
			})
			
		}
		
		//提现成功 页面
		if (page.name === 'tackCashSuceed') {
			$('#tackCashSuceed .done').on('click','button',function(){
//				mainView.router.loadPage('#index-3');
				window.location.href = 'index.html?channel='+ channel;
//				mainView.router.loadPage('index.html?channel='+ channel);
//				loadMy();
				$('.toolbar').show().css('z-index',5001);
			})
		}
		
		
		//代理"明细"页面
		if (page.name === 'transDetails') {
			var data ={
				'token':token,
				'refId':''
			}
			var url, successFunc, dataBox, dataBox1;
			url = apiHost+'/diyapi/user/flowing/list';
			successFunc = function(data){
				if (data.code == 200) {
					var data = data.data;
					if (data.length == 0) {
						layerHint('您还没有明细账单呢');
						setTimeout(function(){
							mainView.router.back();
						},1000)
					} else{
						dataBox = '';
						$.each(data,function(i){
							var type = data[i].type;
							var amount = toDecimal2(data[i].amount);
							var balance = toDecimal2(data[i].balance);
//							var time = getLocalTime(data[i].createTime/1000);
//							var time1 = time.split(' ')[0];
							var time = timeTodate(data[i].createTime);	
							if(type == 1){
								dataBox += '<li data-id="'+ data[i].id +'"><div class="detailLeft"><div class="LeftTitle">代理分成</div><div class="detailTime">'+ time +'</div></div><div class="detailRight" style="color:#00b900">+'+ amount +'</div></li>'
							}else if(type == 2){
								dataBox += '<li data-id="'+ data[i].id +'"><div class="detailLeft"><div class="LeftTitle">提现</div><div class="detailTime">'+ time +'</div></div><div class="detailRight">-'+ amount +'</div></li>'
							}
							$('#transDetails .transDetails-list ul').empty().append(dataBox)
							
						})
					}
					
					//加载更多数据
					// Loading flag
					var loading = false;
					 
					// Last loaded index
					var lastIndex = $('.liBox li').length;
					// Max items to load
//							var maxItems = 60;
					
					// Append items per load
					var itemsPerLoad = 10;
					 $('.infinite-scroll-preloader').hide();
					// Attach 'infinite' event handler
					$('body').on('infinite','.infinite-scroll', function () {
				      $('.infinite-scroll-preloader').show();
					  // Exit, if loading in progress
					  if (loading) return;
					 
					  // Set loading flag
					  loading = true;
					 
					  // Emulate 1s loading
					  setTimeout(function () {
					    // Reset loading flag
					    loading = false;
					 	var len = $('.liBox li').length;
						var refId = $('.liBox li').eq(len-1).attr('data-id');
						
					    if ($('.liBox li').eq(len-1).hasClass('lastAtem') || len == 0) {
					      // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
					      mainView.detachInfiniteScroll($('.infinite-scroll'));
					      // Remove preloader
					      $('.infinite-scroll-preloader').remove();
					      return;
					    }
					 
					    // Generate new items HTML
						data ={
							'token':token,
							'refId':refId
						}
					 	successFunc = function(data){
					 		if (data.code == 200) {
								var data = data.data;
								if(data.length == 0){
									layerHint('已经是最后一条数据了哦');
									$('.liBox li').eq(len-1).addClass('lastAtem');
									return;
								}else{
									dataBox = '';
									$.each(data,function(i){
										var type = data[i].type;
										var amount = toDecimal2(data[i].amount);
										var balance = toDecimal2(data[i].balance);
//												var time = getLocalTime(data[i].createTime/1000);
										var time = timeTodate(data[i].createTime)	
//												var time1 = time.split(' ')[0];
//												time1.split('-')[1] +'月'+ time1.split('-')[2] +'日 <i>'+ time.split(' ')[1] +'</i>
										if(type == 1){
											dataBox += '<li data-id="'+ data[i].id +'"><div class="detailLeft"><div class="LeftTitle">代理分成</div><div class="detailTime">'+ time +'</div></div><div class="detailRight" style="color:#00b900">+'+ amount +'</div></li>'
										}else if(type == 2){
											dataBox += '<li data-id="'+ data[i].id +'"><div class="detailLeft"><div class="LeftTitle">代理分成</div><div class="detailTime">'+ time +'</div></div><div class="detailRight">-'+ amount +'</div></li>'
										}
									})
									$('#transDetails .transDetails-list ul').append(dataBox)
								}
								
							}
					 	}	
					 loadData(url,successFunc,data);
					    lastIndex = $('.liBox li').length;
					  }, 1000);
					}); 
					
					
				}
			}
			loadData(url,successFunc,data);
			
		}
		
		
		
		
		
		
		
})


var source = localStorage.getItem('source');
//我的订单 页面
var loadMyOrder = function (data){
	var url,successFunc,dataBox,dataBox1,dataBox2;
	var pageName = $('.page').attr('data-page');
	if(pageName == "myOrder"){
		$('.hd-noLoad').show();
		url = apiHost+'/diyapi/trade/order/list';
		successFunc = function (data) {
			if(data.code == 200){
				dataBox = "";
				dataBox1 = "";
				dataBox2 = "";
				if(data.data != '' &&data.data != null){
					$.each(data.data,function(i){
						var goodsList = data.data[i].goodsList;
						var merchant = data.data[i].merchant;
						var expressFee = toDecimal2(data.data[i].expressFee);
						var expressNo = data.data[i].expressNo;
						var totalAmount = toDecimal2(data.data[i].payAmount);
						dataBox += '<section class="order-elem do"><div class="title _fm-overhide _fm-f-14"><span class="_fm-left">'+ merchant.name +'</span><span class="_fm-right"></span>';
						dataBox += '<span class="_fm-right order-status">'+({"0":"待付款","1":"待发货","2":"待收货","8":"订单已完成","-3":"订单已取消","-2":"订单已过期","3":"订单已完成","-4":"已退款"}[data.data[i].status]||'')+'</span></div><p class="division1 _fm-rel"></p><div class="goods-detail">';
						if(goodsList){
							$.each(goodsList, function(j) {
									var imageUrl;
									if(goodsList[j].previewImageList.length>0){
										imageUrl = goodsList[j].previewImageList[0].imageUrl;
									}else{
										imageUrl =''
									}
									var goodPrice = toDecimal2(goodsList[j].price);  //将拿到的金额强制转换成带两位小数的浮点型
									var goodPrice1 = goodPrice.split(".")[0];
									var goodPrice2 = goodPrice.split(".")[1];
									dataBox += '<div class="goods-content _fm-clearfix" data-id="'+ goodsList[j].id +'" data-tradeOrderId="'+ data.data[i].id +'"><a class="external" href="orderDetail.html?tradeOrderId='
										+ goodsList[j].tradeOrderId +'&channel='+ channel +'"><div class="_fm-img _fm-rel _fm-left"><div class="img-inner"><img class="lazy" data-src="" alt="" src="'
										+ imageUrl + '"></div></div><div class="goods-msg _fm-rel"><h2 class="_fm-f-14 _fm-ellipsis">'+ goodsList[j].name +'</h2><div class="price-count _fm-abs _fm-bz _fm-lz" data-price="'
										+ goodPrice +'"><span class="count-num _fm-left _js-formatGoodsPrice haveDone">￥<span style="font-size: 16px">'
										+ goodPrice1 +'.</span>'+ goodPrice2 +'</span><div class="total-num _fm-right">x<span class="num">'+ goodsList[j].num +'</span></div></div><p class="style _fm-overhide">'
										+ goodsList[j].goodsStyleDesc +'</p></div></a></div>'
							});
						}

						if(data.data[i].status==0){
							dataBox += '</div><p class="division1 _fm-rel"></p><div class="OrderTotal"><span class="qualityTotal">共<i>'
							+ data.data[i].num +'</i>件商品</span><span class="priceTotal">合计:￥<i class="totalAmount">'+totalAmount +'</i>(含运费:￥<i>'+ expressFee +'</i>)</span></div><p class="division1 _fm-rel"></p><div class="elem-footer _fm-overhide"><span class="or do or payfor">立即付款</span><span class="do cancelOrder">取消订单</span><span class="do addShoppingCar">加入购物车</span></div></section>'
						}else if(data.data[i].status==1){
							dataBox += '</div><p class="division1 _fm-rel"></p><div class="OrderTotal"><span class="qualityTotal">共<i>'
							+ data.data[i].num +'</i>件商品</span><span class="priceTotal">合计:￥<i class="totalAmount">'+totalAmount +'</i>(含运费:￥<i>'+ expressFee +'</i>)</span></div><p class="division1 _fm-rel"></p><div class="elem-footer _fm-overhide"><span class="do remindShip">提醒发货</span></div></section>'
						}else if(data.data[i].status==2){
							dataBox += '</div><p class="division1 _fm-rel"></p><div class="OrderTotal"><span class="qualityTotal">共<i>'
							+ data.data[i].num +'</i>件商品</span><span class="priceTotal">合计:￥<i class="totalAmount">'+totalAmount +'</i>(含运费:￥<i>'+ expressFee +'</i>)</span></div><p class="division1 _fm-rel"></p><div class="elem-footer _fm-overhide"><span class="do viewLogistics" data-expressNo="'+ expressNo +'">查看物流</span><span class="do confirmReceipt">确认收货</span></div></section>'
						}else if(data.data[i].status==8 || data.data[i].status== 3){
							dataBox += '</div><p class="division1 _fm-rel"></p><div class="OrderTotal"><span class="qualityTotal">共<i>'
							+ data.data[i].num +'</i>件商品</span><span class="priceTotal">合计:￥<i class="totalAmount">'+totalAmount +'</i>(含运费:￥<i>'+ expressFee +'</i>)</span></div><p class="division1 _fm-rel"></p><div class="elem-footer _fm-overhide"><span class="do viewLogistics" data-expressNo="'+ expressNo +'">查看物流</span><span class="do deleteOrder">删除订单</span></div></section>'
						}else if(data.data[i].status== -3){
							dataBox += '</div><p class="division1 _fm-rel"></p><div class="OrderTotal"><span class="qualityTotal">共<i>'
							+ data.data[i].num +'</i>件商品</span><span class="priceTotal">合计:￥<i class="totalAmount">'+totalAmount +'</i>(含运费:￥<i>'+ expressFee +'</i>)</span></div><p class="division1 _fm-rel"></p><div class="elem-footer _fm-overhide"><span class="do addShoppingCar">加入购物车</span><span class="do deleteOrder">删除订单</span></div></section>'
						}else if(data.data[i].status== -2){
							dataBox += '</div><p class="division1 _fm-rel"></p><div class="OrderTotal"><span class="qualityTotal">共<i>'
							+ data.data[i].num +'</i>件商品</span><span class="priceTotal">合计:￥<i class="totalAmount">'+totalAmount +'</i>(含运费:￥<i>'+ expressFee +'</i>)</span></div><p class="division1 _fm-rel"></p><div class="elem-footer _fm-overhide"><span class="do addShoppingCar">加入购物车</span><span class="do deleteOrder">删除订单</span></div></section>'
						}else if(data.data[i].status== -4){
							dataBox += '</div><p class="division1 _fm-rel"></p><div class="OrderTotal"><span class="qualityTotal">共<i>'
							+ data.data[i].num +'</i>件商品</span><span class="priceTotal">合计:￥<i class="totalAmount">'+totalAmount +'</i>(含运费:￥<i>'+ expressFee +'</i>)</span></div><p class="division1 _fm-rel"></p><div class="elem-footer _fm-overhide"><span class="do deleteOrder">删除订单</span></div></section>'
						}
						
					});
				}else{
					dataBox = '<div style="text-align: center;margin-top: 2.5rem;"><div><img src="img/noOrder.png"/ style="width:3.49rem;margin-bottom:0.5rem"></div><div class="no-order">您还没有订单哦，<a style="color:#007aff!important" href="index.html?channel='
					+ channel +'&source='+source+'" class="external">赶紧去下单吧</a></div></div>'
				}
				
				$('.mian-content').empty().append(dataBox);
				$('.hd-noLoad').hide();
			}else{
				dataBox = '<div style="text-align: center;margin-top: 2.5rem;"><div><img src="img/noOrder.png"/ style="width:3.49rem;margin-bottom:0.5rem"></div><div class="no-order">您还没有订单哦，<a style="color:#007aff!important" href="index.html?channel='
				+ channel +'&source='+source+'" class="external">赶紧去下单吧</a></div></div>'
				$('.mian-content').empty().append(dataBox);
				$('.hd-noLoad').hide();
			}

		}
		loadData(url, successFunc,data);
		
	}
}

//点击上方tab栏
$('._js-orderList .page .sub-navi').on('click','li',function(){
	$(this).addClass("active").siblings('li').removeClass("active");
	var type = $(this).attr('data-type');
	if(type==0){
		var data = {'status':'',
					'token':token
					};
		loadMyOrder(data);                           //加载全部订单
	}else if(type==1){
		var data = {'status':0,
					'token':token
					};       //加载待付款订单
		loadMyOrder(data); 
	}else if(type==2){
		var data = {'status':1,
					'token':token
					};
		loadMyOrder(data);                        //加载待发货订单
	}else if(type==3){
		var data = {'status':2,
					'token':token
					};
		loadMyOrder(data);                        //加载待收货订单
	}
})




			
			//确认订单页面数据
			var loadOrderComfirm = function() {
				
			$('.hd-noLoad').show();
//			inputFouc();   //检测键盘是否弹起
			var deliveryAddress;
			var chooseAddressId = localStorage.getItem('chooseAddressId');
			var url, successFunc, dataBox, dataBox1, dataBox2, dataBox3; //将data传给后端成功后，再向后端请求订单详情接口的数据
			successFunc = function(data) {
				//优惠金额
				var exemptAmount = toDecimal2(data.data.exemptAmount);
				var exemptAmount1 = exemptAmount.split(".")[0];
				var exemptAmount2 = exemptAmount.split(".")[1];
				
				
				var tradeOrder = data.data.tradeOrder;
				
				//总金额
				var totalAmount = toDecimal2(tradeOrder.amount);
				var totalAmount1 = totalAmount.split(".")[0];
				var totalAmount2 = totalAmount.split(".")[1];
				
				//实际支付金额
				var payAmount = toDecimal2(tradeOrder.payAmount);
				var payAmount1 = payAmount.split(".")[0];
				var payAmount2 = payAmount.split(".")[1];
				
				//邮费
				var expressFee = toDecimal2(tradeOrder.expressFee);
				var expressFee1 = expressFee.split(".")[0];
				var expressFee2 = expressFee.split(".")[1];
				
				//总数量
				var totalNum = tradeOrder.num;
				
				//立减优惠
				var exemptAmount = toDecimal2(data.data.exemptAmount);
				
				var goodsList = data.data.tradeOrder.goodsList;
				var amount = toDecimal2(data.data.tradeOrder.amount); //将拿到的金额强制转换成带两位小数的浮点型
				var amount1 = amount.split(".")[0];
				var amount2 = amount.split(".")[1];
				if (data.code == 200) {
					dataBox = "";
					dataBox1 = "";
					dataBox2 = "";
					dataBox3 = "";
					$.each(goodsList, function(i) {
						var price = toDecimal2(goodsList[i].price); //将拿到的金额强制转换成带两位小数的浮点型
						var goodPrice1 = price.split(".")[0];
						var goodPrice2 = price.split(".")[1];
						if (goodsList.length == 1) {
							dataBox = '<div class="goods-content _fm-clearfix onegoods" data-goodsId="'+ goodsList[i].goodsId +'" data-num="'+ goodsList[i].num +'" data-tradeOrderGoodsId="'+ goodsList[i].id +'"><div class="_fm-img _fm-rel _fm-left"><div class="img-inner"><img class="lazy-loaded" alt="" src="' + goodsList[i].previewImageList[0].imageUrl + '"></div></div><div class="goods-msg _fm-rel"><h2 class="_fm-f-14 _fm-ellipsis">' + goodsList[i].name + '</h2><div class="price-count _fm-abs _fm-bz _fm-lz"><span class="count-num _fm-left _js-formatGoodsPrice haveDone" data-size="16px">￥<span style="font-size: 16px">' + goodPrice1 + '.</span>' + goodPrice2 + '</span><div class="count total-num"><div class="subtract op-l"><img src="img/ap-subtract.png"></div>	<input disabled="" type="text" value="' + goodsList[i].num + '" name="number" pattern="[0-9]*" maxlength="4" class="num"><div class="add op-r"><img src="img/ap-add.png"></div></div></div><p class="style _fm-overhide">' + goodsList[i].goodsStyleDesc + '</p></div></div>'
						} else {
							dataBox1 += '<div class="area-elem _fm-inline" data-goodsId="'+ goodsList[i].goodsId +'"  data-num="'+ goodsList[i].num +'"><div class="_fm-img"><div class="img-inner"><img src="' + goodsList[i].previewImageList[0].imageUrl + '" alt=""></div></div></div>';
							dataBox = '<a class="one-item img-show _fm-block" href="#goodsList"><div class="right-ico _fm-right"><span class="_fm-back-right">&nbsp;</span></div><div class="img-show-area">' + dataBox1 + '</div><div class="oneGood"><p class="one-item _fm-f-13 onePrice">￥' + amount1 + '.' + amount2 + '</p><p class="one-item _fm-f-13 oneNun">共' + totalNum + '件</p></div></a>';
							dataBox2 += '<section class="goods-content _fm-clearfix"><input name="isBoutique" class="isBoutique" value="1" type="hidden"><div class="_fm-img _fm-rel _fm-left"><div class="img-inner"><img class="lazy-loaded" alt="" src="' + goodsList[i].previewImageList[0].imageUrl + '"></div></div><div class="goods-msg _fm-rel"><h2 class="_fm-f-14 _fm-ellipsis">' + goodsList[i].name + '</h2><div class="price-count _fm-abs _fm-bz _fm-lz"><span class="count-num _fm-left _js-formatGoodsPrice haveDone" data-size="16px">￥<span style="font-size: 16px">' + goodPrice1 + '.</span>' + goodPrice2 + '</span><div class="total-num _fm-right">x<span class="num">' + goodsList[i].num + '</span></div></div><p class="style _fm-overhide">' + goodsList[i].goodsStyleDesc + '</p></div></section>';
						} 
					});
					$('.goodsList .goods-detail').empty().append(dataBox2);
					$('.shoppingcar-confirm .goods-detailList').empty().append(dataBox);
					
					dataBox2 = '<div class="toolbar-inner _fm-block _fm-rel _fm-overhide"><span class="submit do _fm-right _fm-txtcenter _fm-f-18">提交订单</span><span class="total _fm-f-18" data-payAmount="'+ payAmount +'" data-totalNum="'+ totalNum +'">合计:<span class="count-num _fm-f-14" data-size="18px">￥<span style="font-size: 18px">' + payAmount1 + '.</span>' + payAmount2 + '</span></span></div>';
					$('.shoppingcar-confirm .toolbar').empty().append(dataBox2);
					
					if (data.data.deliveryAddress) {
						dataBox3 = '<div class="left-ico _fm-left"><i class="_fm-rel _fm-inline _fm-txtcenter">&nbsp;</i></div><div class="msg"><p class="_fm-overhide _fm-f-15"><span class="name _fm-left _fm-ellipsis" data-deliveryAddress="' 
									+ data.data.deliveryAddress.id + '"data-name="' + data.data.deliveryAddress.name + '">收货人: ' + data.data.deliveryAddress.name + '</span><span class="_fm-right userPhone" data-phone="' + data.data.deliveryAddress.phone + '">' 
									+ data.data.deliveryAddress.phone + '</span></p><div class="address _fm-overhide" data-Province="' + data.data.deliveryAddress.province + '" data-County="' 
									+ (data.data.deliveryAddress.city||"") + '" data-Address="' + (data.data.deliveryAddress.county||"") + '">收货地址：' + data.data.deliveryAddress.provinceName + '&nbsp;' 
									+ (data.data.deliveryAddress.cityName||"") + '&nbsp;' + (data.data.deliveryAddress.countyName||"") +'&nbsp;' + data.data.deliveryAddress.address + '</div></div>'
						$('.order-msg .orderComfirm-address').empty().append(dataBox3);
					} else {
						dataBox3 = '<div class="noAddress" style="margin: 0 auto;text-align: center;padding-top: 0.4rem;line-height: 1rem;"><a href="useAddress.html" style="font-size: 0.3rem;display: inline-block;line-height: 1rem;">新增收货地址</a></div>';
						$('.order-msg .orderComfirm-address').empty().append(dataBox3);
					}
					
					dataBox = '<span class="center">商品详情</span><a href="#" class="left back left-txt _fm-abs _fm-tz _fm-lz _fm-f-14"><i class="_fm-back-left">&nbsp;</i>返回</a><span class="right right-txt _fm-abs _fm-tz _fm-rz _fm-f-14">共' + totalNum + '件</span>'
					$('.shoppingcar-confirm .goodsList-nav').empty().append(dataBox);
					
					dataBox = '<span>运费:</span><span class="_fm-right" style="color: #ff5252;">+ ￥<i class="postPrice" data-expressFee="'+expressFee+'">'+ expressFee1 +'.'+ expressFee2 +'</i><i class="postFeeIcon"></i></span>';
					$('.shoppingcar-confirm .postFee').empty().append(dataBox);
					
					dataBox='<span class="discountNow">立减优惠：</span><span class="_fm-right" style="color: #ff5252;">- ￥<i class="discountNowPrice">'+ exemptAmount +'</i></span>'
					$('.shoppingcar-confirm .DiscountNow').empty().append(dataBox);
					
					//平安活动商品 在优惠券的地方单独处理
					dataBox='';
					var count;
					if (goodsList.length == 1) {
						dataBox='';
						count=0;
						var s1 = $('.onegoods').attr('data-goodsId');
						var s2 = $('.onegoods').attr('data-num');
						if(s1==130 || s1==131 || s1==132 || s1==133 || s1==134 || s1==135 || s1==136 || s1==138 || s1==42 || s1==144){
							count = s2;
							dataBox = '<a href="#coupon" style="color:#575757"><span class="_fm-left">选择优惠券：</span><div class="msg _fm-overhide"><span class="_fm-right _fm-ellipsis">活动已默认优惠'+ 30*count +'元</span></div></a>'
						}else{
							dataBox = '<a href="#coupon" style="color:#575757"><span class="_fm-left">选择优惠券：</span><div class="right-ico _fm-right" style="margin-top: -3px;"><span class="_fm-back-right">&nbsp;</span></div><div class="msg _fm-overhide"><span class="_fm-right _fm-ellipsis">无可用优惠券</span></div></a>'
						}
					}else{
						count=0;
						dataBox='';
						for (var i=0;i<goodsList.length;i++) {
							var s1 = $('.area-elem').eq(i).attr('data-goodsId');
							var s2 = $('.area-elem').eq(i).attr('data-num');
							if(s1==130 || s1==131 || s1==132 || s1==133 || s1==134 || s1==135 || s1==136 || s1==138 || s1==42 || s1==144){
								count += Number(s2)
							}
						}
						if(count >0){
							dataBox = '<a href="#coupon" style="color:#575757"><span class="_fm-left">选择优惠券：</span><div class="msg _fm-overhide"><span class="_fm-right _fm-ellipsis">活动已默认优惠'+ 30*count +'元</span></div></a>'
						}else{
							dataBox = '<a href="#coupon" style="color:#575757"><span class="_fm-left">选择优惠券：</span><div class="right-ico _fm-right" style="margin-top: -3px;"><span class="_fm-back-right">&nbsp;</span></div><div class="msg _fm-overhide"><span class="_fm-right _fm-ellipsis">无可用优惠券</span></div></a>'
						}
					}
					$('.shoppingcar-confirm .coupon').empty().append(dataBox);
					
					dataBox ='';
					//判断用户平台 安卓还是ios
//					if(devicePlatform == 'android'){
//						dataBox = '<li class="method-elem _fm-overhide" data-method="alipay_wap"><img class="_fm-left ico" src="img/zhifubao.png" alt="支付宝"><div class="right-ico _fm-right do active payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">支付宝支付</h1></div></li><li class="method-elem1 _fm-overhide" data-method="upacp_wap"><img class="_fm-left ico" src="img/unionPay.png" alt="银联"><div class="right-ico _fm-right do payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">银联支付(账户正在开通中，敬请期待)</h1></div></li>'
//					}else{
						//判断是否在微信浏览器中打开，如果在微信浏览器中打开，则将微信支付关闭
						if(deviceBrowser){
							//判断是否是在第三方公众号的链接
							var source = localStorage.getItem('source');
							if(source == 'omp'){
								dataBox = '<li class="method-elem _fm-overhide" data-method="alipay_wap"><img class="_fm-left ico" src="img/zhifubao.png" alt="支付宝"><div class="right-ico _fm-right do active payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">支付宝支付</h1></div></li><li class="method-elem _fm-overhide" data-method="upacp_wap"><img class="_fm-left ico" src="img/unionPay.png" alt="银联"><div class="right-ico _fm-right do payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">银联支付</h1></div></li>'
							}else{
								dataBox = '<li class="method-elem _fm-overhide" data-method="wx_pub"><img class="_fm-left ico" src="img/wechat.png" alt="微信"><div class="right-ico _fm-right do active payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">微信支付</h1></div></li><li class="method-elem _fm-overhide" data-method="upacp_wap"><img class="_fm-left ico" src="img/unionPay.png" alt="银联"><div class="right-ico _fm-right do payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">银联支付</h1></div></li><li class="method-elem _fm-overhide" data-method="alipay_wap"><img class="_fm-left ico" src="img/zhifubao.png" alt="支付宝"><div class="right-ico _fm-right do payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">支付宝支付</h1></div></li>'
							}
						}else{
							dataBox = '<li class="method-elem _fm-overhide" data-method="wx_wap"><img class="_fm-left ico" src="img/wechat.png" alt="微信"><div class="right-ico _fm-right do active payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">微信支付</h1></div></li><li class="method-elem _fm-overhide" data-method="upacp_wap"><img class="_fm-left ico" src="img/unionPay.png" alt="银联"><div class="right-ico _fm-right do payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">银联支付</h1></div></li><li class="method-elem _fm-overhide" data-method="alipay_wap"><img class="_fm-left ico" src="img/zhifubao.png" alt="支付宝"><div class="right-ico _fm-right do payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">支付宝支付</h1></div></li>'
						}
//					}
					$('.shoppingcar-confirm .pay-method').empty().append(dataBox);
					
					$('.shoppingcar-confirm .pay-method').find('.method-elem1').hide();//银联暂未开通
					
					
					dataBox ='';
					dataBox = '<span>备注：</span><input type="text" class="remarkTextarea" placeholder="对本次交易的说明(建议填写)" maxlength="50">';
					$('.shoppingcar-confirm .remarkInfo').empty().append(dataBox);
					var orderMsg = window.localStorage.getItem('orderMsg');
					$('.shoppingcar-confirm .remarkInfo .remarkTextarea').val(orderMsg);
					isShowSubtract();
					$('.hd-noLoad').hide();
				
				}
			}
			
			if(chooseAddressId){
				loadData(apiHost+'/diyapi/trade/preorder/detail?tradeOrderId=' + tradeOrderId+'&deliveryAddressId='+chooseAddressId, successFunc);
			}else{
				loadData(apiHost+'/diyapi/trade/preorder/detail?tradeOrderId=' + tradeOrderId, successFunc);
			}
			
		};
		
		
		
		
//首页加载商品详情数据
var indexLoadDetail = function (channel,goodsId){
	var url,successFunc,dataBox,dataBox1;
		$('.hd-noLoad').show();
		url = apiHost+'/diyapi/goods/wechat/detail?channel='+channel+'&goodsId='+goodsId;
		successFunc = function (data) {
            
			if(data.code == 200){
				var bannerList = data.data.bannerList,
            	detailList = data.data.detailList,
                goods = data.data.goods,
                video = data.data.videoList;
				dataBox = "";
				dataBox1 = "";
				dataBox += '<img src="img/detailBg.png" class="detailBg"><div class="content-block detail-content-block"><div class="content-block-inner"><div class="swiper-container detail-swiper-container" data-space-between="0"><div class="swiper-wrapper">';
				$.each(bannerList,function(i){
					dataBox += '<div class="swiper-slide"><a href="#"><img src="'+ bannerList[i].imageUrl +'" alt="banner" /></a></div>'
					
				});
				
				dataBox +='</div><div class="swiper-pagination"></div></div>'
				
				var priceWechat = toDecimal2(goods.showPrice); //将现价金额强制转换成带两位小数的浮点型
				var goodPrice1 = priceWechat.split(".")[0];
				var goodPrice2 = priceWechat.split(".")[1];
				
				var originalPrice = toDecimal2(goods.originalPrice); //将原价强制转换成带两位小数的浮点型
				var originalPrice1 = originalPrice.split(".")[0];
				var originalPrice2 = originalPrice.split(".")[1];
				dataBox += '<div class="detailText"><div><span class="detail-goodPrice">￥<i>'+ goodPrice1 +'.<i style="font-size:0.32rem!important">'+ goodPrice2 +'</i></i></span><div class="detail-good-top" data-id="'+ goods.id +'"><span class="detail-goodName">'
							+ goods.name +'<i></i></span></div></div><div><div class="detail-good-middle"><span class="detail-oldGoodPrice"><i>￥&nbsp;'
							+ originalPrice1 +'.'+ originalPrice2 +'</i></span><span class="detail-peopel"><img src="img/giftIcon.png"/><b>'
							+ goods.soldNum +'人定制</b></span></div></div>'
				
				//有活动时显示，没有活动时不显示活动一栏
				if(goods.activityName){
					dataBox += '<div class="detail-good-bottom"><span>促销<i>'+ goods.activityName +'</i></span></div>'
				}
				dataBox += '</div></div></div>'
				
				
				//判断是否为自营商品，有就显示
				if (goods.isOwn == true){
					$('.detail-goodName i').css("opacity",1);
				}else{
					$('.detail-goodName i').css("opacity",0);
				};
				
				if(video.length !== 0){
					$.each(video,function(k){
						if(video[k].videoUrl){
							dataBox += '<div class="content-block detail-content-block detail-video"><div class="content-block-inner" data-videosrc="'+ video[k].videoUrl +'" data-videoimg="'+ video[k].imageUrl +'" id="video"></div></div>'
						}
					})
				if(devicePlatform == 'android'){
						//加载视频
						var flashvars={
							f:'',
							c:0,
							b:1,
							i:'img/poster.jpg',
							loaded:'loadedHandler'
							};
					}else{
						//加载视频
						var flashvars={
							f:'',
							c:0,
							b:1,
							i:'',
							loaded:'loadedHandler'
							};
					}
				
				var video=[video[0].videoUrl+'->video/mp4'];
				var support=['iPad','iPhone','ios','android+false','msie10+false'];
				CKobject.embedHTML5('video','ckplayer_video','100%','100%',video,flashvars,support);	
					
				}else{
					$('.detail-video').hide();
				}
				dataBox += '<div class="content-block-title detail-ImgTitle"><div class="ImgTitle">定制详情</div><div class="ImgTitle-Triangle"><img src="img/Triangle.png"></div></div><div class="content-block detail-content-block detail-Img"><div class="content-block-inner">'
				$.each(detailList,function(i){
					dataBox += '<img src="'+ detailList[i].imageUrl +'" /> '
				})
				dataBox += '</div></div></div>'
				dataBox1 = '<a href="diy.html?channel='+channel+'&goodsId='+goodsId+'" class="tab-link external"><span class="tabbar-label">开启定制之旅</span></a>'
				$('.toCustumised').empty().append(dataBox1);
				$('.toCustumised').show();
				$('#view-1 .page-content').empty().append(dataBox);
				var mySwiper2 = myApp.swiper('.detail-swiper-container', {
					pagination: '.swiper-pagination',
					speed: 400,
					loop:true
				});
				$('.hd-noLoad').hide();
			}else{
				window.location.href="index.html?channel="+channel.split("_")[0]+'&source='+localStorage.getItem('source');
			}
		}
		errorFunc = function(error){
			window.location.href="index.html?channel="+channel.split("_")[0]+'&source='+localStorage.getItem('source');;
		}
		loadData(url,successFunc,"",errorFunc);
		
}

		
	//详情页中选择材质弹窗 加减数量  ，写在外面，防止点击多次
	$('body').on('click','.attributePopup .ap-numBox .count .add',function() {
		var num = $('.attributePopup .ap-numBox .count input').val();
		num++;
		if(num < 10000) {
			$('.attributePopup .ap-numBox .count input').val(num);
		}
		isShowSubtract1()
	});
	
	$('body').on('click','.attributePopup .ap-numBox .count .subtract',function() {
		var num = $('.attributePopup .ap-numBox .count input').val();
		num--;
		if(num > 0) {
			$('.attributePopup .ap-numBox .count input').val(num);
		}
		isShowSubtract1()
	});	
	
	//详情页中选择材质弹窗 加减数量，数量=1时，减号置灰
	function isShowSubtract1(){
		if($('.attributePopup .ap-numBox .count input').val() <= 1){
	    		$('.attributePopup .ap-numBox .count .subtract img').attr('src','img/ap-subtract-disabled.png')
	    }else{
	    		$('.attributePopup .ap-numBox .count .subtract img').attr('src','img/ap-subtract.png')
	    	}
	}
	


	//微信个人信息页面
	var personalCenter = function() {
		var url, successFunc, dataBox;
		url = apiHost +'/diyapi/user/agency/info';
		token = getCookie('token');
		var data = {
			'token':token
		}
		successFunc = function(data){
			if(data.code == 200){
					console.log(12344)
				var channelUrl = data.data.channelUrl,
				isBindAliapy = data.data.isBindAliapy,
				isBindWx = data.data.isBindWx,
				mobile = data.data.mobile,
				head = data.data.head,
				level = data.data.level;
				dataBox='';
				dataBox = '<div class="weChatIndex"><div class="personInfo"><div class="info"><div class="head"><img src="'+ head +'" /></div><div class="headRight"><p></p><p></p></div><div class="changeNum"></div></div><p class="channelLink">'
				+ channelUrl +'</p><p class="text">长按复制渠道编码</p></div><div class="middle"><div class="linkBox order" data-type="1"><div class="linkBoxCon"><img src="img/wechatORDER.png"/><div><p>查看订单</p><p>订单详情</p></div></div></div><div class="linkBox cash"><div class="linkBoxCon"><img src="img/wechatCASH.png"/><div><p>查看收益</p><p>我的收益</p></div></div></div></div><div class="bottom"><ul><li class="takeCashType"><span class="right"></i></span><span class="left">提现方式</span></li><li><a href="tel:0755-86536781" class="right external">0755-86536781</a><span class="left">联系客服</span></li></ul></div></div>'
				$('#personalCenter .page-content').empty().append(dataBox);
				
				if(level == 1){
					$('.headRight').html('<p>尊贵的一级代理</p><p>'+ mobile +'</p>');
				}else if(level == 2){
					$('.headRight').html('<p>尊贵的二级代理</p><p>'+ mobile +'</p>');
				}
				
				if(isBindAliapy == false && isBindWx == false){
					$('.bottom ul li').eq(0).find('.right').html('未绑定')
				}else if(isBindAliapy == true && isBindWx == false){
					$('.bottom ul li').eq(0).find('.right').html('已绑定<i class="wechatZFB"></i>')
				}else if(isBindAliapy == false && isBindWx == true){
					$('.bottom ul li').eq(0).find('.right').html('已绑定<i class="wechatWX"></i>')
				}else if(isBindAliapy == true && isBindWx == true){
					$('.bottom ul li').eq(0).find('.right').html('已绑定<i class="wechatZFB"></i><i class="wechatWX"></i>')
				}
				$('#personalCenter .weChatIndex .personInfo .info .headRight').css('color','#fff!important');
				console.log(12344)
				$('#personalCenter .weChatIndex .personInfo').css('background-color','#FF3D58')
				$('.hd-noLoad').hide();
			}else if(data.code == 3040){
				$('#personalCenter .bottom ul .takeCashType').hide();
				var mobile = data.data.mobile,
				head = data.data.head;
				dataBox='';
				dataBox = '<div class="weChatIndex"><div class="personInfo"><div class="info"><div class="head"><img src="'+ head +'" /></div><div class="headRight"><p>尊贵的用户</p><p>'+ 
				 mobile +'</p></div><div class="changeNum"></div></div><div class="joinAgency"><img src="img/wechatJoinAgency.png"/></div></div><div class="middle"><div class="linkBox order" data-type="1"><div class="linkBoxCon"><img src="img/wechatORDER.png"/><div><p>查看订单</p><p>订单详情</p></div></div></div><div class="linkBox mall"><div class="linkBoxCon"><img src="img/wechatMall.png"/><div><p>进入商城</p><p>定制商城</p></div></div></div></div><div class="bottom"><ul><li><a href="tel:0755-86536781" class="right external">0755-86536781</a><span class="left">联系客服</span></li></ul></div></div>'
				$('#personalCenter .page-content').empty().append(dataBox);
				$('#personalCenter .weChatIndex .personInfo .info .headRight p').eq(0).css('color','#969696');
				$('#personalCenter .weChatIndex .personInfo .info .headRight p').eq(1).css('color','#373737');
				$('#personalCenter .weChatIndex .personInfo').css('background-color','#fff')
				$('.hd-noLoad').hide();
			}
		}
		loadData(url, successFunc,data);
	}
	
	
	
	//联系方式
	function contactLayer(box,succBack){
		if($(".xl-contact").length == 0) {
			var dataBox = '';
			dataBox = '<div class="xl-contact"><div class="detail"><div class="detailOut"><div>电话：<a href="tel:0755-86536781" class="external" style="color:blue!important">0755-86536781</a></div><div>微信：<span>xiaoyoulaile520</span></div><div>Q Q：<span>767430434</span></div><div>邮箱：<a href="mailto:fangjiangfei@51app.cn" class="external">fangjiangfei@51app.cn</a></div></div><div class="serviceQr"><img src="img/serviceQr.png" /><p>扫码联系客服</p></div><div class="iKnow"></div></div><div class="mask"></div></div>'
			$(box).append(dataBox)
		} else {
			$(".xl-contact").show();
		}
		
		$('.iKnow').click(function(){
			$('.xl-contact').hide()
		})
		
		
	}
			