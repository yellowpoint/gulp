function materialLayer(box, succBack, clicked) {
	//渠道号
	//	var channel = GetQueryString('channel')||getCookie('channel') ||'etime';
	//	setCookie('channel',channel)
	var seriesId = succBack.seriesId;
	var albumTopicId = succBack.albumTopicId;
	var albumId = succBack.albumId;
	var index = succBack.index;
	var page = 1;
	var url, successFunc, dataBox, dataBox1;
	if (albumId) {
		var data = {
			'seriesId': seriesId,
			'albumId': albumId,
			'page': page
		}
	} else {
		var data = {
			'seriesId': seriesId,
			'albumTopicId': albumTopicId,
			'page': page
		}
	}
	var LoadSlide1 = function(data) {
		var dataBox, dataBox1;
		dataBox = '';
		dataBox1 = '';
		var albumTopicId = data.albumTopicId;
		var imgBox = $('#materials .material-image');
		var goodsName, price, label, goodsId, imageWidth, imageHeight, imageX, imageY, frameImageUrl;
		$.each(imgBox, function(i) {
			var imageUrl = imgBox.eq(i).find('img').attr('src'),
				id = imgBox.eq(i).attr('data-id'),
				type = imgBox.eq(i).attr('data-type');
			goodsName = imgBox.eq(i).attr('data-goodsName');
			price = toDecimal2(imgBox.eq(i).attr('data-price'));
			label = imgBox.eq(i).attr('data-label');
			goodsId = imgBox.eq(i).attr('data-goodsId');
			imageWidth = imgBox.eq(i).attr('data-imageWidth');
			imageHeight = imgBox.eq(i).attr('data-imageHeight');
			imageX = imgBox.eq(i).attr('data-imageX');
			imageY = imgBox.eq(i).attr('data-imageY');
			frameImageUrl = imgBox.eq(i).attr('data-frameImageUrl');
			//type=1是文件夹，type=2是图片
			if (type == 2) {
				dataBox += '<div class="swiper-slide" data-id="' + id + '" data-TopicId="' + albumTopicId + '"><a href="#" class=""><img src="' + imageUrl + '" alt="banner" class="layerImg" ></a></div>'
			} else if (type == 1) {
				dataBox += ''
			}
		});
		dataBox1 = '<div class="material-mask material-mask1" style="display: block;"></div><div class="xl-material xl-material1"></div>';
		$(box).append(dataBox1)
		dataBox1 = ''
		dataBox1 += '<div class="xl-materialTop"><div class="materialName" data-goodsId="' + goodsId + '">' + goodsName + '</div><div class="materialDetail"><span>￥' + price + '</span><i></i></div><i class="xl-materialClose"></i></div><div class="xl-materialMiddle"><div class="swiperMask"><img src="' + frameImageUrl + '"/></div><div class="swiper-container swiper-init swiper-container-horizontal" ><div class="swiper-wrapper"></div></div><div class="swiper-button-next"></div> <div class="swiper-button-prev"></div></div><div class="material-button"><span>查看详情</span></div>'
		$('body .xl-material1').empty().append(dataBox1);
		$('body .xl-material1 .swiper-wrapper').empty().append(dataBox);

		$('.xl-material1 .xl-materialMiddle .swiper-container').css({
			"width": imageWidth + "rem",
			"height": imageHeight + "rem",
			"top": imageY + "rem",
			"left": imageX + "rem"
		})
		$('.xl-material1 .xl-materialMiddle .swiper-container .swiper-slide a').css("height", imageHeight + "rem")

	}

	var LoadSlide2 = function(data) {
		var dataBox, dataBox1;
		dataBox = '';
		dataBox1 = '';
		var albumTopicId = data.albumTopicId;
		var imgBox = $('#material-file .material-image');
		var goodsName, price, label, goodsId, imageWidth, imageHeight, imageX, imageY, frameImageUrl;
		$.each(imgBox, function(i) {
			var imageUrl = imgBox.eq(i).find('img').attr('src'),
				id = imgBox.eq(i).attr('data-id'),
				type = imgBox.eq(i).attr('data-type');
			goodsName = imgBox.eq(i).attr('data-goodsName');
			price = toDecimal2(imgBox.eq(i).attr('data-price'));
			label = imgBox.eq(i).attr('data-label');
			goodsId = imgBox.eq(i).attr('data-goodsId');
			imageWidth = imgBox.eq(i).attr('data-imageWidth');
			imageHeight = imgBox.eq(i).attr('data-imageHeight');
			imageX = imgBox.eq(i).attr('data-imageX');
			imageY = imgBox.eq(i).attr('data-imageY');
			frameImageUrl = imgBox.eq(i).attr('data-frameImageUrl');
			//type=1是文件夹，type=2是图片
			if (type == 2) {
				dataBox += '<div class="swiper-slide" data-id="' + id + '" data-TopicId="' + albumTopicId + '"><a href="#" class=""><img src="' + imageUrl + '" alt="banner" class="layerImg" ></a></div>'
			} else if (type == 1) {
				dataBox += ''
			}
		});
		dataBox1 = '<div class="material-mask material-mask2" style="display: block;"></div><div class="xl-material xl-material2"></div>';
		$(box).append(dataBox1)
		dataBox1 = ''
		dataBox1 += '<div class="xl-materialTop"><div class="materialName" data-goodsId="' + goodsId + '">' + goodsName + '</div><div class="materialDetail"><span>￥' + price + '</span><i></i></div><i class="xl-materialClose"></i></div><div class="xl-materialMiddle"><div class="swiperMask"><img src="' + frameImageUrl + '"/></div><div class="swiper-container swiper-init swiper-container-horizontal" ><div class="swiper-wrapper"></div></div><div class="swiper-button-next"></div> <div class="swiper-button-prev"></div></div><div class="material-button"><span>查看详情</span></div>'
		$('body .xl-material2').empty().append(dataBox1);
		$('body .xl-material2 .swiper-wrapper').empty().append(dataBox);
		//标签 促销1
		if (label == 1) {
			$('.xl-material .materialDetail i').css('background', 'url(img/xl-discount.png) center no-repeat');
			$('.xl-material .materialDetail i').css('background-size', 'cover');
		}

		$('.xl-material2 .xl-materialMiddle .swiper-container').css({
			"width": imageWidth + "rem",
			"height": imageHeight + "rem",
			"top": imageY + "rem",
			"left": imageX + "rem"
		})
		$('.xl-material2 .xl-materialMiddle .swiper-container .swiper-slide a').css("height", imageHeight + "rem")

	}

	if (clicked == 'material-file') {
		//			if($(".material-mask2").length ==0 && $(".xl-material2").length ==0) {
		LoadSlide2(data);
		//			}else{
		//				$(".material-mask2").show();
		//				$('.xl-material2').show()
		//			}
	} else if (clicked == 'materials') {
		//			if($(".material-mask1").length ==0 && $(".xl-material1").length ==0) {
		LoadSlide1(data);
		//			}else{
		//				$(".material-mask1").show();
		//				$('.xl-material1').show()
		//			}

	}

	function scrollTo(who, target) {
		console.log(target)
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
	//弹窗轮播
	var startY, startX, endX, endY;
	var mySwiper = new Swiper('.swiper-container', {
		initialSlide: index,
		//		loop: true,
		nextButton: '.swiper-button-next',
		prevButton: '.swiper-button-prev',
		observer: true,
		observeParents: false,
		onSlideChangeEnd: function(swiper) {　　　
			swiper.update();
		},
		onSlideChangeEnd: function(swiper) {
			var indexActive = swiper.activeIndex;
			if (clicked == 'material-file') {
				var item = $(".material-image").eq(indexActive);
				var container = $(".materialFile-content");
				var itemOffset = item.offset();
				var itemOffsetTop = itemOffset.top + container.scrollTop();
				scrollTo('.materialFile-content', itemOffsetTop - $('.materialFixed').outerHeight(true));
			} else if (clicked == 'materials') {
				var item = $(".material-image").eq(indexActive);
				var container = $(".material-content");
				var itemOffset = item.offset();
				var itemOffsetTop = itemOffset.top + container.scrollTop();
				scrollTo('.material-content', itemOffsetTop - $('.materialFixed').outerHeight(true));
			}
		}

	})

	$('body').on('click', '.swiper-button-next', function() {
		var indexActive = $('.xl-material .swiper-slide.swiper-slide-active').index();
		if (clicked == 'material-file') {
			var item = $(".materialFile-content .material-image").eq(indexActive);
			var container = $(".materialFile-content");
			var itemOffset = item.offset();
			var itemOffsetTop = itemOffset.top + container.scrollTop();
			scrollTo('.materialFile-content', itemOffsetTop - $('.materialFixed').outerHeight(true));
		} else if (clicked == 'materials') {
			var item = $(".material-content .material-image").eq(indexActive);
			var container = $(".material-content");
			var itemOffset = item.offset();
			var itemOffsetTop = itemOffset.top + container.scrollTop();
			scrollTo('.material-content', itemOffsetTop - $('.materialFixed').outerHeight(true));
		}
	})

	$('.hd-noLoad').hide();

	//查看详情
	$('body').on('click', '.material-button span', function() {
		var goodsId = $(this).parents('.xl-material').find('.materialName').attr('data-goodsId');
		var albumId = $(this).parents('.xl-material').find('.swiper-slide-active').attr('data-id');
		window.location.href = '../main/goodsDetail_materialPriority.html?goodsId=' + goodsId + '&albumId=' + albumId;
	})

	/**
	 * 设置cookie
	 * @param {string} name  键名
	 * @param {string} value 键值
	 * @param {integer} days cookie周期
	 */
	function setCookie(name, value, days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			var expires = "; expires=" + date.toGMTString();
		} else {
			var expires = "";
		}
		document.cookie = name + "=" + value + expires + "; path=/";
	}

	var xlLoadData = function(url, successFunc, data) {
		$.ajax({
			url: url,
			type: 'POST',
			timeout: 60000,
			async: true,
			dataType: 'json',
			data: data || {},
			success: successFunc,
			error: function(error) {
				console.log('木有数据');
			}
		});
	};

}