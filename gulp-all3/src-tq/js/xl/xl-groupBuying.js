//var apiDomain = 'http://192.168.1.249:9081';
//var token = GetQueryString('token')||getCookie('token');
//setCookie('token',token);
var channel = GetQueryString('channel') || getCookie('channel') || 'etime';
setCookie('channel', channel); //将channel存入cookie

//团购详情
var groupDetail = function(){
//	alert(getCookie('dec'))
	if(!getCookie('dec') == 1 || getCookie('dec') == null){
		deleteCookie('dec');//设置一个flag
		if(GetQueryString('groupId')){
			window.location.href = 'https://api.51app.cn/webPage/tq/web/html/groupBuying/AuthorizedLogin.html?groupId='+GetQueryString('groupId');

		}else{
			window.location.href = 'https://api.51app.cn/webPage/tq/web/html/groupBuying/AuthorizedLogin.html?groupGoodsId='+ GetQueryString('groupGoodsId');
		}
	}
	deleteCookie('dec');//设置一个flag
	
	var token = GetQueryString('token')||getCookie('token');
	setCookie('token',token);
	var url, successFun, dataBox, dataBox1, dataBox2;
	groupId = GetQueryString('groupId');
	if (GetQueryString('groupGoodsId')) {
		data = {
			'groupGoodsId':GetQueryString('groupGoodsId'),
			'token':token
		}
	} else{
		data = {
			'groupId':groupId,
			'token':token
		}
	}
	url = apiDomain + '/diyapi/group/goods/detail/h5';
	successFun = function(data) {
		if (data.code == 200) {
			var bannerlList = data.data.bannerlList,
			goods = data.data.goods,
			GroupGoods = data.data.GroupGoods,
			group = data.data.group,
			detailList = data.data.detailList;
			//倒计时时间
			var t = group.gameOverTime,
			mill = 9;
			dataBox = '';
			$.each(bannerlList, function(i) {
				var imageUrl = bannerlList[i].imageUrl;
				dataBox += '<li class="slider_item swiper-slide"><div class="effectImg"><img class="frontImg" src="'+ imageUrl +'"></div></li>'
			});
			$('.slider_list').empty().append(dataBox);
			var mySwiper1 = new Swiper ('.swiper-container', {
				pagination: '.swiper-pagination',
				speed: 400,
				loop: true
			});
			var dataBox = '';
			dataBox = '<div class="detail-goodsOuter" data-name="'+ goods.name +'" data-diyType="'+ goods.diyType +'" data-goodsId="'+ goods.id +'" data-groupGoodsId="'+ group.groupGoods.id +'"><span class="detail-goodPrice">￥<i>'+ (goods.groupPrice || 0).toFixed(2).split('.')[0] 
						+'.<i style="font-size:0.32rem!important">'+ (goods.groupPrice || 0).toFixed(2).split('.')[1] +'</i></i></span><div class="detail-good-top"><span class="detail-goodName">'+ goods.name 
						+'</span></div></div><div><div class="detail-good-middle"><span class="detail-oldGoodPrice"><i>￥&nbsp;'
						+ (goods.originalPrice || 0).toFixed(2) +'</i></span><span class="detail-peopel">已拼<b>'+ goods.soldNum +'</b>件<i>'+ group.groupGoods.orderRequired +'人团</i></span></div></div>'
			$('.detailText').empty().append(dataBox)
			
//			dataBox = '';
//			dataBox = GroupGoods.soldNum + '人正在拼单，可直接参与'
//			$('.groupCon .groupConHead span').text(dataBox);
			dataBox = '';
			if (GetQueryString('groupGoodsId')) {
				
				//暂时去掉开团时展示的团列表
//				var groupList = data.data.groupList;
//				if (groupList.length>0) {
//					$('.groupCon .groupBox .groupPeople .groupPeopleHead').css('background-image','url('+ groupList[0].user.headImageUrl +')');
//					$('.groupCon .groupBox .groupPeople .groupPeopleName').text(groupList[0].user.alias).attr('data-groupStatus',groupList[0].status);
//					if (groupList[0].status == 0) {
//						$('.groupCon .groupBox .buyingCon p').eq(0).empty().append('还差<span>'+ groupList[0].residue +'人</span>拼成')
//					}else if (groupList[0].status == 1) {
//						$('.groupCon .groupBox .buyingCon p').eq(0).empty().append('已成团');
//						t = 0;
//						clearInterval(timer1);
//						$('.mill i').eq(0).text(0)
//					}else if (groupList[0].status == 2) {
//						$('.groupCon .groupBox .buyingCon p').eq(0).empty().append('拼团失败');
//						t = 0;
//						clearInterval(timer1);
//						$('.mill i').eq(0).text(0)
//					}
////					$('.groupCon .groupBox .buyingCon').attr('data-groupId',groupList[0].id).attr('data-residue',groupList[0].residue).attr('data-userAlias',groupList[0].user.alias);
//				} else{
					$('.groupCon').hide();
//				}
				$('.bottom3').show().siblings().hide();
			} else{
				$('.groupCon .groupBox .groupPeople .groupPeopleHead').css('background-image','url('+ group.user.headImageUrl +')');
				$('.groupCon .groupBox .groupPeople .groupPeopleName').text(group.user.alias).attr('data-groupStatus',group.status);
				if (group.status == 0) {
					$('.groupCon .groupBox .buyingCon p').eq(0).empty().append('还差<span>'+ group.residue +'人</span>拼成')
				}else if (group.status == 1) {
					$('.groupCon .groupBox .buyingCon p').eq(0).empty().append('已成团');
					t = 0;
					clearInterval(timer1);
					$('.mill i').eq(0).text(0)
				}else if (group.status == 2) {
					$('.groupCon .groupBox .buyingCon p').eq(0).empty().append('拼团失败');
					t = 0;
					clearInterval(timer1);
					$('.mill i').eq(0).text(0)
				}
				$('.groupCon .groupBox .buyingCon').attr('data-groupId',group.id).attr('data-residue',group.residue).attr('data-userAlias',group.user.alias);
			
				if(group.inGorup == true){
					$('.bottom4').show().siblings().hide();
				}else{
					if (group.status == 0) {
						$('.bottom2').show().siblings().hide();
					}else if (group.status == 1) {
						$('.bottom3').show().siblings().hide();
					}else if (group.status == 2) {
						$('.bottom3').show().siblings().hide();
					}
				}
			
			}
			
			
			//设置倒计时时间
			if (t<1) {
				t = 0;
				clearInterval(timer1);
				$('.mill i').eq(0).text(0)
			}
			countdown(t);
			var timer = setInterval(function() {
				t = t - 1000;
				if (t<0) {
					t=0;
					clearInterval(timer1);
					$('.mill i').eq(0).text(0)
				}
				countdown(t)
			}, 1000);
			
			var timer1 = setInterval(function(){
				if(mill < 0){
					mill =9;
				}
				$('.mill i').eq(0).text(mill)
				mill --;
			},100)
			dataBox = '';
			$.each(detailList, function(i) {
				dataBox += '<img src="'+ detailList[i].imageUrl +'"/>'
			});
			$('.detailImg').empty().append(dataBox)
			if(isIphoneX()){
				$('#groupDetail .toolbar').css('height','74px');
				$('#groupDetail .toolbar .bottomBtn').css('bottom','24px');
				$('#address .page-content').css('padding-bottom','1.5rem')
			}
			$('.dom-noLoad').hide();
		}
	}
	uploadData(url, true, data, successFun);
	
}

//团购结果
var groupResult = function(){
	var url, successFun, dataBox, dataBox1, dataBox2;
	var token = getCookie('token');
	
	var loadResult = function(groupId,token){
		var data = {
			'groupId':groupId,
			'token':token
		}
		url = apiDomain + '/diyapi/group/detail';
		successFun = function(data) {
			if(data.code == 200){
				var goodsBasic = data.data.goodsBasic;
				groupGoods = data.data.groupGoods;
				//设置倒计时时间
				var t = data.data.gameOverTime,
				mill = 9;
				dataBox = '';
				dataBox = '<img src="'+ goodsBasic.coverImageUrl +'"/>';
				$('.groupResult .goodsImg').empty().append(dataBox);
				dataBox = '';
				dataBox = '<div class="goodsName" data-groupGoodsId="'+ data.data.groupGoodsId +'">'+ goodsBasic.name +'</div><div class="goodsPrices"><span>￥'+ goodsBasic.groupPrice.toFixed(2) +'</span><span>￥'+ goodsBasic.originalPrice.toFixed(2)
				+'</span></div><div class="soldNum"><i>'+ groupGoods.orderRequired +'人团</i><span>已拼团'+ groupGoods.soldNum +'件</span></div>'
				$('.groupResult .goodsInfo').empty().append(dataBox);
				dataBox = '';
				var userList = data.data.userList;
				$.each(userList, function(i) {
					if(i == 0){
						dataBox += '<li><img src="'+ userList[0].headImageUrl +'"/><i>拼主</i></li>'
					}else{
						dataBox += '<li><img src="'+ userList[i].headImageUrl +'"/></li>'
					}
					
				});
				if (data.data.status == 0) {
					dataBox += '<div class="noFull"><img src="../../img/groupBuying/noFull.png"/></div>';
					$('.groupResult .groupResultCon .remaindTime .reDo').text('邀请好友').addClass('toFriends');
				}else if(data.data.status == 1){
					t = 0;
					clearInterval(timer3);
					$('.mill i').eq(0).text(0);
					$('.remaindTime').empty().append('<span class="remaindText">拼团成功，马上发货！</span><span class="reDo">再拼一单</span>');
					$('.groupResult .groupResultCon .remaindTime .reDo').text('再拼一单').addClass('groupMore');
				}else if(data.data.status == 2){
					$('.groupResult .groupResultCon .remaindTime .reDo').text('重新参团').addClass('groupAgain');
					
				}
				$('.groupResult .buyPeopleHead').empty().append(dataBox)
				
				if (t<1) {
					t =0;
					clearInterval(timer3);
					$('.mill i').eq(0).text(0)
				}
				countdown(t)
				var timer = setInterval(function() {
					t = t - 1000;
					if (t<0) {
						t=0;
						clearInterval(timer3);
						$('.mill i').eq(0).text(0)
					}
					countdown(t)
				}, 1000);
				
				var timer3 = setInterval(function(){
					if(mill < 0){
						mill =9;
					}
					$('.mill i').eq(0).text(mill)
					mill --;
				},100)
				$('.dom-noLoad').hide();
				var groupGoodsId = $('.groupResult .goodsInfo').find('.goodsName').attr('data-groupgoodsid');
				wxShare('腾趣拼团商城','https://api.51app.cn/webPage/tq/web/html/groupBuying/AuthorizedLogin.html?groupGoodsId='+groupGoodsId,'https://api.51app.cn/webPage/tq/web/img/logo.png')
			}
		}
		uploadData(url, true, data, successFun);
	}
	if(GetQueryString('tradeOrderId')){
		var tradeOrderId = GetQueryString('tradeOrderId');
		var data = {
			'tradeOrderId':tradeOrderId,
			'token':token
		}
		url = apiDomain + '/diyapi/group/trade/detail';
		successFun = function(data) {
			if(data.code == 200){
				var groupId = data.data.group.id;
				loadResult(groupId,token);
			}else if(data.code == 3000){
				cashier('body');
			}
		}
		uploadData(url, true, data, successFun);
	}else{
		var groupId =  GetQueryString('groupId');
		loadResult(groupId,token);
	}
	
	

	
}

//倒计时
function countdown(t) {
	var h = getDoubleDigit(Math.floor(t / 1000 / 60 / 60 % 24));
	var m = getDoubleDigit(Math.floor(t / 1000 / 60 % 60));
	var s = getDoubleDigit(Math.floor(t / 1000 % 60));
	$('.hour i').eq(0).text(h[0])
	$('.hour i').eq(1).text(h[1])
	$('.minute i').eq(0).text(m[0])
	$('.minute i').eq(1).text(m[1])
	$('.second i').eq(0).text(s[0])
	$('.second i').eq(1).text(s[1])
}
function getDoubleDigit(data) {
	if(data < 10) {
		data = '0' + data;
	}
	return String(data);
}


//一键参团
$('#groupDetail').on('click','.bottom2',function(){
	var type = $('.detail-goodsOuter').attr('data-diyType'),
	goodsId = $('.detail-goodsOuter').attr('data-goodsId');
	if(type == 1){
		groupChoose('groupBuy');
	}else{
//		window.location.href = 'https://api.51app.cn/webPage/tq/web/html/main/diy2.html?fromgroup=yes&goodsId=' + goodsId;
		customGoods();
	}
	
})
//一键开团
$('#groupDetail').on('click','.bottom4',function(){
	var groupId = $('.groupCon .groupBox .buyingCon').attr('data-groupId');
	window.location.href = 'groupResult.html?groupId='+groupId;
})

//参团选材质
var groupChoose = function(OP){
	var url, successFun;
	var goodsId = $('.detail-goodsOuter').attr('data-goodsId');
	url = apiDomain + '/diyapi/goods/overview?goodsId=' + goodsId;
	successFun = function(data) {
		var operate = ''
		var operate = OP; //记录下是点击了一键参团
		chooseAttribute('body', data, confirmAttribute, operate); //加载选材质内容 
	};
	loadData(url, true, successFun);
	var confirmAttribute = function(data) {};
}
//详情页中选择材质弹窗 加减数量  ，写在外面，防止点击多次
$('body').on('click', '.attributePopup .ap-numBox .count .add', function() {
	var num = $('.attributePopup .ap-numBox .count input').val();
	num++;
	if (num < 10000) {
		$('.attributePopup .ap-numBox .count input').val(num);
	}
	isShowSubtract1()
});

$('body').on('click', '.attributePopup .ap-numBox .count .subtract', function() {
	var num = $('.attributePopup .ap-numBox .count input').val();
	num--;
	if (num > 0) {
		$('.attributePopup .ap-numBox .count input').val(num);
	}
	isShowSubtract1()
});

//参团时参团人员弹窗
var groupLayer = function(){
	var url, successFun, dataBox, dataBox1, dataBox2;
	var token = getCookie('token'),
	groupId = GetQueryString('groupId');
	data = {
		'groupId':groupId,
		'token':token
	}
	url = apiDomain + '/diyapi/group/goods/detail/h5';
	successFun = function(data) {
		if (data.code == 200) {
			var goods = data.data.goods,
			GroupGoods = data.data.GroupGoods,
			group = data.data.group;
			//倒计时时间
			var t = group.gameOverTime,
			mill = 9;
			
			if (group.status == 0) {
				$('.joinGroupCon .groupName').text('参与'+ group.user.alias +'的拼单');
				$('.joinGroupCon .groupTime .noPeopleNum').text(group.residue);
				dataBox = '';
				var userList = group.userList;
				$.each(userList, function(i) {
					if(i == 0){
						dataBox += '<li><img src="'+ userList[0].headImageUrl +'"/><i>拼主</i></li>'
					}else{
						dataBox += '<li><img src="'+ userList[i].headImageUrl +'"/></li>'
					}
					
				});
				dataBox += '<div class="noFull"><img src="../../img/groupBuying/noFull.png"/></div>';
				$('.joinGroupCon .buyPeopleHead').empty().append(dataBox);
				//设置倒计时时间
				if (t<1) {
					t = 0;
					clearInterval(timer3);
					$('.mill i').eq(0).text(0)
				}
				countdown(t)
				var timer2 = setInterval(function() {
					t = t - 1000;
					if (t<0) {
						t=0;
						clearInterval(timer3);
						$('.mill i').eq(0).text(0)
					}
					countdown(t)
				}, 1000);
				
				var timer3 = setInterval(function(){
					if(mill < 0){
						mill =9;
					}
					$('.mill i').eq(0).text(mill)
					mill --;
				},100)
				$('.mask').show();
				$('.joinGroupCon').show();
				$('.attributePopupBox').hide();
			}else if (group.status == 1) {
				layerHint('该团已满员，请重新开团！');
				setTimeout(function(){
					location.reload();
				},2000)
				$('.attributePopupBox').hide();
			}else{
				layerHint('该团超时未满员，请重新开团！');
				setTimeout(function(){
					location.reload();
				},2000)
				$('.attributePopupBox').hide();
			}
		}
	}
	uploadData(url, true, data, successFun);
}

//购买商品
var groupOrdercomfirm = function(){
	var url, successFun, dataBox, dataBox1, dataBox2;
	var groupId = $('.groupCon .groupBox .buyingCon').attr('data-groupId');
	if (GetQueryString('groupGoodsId')) {
		data = {
			'groupGoodsId':GetQueryString('groupGoodsId'),
			'token': getCookie('token')
		}
		url = apiDomain + '/diyapi/group/add';
		successFun = function(data) {
			if(data.code == 200){
				var groupUserId = data.data.id;
				token = getCookie('token');
				var selectedStyleList = JSON.parse(localStorage.getItem('selectedStyleList'));
				var goodsId = selectedStyleList.goodsId;
				var goodsName = selectedStyleList.name;
				var previewList = selectedStyleList.previewList;
				var goodsStyleId = selectedStyleList.id;
				var num = 1;
				sendUserData1(channel,goodsId,goodsName,previewList,goodsStyleId,num,groupUserId)
			}else{
//				layerHint('该商品团购已满员，请重新开团！');
				var groupGoodsId = $('.detail-goodsOuter').attr('data-groupGoodsId');
				setTimeout(function(){
					window.location.href = 'AuthorizedLogin.html?groupGoodsId='+groupGoodsId;
				},2000)
			}
		}
	} else{
		data = {
			'groupId':groupId,
			'token': getCookie('token')
		}
		url = apiDomain + '/diyapi/group/join';
		successFun = function(data) {
			if(data.code == 200){
				var groupUserId = data.data.id;
				token = getCookie('token');
				var selectedStyleList = JSON.parse(localStorage.getItem('selectedStyleList'));
				var goodsId = selectedStyleList.goodsId;
				var goodsName = selectedStyleList.name;
				var previewList = selectedStyleList.previewList;
				var goodsStyleId = selectedStyleList.id;
				var num = 1;
				
				sendUserData1(channel,goodsId,goodsName,previewList,goodsStyleId,num,groupUserId)
			}else{
				layerHint('该团已满员，请重新开团！');
				var groupGoodsId = $('.detail-goodsOuter').attr('data-groupGoodsId');
				setTimeout(function(){
					window.location.href = 'AuthorizedLogin.html?groupGoodsId='+groupGoodsId;
				},2000)
			}
		}
	}
	uploadData(url, true, data, successFun);
	
	function sendUserData1(channel,goodsId,goodsName,previewList,goodsStyleId,num,groupUserId) {
		//loading层
		layer.open({
			content: '',
			type: 2,
			shadeClose: false
		});
		var url, successFun, data, errorFun;
		url = apiDomain + '/diyapi/trade/preorder';
		data = {
			data: JSON.stringify({
				"token": getCookie('temporaryToken') || getCookie('token'),
				"channel": channel,
				"goodsId": goodsId,
				"name": goodsName,
				"num": num,
				"goodsStyleId": goodsStyleId,
				"styleSideArray": [],
				'groupUserId':groupUserId
			})
		}
		successFun = function(data) {
			$('.layui-m-layer').remove()
			if (data.code == 200) {
				window.localStorage.setItem('isComfirm', 1);
				window.location.href = '../main/orderConfirm.html?channel=' + channel + '&tradeOrderId=' + data.data.id+ '&fromgroup=yes';
			} else {
				layerHint('购买失败，请重试')
			}
	
		}
		uploadData(url, true, data, successFun);
	
	}
}


//点击参团弹窗 确定按钮
$('.joinGroupCon').on('click','.joinComfirm',function(){
	groupOrdercomfirm();
})

//关闭参团人员弹窗
$('.joinGroupCon').on('click','.closeIt',function(){
	$('.mask').hide();
	$('.joinGroupCon').hide();
})
//选完材质后一键参团
$('body').off('click').on('click','.groupBuy',function(){
	groupLayer();
})
	

//一键开团
$('#groupDetail').on('click','.bottom3',function(){
	var type = $('.detail-goodsOuter').attr('data-diyType'),
	goodsId = $('.detail-goodsOuter').attr('data-goodsId');
	if(type == 1){
		groupChoose('groupOpen');
	}else{
//		window.location.href = 'https://api.51app.cn/webPage/tq/web/html/main/diy2.html?fromgroup=yes&goodsId=' + goodsId;
		customGoods();
	}
})
//选完材质后一键开团
$('body').off('click').on('click','.groupOpen',function(){
	groupOrdercomfirm()
})

//拼团规则
$('.groupResult').on('click','.groupInTroduce',function(){
	mainView.router.loadPage('groupInTroduce.html')
})

//再拼一单
$('.groupResult').on('click','.groupMore',function(){
	var groupGoodsId = $('.groupResult .goodsInfo').find('.goodsName').attr('data-groupGoodsId');
	window.location.href = 'AuthorizedLogin.html?groupGoodsId='+groupGoodsId;
})
//重新参团支付
$('.groupResult').on('click','.groupMore',function(){
	cashier('body');
})

//邀请好友
$('.groupResult').on('click','.toFriends',function(){
	$('.shareFriends').show();
})
	
//跳转定制页面前的验证
var customGoods = function() {
	var url, successFun, dataBox, dataBox1, dataBox2;
	var groupId = $('.groupCon .groupBox .buyingCon').attr('data-groupId');
	if (GetQueryString('groupGoodsId')) {
		data = {
			'groupGoodsId':GetQueryString('groupGoodsId'),
			'token': getCookie('token')
		}
		url = apiDomain + '/diyapi/group/add';
		successFun = function(data) {
			if(data.code == 200){
				var groupUserId = data.data.id;
				var goodsId = $('.detail-goodsOuter').attr('data-goodsId');
				window.location.href = 'https://api.51app.cn/webPage/tq/web/html/main/diy2.html?fromgroup=yes&goodsId=' + goodsId + '&groupUserId=' + groupUserId;
			}else{
//				layerHint('该商品团购已满员，请重新开团！');
				var groupGoodsId = $('.detail-goodsOuter').attr('data-groupGoodsId');
				setTimeout(function(){
					window.location.href = 'AuthorizedLogin.html?groupGoodsId='+groupGoodsId;
				},2000)
			}
		}
	} else{
		data = {
			'groupId':groupId,
			'token': getCookie('token')
		}
		url = apiDomain + '/diyapi/group/join';
		successFun = function(data) {
			if(data.code == 200){
				var groupUserId = data.data.id;
				var goodsId = $('.detail-goodsOuter').attr('data-goodsId');
				window.location.href = 'https://api.51app.cn/webPage/tq/web/html/main/diy2.html?fromgroup=yes&goodsId=' + goodsId + '&groupUserId=' + groupUserId;
			}else{
				layerHint('该团已满员，请重新开团！');
				var groupGoodsId = $('.detail-goodsOuter').attr('data-groupGoodsId');
				setTimeout(function(){
					window.location.href = 'AuthorizedLogin.html?groupGoodsId='+groupGoodsId;
				},2000)
			}
		}
	}
	uploadData(url, true, data, successFun);
}
