function cashier (box,TradeOrderId,orderId,amount,arr,itemCount){
	
	var xlLoadData = function(url, successFunc,data) {
		$.ajax({
			url: url,
			type: 'POST',
			timeout: 60000,
			async: true,
			dataType: 'json',
			data: data||{},
			success: successFunc,
			error: function(error) {
				console.log('木有数据1');
			}
		});
	};
	
	//URL公共部分
//	var apiDomain = '//api.51app.cn';
	
	var token = getCookie('token');
	//渠道号
	var channel = GetQueryString('channel') || getCookie('channel') || 'etime' ;
	setCookie('channel',channel)
	var Id = GetQueryString('tradeOrderId');
	var tradeOrderId ="";
	if(Id){
		tradeOrderId = GetQueryString('tradeOrderId').split('_')[0];
	}else{
		tradeOrderId =TradeOrderId;
	}
	
	if($(".xl-cashier").length == 0) {
		var data = {
			'token':token,
			'tradeOrderId':tradeOrderId
		}
		var url, successFunc, dataBox;
		url = apiDomain+'/diyapi/trade/order/pay/detail';
		successFunc = function(data){
			var payAmount = toDecimal2(data.data.trade.amount);
			//判断是否在微信浏览器中打开，如果在微信浏览器中打开，则将微信支付关闭
			if(deviceBrowser){
				//判断是否是在第三方公众号的链接
				var source = localStorage.getItem('source');
				if(source){
					if(source == 'omp'){
					dataBox = '<div class="xl-cashier"></div><div class="cashier"><span class="cashierClose"></span><div class="cashPay">应付金额：<span>￥'
							+ payAmount +'</span></div><ul class="pay-method"><li class="method-elem _fm-overhide" data-method="alipay_wap"><img class="_fm-left ico payImg" src="../../img/zhifubao.png" alt="支付宝"><div class="right-ico _fm-right do active payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">支付宝支付</h1></div></li><li class="method-elem _fm-overhide" data-method="upacp_wap"><img class="_fm-left ico payImg" src="../../img/unionPay.png" alt="银联支付"><div class="right-ico _fm-right do payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">银联支付</h1></div></li></ul><div class="cashierBottom"><img src="../../img/cashierBottom.png"/></div></div>'
					}else{
					dataBox = '<div class="xl-cashier"></div><div class="cashier"><span class="cashierClose"></span><div class="cashPay">应付金额：<span>￥'
							+ payAmount +'</span></div><ul class="pay-method"><li class="method-elem _fm-overhide" data-method="wx_pub"><img class="_fm-left ico payImg" src="../../img/wechat.png" alt="微信"><div class="right-ico _fm-right do active payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">微信支付</h1></div></li><li class="method-elem _fm-overhide" data-method="upacp_wap"><img class="_fm-left ico payImg" src="../../img/unionPay.png" alt="银联支付"><div class="right-ico _fm-right do payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">银联支付</h1></div></li><li class="method-elem _fm-overhide" data-method="alipay_wap"><img class="_fm-left ico payImg" src="../../img/zhifubao.png" alt="支付宝"><div class="right-ico _fm-right do payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">支付宝支付</h1></div></li></ul><div class="cashierBottom"><img src="../../img/cashierBottom.png"/></div></div>'
					}
				}else{
					dataBox = '<div class="xl-cashier"></div><div class="cashier"><span class="cashierClose"></span><div class="cashPay">应付金额：<span>￥'
					+ payAmount +'</span></div><ul class="pay-method"><li class="method-elem _fm-overhide" data-method="wx_pub"><img class="_fm-left ico payImg" src="../../img/wechat.png" alt="微信"><div class="right-ico _fm-right do active payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">微信支付</h1></div></li><li class="method-elem _fm-overhide" data-method="alipay_wap"><img class="_fm-left ico payImg" src="../../img/zhifubao.png" alt="支付宝"><div class="right-ico _fm-right do payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">支付宝支付</h1></div></li><li class="method-elem _fm-overhide" data-method="upacp_wap"><img class="_fm-left ico payImg" src="../../img/unionPay.png" alt="银联支付"><div class="right-ico _fm-right do payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">银联支付</h1></div></li></ul><div class="cashierBottom"><img src="../../img/cashierBottom.png"/></div></div>'
				}
			}else{
				dataBox = '<div class="xl-cashier"></div><div class="cashier"><span class="cashierClose"></span><div class="cashPay">应付金额：<span>￥' + payAmount + '</span></div><ul class="pay-method"><li class="method-elem _fm-overhide" data-method="wx_wap"><img class="_fm-left ico payImg" src="../../img/wechat.png" alt="微信"><div class="right-ico _fm-right do active payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">微信支付</h1></div></li><li class="method-elem _fm-overhide" data-method="upacp_wap"><img class="_fm-left ico payImg" src="../../img/unionPay.png" alt="银联支付"><div class="right-ico _fm-right do payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">银联支付</h1></div></li><li class="method-elem _fm-overhide" data-method="alipay_wap"><img class="_fm-left ico payImg" src="../../img/zhifubao.png" alt="支付宝"><div class="right-ico _fm-right do payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">支付宝支付</h1></div></li></ul><div class="cashierBottom"><img src="../../img/cashierBottom.png"/></div></div>'
			
			
			}
			$(box).append(dataBox);
			var bodyHight = $('body').height()
			$('.xl-cashier').css('height',bodyHight+'px')
			
			var URL = window.location.href; //获取当前url
			if (GetQueryString('tradeOrderId')) {
				if (GetQueryString('tradeOrderId').split('_')[1]) {
					$('.cashier').css('background','url(../../img/cashier1.png) left top no-repeat');
					$('.cashier').css('background-size','6.19rem 8rem')
					$('.cashier .cashierClose').hide()
				}
				if(URL.split('?')[0].split('/')[8].split('.')[0] && URL.split('?')[0].split('/')[8].split('.')[0] == 'groupResult'){
					$('.cashier').css('background','url(../../img/cashier1.png) left top no-repeat');
					$('.cashier').css('background-size','6.19rem 8rem');
					$('.cashier .cashierClose').hide();
					$('.cashier .pay-method .method-elem').eq(2).hide();
					$('.cashier .pay-method .method-elem').eq(1).css('border-bottom','none');
					$('.cashierBottom').css('margin-top','0.5rem')
				}
			}
			
			$('.pay-method').find('.method-elem1').hide();//银联暂未开通

		}
		xlLoadData(url,successFunc,data);
		
	} else {
		$(".xl-cashier").show();
		$(".cashier").show();
	}
	
		
	//选择付款方式
		$('body').on('click','.pay-method .method-elem',function(){
			$(this).find('.payMethod').addClass('active').parents('.method-elem').siblings('.method-elem').find('.payMethod').removeClass('active');
		})
	
	
	
	//确认支付
	$('body').on('click','.cashierBottom',function(){
		console.log(123)
		var that = $(this);
		var length = that.parents('.cashier').find('.pay-method').find('.method-elem').length;
		for(var i=0;i<length;i++){
			if (that.parents('.cashier').find('.pay-method').find('.method-elem').eq(i).find('.payMethod').hasClass('active')) {
				var payChannel = that.parents('.cashier').find('.pay-method').find('.method-elem').eq(i).find('.payMethod').parents('.method-elem').attr('data-method');
			}
		}
		var token = getCookie('token');
		var channel = localStorage.getItem('channel');
		
		var URL = window.location.href; //获取当前url
		var tradeFlag;
		if(URL.split('?')[0].split('/')[8].split('.')[0] && URL.split('?')[0].split('/')[8].split('.')[0] == 'groupResult'){
			tradeFlag = 'group'
		}else{
			tradeFlag = 'tq'
		}
		
		if(payChannel == 'wx_pub'){
			var source = localStorage.getItem('source');
			if(source){
				if (source == 'mp') { //在小优来了公众号里面
				var data = {
					'tradeOrderId': tradeOrderId,
					'payChannel': "wx_pub",
					'token':token,
					'flag':tradeFlag
				}
				
				$.ajax({
					url: apiDomain+'/diyapi/trade/order/topay',
					type: 'POST',
					timeout: 0,
					async: true,
					data: data,
					dataType: 'json',
					beforeSend: function() {},
					success: function(data) {
						if (data.code == 200) {
							var appId = data.data.appid;
							var timeStamp = data.data.timestamp;
							var nonceStr = data.data.nonceStr;
							var packages = 'prepay_id=' + data.data.prepayId;
							var paySign = data.data.sign;
	
							function onBridgeReady() {
								WeixinJSBridge.invoke(
									'getBrandWCPayRequest', {
										"appId": appId, //公众号名称，由商户传入     
										"timeStamp": timeStamp, //时间戳，自1970年以来的秒数     
										"nonceStr": nonceStr, //随机串     
										"package": packages,
										"signType": "MD5", //微信签名方式：     
										"paySign": paySign //微信签名 
									},
									function(res) {
										//统计付款成功数据
										var amount = $('.confirm-toolBar .total').attr('data-payamount');
										var orderId = tradeOrderId;
										var itemCount = $('.confirm-toolBar .total').attr('data-totalnum');
										if (res.err_msg == "get_brand_wcpay_request:ok") {
											window.location.href = 'paySucced.html&tradeOrderId=' + tradeOrderId;
										} // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
										if (res.err_msg == "get_brand_wcpay_request:cancel") {
											window.location.href = 'paySucced.html&tradeOrderId=' + tradeOrderId;
										}
										if (res.err_msg == "get_brand_wcpay_request:fail") {
											window.location.href = 'paySucced.html&tradeOrderId=' + tradeOrderId;
										}
									}
								);
							}
							if (typeof WeixinJSBridge == "undefined") {
								if (document.addEventListener) {
									document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
								} else if (document.attachEvent) {
									document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
									document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
								}
							} else {
								onBridgeReady();
							}
						}
					},
					error: function(data) {
						console.log("立即付款失败")
					}
				})
					
				
				
				
				
			} 
			}else {
				var data = {
					'tradeOrderId': tradeOrderId,
					'payChannel': "wx_pub",
					'token': token,
					'topay': false,
					'flag':tradeFlag
				}
				$.ajax({
					url: apiDomain+'/diyapi/trade/order/topay',
					type: 'POST',
					timeout: 0,
					async: true,
					data: data,
					dataType: 'json',
					success: function(data) {
						if (data.code == 200) {
							window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx204459d3f9148e3b&redirect_uri=https%3A%2F%2Fapi.51app.cn%2Fdiyapi%2Ftrade%2Forder%2Ftopay%2Fwxpub&response_type=code&scope=snsapi_base&state=' + tradeOrderId + '_'+ tradeFlag +'#wechat_redirect';
						} 
					},
					error: function(data) {
						console.log("订单提交失败")
					}
				})
			}
		}else if (payChannel == 'wx_wap') {
			var url,successFunc;
			successFunc =function(data){
				window.location.href=data.data;
			}
			xlLoadData('https://api.51app.cn/diyapi/trade/order/topay/h5?flag='+ tradeFlag +'&tradeOrderId='+tradeOrderId,successFunc);
			
		}else{
			var data = {
				'tradeOrderId': tradeOrderId,
				'payChannel': payChannel,
				'token':token,
				'flag':tradeFlag
			}
			$.ajax({
				url: apiDomain+'/diyapi/trade/order/topay',
				type: 'POST',
				timeout: 0,
				async: true,
				data: data,
				dataType: 'json',
				beforeSend: function() {},
				success: function(data) {
					var charge = data.data;
					if (data.code == 200) {
					
					 pingpp.createPayment(charge, function(result, err) {
	                    if (result == "success") {
					        // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
					    } else if (result == "fail") {
					        // charge 不正确或者微信公众账号支付失败时会在此处返回
					    } else if (result == "cancel") {
					        // 微信公众账号支付取消支付
					    }
	                });
					
					}
				},
				error: function(data) {
					console.log("立即付款失败")
				}
			})
		}
	})
	
	
	
	//关闭付款弹窗
	$('body').on('click','.cashierClose',function(){
		$(".xl-cashier").hide();
		$(".cashier").hide();
	})
	
	
	
	
}
