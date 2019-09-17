//Shirley的公共方法

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

//处理时间
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


//处理时间
function timeTodate1(time) {
	var date = new Date(time);
	Y = date.getFullYear() + '.';
	M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
	D = (date.getDate()<10?'0'+date.getDate():date.getDate()) + ' ';
	return(Y + M + D);
}
//购物车页面
	//加载购物车数量，如果没有登录,不显示数量
		function loadShopCarNum(){
			var url,successFun,dataBox,errorFun;
			url = apiDomain + '/diyapi/trade/cart/num?token=' + getCookie('token');
			successFun = function(data){
				if(data.code == 200){
					if(data.data > 99) {
						data.data = '99+';
					}
					dataBox = '<b>'+ data.data +'</b>';
					$('.toCustumised .toolbar-inner .goShopCar').empty().append(dataBox)	
				}
				
			}
			loadData(url,true,successFun);
		}		
		
		//判断商品数量，如果等于1，则将减号图片换掉
		function isShowSubtract(){
			var length = $('.page .total-num').length;
			for(var i=0;i<length;i++){
				if($('.total-num').eq(i).find('input').val() <= 1){
					$('.total-num').eq(i).find('.subtract img').attr('src','../../img/ap-subtract-disabled.png')
					$('.total-num').eq(i).find('.subtract').removeClass('op-l');
				}else{
					$('.total-num').eq(i).find('.subtract img').attr('src','../../img/ap-subtract.png');
					$('.total-num').eq(i).find('.subtract').addClass('op-l');
				}
			}
		}
			//每操作一次都刷新购物车
		var sendRefresh= function(data){
			$.ajax({
				url: apiDomain+"/diyapi/trade/cart/modify", 
				type: 'POST',
				timeout: 0,
				async: true,
				data: data, 
				beforeSend: function() {
					//可加入loading的效果
				},
				success: function(data) {
					loadPage()      //修改成功后刷新购物车
				},
				error: function(data) {
					console.log("购物车修改失败")
				}
			})
		}
		
		
		//每操作一次传给后台但不刷新购物车
		var sendNoRefresh= function(data){
			$.ajax({
				url: apiDomain+"/diyapi/trade/cart/modify", 
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
				url: apiDomain+"/diyapi/trade/cart/delete", 
				type: 'POST',
				timeout: 0,
				async: true,
				data: data, 
				beforeSend: function() {
					//可加入loading的效果
				},
				success: function(data) {
					loadPage()      //修改成功后刷新购物车
				},
				error: function(data) {
					console.log("购物车修改失败")
				}
			})
		}
//详情页中选择材质弹窗 加减数量，数量=1时，减号置灰
function isShowSubtract1(){
	if($('.attributePopup .ap-numBox .count input').val() <= 1){
		$('.attributePopup .ap-numBox .count .subtract img').attr('src','../../img/ap-subtract-disabled.png')
    }else{
		$('.attributePopup .ap-numBox .count .subtract img').attr('src','../../img/ap-subtract.png')
	}
}
	


//点击关闭按钮，关闭弹窗
$('body').on('click','.closeit',function(){
	$('.attributePopupBox').hide();
	$('.attributePopup .ap-confirm').removeClass('act');
})



//收货地址列表
var ADDress = function(){
	var url, successFun, dataBox, dataBox1, dataBox2;
	var page = $('.page');
	url = apiDomain+'/diyapi/user/address/list?token='+token;
	successFun = function(data) {
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
				
				dataBox += '<div class="right-ico _fm-right do deleteAddr" style="color:#575757"><span class="_fm-inline _fm-rel _fm-txtcenter">&nbsp;</span><i>删除</i></div><div class="right-ico _fm-right do editAddr" data-op="editAddr"><a href="../subject/modifyAddress.html" style="color:#575757"><span class="_fm-inline _fm-rel _fm-txtcenter">&nbsp;</span><i>编辑</i></a></div></div></section>';
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
	loadData(url,true,successFun);
}
	
//选择收货地址
var chooseAddress = function(){
	var chooseAddressId = localStorage.getItem("chooseAddressId");
	var url, successFun, dataBox, dataBox1, dataBox2;
	var page = $('.page');
	url = apiDomain+'/diyapi/user/address/list?token='+token;
	successFun = function(data) {
					
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
				dataBox += '</div></div><div class="right-ico _fm-right do editAddr editAddr1" data-op="editAddr"><a href="../subject/useAddress.html" style="color:#666"><span class="_fm-inline _fm-rel _fm-txtcenter">&nbsp;</span></a></div></section>';
			})
			
			$('.pages .address-list').empty().append(dataBox); 
			 var length = $('.address-list .order-address').length;
			for (var j=0;j<length;j++) {
				var id = $('.address-list .order-address').eq(j).attr('data-id');
				if(chooseAddressId ==  id){
					$('.address-list .order-address').eq(j).find('.AddressChooseIcon').show().parents('.order-address').siblings('.order-address').find('.AddressChooseIcon').hide();
					$('.address-list .order-address').eq(j).find('.msg').addClass('chooseActive').parents('.order-address').siblings('.order-address').find('.msg').removeClass('chooseActive');
				}
				var height = $('.order-address').eq(j).height();
				$('.order-address').eq(j).find('.AddressChooseIcon').css('line-height',height+'px');
				$('.order-address').eq(j).find('.editAddr').css('line-height',height+'px');
			}
		}else if(data.code == 1001){
						loginLayer('body')
						return;
					}
	};
	loadData(url,true,successFun);
}

//地址栏 设为默认地址开关
var switchClick = function(){
	if($('.xl-checkbox').hasClass('xl-checkBox-active')){
		$(".xl-switch input").attr("checked",'true');
		$('.xl-checkSlide').css('-webkit-transform','translateX(0rem)')
		$('.xl-checkbox').removeClass('xl-checkBox-active');
	}else{
		$(".xl-switch input").removeAttr("checked");
		$('.xl-checkSlide').css('-webkit-transform','translateX(0.4rem)')
		$('.xl-checkbox').addClass('xl-checkBox-active')
	}
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



//加载talkingData需要的数据    //在点击提交订单时调用，不能在页面加载时调用，防止后面订单数据进行修改
var loadTalkingData = function(tradeOrderId){
	var arr=[];
	var data = {
		'tradeOrderId':tradeOrderId
	}
	$.ajax({
		url: apiDomain + '/diyapi/trade/preorder/detail',
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

//首页弹出广告

//首页新人弹出优惠券广告
var indexLayer = function(){
	var indexLayer = layer.open({
	  type: 1,
	  content: '<div class="indexLayer"><i class="indexLayerClose"></i><i class="couponGet"></i></div>',
	  anim: 'up',
	  shadeClose: false,
	  style: 'position:absolute; left:0; top:0;right:0;bottom:0;margin:auto;width:6.16rem; height:8.24rem; border: none; -webkit-animation-duration: .5s; animation-duration: .5s;opacity:.5'
	});
}
