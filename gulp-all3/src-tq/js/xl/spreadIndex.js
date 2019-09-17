//渠道推广 先从url上面取，没有再去cookie去取，防止在支付后后台返回的链接里面没有带channel
var channel = GetQueryString('channel') || getCookie('channel') || 'etime';
setCookie('channel', channel);
if(!GetQueryString('channel')){
	var index  = window.location.href.indexOf('html?');
	var stateObject = {};
	var title = document.title;
	var newUrl;
	if(index > 0){
		newUrl = window.location.href +'&channel='+channel;
	}else{
	    newUrl = window.location.href +'?channel='+channel;
	}
	history.pushState(stateObject, title, newUrl);
}


var spreadIndex = function(){
	var url, data, successFun, errorFun;
	url = apiDomain + '/diyapi/topic/create';
	successFun = function(data) {
		if(data.code == 200){
			var bannerList = data.data.bannerList,
			topic = data.data.topic,
			topicItemList = data.data.topicItemList;
			//顶部banner
			dataBox = '';
			$.each(bannerList, function(i) {
				var imageUrl = bannerList[i].imageUrl;
				if(bannerList[i].isUrl == true){
					dataBox += '<div class="swiper-slide getUrl" data-url="'+ bannerList[i].url +'"><img src="'+ imageUrl +'" /></div>'
				}else{
					dataBox += '<div class="swiper-slide" data-id="'+ bannerList[i].goods.id +'" data-diyType="'+ bannerList[i].goods.diyType +'"><img src="'+ imageUrl +'" /></div>'
				}
			});
			$('.certify .swiper-wrapper').empty().append(dataBox);
			var certifySwiper = new Swiper('.swiper-banner', {
				autoplay: 3000,
                loop: true,
				effect: 'coverflow',
                slidesPerView: 1,
                centeredSlides: true,
                pagination: '.swiper-pagination',
                coverflow: {
                    rotate: 0,
                    stretch: 3,
                    depth: 300,
                    modifier: 1,
                    slideShadows: false
                },
                observer: true, //修改swiper自己或子元素时，自动初始化swiper
                observeParents: true //修改swiper的父元素时，自动初始化swiper
			});
			
			//页面title
			$(document).attr('title',topic.name);
			//版块列表
			dataBox = '';
			$.each(topicItemList, function(i) {
				var layout = topicItemList[i].layout,
				itemGoodsList = topicItemList[i].itemGoodsList;
				if(layout == 1){   //单行
					dataBox += '<div class="plateBox plate7"><h1 class="plateTitle"><span class="title _fm-f-16">'+ topicItemList[i].title +'</span>';
					if(itemGoodsList.length >6){
						dataBox += '<i class="lookMore _fm-f-12" data-id="'+ topicItemList[i].id +'">查看更多 ></i>'
					}
					dataBox += '</h1><div class="plateCon"><ul>';
					
					$.each(itemGoodsList, function(j) {
						if (j < 6) {
							if(itemGoodsList[j].isUrl == true){
								dataBox += '<li class="item getUrl" data-url="'+ itemGoodsList[j].url +'"><img src="'+ itemGoodsList[j].coverImageUrl +'"/></li>'
							}else{
								dataBox += '<li class="item" data-id="'+ itemGoodsList[j].goods.id +'" data-diyType="'+ itemGoodsList[j].goods.diyType +'"><img src="'+ itemGoodsList[j].coverImageUrl +'"/></li>'
							}
							
						} 
					});	
					dataBox += '</ul></div></div>'
				}else if(layout == 2){  //左图有文字
					dataBox += '<div class="plateBox plate1"><h1 class="plateTitle"><span class="title _fm-f-16"><i></i>'+ topicItemList[i].title +'</span><i class="_fm-f-12 title-right">'+ topicItemList[i].content +'</i></h1><div class="plateCon">'
					if (topicItemList[i].mediaType == 1) {  //视频
						if(topicItemList[i].isUrl == true){
							dataBox += '<div class="imgOrvideo getUrl" data-url="'+ topicItemList[i].url +'"><div class="imgOrvideoCon"><video loop muted autoplay><source src="'+ topicItemList[i].videoUrl +'" type="video/mp4"><source src="'+ topicItemList[i].videoUrl +'" type="video/ogg"><source src="'+ topicItemList[i].videoUrl 
								+'" type="video/webm"></video></div><div class="imgMask"><img src="'+  (topicItemList[i].maskImageUrl || '')  +'"/></div></div>'
						}else{
							dataBox += '<div class="imgOrvideo"><div class="imgOrvideoCon"><video loop muted autoplay><source src="'+ topicItemList[i].videoUrl +'" type="video/mp4"><source src="'+ topicItemList[i].videoUrl +'" type="video/ogg"><source src="'+ topicItemList[i].videoUrl 
								+'" type="video/webm"></video></div><div class="imgMask"><img src="'+  (topicItemList[i].maskImageUrl || '')  +'"/></div></div>'
						}
						
					} else if(topicItemList[i].mediaType == 2 || topicItemList[i].mediaType == 3){   //前景图||背景图
						if(topicItemList[i].isUrl == true){
							dataBox += '<div class="imgOrvideo getUrl" data-url="'+ topicItemList[i].url +'"><div class="imgOrvideoCon"><img src="'+ topicItemList[i].imageUrl +'"/></div></div>'
						}else{
							dataBox += '<div class="imgOrvideo"><div class="imgOrvideoCon"><img src="'+ topicItemList[i].imageUrl +'"/></div></div>'
						}
						
					}
					dataBox += '<div class="plateGoodsList1"><ul class="downList">';
					$.each(itemGoodsList, function(j) {
						if(i<3){
							switch(Number(itemGoodsList[j].goods.diyType)) {
								case 1:
									type = '<img class="diyTypeIcon" src="../../img/type/1.png" alt="精品"/>';
									break;
								case 2:
									type = '<img class="diyTypeIcon" src="../../img/type/2.png" alt="刻字"/>';
									break;
								case 3:
									type = '<img class="diyTypeIcon" src="../../img/type/3.png" alt="图印"/>';
									break;
								case 6:
									type = '<img class="diyTypeIcon" src="../../img/type/6.png" alt="冲印"/>';
									break;
								default:
									type = '';
									break;
							}
							if(itemGoodsList[j].isUrl == true){
								dataBox += '<li class="item getUrl" data-url="'+ itemGoodsList[j].url +'"><img src="'+ itemGoodsList[j].coverImageUrl +'"/></li>'
								dataBox += '<li class="getUrl" data-url="'+ itemGoodsList[j].url +'"><img src="'+ itemGoodsList[j].goods.coverImageUrl +'" /><div class="item"><h1 class="_fm-f-14">'+ itemGoodsList[j].goods.name +'</h1><p class="itemCon"><span class="_fm-f-14">'+ type +'</span><span class="_fm-f-12">已售'+ itemGoodsList[j].goods.soldNum +'件</span></p></div></li>'
							}else{
								dataBox += '<li data-id="'+ itemGoodsList[j].goods.id +'" data-diyType="'+ itemGoodsList[j].goods.diyType +'"><img src="'+ itemGoodsList[j].goods.coverImageUrl +'" /><div class="item"><h1 class="_fm-f-14">'+ itemGoodsList[j].goods.name +'</h1><p class="itemCon"><span class="_fm-f-14">'+ type +'</span><span class="_fm-f-12">已售'+ itemGoodsList[j].goods.soldNum +'件</span></p></div></li>'
							}
							
						}
					});
					dataBox += '</ul></div></div></div>'
				}else if(layout == 3){  //横排轮播
					if(topicItemList[i].content == ''){
						dataBox += '<div class="plateBox plate3" data-length="'+ itemGoodsList.length +'"><h1 class="plateTitle"><span class="title _fm-f-16"><i></i>'+ topicItemList[i].title +'</span>'
						if(itemGoodsList.length >3){
							dataBox += '<i class="_fm-f-12 lookMore" data-id="'+ topicItemList[i].id +'">查看更多 ></i></h1>'
						}else{
							dataBox += '</h1>'
						}
					}else{
						dataBox += '<div class="plateBox plate6" data-length="'+ itemGoodsList.length +'"><h1 class="plateTitle"><span class="title _fm-f-16">'+ topicItemList[i].title +'</span></h1><h2 class="Vice-plateTitle _fm-f-14">'+ topicItemList[i].content +'</h2>';
					}
					
					dataBox += '<div class="plateCon"><div class="scrollBox">';
					$.each(itemGoodsList, function(j) {
						if(j<3){
							if (itemGoodsList[j].mediaType == 1) {
								if(itemGoodsList[j].isUrl == true){
									dataBox += '<div class="item getUrl" data-url="'+ itemGoodsList[j].url +'"><div class="imgOrvideoCon"><video loop muted autoplay><source src="'
										+ topicItemList[i].videoUrl +'" type="video/mp4"><source src="'+ topicItemList[i].videoUrl +'" type="video/ogg"><source src="'+ topicItemList[i].videoUrl
										+'" type="video/webm"></video></div><div class="imgMask"><img src="'+  (itemGoodsList[j].maskImageUrl || '')  +'"/></div></div>'
								}else{
									dataBox += '<div class="item" data-id="'+ itemGoodsList[j].goods.id +'" data-diyType="'+ itemGoodsList[j].goods.diyType +'"><div class="imgOrvideoCon"><video loop muted autoplay><source src="'
										+ topicItemList[i].videoUrl +'" type="video/mp4"><source src="'+ topicItemList[i].videoUrl +'" type="video/ogg"><source src="'+ topicItemList[i].videoUrl
										+'" type="video/webm"></video></div><div class="imgMask"><img src="'+  (itemGoodsList[j].maskImageUrl || '')  +'"/></div></div>'
								}
								
							} else if(itemGoodsList[j].mediaType == 2 || itemGoodsList[j].mediaType == 3){
								if(itemGoodsList[j].isUrl == true){
									dataBox += '<div class="item getUrl" data-url="'+ itemGoodsList[j].url +'"><div class="imgOrvideoCon"><img src="'+ itemGoodsList[j].coverImageUrl +'"/></div></div>'
								}else{
									dataBox += '<div class="item" data-id="'+ itemGoodsList[j].goods.id +'" data-diyType="'+ itemGoodsList[j].goods.diyType +'"><div class="imgOrvideoCon"><img src="'+ itemGoodsList[j].coverImageUrl +'"/></div></div>'
								}
							}
						}
						
					});
					dataBox += '</div></div></div>';
				}else if(layout == 4){  //横排3个
					if (topicItemList[i].mediaType == 2 || topicItemList[i].mediaType == 1) {
						dataBox += '<div class="plateBox plate4"><h1 class="plateTitle"><span class="title _fm-f-16"><i></i>'+ topicItemList[i].title +'</span>';
						if(itemGoodsList.length >3){
							dataBox += '<i class="_fm-f-12 lookMore" data-id="'+ topicItemList[i].id +'">查看更多 ></i>'
						}
						dataBox += '</h1><div class="plateCon">';
						if(topicItemList[i].mediaType == 1){
							if(topicItemList[i].isUrl == true){
								dataBox += '<div class="imgOrvideo getUrl" data-url="'+ topicItemList[i].url +'"><video loop muted autoplay><source src="'+ topicItemList[i].videoUrl +'" type="video/mp4"><source src="'+ topicItemList[i].videoUrl +'" type="video/ogg"><source src="'+ topicItemList[i].videoUrl
								+'" type="video/webm"></video></div><div class="imgMask"><img src="'+ (topicItemList[i].maskImageUrl || '') +'"/></div></div>'
							}else{
								dataBox += '<div class="imgOrvideo"><video loop muted autoplay><source src="'+ topicItemList[i].videoUrl +'" type="video/mp4"><source src="'+ topicItemList[i].videoUrl +'" type="video/ogg"><source src="'+ topicItemList[i].videoUrl
								+'" type="video/webm"></video></div><div class="imgMask"><img src="'+ (topicItemList[i].maskImageUrl || '') +'"/></div></div>'
							}
							
						}else if(topicItemList[i].mediaType == 2){
							dataBox +='<div class="imgOrvideo"><img src="'+ topicItemList[i].imageUrl +'"/></div>'   
						}
						dataBox += '<div class="plateGoodsList2"><ul class="downList">';
						$.each(itemGoodsList, function(j) {
							if(itemGoodsList.length<4){
								if(itemGoodsList[j].isUrl == true){
									dataBox += '<li class="getUrl" data-url="'+ itemGoodsList[j].goods.url +'"><img src="'+ itemGoodsList[j].goods.coverImageUrl +'" /><div class="item"><h1 class="_fm-f-12">'+ itemGoodsList[j].goods.name +'</h1><p class="itemCon _fm-f-10"><span>已售'+ itemGoodsList[j].goods.soldNum +'件</span><i class="_fm-f-10">定制</i></p></div></li>'
								}else{
									dataBox += '<li data-id="'+ itemGoodsList[j].goods.id +'" data-diyType="'+ itemGoodsList[j].goods.diyType +'"><img src="'+ itemGoodsList[j].goods.coverImageUrl +'" /><div class="item"><h1 class="_fm-f-12">'+ itemGoodsList[j].goods.name +'</h1><p class="itemCon _fm-f-10"><span>已售'+ itemGoodsList[j].goods.soldNum +'件</span><i class="_fm-f-10">定制</i></p></div></li>'
								}	
							}
						});
						dataBox += '</ul></div></div></div>'
					} else if (topicItemList[i].mediaType == 3){
						dataBox += '<div class="plateBox plate5"><div class="plateCon"><div class="imgBg"><img src="'+ topicItemList[i].imageUrl +'"/><div class="imgMask"><p class="_fm-f-18">'+ topicItemList[i].title 
								+'</p><p class="_fm-f-15">'+ topicItemList[i].content +'</p></div></div><div class="plateGoodsList3"><ul class="downList">'
						$.each(itemGoodsList, function(j) {
							if(itemGoodsList.length<4){
								if (itemGoodsList[j].isUrl == true) {
									dataBox += '<li class="getUrl" data-url="'+ itemGoodsList[j].goods.url +'"><img src="'+ itemGoodsList[j].goods.coverImageUrl +'" /><div class="item"><h1 class="_fm-f-12">'+ itemGoodsList[j].goods.name +'</h1><p class="itemCon _fm-f-10"><span>已售'+ itemGoodsList[j].goods.soldNum +'件</span></p></div></li>'
								} else{
									dataBox += '<li data-id="'+ itemGoodsList[j].goods.id +'" data-diyType="'+ itemGoodsList[j].goods.diyType +'"><img src="'+ itemGoodsList[j].goods.coverImageUrl +'" /><div class="item"><h1 class="_fm-f-12">'+ itemGoodsList[j].goods.name +'</h1><p class="itemCon _fm-f-10"><span>已售'+ itemGoodsList[j].goods.soldNum +'件</span></p></div></li>'
								}
							}
						});
						dataBox += '</ul></div></div></div>'
					}
				}else if(layout == 5){  //左1右3
					dataBox += '<div class="plateBox plate2"><h1 class="plateTitle"><span class="title _fm-f-16"><i></i>'+ topicItemList[i].title +'</span><i class="lookMore _fm-f-12">'+ topicItemList[i].content +'</i></h1><div class="plateCon"><div class="itemLeft" data-id="'+ itemGoodsList[0].goods.id +'" data-diyType="'+ itemGoodsList[0].goods.diyType +'"><div class="leftBox"><img src="'
							+ itemGoodsList[0].goods.coverImageUrl +'"/><h2 class="_fm-f-13 overflowEllipsis">'+ itemGoodsList[0].goods.name +'</h2><p class="_fm-f-10 overflowEllipsis">'+ itemGoodsList[0].goods.tagline 
							+'</p></div></div><div class="itemRight"><div class="rightTopBox" data-id="'+ itemGoodsList[1].goods.id +'" data-diyType="'+ itemGoodsList[1].goods.diyType +'"><img src="'+ itemGoodsList[1].goods.coverImageUrl +'" /><div class="item"><h1 class="_fm-f-13 overflowEllipsis">'+ itemGoodsList[1].goods.name +'</h1><p class="_fm-f-10 overflowEllipsis">'
							+ itemGoodsList[1].goods.tagline +'</p></div></div><div class="rightButtom"><div class="buttom1Box" data-id="'+ itemGoodsList[2].goods.id +'" data-diyType="'+ itemGoodsList[2].goods.diyType +'"><img src="'+ itemGoodsList[2].goods.coverImageUrl +'"/><p>'+ itemGoodsList[2].goods.name +'</p></div><div class="buttom2Box" data-id="'+ itemGoodsList[3].goods.id +'" data-diyType="'+ itemGoodsList[3].goods.diyType +'"><img src="'
							+ itemGoodsList[3].goods.coverImageUrl +'"/><p>'+ itemGoodsList[3].goods.name +'</p></div></div></div></div></div>'
				}
			});
			$('.itemBox').empty().append(dataBox);
			
			for(var i=0;i<$('.plate3').length;i++){
				var width;
				if($('.plate3').eq(i).attr('data-length')>3){
					width = 3*5.2;
				}else{
					width = $('.plate3').eq(i).attr('data-length')*5.2;
				}
				$('.plate3').eq(i).find('.plateCon .scrollBox').css('width',width+'rem')
			}
			for(var i=0;i<$('.plate6').length;i++){
				var width;
				if($('.plate6').eq(i).attr('data-length')>3){
					width = 3*6.4;
				}else{
					width = $('.plate6').eq(i).attr('data-length')*6.4;
				}
				$('.plate6').eq(i).find('.plateCon ul').css('width',width+'rem')
			}
		}
		//查询购物车数量，购物车有商品，加红点
		if(getCookie('token')){
			var url,data,successFun;
			url = apiDomain + '/diyapi/trade/cart/num?token=' + getCookie('token');
			successFun = function(data){
				if(data.code == 200){
					if(data.data >0){
						$('.menuBox .tomyshopcar i').show();
					}else{
						$('.menuBox .tomyshopcar i').hide();
					}
				}
			}
			loadData(url, true, successFun);
		}
		$('.dom-noLoad').hide();
	};
	errorFun = function(data) {
		console.log('错误')
	}
	uploadData(url, true, data, successFun, errorFun);
}


//点击查看更多
$('body').on('click','.lookMore',function(){
	var topicItemId = $(this).attr('data-id');
	window.location.href = 'spreadGoodsList.html?topicItemId='+topicItemId+'&channel='+channel;
})

//返回
$('.back').click(function(){
	window.history.go(-1)
})


//查看更多
var spreadGoodsList = function(){
	var url, data, successFun, errorFun;
	var topicItemId = GetQueryString('topicItemId');
	data = {
		'topicItemId':topicItemId
	}
	url = apiDomain + '/diyapi/topic/item/detail';
	successFun = function(data) {
		if(data.code == 200){
			var itemGoodsList = data.data.itemGoodsList;
			var goods = [];
			dataBox = '';
			$.each(itemGoodsList, function(i) {
				var goodsItem = itemGoodsList[i].goods;
				goods.push(goodsItem);
			});
			dataBox += loadGoods(goods);
			$('.spreadGoodsList .main').empty().append(dataBox);
			$('.spreadGoodsList .headImg p').text(data.data.title)
			$('.dom-noLoad').hide();
			$('.dom-hasLoad').show();
		}
		
	};
	errorFun = function(data) {
		console.log('错误')
	}
	uploadData(url, true, data, successFun, errorFun);
}


//点击商品
$('body').on('click','.plateGoodsList1 li,.plateGoodsList2 li,.plate3 .item,.plate6 .item,.plate2 .itemLeft,.plate2 .rightTopBox,.plate2 .buttom1Box,.plate2 .buttom2Box,.plate5 li,.plate7 li,.certify .swiper-slide,.imgOrvideo',function(){
	if ($(this).hasClass('getUrl')) {
		var url = $(this).attr('data-url');
		window.location.href = url;
	} else{
		var goodsId = $(this).attr('data-id'),
		diyType = $(this).attr('data-diyType');
		window.location.href = 'goodsDetail.html?goodsId='+goodsId+'&diyType='+diyType+'&channel='+channel;
	}
	
})



//点击首页菜单栏
$('.menuBox').on('click','.control',function(){
	if ($(this).hasClass('controlTrans1')) {
		$(this).removeClass('controlTrans1').addClass('controlTrans2')
	} else{
		$(this).addClass('controlTrans1').removeClass('controlTrans2')
	}
	if ($('.menuBox .menuIcon').eq(0).hasClass('showIt')) {
		$('.menuBox .menuIcon').addClass('hideIt').removeClass('showIt');
	} else{
		$('.menuBox .menuIcon').addClass('showIt').removeClass('hideIt');
	}
})

//去客服页面
$('.menuBox').on('click','.toservice',function(){
	//添加talkingData点击事件监测
	var MapKv =  {"channel":channel};
	TDAPP.onEvent ('点击客服','首页活动页面',MapKv);
	window.location.href = '../other/cusService.html?from=spreadIndex';
})
//去购物车页面
$('.menuBox').on('click','.tomyshopcar',function(){
	var MapKv =  {"channel":channel};
	TDAPP.onEvent ('点击去购物车','首页活动页面',MapKv);
	window.location.href = 'shopCar.html?from=spreadIndex&channel='+channel;
})
//去订单页面
$('.menuBox').on('click','.tomyorder',function(){
	var MapKv =  {"channel":channel};
	TDAPP.onEvent ('点击去订单列表','首页活动页面',MapKv);
	window.location.href = 'myOrder.html?from=spreadIndex&channel='+channel;
})


