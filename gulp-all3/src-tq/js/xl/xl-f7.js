//各个子页面内容
$(document).on('page:init', function(e) {
	var page = e.detail.page;
	if(isIphoneX()){
		$('.f7Toolbar').css('height','74px');
		$('.f7Toolbar a').css('bottom','24px');
		$('#address .page-content').css('padding-bottom','1.5rem')
	}
	
	
	//代理 我的收益账户
	if (page.name === 'agentAccount') {
		$('#agentAccount').on('click','.Withdrawals',function(){
			mainView.router.loadPage('../subject/withdrawals.html')
		})
		var data = {
			'token':token
		};
		var loadAgentAccount = function(data){
			$('.dom-noLoad').show();
			var url, successFun, dataBox;
			url = apiDomain+'/diyapi/user/profit/detail';
			successFun = function(data) {
				if (data.code == 200) {
					var cashableBalance = data.data.cashableBalance.toFixed(2);
					$('#agentAccount .totalMoney .cashNum').text(cashableBalance)
					$('.dom-noLoad').hide();
				}
			}
			uploadData(url,true,data,successFun);
		}
		loadAgentAccount(data);
		
		$('body').on('click','.TradeDetail',function(){
			mainView.router.loadPage('../subject/transDetails.html');
		})
		
	}else if(page.name === 'withdrawals'){  //提现
		
		$('body').on('click','.agentMoneyBack',function(){
			$('body .navbar-inner').find('.back').addClass('agentMoneyBack')
			localStorage.removeItem('agentMoney');
			mainView.router.back();
			$('.toolbar').show();
		})
		$('body').on('click','.withTips',function(){
			console.log(1234)
			layer.open({
				content: '订单确认收货后，15天后未退款的订单，订单方可转入已结算收益，已结算的订单收益金额转入代理账户余额~',
				btn: '好的',
				shadeClose: false,
				yes: function(index) {
					layer.close(index);
				}
			});
		})
		
		var loadWithdrawals = function(data){
			var data = {
				'token':token
			};
			var url, successFun, dataBox;
			url = apiDomain+'/diyapi/user/profit/detail';
			successFun = function(data) {
				if (data.code == 200) {
					$('.dom-noLoad').hide();
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
					$('.dom-noLoad').hide();
				}
			}
			uploadData(url,true,data,successFun);
		}
		loadWithdrawals();
		
		//代理商 “日收益明细”
		$('body').on('click','.moneyDetail',function(){
			var month = $(this).attr('data-month');
			setCookie('month',month);
			var status = $(this).attr('data-status');
			setCookie('status',status);
			mainView.router.loadPage('../subject/dayCash.html');
		})
		
		//点击“立即提现”
		$('body').on('click','.takeNow',function(){
			if($('.withdrawals-top .canBeTake').text() == 0 ||$('.withdrawals-top .canBeTake').text() == null){
				layerHint('您的可提现余额不足以提现哦，赶紧先去推广赚钱吧！');
				return;
			}else{
				mainView.router.loadPage('../subject/takeCash.html');
			}
		})
		
		
	}else if(page.name === 'takeCash'){  //马上提现页面
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
					var url,data,successFun;
					url = apiDomain+'/diyapi/user/agency/info';
					data = {
						'token':token
					};
					successFun = function(data){
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
											mainView.router.loadPage('../subject/bindWithdrawAcount.html');
										} else if(data.data.isBindAliapy == false && data.data.isBindWx == true){
											localStorage.setItem('bind','Aliapy');
											mainView.router.loadPage('../subject/bindWithdrawAcount.html');
										}else if(data.data.isBindAliapy == true && data.data.isBindWx == false){
											localStorage.setItem('bind','wx');
											mainView.router.loadPage('../subject/bindWithdrawAcount.html');
										}
									},1000)
								} else{
									mainView.router.loadPage('../subject/smsCheck.html');
								}
							}else if(withdrawChannel == 'alipay'){
								if (data.data.isBindAliapy == false) {
										layerHint('您还没有绑定支付宝哦，赶紧去绑定吧！');
										setTimeout(function(){
											if (data.data.isBindAliapy == false && data.data.isBindWx == false) {
												localStorage.setItem('bind','both');
												mainView.router.loadPage('../subject/bindWithdrawAcount.html');
											} else if(data.data.isBindAliapy == false && data.data.isBindWx == true){
												localStorage.setItem('bind','Aliapy');
												mainView.router.loadPage('../subject/bindWithdrawAcount.html');
											}else if(data.data.isBindAliapy == true && data.data.isBindWx == false){
												localStorage.setItem('bind','wx');
												mainView.router.loadPage('../subject/bindWithdrawAcount.html');
											}
										},1000)
								} else{
									mainView.router.loadPage('../subject/smsCheck.html');
								}
							}
						}
					}
					uploadData(url,true,data,successFun);
				}
			})
			
			$('body').on('click','.takeCa',function(){
				$('.tabbar').css('z-index',5001);
				$('.toolbar').show();
			})
		
		
		
		
	}else if (page.name === 'dayCash') {
			$('.dom-noLoad').show();
			var month = getCookie('month');
			setCookie('month',month,-1);
			var status = getCookie('status');
			setCookie('status',status,-1);
			var data = {
				'token':token,
				'month':month,
				'status':status
			}
			var url, successFun, dataBox, dataBox1;
			url = apiDomain+'/diyapi/user/profit/month/detail';
			successFun = function(data){
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
					$('.dom-noLoad').hide();
				}
			}
			uploadData(url,true,data,successFun);
	}else if (page.name === 'transDetails') {  //代理"明细"页面
			var data ={
				'token':token,
				'refId':''
			}
			var url, successFun, dataBox, dataBox1;
			url = apiDomain+'/diyapi/user/flowing/list';
			successFun = function(data){
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
					var loading = false;
					var lastIndex = $('.liBox li').length;
					var itemsPerLoad = 10;
					 $('.infinite-scroll-preloader').hide();
					$('body').on('infinite','.infinite-scroll', function () {
				      $('.infinite-scroll-preloader').show();
					  if (loading) return;
					 
					  loading = true;
					 
					  setTimeout(function () {
					    loading = false;
					 	var len = $('.liBox li').length;
						var refId = $('.liBox li').eq(len-1).attr('data-id');
						
					    if ($('.liBox li').eq(len-1).hasClass('lastAtem') || len == 0) {
					      mainView.detachInfiniteScroll($('.infinite-scroll'));
					      $('.infinite-scroll-preloader').remove();
					      return;
					    }
					 
						data ={
							'token':token,
							'refId':refId
						}
					 	successFun = function(data){
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
										var time = timeTodate(data[i].createTime)	
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
					 uploadData(url,true,data,successFun);
					    lastIndex = $('.liBox li').length;
					  }, 1000);
					}); 
					
					
				}
			}
			uploadData(url,true,data,successFun);
			
		}else if (page.name === 'dayCash') { //代理日收益
			$('.dom-noLoad').show();
			var month = getCookie('month');
			setCookie('month',month,-1);
			var status = getCookie('status');
			setCookie('status',status,-1);
			var data = {
				'token':token,
				'month':month,
				'status':status
			}
			var url, successFun, dataBox, dataBox1;
			url = apiDomain+'/diyapi/user/profit/month/detail';
			successFun = function(data){
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
					$('.dom-noLoad').hide();
				}
			}
			uploadData(url,true,data,successFun);
		}else if (page.name === 'smsCheck') {//提现时 手机号验证
			if(devicePlatform == 'android') {
				inputFouc();   //检测键盘是否弹起
			}
			var mobile = $('#view-3 .userCon p').eq(1).attr('data-mobile');
			$('#smsCheck .smsNum span').text(mobile)
			
			//发送验证码
			var smsSending = function(data){
				var url,data,successFun;
				url = apiDomain+'/diyapi/user/login/code';
				successFun = function(data){
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
				uploadData(url,true,data,successFun);
			}
			
			//验证 验证码
			var smsChecking = function(data){
				var url,data,successFun;
				url = apiDomain+'/diyapi/user/withdraw';
				successFun = function(data){
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
						  	mainView.router.loadPage('../subject/bindWithdrawAcount.html');
							return false;
						},100)
					}else if(data.code== 200){
//						$.ajax({
//                          url: apiDomain + '/diyapi/user/withdraw',
//                          type: 'POST',
//                          data: data,
//                          dataType: 'json',
//                          cache: false,
//                          timeout: "60000",
//                          success: function(data) {
//                          	if(data.code == 200){
	                        		layerHint('您已成功申请提现！');
									mainView.router.loadPage('../subject/tackCashSuceed.html');
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
			uploadData(url,true,data,successFun);
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
			
		}else if(page.name == 'bindWithdrawAcount'){//绑定提现账号 页面
			var dataBox,dataBox1,bind;
			bind = localStorage.getItem('bind');
			localStorage.removeItem('bind');
			if(bind == 'Aliapy'){
				dataBox = '<li class="method-elem active" data-method="alipay"><img class="ico" src="../../img/zhifubao.png" alt="支付宝"><div class="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1>支付宝</h1></div></li>'
				dataBox1 = '<input type="text" name="" id="" placeholder="请输入需要绑定的支付宝账号" />';
			}else if(bind == 'wx'){
				dataBox = '<li class="method-elem active" data-method="wx"><img class="ico" src="../../img/wechat.png" alt="微信"><div class="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1>微信</h1></div></li>'
				dataBox1 = '<input type="text" name="" id="" placeholder="请输入需要绑定的微信账号" />';
			}else {
				dataBox = '<li class="method-elem active" data-method="wx"><img class="ico" src="../../img/wechat.png" alt="微信"><div class="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1>微信</h1></div></li><li class="method-elem" data-method="alipay"><img class="ico" src="../../img/zhifubao.png" alt="支付宝"><div class="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1>支付宝</h1></div></li>'
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
			})
			
			$('#bindWithdrawAcount').on('click','.next button',function(){
				var value1 = $('#bindWithdrawAcount .bindNum input').val();
				var value2 = $('#bindWithdrawAcount .confirmBindNum input').val();
				if(value1.length>0 && value2.length>0){
					if (value1 == value2) {
					$('#bindWithdrawAcount .bindLayer').show();
					$('#bindWithdrawAcount .mask').show();
					var mobile = $('#view-3 .userCon p').eq(1).attr('data-mobile');
					$('#bindWithdrawAcount .bindLayer .telNum').text('+86 '+mobile);
					if(devicePlatform == 'android') {
						inputFouc();   //检测键盘是否弹起
					}
					//发送验证码
					var timer60;
					var smsSending = function(data){
						var url,data,successFun;
						url = apiDomain+'/diyapi/user/login/code';
						successFun = function(data){
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
						uploadData(url,true,data,successFun);
					}
					
					//验证 验证码
					var smsChecking1 = function(data){
						var bindChannel = data.bindChannel;
						var url,data,successFun;
						url = apiDomain+'/diyapi/user/bind/account';
		//				url = 'http://192.168.1.249:9081/diyapi/user/withdraw';
						successFun = function(data){
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
					uploadData(url,true,data,successFun);
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
				}else{
					layerHint("请务必将提现账号填写完整");
					return;
				}
				
			})
			
		}else if (page.name === 'tackCashSuceed') {//提现成功 页面
			$('#tackCashSuceed .done').on('click','button',function(){
				window.location.href = 'my.html?channel='+ channel;
			})
		}
		
		//收货地址系列
	else if (page.name === 'editAddress') {//新增收货地址页面
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
			var isDefault;
			if($('.xl-switch .xl-checkbox').hasClass('xl-checkBox-active')){
				isDefault = true;
			}else{
				isDefault = false;
			}
			
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
				url: apiDomain+'/diyapi/user/address/add',  
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
						
						//判断是否是拼团
						if(GetQueryString('fromgroup')){
							location.reload();
						}else{
							window.location.href='orderConfirm.html?channel='+channel+'&tradeOrderId='+tradeOrderId;
						}
					}else{
						mainView.router.back();
						loadPage();
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
	else if (page.name === 'editAddress1') {
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
				url: apiDomain+'/diyapi/user/address/add',  
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
//						var phone = $('.editAddress1 .mobile').val();
//						var name = $('.editAddress1 .name').val();
//						var address =  $('.editAddress1 .edit-address').find('._js-provincePicker').val();
//						var addressCode =  $('.editAddress1 .edit-address').find('#value1').val();
//						
//						var province = address.split(',')[0];
//						var city = address.split(',')[1];
//						var county = address.split(',')[2];
//						var otherAddress = $('.editAddress1 .otherAddress').val();
//						var provinceCode = addressCode.split(',')[0];
//						var cityCode = addressCode.split(',')[1];
//						var countyCode = addressCode.split(',')[2];
//			
						var id = data.data.id;
						//将数据存储到localStorage中
						localStorage.setItem("chooseAddressId",id);
						//判断是否是拼团
						if(GetQueryString('fromgroup')){
							location.reload();
						}else{
							window.location.href='orderConfirm.html?channel='+channel+'&tradeOrderId='+tradeOrderId;
						}
						
					}else{
						mainView.router.back();
						loadPage();
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
	else if (page.name === 'eiditAddressLogin') {
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
				var url,data,successFun;
				url = apiDomain+'/diyapi/user/login/code';
				successFun = function(data){
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
				uploadData(url,true,data,successFun);
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
			var url,data,successFun;
			url = apiDomain+'/diyapi/user/login';
			successFun = function(data){
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
						url: apiDomain+'/diyapi/user/address/add',  
						type: 'POST',
						timeout: 0,
						async: true,
						data: data, 
						dataType: 'json',
						beforeSend: function() {
							//可加入loading的效果
						},
						success: function(data) {
							var id = data.data.id;
							//将数据存储到localStorage中
							localStorage.setItem("chooseAddressId",id);
							deleteCookie('temporaryToken');
							mainView.router.back();
							loadPage();
						},
						error: function(data) {
							console.log("地址修改失败")
						}
					})
				}
			};
			uploadData(url,true,data,successFun);
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
	else if (page.name === 'modifyAddress') {
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
			if($('.xl-switch .xl-checkbox').hasClass('xl-checkBox-active')){
				isDefault = true;
			}else{
				isDefault = false;
			}
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
			addSendBack(data,apiDomain+'/diyapi/user/address/modify');
			mainView.router.back();
			if(GetQueryString('tradeOrderId')){
				loadOrderComfirm();
			}else{
				loadPage();
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
	else if (page.name === 'useAddress') {
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
				url: apiDomain+'/diyapi/user/address/modify', 
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
					//判断是否是拼团
					if(GetQueryString('fromgroup')){
						location.reload();
					}else{
						window.location.href='orderConfirm.html?channel='+channel+'&tradeOrderId='+tradeOrderId;
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
	
	
	
	//收货地址列表
	else if (page.name === 'address') {
		ADDress();
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
				addSendBack(data,apiDomain+'/diyapi/user/address/delete');
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
				url: apiDomain+'/diyapi/user/address/modify', 
				type: 'POST',
				timeout: 0,
				async: true,
				data: data, 
				dataType: 'json',
				beforeSend: function() {
					//可加入loading的效果
				},
				success: function(data) {
					loadPage();
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
else if (page.name === 'chooseAddress') {
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
			//判断是否是拼团
			if(GetQueryString('fromgroup')){
				location.reload();
			}else{
				window.location.href='../main/orderConfirm.html?channel='+channel+'&tradeOrderId='+tradeOrderId;
			}
			
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
	//客服页面
	else if (page.name === 'cusService') {
				$('.themeColor').css('background-color',themeColor);
	}
		
		
		
	})