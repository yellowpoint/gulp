tradeOrderId = GetQueryString('tradeOrderId');

//渠道推广 先从url上面取，没有再去cookie去取，防止在支付后后台返回的链接里面没有带channel
var channel = GetQueryString('channel') || getCookie('channel') || 'etime';
setCookie('channel', channel)

//领取优惠券页面
var getCoupon = function(){
	var url, data,successFun, dataBox;
	url = apiDomain + '/diyapi/coupon/list';
	data = {
		'token':token
	}
	successFun = function(data) {
		if(data.code == 200){
			dataBox = '';
			$.each(data.data,function(i){
				var amountMinus = data.data[i].amountMinus,
				couponId = data.data[i].id,
				name = data.data[i].name,
				instruction = data.data[i].instruction,
				startTime = timeTodate1(data.data[i].startTime),
				endTime = timeTodate1(data.data[i].endTime);
				dataBox += '<li data-couponId="'+ couponId +'"><img class="coupon-itemImg" src="../../img/coupon/coupon-yes.png"/><div class="coupon-itemText"><div class="itemTextLeft"><div class="amount">'+ amountMinus 
				+'</div><p>RMB</p></div><div class="itemTextRight"><div class="name">'+ name +'</div><div class="require"><span>'+ instruction +'</span><i class="clickGet">点击领取</i></div><p>使用期限</p><p>'+ startTime +' 一 '+ endTime +'</p></div></div><div class="getMake"><img class="coupon-itemImg" src="../../img/coupon/geted.png"/></div></li>'
			})
			$('.couponListUl').empty().append(dataBox);
			$('.dom-noLoad').hide();
		}
	}
	
	uploadData(url, true, data, successFun);
	
}

//激活码领取优惠券
$('.getOuter').on('click','button',function(){
	var code = $('.getOuter input').val();
	var url, data,successFun,errorFun, dataBox;
	url = apiDomain + '/diyapi/coupon/active';
	data = {
		'token':token,
		'code':code
	}
	successFun = function(data) {
		if(data.code == 200){
			$('.getOuter input').val('');
			layerHint('优惠券激活成功，已放入您的账户');
		}else if(data.code == 3010){
			layerHint('优惠券已过期');
		}else if(data.code == 3011){
			layerHint('优惠券已领取');
		}else if(data.code == 3001){
			layerHint('激活码错误');
		}else{
			layerHint('领取失败');
		}
	}
	errorFun = function(data){
		layerHint('领取失败');
	}
	uploadData(url, true, data, successFun,errorFun);
})



//用户点击优惠券领取
$('.getCoupon .couponListUl').on('click','li',function(){
	var couponId = $(this).attr('data-couponId');
	var that = $(this);
	var url, data,successFun,errorFun, dataBox;
	url = apiDomain + '/diyapi/coupon/receive';
	data = {
		'token':token,
		'couponId':couponId
	}
	successFun = function(data) {
		if(data.code == 200){
			layerHint('已领取');
			that.find('.getMake').show();
			that.find('.clickGet').hide();
		}else if(data.code == 3010){
			layerHint('优惠券已过期');
		}else if(data.code == 3011){
			layerHint('优惠券已领取');
		}else{
			layerHint('领取失败');
		}
		
	}
	errorFun = function(data){
		layerHint('领取失败');
	}
	uploadData(url, true, data, successFun,errorFun);
})




//优惠券列表页
var couponList = function(status){
	var url, data,successFun, dataBox1,dataBox2,dataBox3;
	url = apiDomain + '/diyapi/coupon/user/info';
	data = {
		'token':token
	}
	successFun = function(data) {
		if(data.code == 200){
			dataBox1 = '';
			dataBox2 = '';
			dataBox3 = '';
			var valid = data.data.valid,
			used = data.data.used,
			expired = data.data.expired,
			expiredList = data.data.expiredList,
			usedList = data.data.usedList,
			validList = data.data.validList;
			
			$('.couponList .sub-navi .sub-item').eq(0).find('span').text('未使用('+ valid +')');
			$('.couponList .sub-navi .sub-item').eq(1).find('span').text('已使用('+ used +')');
			$('.couponList .sub-navi .sub-item').eq(2).find('span').text('已过期('+ expired +')');
			
			if (valid == 0){
				dataBox1 = '<div class="noCoupon"><img src="../../img/coupon/no-coupon.png"></div>'
			}else{
				$.each(validList,function(i){
					var amountMinus = validList[i].amountMinus,
					couponId = validList[i].id,
					name = validList[i].name,
					instruction = validList[i].instruction,
					startTime = timeTodate1(validList[i].createTime),
					endTime = timeTodate1(validList[i].expires),
					isOverall = validList[i].isOverall,
					merchantId = validList[i].merchantId;
					if(isOverall){
						dataBox1 += '<li data-couponId="'+ couponId +'" data-isOverall="'+ isOverall +'"><img class="coupon-itemImg" src="../../img/coupon/coupon-yes.png"/><div class="coupon-itemText"><div class="itemTextLeft"><div class="amount">'+ amountMinus 
							+'</div><p>RMB</p></div><div class="itemTextRight"><div class="name">'+ name +'</div><div class="require"><span>'+ instruction +'</span><i class="clickUse">立即使用</i></div><p>使用期限</p><p>'+ startTime +' 一 '+ endTime +'</p></div></div></li>'
					}else(
						dataBox1 += '<li data-couponId="'+ couponId +'" data-isOverall="'+ isOverall +'" data-merchantId="'+ merchantId +'"><img class="coupon-itemImg" src="../../img/coupon/coupon-yes.png"/><div class="coupon-itemText"><div class="itemTextLeft"><div class="amount">'+ amountMinus 
							+'</div><p>RMB</p></div><div class="itemTextRight"><div class="name">'+ name +'</div><div class="require"><span>'+ instruction +'</span><i class="clickUse">立即使用</i></div><p>使用期限</p><p>'+ startTime +' 一 '+ endTime +'</p></div></div></li>'
					)
				})
			}
			if (used == 0){
				dataBox2 = '<div class="noCoupon"><img src="../../img/coupon/no-coupon.png"></div>'
			}else{
				$.each(usedList,function(i){
					var amountMinus = usedList[i].amountMinus,
					couponId = usedList[i].id,
					name = usedList[i].name,
					instruction = usedList[i].instruction,
					startTime = timeTodate1(usedList[i].createTime),
					endTime = timeTodate1(usedList[i].expires);
					dataBox2 += '<li data-couponId="'+ couponId +'"><img class="coupon-itemImg" src="../../img/coupon/coupon-no.png"/><div class="coupon-itemText"><div class="itemTextLeft"><div class="amount">'+ amountMinus 
					+'</div><p>RMB</p></div><div class="itemTextRight"><div class="name">'+ name +'</div><div class="require"><span>'+ instruction +'</span></div><p>使用期限</p><p>'+ startTime +' 一 '+ endTime +'</p></div></div></div><div class="useMake" style="display:block"><img class="coupon-itemImg" src="../../img/coupon/useed.png"/></div></li>'
				})
				
			}
			if (expired == 0){
				dataBox3 = '<div class="noCoupon"><img src="../../img/coupon/no-coupon.png"></div>'
			}else{
				$.each(expiredList,function(i){
					var amountMinus = expiredList[i].amountMinus,
					couponId = expiredList[i].id,
					name = expiredList[i].name,
					instruction = expiredList[i].instruction,
					startTime = timeTodate1(expiredList[i].createTime),
					endTime = timeTodate1(expiredList[i].expires);
					dataBox3 += '<li data-couponId="'+ couponId +'"><img class="coupon-itemImg" src="../../img/coupon/coupon-no.png"/><div class="coupon-itemText"><div class="itemTextLeft"><div class="amount">'+ amountMinus 
					+'</div><p>RMB</p></div><div class="itemTextRight"><div class="name">'+ name +'</div><div class="require"><span>'+ instruction +'</span></div><p>使用期限</p><p>'+ startTime +' 一 '+ endTime +'</p></div></li>'
				})
				
			}
			$('.couponList .couponListValid').empty().append(dataBox1);
			$('.couponList .couponListUsed').empty().append(dataBox2);
			$('.couponList .couponListExpired').empty().append(dataBox3);
			
			var height = Number($('.navbar').height());
			$('.sub-navi').css('top',height+'px')
			
		}
	}
	if(status == 0){
		$('.couponList .couponListUl').eq(0).show().siblings('.couponListUl').hide();
	}else if(status == 1){
		$('.couponList .couponListUl').eq(1).show().siblings('.couponListUl').hide()
	}else if(status == 2){
		$('.couponList .couponListUl').eq(2).show().siblings('.couponListUl').hide()
	}
	
	
	$('.dom-noLoad').hide();
	uploadData(url, true, data, successFun);
	
	
}

//优惠券列表页切换tab
$('.couponList .sub-navi').on('click','li',function(){
	$(this).addClass('active').siblings('li').removeClass('active');
	var status = $(this).attr('data-type');
	couponList(status);
	
})
//优惠券列表页点击领取优惠券
$('.couponList .getCouponButton').on('click','span',function(){
	window.location.href = 'getCoupon.html';
})

//优惠券列表页点击立即使用
$('.couponList').on('click','.clickUse',function(){
	var isOverall = $(this).parents('li').attr('data-isOverall');
	if (isOverall == 'true') {
		window.location.href = 'couponGoods.html?merchantId=isOverall';
	} else{
		var merchantId = $(this).parents('li').attr('data-merchantId')
		window.location.href = 'couponGoods.html?merchantId='+merchantId;
	}
})






//确认订单页面选择优惠券页面
var preorderCoupon = function(status){
	localStorage.setItem('isCoupon',2)
	var url, data,successFun, dataBox1,dataBox2;
	url = apiDomain + '/diyapi/coupon/tradeorder/list';
	data = {
		'tradeOrderId':tradeOrderId
	}
	successFun = function(data) {
		if(data.code == 200){
			dataBox1 = '';
			dataBox2 = '';
			var valid = data.data.valid,
			unvalid = data.data.unvalid,
			unvalidList = data.data.unvalidList,
			validList = data.data.validList;
			$('.preorderCoupon .sub-navi .sub-item').eq(0).find('span').text('可用优惠券('+ valid +')');
			$('.preorderCoupon .sub-navi .sub-item').eq(1).find('span').text('不可用优惠券('+ unvalid +')');
			if (valid == 0){
				dataBox1 = '<div class="noCoupon"><img src="../../img/coupon/no-coupon.png"></div>'
			}else{
				$.each(validList,function(i){
					var amountMinus = validList[i].amountMinus,
					couponId = validList[i].id,
					name = validList[i].name,
					instruction = validList[i].instruction,
					startTime = timeTodate1(validList[i].createTime),
					endTime = timeTodate1(validList[i].expires);
					dataBox1 += '<li class="couponLi" data-couponId="'+ couponId +'" data-money="'+ amountMinus +'"><img class="coupon-itemImg coupon-yes" src="../../img/coupon/coupon-yes.png"/><div class="coupon-itemText"><div class="itemTextLeft"><div class="amount">'+ amountMinus 
					+'</div><p>RMB</p></div><div class="itemTextRight"><div class="name">'+ name +'</div><div class="require"><span>'+ instruction +'</span><div class="checked"><span class="_fm-check-1">&nbsp;</span></div></div><p>使用期限</p><p>'+ startTime +' 一 '+ endTime +'</p></div></div></li>'
				})
			}
			if (unvalid == 0){
				dataBox2 = '<div class="noCoupon"><img src="../../img/coupon/no-coupon.png"></div>'
			}else{
				$.each(unvalidList,function(i){
					var amountMinus = unvalidList[i].amountMinus,
					couponId = unvalidList[i].id,
					name = unvalidList[i].name,
					instruction = unvalidList[i].instruction,
					startTime = timeTodate1(unvalidList[i].createTime),
					endTime = timeTodate1(unvalidList[i].expires);
					dataBox2 += '<li data-couponId="'+ couponId +'" data-money="'+ amountMinus +'"><img class="coupon-itemImg" src="../../img/coupon/coupon-yes.png"/><div class="coupon-itemText"><div class="itemTextLeft"><div class="amount">'+ amountMinus 
					+'</div><p>RMB</p></div><div class="itemTextRight"><div class="name">'+ name +'</div><div class="require"><span>'+ instruction +'</span></div><p>使用期限</p><p>'+ startTime +' 一 '+ endTime +'</p></div></div></li>'
				})
			}
			$('.preorderCoupon .couponListCan').empty().append(dataBox1);
			$('.preorderCoupon .couponListNo').empty().append(dataBox2);
			
			var height1 = Number($('.navbar').height());
			var height2 = Number($('.sub-navi').height());
			$('.sub-navi').css('top',$('.navbar').height()+'px');
			$('.couponChooseInfo').css('top',(height1+height2)+'px');
			//选择优惠券后，再次进入选择优惠券界面，已选中的要是选中状态
			if(localStorage.getItem('userCouponIds')){
				var str = localStorage.getItem('userCouponIds');
				var arr=[];
				for (var n=0;n<str.split(',').length;n++) {
					arr.push(str.split(',')[n])
				}
				for (var i=0;i<arr.length;i++) {
					for (var j=0;j<$('.couponListCan .couponLi').length;j++) {
						if($('.couponListCan .couponLi').eq(j).attr('data-couponid') == arr[i]){
							$('.couponListCan .couponLi').eq(j).addClass('chooseActive').find('.checked span').addClass('active')
						}
					}
				}
				chooseCoupon(tradeOrderId,str);
				useAmount()
			}
		}
	}
	if(status == 0){
		$('.preorderCoupon .couponListUl').eq(0).show().siblings('.couponListUl').hide();
	}else if(status == 1){
		$('.preorderCoupon .couponListUl').eq(1).show().siblings('.couponListUl').hide()
	}
	
	
	$('.dom-noLoad').hide();
	uploadData(url, true, data, successFun);
	
}

//确认订单页面切换tab
$('.preorderCoupon .sub-navi').on('click','li',function(){
	$(this).addClass('active').siblings('li').removeClass('active');
	var status = $(this).attr('data-type');
	preorderCoupon(status);
	if (status == 1) {
		$('.CouponComfirm').hide();
		$('.couponChooseInfo').hide();
		$('.preorderCoupon .page-content').css('padding','1.5rem 0 0')
	} else{
		$('.CouponComfirm').show();
		$('.couponChooseInfo').show();
		$('.preorderCoupon .page-content').css('padding','2.2rem 0 0')
	}
})

//确认订单页面选中优惠券
$('.preorderCoupon').on('click','.couponLi',function(){
	if ($(this).find('.coupon-itemImg').hasClass('coupon-yes')) {
		var userCouponIds;
		var tradeOrderId = GetQueryString('tradeOrderId');
		if ($(this).find('.checked').find('span').hasClass('active')) {
			$(this).find('.checked').find('span').removeClass('active');
			$(this).removeClass('chooseActive');
			useAmount();
			userCouponIds = chooseId();
		} else{
			$(this).find('.checked').find('span').addClass('active');
			$(this).addClass('chooseActive');
			useAmount();
			userCouponIds = chooseId();
		}
		chooseCoupon(tradeOrderId,userCouponIds)
	} 
})
//选中的优惠券Id
var chooseId = function(){
	var allCoupon = $('.couponLi').length;
	var allChoose = [];
	for (var i = 0; i < allCoupon; i++) {
		if ($('.couponLi').eq(i).hasClass('chooseActive')) {
			var userCouponId = Number($('.couponLi').eq(i).attr('data-couponId'));
			allChoose.push(userCouponId);
		} 			
	}
	return allChoose.toString()
}

//确认订单页面选中优惠券总和
var useAmount = function(){
	var totalPrice = 0,
	totalNum = 0;
	var allCoupon = $('.couponLi').length;
	var allMoney = [];
	for (var i = 0; i < allCoupon; i++) {
		if ($('.couponLi').eq(i).hasClass('chooseActive')) {
			var price = Number($('.couponLi').eq(i).attr('data-money'));
			allMoney.push(price);
			totalNum ++;
		} 			
	}
	for (var i in allMoney) {
		totalPrice += allMoney[i];
	}
	$('.couponChooseInfo').text('您已选中优惠券'+ totalNum +'张，共可抵用￥'+totalPrice.toFixed(2))
	return totalPrice.toFixed(2)
}

//选择优惠券 接口
var chooseCoupon = function(tradeOrderId,userCouponIds){
	var url,data,successFun;
	url = apiDomain + '/diyapi/coupon/tradeorder/select';
	data = {
		'tradeOrderId':tradeOrderId,
		'userCouponIds':userCouponIds
	}
	successFun = function(data) {
		if(data.code == 200){
			var data = data.data;
			$.each(data, function(i) {
				var useStatus = data[i].useStatus;
				if (useStatus == 0 || useStatus == 1) {
					$('.couponLi').eq(i).find('.coupon-itemImg').attr('src','../../img/coupon/coupon-yes.png').addClass('coupon-yes')
				} else{
					$('.couponLi').eq(i).find('.coupon-itemImg').attr('src','../../img/coupon/coupon-no.png').removeClass('coupon-yes')
				}
			});
		}
	}
	uploadData(url, true, data, successFun);
}

//选择优惠券页面  点击确认按钮
$('.preorderCoupon').on('click','.CouponComfirm span',function(){
	var userCouponIds = chooseId();
	var totalCoupon = useAmount();
	localStorage.setItem('userCouponIds',userCouponIds);
	localStorage.setItem('totalCoupon',totalCoupon);
	location.href = '../main/orderConfirm.html?channel='+ channel +'&tradeOrderId=' + tradeOrderId;
})
		



//点击右上角tips
$('.preorderCoupon').on('click','.preorderCouponTips',function(){
	layer.open({
		title: '优惠券使用说明',
	    content: '<p>1.优惠券分为全平台通用券和商家优惠券两种;</p><p>2.全平台通用券不可叠加使用;</p><p>3.全平台通用券和商家优惠券可叠加使用;</p><p>4.商家优惠券叠加使用条件：同一商家的优惠券不可叠加使用，不同商家优惠券可以叠加使用;</p><p>5.优惠券金额大于订单应付金额时，差额不予退回。</p>'
	    ,btn: '我知道了'
	  });
})



//关闭登录窗口
$('body').on('click','.xl-close',function(){
	window.history.go(-1)
})










