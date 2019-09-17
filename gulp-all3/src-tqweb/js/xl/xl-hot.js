//素材版本首页
var matirialIndex = function(){
	var url, successFunc, dataBox,data;
	url = apiHost + '/diyapi/brand/phone/banner';
//	url = 'http://192.168.1.10:10085/diyapi/brand/phone/banner'
	successFunc = function(data) {
		if (data.code == 200) {
			var bannerList = data.data.bannerList;
			dataBox = '';
			$.each(bannerList, function(i) {
				var imageUrl = bannerList[i].imageUrl;
				dataBox += '<div class="swiper-slide"><img src="'+ imageUrl +'"/></div>'
			});
			$('#materialIndex .materialSwiper .swiper-wrapper').empty().append(dataBox);
			var mySwiper = new Swiper ('.swiper-container', {
			    loop: true,
			    autoplay:4000,
			    autoplayDisableOnInteraction : false
			}) 
			$('.hd-noLoad').hide();
		}
	}
	loadData(url, successFunc, data)
}


//小版本选机型页面
var hotIndex = function() {
	var firstLoad = function() {
		var url, successFunc, dataBox, data;
		url = apiHost + '/diyapi/brand/phone/list';
		successFunc = function(data) {
			if (data.code == 200) {
				var iosBrandList = data.data.iosBrandList;
				dataBox = '';
				for (var i = 0; i < iosBrandList.length; i++) {
					dataBox += '<i data-id="' + iosBrandList[i].id + '" style="display:none">' + iosBrandList[i].id + '</i>'
				}
				$('#hotIndex .hotItem').empty().append(dataBox);
				url = apiHost + '/diyapi/brand/series/list';
				var brandId = $('#hotIndex .hotItem i').attr('data-id');
				data = {
					'brandId': brandId
				}
				successFunc = function(data) {
					if (data.code == 200) {
						var seriesList = data.data.seriesList;
						dataBox = '';
						for (var i = 0; i < seriesList.length; i++) {
							var imgUrl = seriesList[i].imageUrl;
							var name = seriesList[i].name;
							var id = seriesList[i].id;
							var goodsId = seriesList[i].goodsId;
//							dataBox += '<li data-id="' + id + '"><img src="' + imgUrl + '?x-oss-process=image/resize,w_200" alt=""/><div></div><p>' + name + '</p></li>'
							dataBox += '<li data-id="' + id + '" data-goodsId="'+ goodsId +'"><img src="' + imgUrl + '" alt=""/></li>'
						}
						$('#hotIndex .hotItemBox ul').empty().append(dataBox);
						$('.hd-noLoad').hide();
					}
				}
				loadData(url, successFunc, data)
			}
		}
		loadData(url, successFunc, data)
	}
	firstLoad();

	var clickLoad = function(data) {
		var brand = data;
		var url, successFunc, dataBox, data;
		url = apiHost + '/diyapi/brand/phone/list';
		successFunc = function(data) {
			if (data.code == 200) {
				if (brand == 'iosBrand') {
					var iosBrandList = data.data.iosBrandList;
					dataBox = '';
					for (var i = 0; i < iosBrandList.length; i++) {
						dataBox += '<i data-id="' + iosBrandList[i].id + '" style="display:none">' + iosBrandList[i].id + '</i>'
					}
					$('#hotIndex .hotItem').empty().append(dataBox);
					url = apiHost + '/diyapi/brand/series/list';
					var brandId = $('#hotIndex .hotItem i').attr('data-id');
					data = {
						'brandId': brandId
					}
					successFunc = function(data) {
						if (data.code == 200) {
							var seriesList = data.data.seriesList;
							dataBox = '';
							for (var i = 0; i < seriesList.length; i++) {
								var imgUrl = seriesList[i].imageUrl;
								var name = seriesList[i].name;
								var id = seriesList[i].id;
								var goodsId = seriesList[i].goodsId;
//								dataBox += '<li data-id="' + id + '"><img src="' + imgUrl + '?x-oss-process=image/resize,w_200" alt=""/><div></div><p>' + name + '</p></li>'
								dataBox += '<li data-id="' + id + '" data-goodsId="'+ goodsId +'"><img src="' + imgUrl + '" alt=""/></li>'
							}
							$('#hotIndex .hotItemBox ul').empty().append(dataBox);
							$('.hd-noLoad').hide();
						}
					}
					loadData(url, successFunc, data)
				} else if (brand == 'androidBrand') {
					var androidBrandList = data.data.androidBrandList;
					dataBox = '';
					for (var i = 0; i < androidBrandList.length; i++) {
						dataBox += '<li data-id="' + androidBrandList[i].id + '">' + androidBrandList[i].name + '</li>'
					}
					$('#hotIndex .hotItem').empty().append(dataBox);
					$('.hotItem li').eq(0).addClass('active')
					url = apiHost + '/diyapi/brand/series/list';
					var brandId = $('#hotIndex .hotItem li').eq(0).attr('data-id');
					data = {
						'brandId': brandId
					}
					successFunc = function(data) {
						if (data.code == 200) {
							var seriesList = data.data.seriesList;
							dataBox = '';
							for (var i = 0; i < seriesList.length; i++) {
								var imgUrl = seriesList[i].imageUrl;
								var name = seriesList[i].name;
								var id = seriesList[i].id;
								var goodsId = seriesList[i].goodsId;
//								dataBox += '<li data-id="' + id + '"><img src="' + imgUrl + '?x-oss-process=image/resize,w_200" alt=""/><div></div><p>' + name + '</p></li>'
								dataBox += '<li data-id="' + id + '" data-goodsId="'+ goodsId +'"><img src="' + imgUrl + '" alt=""/></li>'
							}
							$('#hotIndex .hotItemBox ul').empty().append(dataBox);
							$('.hd-noLoad').hide();
						}
					}
					loadData(url, successFunc, data)
				}
			}
		}
		loadData(url, successFunc, data)
	}

	//点击苹果			
	$('body').on('click', '.hot-ios', function() {
			$('#hotIndex .pageContent-mask').hide();
			$('#hotIndex .hotIndexFixed .hotName li').removeClass('active');
			$(this).addClass('active');
			var current = 0;
			current = (current) % 360;
			$('.hot-android i').css('transform', 'rotate(' + current + 'deg)');
			$('.hot-android i').css('transition', 'all .2s linear 10ms');

			clickLoad('iosBrand')

		})
		//点击安卓
	$('body').on('click', '.hot-android', function() {
			$('#hotIndex .pageContent-mask').show();
			$('.hotItem').show();
			$('#hotIndex .hotIndexFixed .hotName li').removeClass('active');
			$(this).addClass('active');
			var current = 0;
			if ($(this).hasClass('active')) {
				current = (current + 180) % 360;
				$('.hot-android i').css('transform', 'rotate(' + current + 'deg)');
				$('.hot-android i').css('transition', 'all .2s linear 10ms')
				if (current == 180) {
					$('.hotItem').show();
				} else {
					$('.hotItem').hide()
				}
			} else {
				current = (current) % 360;
				$('.hot-android i').css('transform', 'rotate(' + current + 'deg)');
				$('.hot-android i').css('transition', 'all .2s linear 10ms');
			}
			clickLoad('androidBrand')
		})
		//点击安卓 品牌
	$('body').on('click', '.hotItem li', function() {
			$('.hotItem li').removeClass('active');
			$(this).addClass('active');
			$('.pageContent-mask').removeClass('Show').addClass('Hide').hide();
			$('.hotItem').hide();
			var current = 0;
			current = (current) % 360;
			$('.hot-android i').css('transform', 'rotate(' + current + 'deg)');
			$('.hot-android i').css('transition', 'all .2s linear 10ms');
			var brandId = $(this).attr('data-id');
			var data = {
				'brandId': brandId
			}
			var url, successFunc, dataBox;
			url = apiHost + '/diyapi/brand/series/list';
			successFunc = function(data) {
				if (data.code == 200) {
					var seriesList = data.data.seriesList;
					dataBox = '';
					for (var i = 0; i < seriesList.length; i++) {
						var imgUrl = seriesList[i].imageUrl;
						var name = seriesList[i].name;
						var id = seriesList[i].id;
						var goodsId = seriesList[i].goodsId;
						dataBox += '<li data-id="' + id + '" data-goodsId="'+ goodsId +'"><img src="' + imgUrl + '" alt=""/></li>'
					}
					$('#hotIndex .hotItemBox ul').empty().append(dataBox);
					$('.hd-noLoad').hide();
				}
			}
			loadData(url, successFunc, data)
		})
		//点击系列上方遮罩 关闭遮罩，品牌收起，三角形变换
	$('body').on('click', '.pageContent-mask', function() {
		$('.pageContent-mask').hide();
		$('.hotItem').hide();
		var current = 0;
		current = (current) % 360;
		$('.hot-android i').css('transform', 'rotate(' + current + 'deg)');
		$('.hot-android i').css('transition', 'all .2s linear 10ms');
	})

	//点击具体手机系列
	$('body').on('click', '.hotItemBox ul li', function() {
		var urlButoon = GetQueryString('button');
		if(urlButoon == 'uploadImg'){
			var goodsId = $(this).attr('data-goodsId');
			window.location.href = '../main/diy2.html?goodsId=' + goodsId+'&from=materialPriority';
		}else if(urlButoon == 'marterial'){
			var seriesId = $(this).attr('data-id');
			window.location.href = 'material.html?seriesId=' + seriesId;
		}
		
	})
	
	
}

//小版本素材页面
var material = function() {
	$('.hd-noLoad').hide();
	var seriesId = GetQueryString('seriesId');
	var firstLoadTopic = function() {
		var page = 1;
		var url, successFunc, dataBox;
		var data = {
			'seriesId': seriesId,
			'page': page
		}
		url = apiHost + '/diyapi/brand/series/albumtopic/list';
		successFunc = function(data) {
			if (data.code == 200) {
				dataBox = '';
				var data = data.data;
				$.each(data, function(i) {
					var id = data[i].id;
					var name = data[i].name;
					dataBox += '<li data-id="' + id + '">' + name + '</li>'
				})
				$('#materials .materialType').empty().append(dataBox);
				$('#materials .materialType li').eq(0).addClass('active');

				var len = $('.materialFixed .materialType li').length;
				var Width = 0;
				for (var i = 0; i < len; i++) {
					var width = $('.materialFixed .materialType li').eq(i).width();
					Width += Number(width) + 50;
				}
				$('.materialFixed .materialType').css('width', Width + 'px')
				$('body').on('click', '.materialType li', function() {
					$(this).addClass('active').siblings('li').removeClass('active')
				})
				firstLoadAblum();
				$('.hd-noLoad').hide();
			}
		}
		loadData(url, successFunc, data)
	}
	var firstLoadAblum = function() {
		var seriesId = GetQueryString('seriesId');
		var page = 1;
		var albumTopicId = $('#materials .materialType li').eq(0).attr('data-id');
		var url, successFunc, dataBox;
		var data = {
			'seriesId': seriesId,
			'albumTopicId': albumTopicId,
			'page': page
		}
		url = apiHost + '/diyapi/album/list';
		successFunc = function(data) {
			if (data.code == 200) {
				dataBox = '';
				var series = data.data.series;
				var list = data.data.list;
				var goodsName = series.name,
				frameImageUrl = series.frameImageUrl,
				price = series.price,
				label = series.labelType,
				goodsId = series.goodsId,
				imagePoint = series.imagePoint,
				imageWidth = series.imageWidth/100*0.516,
				imageHeight = series.imageHeight/100*0.516;
				var imageX = (imagePoint.split(',')[0])/100*0.516;
				var imageY = (imagePoint.split(',')[1])/100*0.516;
				$.each(list, function(i) {
					var id = list[i].id;
					var imageUrl = list[i].imageUrl;
					var name = list[i].name;
					var type = list[i].type;
					//type=1是文件夹，type=2是图片
					if (type == 1) {
						dataBox += '<li class="fileBox imageBox" data-type="' + type + '" data-id="' + id + '" data-TopicId="' + albumTopicId + '"data-goodsName="' + goodsName + '"data-price="' + price + '"data-label="' 
										+ label + '"data-goodsId="' + goodsId + '"data-imageWidth="' + imageWidth + '"data-imageHeight="' + imageHeight + '"data-imageX="' + imageX + '"data-imageY="' + imageY + '" data-frameImageUrl="'
										+ frameImageUrl +'"><div class="backgroundImg"></div><img src="' + imageUrl + '?x-oss-process=image/resize,w_200" /><div class="files">' + name + '</div></li>'
					} else if (type == 2) {
						dataBox += '<li class="material-image" data-type="' + type + '" data-id="' + id + '" data-TopicId="' + albumTopicId + '"data-goodsName="' + goodsName + '"data-price="' + price + '"data-label="' 
										+ label + '"data-goodsId="' + goodsId + '"data-imageWidth="' + imageWidth + '"data-imageHeight="' + imageHeight + '"data-imageX="' + imageX + '"data-imageY="' + imageY + '" data-frameImageUrl="'
										+ frameImageUrl +'"><div class="backgroundImg"></div><img src="' + imageUrl + '?x-oss-process=image/resize,w_200" /></li>';
						
					}
				})
				$('#materials .meterialBox ul').empty().append(dataBox);
				$('#materials .meterialBox ul li .backgroundImg').css({
					'background':'url('+ frameImageUrl +') center no-repeat',
					'background-size':'cover'
				});
				$('#materials .meterialBox ul li img').css({
					"width": imageWidth + "rem",
					"height": imageHeight + "rem",
					"top": imageY + "rem",
					"left": imageX + "rem"
				})
				$('.hd-noLoad').hide();
			}
		}
		loadData(url, successFunc, data)
	}

	firstLoadTopic();

	//点击topic加载下方图片
	var clickLoadAblum = function(albumTopicId) {
		var seriesId = GetQueryString('seriesId');
		var albumTopicId = albumTopicId;
		var page = 1;
		var url, successFunc, dataBox;
		var data = {
				'seriesId': seriesId,
				'albumTopicId': albumTopicId,
				'page': page
			}
		url = apiHost + '/diyapi/album/list';
		successFunc = function(data) {
			if (data.code == 200) {
				dataBox = '';
				var series = data.data.series;
				var list = data.data.list;
				var goodsName = series.name,
				frameImageUrl = series.frameImageUrl,
				price = series.price,
				label = series.labelType,
				goodsId = series.goodsId,
				imagePoint = series.imagePoint,
				imageWidth = series.imageWidth/100*0.516,
				imageHeight = series.imageHeight/100*0.516;
				var imageX = (imagePoint.split(',')[0])/100*0.516;
				var imageY = (imagePoint.split(',')[1])/100*0.516;
				$.each(list, function(i) {
					var id = list[i].id;
					var imageUrl = list[i].imageUrl;
					var name = list[i].name;
					var type = list[i].type;
					//type=1是文件夹，type=2是图片
					if (type == 1) {
						dataBox += '<li class="fileBox imageBox" data-type="' + type + '" data-id="' + id + '" data-TopicId="' + albumTopicId + '"data-goodsName="' + goodsName + '"data-price="' + price + '"data-label="' 
										+ label + '"data-goodsId="' + goodsId + '"data-imageWidth="' + imageWidth + '"data-imageHeight="' + imageHeight + '"data-imageX="' + imageX + '"data-imageY="' + imageY + '" data-frameImageUrl="'
										+ frameImageUrl +'"><div class="backgroundImg"></div><img src="' + imageUrl + '?x-oss-process=image/resize,w_200" /><div class="files">' + name + '</div></li>'
					} else if (type == 2) {
						dataBox += '<li class="material-image" data-type="' + type + '" data-id="' + id + '" data-TopicId="' + albumTopicId + '"data-goodsName="' + goodsName + '"data-price="' + price + '"data-label="' 
										+ label + '"data-goodsId="' + goodsId + '"data-imageWidth="' + imageWidth + '"data-imageHeight="' + imageHeight + '"data-imageX="' + imageX + '"data-imageY="' + imageY + '" data-frameImageUrl="'
										+ frameImageUrl +'"><div class="backgroundImg"></div><img src="' + imageUrl + '?x-oss-process=image/resize,w_200" /></li>'
					}
				})
				$('#materials .meterialBox ul').empty().append(dataBox);
				$('#materials .meterialBox ul li .backgroundImg').css({
					'background':'url('+ frameImageUrl +') center no-repeat',
					'background-size':'cover'
				});
				$('#materials .meterialBox ul li img').css({
					"width": imageWidth + "rem",
					"height": imageHeight + "rem",
					"top": imageY + "rem",
					"left": imageX + "rem"
				})

				$('.hd-noLoad').hide();
			}
		}
		loadData(url, successFunc, data)
	}

	$('body').on('click', '.materialType li', function() {
		var albumTopicId = $(this).attr('data-id');
		clickLoadAblum(albumTopicId);
		
		//让被选中的文字保持在页面视野内
		var item = $(this);
		var container = $(".materialFixed");
		var itemOffset = item.offset();
		var itemOffsetLeft = itemOffset.left + container.scrollLeft();
		var centerLeft = (container.width() - item.width()) / 2;
		container.scrollLeft(itemOffsetLeft - centerLeft);
	})

	

	//点击文件夹进入子页面
	$('body').on('click', '.imageBox', function() {
		$('.imageBox').removeClass('clickThis');
		$(this).addClass('clickThis');
		mainView.router.loadPage('material-file.html');
	})


	//关闭弹窗
//	$('body').on('click', '.material-mask', function() {
//		$('.material-mask').removeClass('Show').addClass('Hide').hide();
//		$('.xl-material').hide();
//	})
//	$('body').on('click', '.xl-materialClose', function() {
//		$('.material-mask').removeClass('Show').addClass('Hide').hide();
//		$('.xl-material').hide();
//	})

	//点击返回
	$('body').on('click', '#material-file .materialHead .back', function() {
		mainView.router.back();
	})
	
	var page = $('.page');
	var mySwiper1;
	$.each(page, function(n) {
		var pageName = $('.page').eq(n).attr('data-page');
		if (pageName == "material") {
			//加载更多数据
			var loading = false;
			var lastIndex = $('.liBox li').length;
			var itemsPerLoad = 10;
			var page = 1;
			$('.infinite-scroll-preloader').hide();
			$('body').on('infinite', '.infinite-scroll', function() {
				$('.infinite-scroll-preloader').show();
				if (loading) return;
				loading = true;
				setTimeout(function() {
					loading = false;
					page++;
					var len = $('#materials .meterialBox ul li').length;
					if ($('#materials .meterialBox ul li').eq(len - 1).hasClass('lastAtem') || len == 0) {
						$('.infinite-scroll-preloader').remove();
						mainView.detachInfiniteScroll($('.infinite-scroll'));
						return;
					}
		
					var seriesId = GetQueryString('seriesId');
					var albumTopicId = $('.materialType li.active').attr('data-id');
					var url, successFunc, dataBox,dataBox1;
					var data = {
						'seriesId': seriesId,
						'albumTopicId': albumTopicId,
						'page': page
					}
					url = apiHost + '/diyapi/album/list';
					successFunc = function(data) {
						if (data.code == 200) {
							
							var series = data.data.series;
							var list = data.data.list;
							var goodsName = series.name,
							frameImageUrl = series.frameImageUrl,
							price = series.price,
							label = series.labelType,
							goodsId = series.goodsId,
							imagePoint = series.imagePoint,
							imageWidth = series.imageWidth/100*0.516,
							imageHeight = series.imageHeight/100*0.516;
							var imageX = (imagePoint.split(',')[0])/100*0.516;
							var imageY = (imagePoint.split(',')[1])/100*0.516;
				
							if (list.length == 0) {
								layerHint('已经是最后一条数据了哦');
								$('#materials .meterialBox ul li').eq(len - 1).addClass('lastAtem');
								return;
							} else {
								dataBox = '';
								dataBox1= '';
								$.each(list, function(i) {
									var id = list[i].id;
									var imageUrl = list[i].imageUrl;
									var name = list[i].name;
									var type = list[i].type;
									//type=1是文件夹，type=2是图片
									if (type == 1) {
										dataBox += '<li class="fileBox imageBox"  data-type="' + type + '" data-id="' + id + '" data-TopicId="' + albumTopicId + '"data-goodsName="' + goodsName + '"data-price="' + price + '"data-label="' 
										+ label + '"data-goodsId="' + goodsId + '"data-imageWidth="' + imageWidth + '"data-imageHeight="' + imageHeight + '"data-imageX="' + imageX + '"data-imageY="' + imageY + '" data-frameImageUrl="'
										+ frameImageUrl +'"><div class="backgroundImg"></div><img src="' + imageUrl + '?x-oss-process=image/resize,w_200" /><div class="files">' + name + '</div></li>'
									} else if (type == 2) {
										dataBox += '<li class="material-image" data-type="' + type + '" data-id="' + id + '" data-TopicId="' + albumTopicId + '"data-goodsName="' + goodsName + '"data-price="' + price + '"data-label="' 
										+ label + '"data-goodsId="' + goodsId + '"data-imageWidth="' + imageWidth + '"data-imageHeight="' + imageHeight + '"data-imageX="' + imageX + '"data-imageY="' + imageY + '" data-frameImageUrl="'
										+ frameImageUrl +'"><div class="backgroundImg"></div><img src="' + imageUrl + '?x-oss-process=image/resize,w_200" /></li>'
										
										dataBox1 += '<div class="swiper-slide" data-id="'+ id +'" data-TopicId="'+ albumTopicId +'"><a href="#" class=""><img src="'+ imageUrl +'?x-oss-process=image/resize,w_200" alt="banner" class="layerImg" ></a></div>'
									}
								})
								$('#materials .meterialBox ul').append(dataBox);
								$('#materials .meterialBox ul li .backgroundImg').css({
									'background':'url('+ frameImageUrl +') center no-repeat',
									'background-size':'cover'
								});
								$('#materials .meterialBox ul li img').css({
									"width": imageWidth + "rem",
									"height": imageHeight + "rem",
									"top": imageY + "rem",
									"left": imageX + "rem"
								})
								
//								$('body .xl-material1 .swiper-wrapper').append(dataBox1);
//								$('.xl-material1 .xl-materialMiddle .swiper-container').css({"width":imageWidth+"rem","height":imageHeight+"rem","top":imageY+"rem","left":imageX+"rem"})
//								$('.xl-material1 .xl-materialMiddle .swiper-container .swiper-slide a').css("height",imageHeight+"rem")
								
								
							}
		
		
							$('.hd-noLoad').hide();
						}
					}
					loadData(url, successFunc, data)
					lastIndex = $('#materials .meterialBox ul li').length;
				}, 1000);
			});
		}
	})
	

}

//素材页面点击图片弹出轮播弹窗
//$('body').on('click', '#materials .material-image', function() {
//	$('.material-image').removeClass('clickThis');
//	$(this).addClass('clickThis');
//	var albumTopicId = $(this).attr('data-TopicId');
//	var seriesId = GetQueryString('seriesId');
//	var index;
//	for (var i = 0; i < $('#materials .material-image').length; i++) {
//		if ($('#materials .material-image').eq(i).hasClass('clickThis')) {
//			index = i;
//		}
//	}
//	var succBack = {
//		'seriesId': seriesId,
//		'albumTopicId': albumTopicId,
//		'index': index
//	}
//	var clicked = 'materials';
//	materialLayer('body', succBack,clicked)
//})


//子页面点击图片弹出轮播弹窗
//$('body').on('click', '#material-file .material-image', function() {
//	$('.material-image').removeClass('clickThis');
//	$(this).addClass('clickThis');
//	var albumTopicId = $(this).attr('data-TopicId');
//	var seriesId = GetQueryString('seriesId');
//	var albumId = '';
//	var len = $('.imageBox').length;
//	for (var i = 0; i < len; i++) {
//		if ($('.imageBox').eq(i).hasClass('clickThis')) {
//			albumId = $('.imageBox').eq(i).attr('data-id')
//		}
//	}
//	var index;
//	for (var i = 0; i < $('#material-file .material-image').length; i++) {
//		if ($('#material-file .material-image').eq(i).hasClass('clickThis')) {
//			index = i;
//		}
//	}
//	var succBack = {
//		'seriesId': seriesId,
//		'albumId': albumId,
//		'index': index
//	}
//	var clicked = 'material-file';
//	materialLayer('body', succBack,clicked)
//})


//各个页面
$(document).on('page:init', function(e) {
	var page = e.detail.page;
	//素材子页面
	if (page.name === 'material-file') {
		var seriesId = GetQueryString('seriesId');
		var page = 1;
		var albumTopicId = $('#materials .materialType li').eq(0).attr('data-id');
		var albumId, albumName;
		var len = $('.imageBox').length;
		for (var i = 0; i < len; i++) {
			if ($('.imageBox').eq(i).hasClass('clickThis')) {
				albumId = $('.imageBox').eq(i).attr('data-id');
				albumName = $('.imageBox').eq(i).find('.files').text();
			}
		}
		$('#material-file .materialHead p').text(albumName);
		var url, successFunc,dataBox,dataBox1;
		var data = {
			'albumId': albumId,
			'seriesId': seriesId,
			'page': page
		}
		url = apiHost + '/diyapi/album/list';
		successFunc = function(data) {
			if (data.code == 200) {
				dataBox = '';
				dataBox1 = '';
				var series = data.data.series;
				var list = data.data.list;
				var goodsName = series.name,
				frameImageUrl = series.frameImageUrl,
				price = toDecimal2(series.price),
				label = series.labelType,
				goodsId = series.goodsId,
				imagePoint = series.imagePoint,
				imageWidth = series.imageWidth/100*0.516,
				imageHeight = series.imageHeight/100*0.516;
				var imageX = (imagePoint.split(',')[0])/100*0.516;
				var imageY = (imagePoint.split(',')[1])/100*0.516;
				
				$.each(list, function(i) {
					var id = list[i].id;
					var imageUrl = list[i].imageUrl;
					var name = list[i].name;
					var type = list[i].type;
					//type=1是文件夹，type=2是图片
					if (type == 1) {
						//						dataBox += '<li class="fileBox imageBox" data-id="'+ id +'" data-TopicId="'+ albumTopicId +'"><img src="'+ imageUrl +'" /><div class="files">'+ name +'</div></li>'
					} else if (type == 2) {
						dataBox += '<li class="material-image" data-type="' + type + '" data-id="' + id + '" data-TopicId="' + albumTopicId + '" data-goodsName="' + goodsName + '"data-price="' + price + '"data-label="' 
										+ label + '"data-goodsId="' + goodsId + '"data-imageWidth="' + imageWidth + '"data-imageHeight="' + imageHeight + '"data-imageX="' + imageX + '"data-imageY="' + imageY + '" data-frameImageUrl="'
										+ frameImageUrl +'"><div class="backgroundImg"></div><img src="' + imageUrl + '?x-oss-process=image/resize,w_200" /></li>'
						dataBox1 += '<div class="swiper-slide" data-id="'+ id +'" data-TopicId="'+ albumTopicId +'"><a href="#" class=""><img src="'+ imageUrl +'?x-oss-process=image/resize,w_200" alt="banner" class="layerImg" ></a></div>'
					}
				})
				$('#material-file .materialFileBox ul').empty().append(dataBox);
				$('#material-file .materialFileBox ul li .backgroundImg').css({
					'background':'url('+ frameImageUrl +') center no-repeat',
					'background-size':'cover'
				});
				$('#material-file .materialFileBox ul li img').css({
					"width": imageWidth + "rem",
					"height": imageHeight + "rem",
					"top": imageY + "rem",
					"left": imageX + "rem"
				})
				$('.hd-noLoad').hide();
			}
		}
		loadData(url, successFunc, data)

		//加载更多数据
		var loading = false;
		var lastIndex = $('.materialFileBox ul li').length;
		var itemsPerLoad = 10;
		$('.infinite-scroll-preloader').hide();
		$('body').on('infinite', '.infinite-scroll', function() {
			$('.infinite-scroll-preloader').show();
			if (loading) return;
			loading = true;
			setTimeout(function() {
				loading = false;
				page++;
				var len = $('#material-file .materialFileBox ul li').length;
				if ($('#material-file .materialFileBox ul li').eq(len - 1).hasClass('lastAtem') || len == 0) {
					$('.infinite-scroll-preloader').remove();
					mainView.detachInfiniteScroll($('.infinite-scroll'));
					return;
				}

				var albumTopicId = $('.materialType li.active').attr('data-id');
				var albumId, albumName;
				var len = $('.imageBox').length;
				for (var i = 0; i < len; i++) {
					if ($('.imageBox').eq(i).hasClass('clickThis')) {
						albumId = $('.imageBox').eq(i).attr('data-id');
						albumName = $('.imageBox').eq(i).find('.files').text();
					}
				}
				$('#material-file .materialHead p').text(albumName);
				var url, successFunc, dataBox;
				var data = {
					'albumId': albumId,
					'seriesId': seriesId,
					'page': page
				}
				url = apiHost + '/diyapi/album/list';
				successFunc = function(data) {
					if (data.code == 200) {
						dataBox = '';
						var series = data.data.series;
						var list = data.data.list;
						var goodsName = series.name,
						frameImageUrl = series.frameImageUrl,
						price = toDecimal2(series.price),
						label = series.labelType,
						goodsId = series.goodsId,
						imagePoint = series.imagePoint,
						imageWidth = series.imageWidth/100*0.516,
						imageHeight = series.imageHeight/100*0.516;
						var imageX = (imagePoint.split(',')[0])/100*0.516;
						var imageY = (imagePoint.split(',')[1])/100*0.516;
						if (list.length == 0) {
							layerHint('已经是最后一条数据了哦');
							$('#materials .meterialBox ul li').eq(len - 1).addClass('lastAtem');
							return;
						} else {
							$.each(list, function(i) {
								var id = list[i].id;
								var imageUrl = list[i].imageUrl;
								var name = list[i].name;
								var type = list[i].type;
								//type=1是文件夹，type=2是图片
								if (type == 1) {
			//						dataBox += '<li class="fileBox imageBox" data-id="'+ id +'" data-TopicId="'+ albumTopicId +'"><img src="'+ imageUrl +'" /><div class="files">'+ name +'</div></li>'
								} else if (type == 2) {
									dataBox += '<li class="material-image" data-type="' + type + '" data-id="' + id + '" data-TopicId="' + albumTopicId + '" data-goodsName="' + goodsName + '"data-price="' + price + '"data-label="' 
										+ label + '"data-goodsId="' + goodsId + '"data-imageWidth="' + imageWidth + '"data-imageHeight="' + imageHeight + '"data-imageX="' + imageX + '"data-imageY="' + imageY + '" data-frameImageUrl="'
										+ frameImageUrl +'"><div class="backgroundImg"></div><img src="' + imageUrl + '?x-oss-process=image/resize,w_200" /></li>'
								}
							})
							$('#material-file .materialFileBox ul').append(dataBox);
							$('#material-file .materialFileBox ul li .backgroundImg').css({
								'background':'url('+ frameImageUrl +') center no-repeat',
								'background-size':'cover'
							});
							$('#material-file .materialFileBox ul li img').css({
								"width": imageWidth + "rem",
								"height": imageHeight + "rem",
								"top": imageY + "rem",
								"left": imageX + "rem"
							})
						}

						$('.hd-noLoad').hide();
					}
				}
				loadData(url, successFunc, data)
				lastIndex = $('#material-file .materialFileBox ul li').length;
			}, 1000);
		});

	}
})

//点击进入商品详情
$('body').on('click', '.material-image', function() {
	var goodsId = $(this).attr('data-goodsId');
	var albumId = $(this).attr('data-id');
	window.location.href = '../main/goodsDetail_materialPriority.html?goodsId=' + goodsId + '&albumId=' + albumId;
})