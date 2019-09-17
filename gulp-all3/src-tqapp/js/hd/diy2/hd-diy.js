/**
 * Created by yellowpoint on 2017/5/17.
 */
//
//document.documentElement.style.height = window.innerHeight + 'px'

AlloyLever.config({
	entry: "#entry" //请点击这个DOM元素6次召唤vConsole。//你可以通过AlloyLever.entry('#entry2')设置多个机关入口召唤神龙
})

//全局变量开始
//获取定制区域的宽高
var activeAreaWidth = $('.activeArea').width(), //如果为空或设置其他值会报错
	activeAreaHeight = $('.activeArea').height(),
	//用户图片是否上传成功 考虑到用户可能不上传自己的图片，默认true,点击上传按钮选取图片后变为false，上传服务器成功后为true
	ifImgUpload = true,
	//定义图片在页面上的显示宽高，和图片的真实宽高，
	imgWidth, imgHeight, imgRealWidth, imgRealHeight,
	//添加的元素的层级
	additiveLayer = 0,
	//获取整个模版图片，为操作区域；预先定义一个AlloyFinger，防止一开始销毁实例报错
	templateImgBox = document.getElementById("additiveBox"), //templateImgBox
	newAlloyFinger = new AlloyFinger(templateImgBox, {}),
	//图片方向角
	Orientation = null,
	//传给后台，图片还原所需要的角度
	imgOrientation = 0,
	//商品Id
	goodsId = GetQueryString('goodsId'),
	//渠道推广 先从url上面取，没有再去cookie去取，防止在支付后后台返回的链接里面没有带channel
	channel = GetQueryString('channel') || getCookie('channel') || 'etime',
	//商品属性组合id
	goodsStyleId,
	//商品该属性下的第几面的id
	goodsSideId,
	//商品名字
	goodsName,
	//用于有第二个ajax请求时，判断前一个是否完成的变量，未完成则终止它
	uploadImgXhr,
	//用户图片文件
	userImgFile,
	//网络图片分组后的数据
	materialImageGrouping = [],
	//第一次点击属性选择确认按钮，弹出网络图片，其他黑色遮罩
	firstConfirm = true,
	//用户再次添加图片会替换图片的提示，提示一次以后就不再提示
	layerReplaceImg1 = true,
	layerReplaceImg2 = true,
	//手势操作提示 只提示一次
	gestureTips = {
		move: {
			flag: false,
			text: '图片文字可移动位置哟<img src="../../img/gesture/Scroll-Horizontal.png">试试吧'
		},
		scale: {
			flag: false,
			text: '图片文字还能放大缩小<img src="../../img/gesture/Pinch.png">试试吧'
		},
		rotate: {
			flag: false,
			text: '图片文字还能旋转<img src="../../img/gesture/Rotate-01.png">试试吧'
		}

	},

	//接口的域名
	//泉哥本机地址
	//		apiDomain = '//192.168.1.10:8080',
	//本地服务器地址
	//		apiDomain = '//192.168.1.249:9081',
	//测试地址
	//	apiDomain = '//api.51app.cn/test',
	//真实地址
	apiDomain = '//api.51app.cn',
	token = getCookie('token'),
	temporaryToken = getCookie('temporaryToken'),
	//最多添加的元素个数
	maxAdditive = 10;

setCookie('channel', channel)

//全局变量结束

//上传定制页面用户图片
function ajaxUploadUserImg(url, async, data, successFun, errorFun) {

	if(uploadImgXhr && uploadImgXhr.readyState != 4) {
		uploadImgXhr.abort();
	}
	uploadImgXhr = $.ajax({
		url: url,
		type: 'POST',
		timeout: 1800,
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



//获取购物车商品数量 2017.10.18取消购物车
function getCarNum() {
	//	token = getCookie('token')
	//	$(".attribute .shopCar").show();
	//		
	//		var url2 = apiDomain + '/diyapi/open/trade/cart/num?token=' + token;
	//		var successFun2 = function(data) {
	//
	//			if(data.code == 200 && data.data != 0) {
	//				if(data.data > 99) {
	//					data.data = '99+';
	//				}
	//				$(".attribute .shopCar .num").show().text(data.data)
	//			} else {
	//				$(".attribute .shopCar .num").hide();
	//			}
	//
	//		}
	//		loadData(url2, true, successFun2)
}

//获取商品数据
function getGoodsData() {

	token = getCookie('token')

	if(token) {
		getCarNum()
	} else {
		$(".attribute .shopCar").hide();
	}

	var dataBox = '',
		dataBox2 = '',
		url = apiDomain + '/diyapi/goods/overview?goodsId=' + goodsId,
		successFunc = function(data) {

			//推荐图片
			var materialImageList = data.data.materialImageList;

			//网络图片需要进行分组，然后再显示
			$.each(materialImageList, function(i) {
				var exists = -1;
				$.each(materialImageGrouping, function(j) {
					if(materialImageList[i].style == materialImageGrouping[j][0].style) {
						exists = j;
						return;
					}
				})
				if(exists != -1) {
					materialImageGrouping[exists].push(materialImageList[i])
				} else {
					materialImageGrouping.push([materialImageList[i]])
				}

			})

			dataBox = '';
			$.each(materialImageGrouping, function(i) {
				dataBox += '<div class="tabItem">' + materialImageGrouping[i][0].style + '</div>';
				dataBox2 += '<div class="mainItem picture"><div class="imgBox"></div></div>';
			})
			$('.module .moduleTab .tabBox').css('width', 1.33 * materialImageGrouping.length + 'rem')
			$('.module .moduleTab .tabBox').empty().append(dataBox)
			$('.module .moduleMain').empty().append(dataBox2)

			addOtherImg();

			//将数据传给弹窗
			chooseAttribute('body', data, confirmAttribute);
			
			//当url后面有form=materialPriority 的时候，表示来自 素材优先版，则不显示反馈机型
			if(GetQueryString('from') == 'materialPriority') {
				$('.feedback').remove()

			}

			//点击确认按钮后执行的函数
			function confirmAttribute(selectedStyleList) {
				//loading层
				layer.open({
					content: '',
					type: 2,
					shadeClose: false
				});

				$('.attribute b').html($('.ap-selectedInfo').html().slice(9));

				//商品属性id
				goodsStyleId = selectedStyleList.id;
				//商品该属性的第几面的id 暂时只有一面 
				goodsSideId = selectedStyleList.sideList[0].id;

				//模型图
				var template = selectedStyleList.sideList[0];

				$('.templateImgBox').eq(0).css({
					'top': template.modelOrigin.split(',')[1] / 100 + 'rem',
					'left': template.modelOrigin.split(',')[0] / 100 + 'rem',
					'width': template.modelSize.split(',')[0] / 100 + 'rem',
					'height': template.modelSize.split(',')[1] / 100 + 'rem'
				});
				$('.templateImgBox').eq(0).attr('data-templateRealWidth', template.modelSize.split(',')[0]);
				$('.templateImgBox .bgImg').eq(0).attr('src', template.modelBackgroundImageUrl);

				//如果没有前景图则移除这个元素
				if(template.modelForegroundImageUrl === undefined) {
					$('.templateImgBox .frontImg').eq(0).remove();
				} else {
					$('.templateImgBox .frontImg').eq(0).attr('src', template.modelForegroundImageUrl);
				}

				$('.activeArea').eq(0).css({
					'top': template.editAreaOrigin.split(',')[1] / 100 + 'rem',
					'left': template.editAreaOrigin.split(',')[0] / 100 + 'rem',
					'width': template.editAreaSize.split(',')[0] / 100 + 'rem',
					'height': template.editAreaSize.split(',')[1] / 100 + 'rem'
				});

				activeAreaWidth = $('.activeArea').width();
				activeAreaHeight = $('.activeArea').height();

				//大图预览图
				var previewList = selectedStyleList.previewList;
				var dataBox = '';
				$.each(previewList, function(i) {

					var compoundImgStyle = 'top:' + previewList[i].userImageOrigin.split(',')[1] / 100 + 'rem' + ';left:' + previewList[i].userImageOrigin.split(',')[0] / 100 + 'rem' + ';width:' + previewList[i].userImageSize.split(',')[0] / 100 + 'rem' + ';height:' + previewList[i].userImageSize.split(',')[1] / 100 + 'rem' + '';

					dataBox += '<div class="swiper-slide"><div class="previewMain"><img class="bgImg" src="' + previewList[i].backgroundImageUrl + '"><img class="frontImg" src="' + previewList[i].foregroundImageUrl + '"><div class="compoundImg" style="' + compoundImgStyle + '" ><img src=""></div></div></div>';

				});

				$('.previewPage .swiper-preview .swiper-wrapper').empty().append(dataBox);

				goodsName = data.data.name;

				$('.layui-m-layer').remove()

				//			//初次进入添加操作提示图片
				//			var operationTips = getCookie('operationTips')
				//			if(!operationTips) {
				//				$('body').append('<div class="operationTips"><img src="img/diy-operationTips.png" alt="提示"/></div>')
				//				$('body').on('touchstart', '.operationTips', function() {
				//					$('.operationTips').remove();
				//				})
				//				setCookie('operationTips', true, 30)
				//				return;
				//			}

			}

			//数据加载完成后显示界面
			$('.dom-noLoad').hide();
			$('.dom-hasLoad').show();

		};
	loadData(url, true, successFunc);

	$('.attribute .shopCar').off('click').click(function() {

		layer.open({
			content: '离开此页面将会清除您的定制操作',
			btn: ['确定', '取消'],
			yes: function(index) {
				//跳转首页需要传入channel和source，如果localstorage里面没有source则传给首页的就是null，首页再去做判断
				window.location.href = 'index.html?channel=' + channel + '&source=' + localStorage.getItem('source');

				window.localStorage.setItem('tab', 2)
				layer.close(index);

			},
			no: function(index) {
				layer.close(index);

			}

		})
	})

	$('.attribute .back').off('click').click(function() {
		layer.open({
			content: '离开此页面将会清除您的定制操作',
			btn: ['确定', '取消'],
			yes: function(index) {
				//如果带有"_"的channel,且后面跟的是数字的话则表示为友宝那边的，返回就是首页了
				if(!isNaN(channel.split('_')[1])) {

					window.location.href = 'index.html?channel=' + channel + '&source=' + localStorage.getItem('source');
				} else {

					history.go(-1)
				}

				layer.close(index);

			},
			no: function(index) {
				layer.close(index);

			}

		})
	})
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

	var scrollable = document.getElementsByClassName('containerBox')[0];
	new ScrollFix(scrollable);

};
getGoodsData();

//点击选中元素进行操作
function checked() {
	$('.cover').hide()

	//手势操作提示
	if(!gestureTips.move.flag) {
		changeTips(gestureTips.move.text)
	} else {
		changeTips();
	}

	$.each(gestureTips, function(i) {
		if(!gestureTips[i].flag) {
			changeTips(gestureTips[i].text)
			gestureTips[i].flag = true;
			return false;
		}
	})

	$('.additive').off("click").click(function(e) {
		//		$('.additiveBox2').css('overflow','visible')

		//编辑按钮变为预览
		$('.handleBtn').hide();
		$('.handleBtn.previewBtn').show();

		//	选中出现删除按钮
		$('.sideBtn .delete').show();
		$('body').on('click', '.sideBtn .delete', function() {

			layer.open({
				content: '是否确定删除？',
				btn: ['确定', '取消'],
				yes: function(index) {
					$('.additive.textConfirm .close').click()
					layer.close(index);

				},
				no: function(index) {
					layer.close(index);

				}
			});

		})
		$('.module,.textBtn,.imgBtn').removeClass('act')
		$('.activeArea').addClass('confirm');
		var index = $(this).index()
		$('.additive .close').hide();
		$('.additive').removeClass('textConfirm').eq(index).addClass('textConfirm').find('.close').show();
		$('.additive2 .close').hide();
		$('.additive2').removeClass('textConfirm').eq(index).addClass('textConfirm').find('.close').show();
		handleImg(index)

		if($('.additive.addText.textConfirm').length > 0) {
			$('.textInputBox .changeText,.textInputBox .emptyInput').show()
			$('.textInput').val($('.additive.addText.textConfirm .text').text())

			$('.textModule.module,.bottomBtn .textBtn').addClass('act')
			var fontfamily = $('.additive.addText.textConfirm').attr('data-fontfamily')
			var fontColor = $('.additive.addText.textConfirm').attr('data-fontColor')
			$('.textModule .fontFamily .item,.textModule .fontColor .item').removeClass('act');
			$('.textModule .fontFamily .item[data-fontfamily="' + fontfamily + '"]').click();
			$('.textModule .fontColor .item[data-fontColor="' + fontColor + '"]').click();

		} else {
			$('.module').removeClass('act')
			$('.textModule .fontFamily .item').removeClass('act').eq(0).addClass('act');
			$('#textInput').val('')
			$('.textInputBox .changeText').hide()
		}

	})

	$('.additiveBox .close').off("click").click(function() {

		var index = $(this).parents('.additive').index();
		$('.additive').eq(index).remove();
		$('.additive2').eq(index).remove();
		confirm()

	})
	$('.additive').on('touchstart', function() {

		//		$(this).click();
	})
	$('.goodsShow').on('click', function(e) {
		if(e.target == e.currentTarget) {

			confirm();
		}
	})
	$('.templateImgBox').on('click', function(e) {
		if(e.target == e.currentTarget) {
			confirm();
		}
	})
	$('.additiveBox').on('click', function(e) {
		if(e.target == e.currentTarget) {
			confirm();
		}
	})

}
//checked();

//点击确认
function confirm() {
	$('.sideBtn .delete,.sideBtn .confirm,.activeArea .close,.textInputBox .inputTips').hide();
	$('.activeArea').removeClass('confirm');

	$('.additive,.additive2').removeClass('textConfirm')
	newAlloyFinger = newAlloyFinger.destroy();
	newAlloyFinger = new AlloyFinger(templateImgBox, {});
	$('.module,.textBtn,.imgBtn,.goodsShow').removeClass('act')
	//	$('.containerBox').scrollTop(0)
	//清空输入框
	$('#textInput').val('');
	//隐藏红叉和大勾
	$('.textInputBox .changeText,.textInputBox .emptyInput').hide()
	//	$('.additiveBox2').css('overflow','hidden')

	//预览按钮变为编辑
	$('.handleBtn').hide();
	$('.handleBtn.compileBtn').show();
}

//判断是否有表情，有则返回true
function isEmojiCharacter(substring) {

	for(var i = 0; i < substring.length; i++) {
		//		console.log(substring[i].charCodeAt())
		//发现有些表情没有检测到；后来添加的;后面的爱心 国旗等表情的编码是65039
		if(substring[i].charCodeAt() >= 55356 && substring[i].charCodeAt() <= 65039) {
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

//字数限制
$('#textInput').bind('input propertychange', function() {
	//去除中间的空格
	var va = $(this).val().replace(/\s/gi, '')
	if(va.length >= 10) {
		$(this).val(va.substring(0, 10))
		$('.textInputBox .inputTips ').show()
	} else {
		$('.textInputBox .inputTips ').hide()
	}
	//判断是否有表情 时时输入做判断
	if(isEmojiCharacter(va)) {
		layerHint('请输入汉字或英文')
		$('#textInput').val('');
	}

});

//添加文字
function addText() {

	//超过个数提示
	if($('.activeArea .additive').length >= maxAdditive) {
		layer.open({
			content: '超过了添加元素个数',
			btn: '我知道了'
		});
		return false;
	}
	var value;

	function detectionText() {
		//		var flag = true;
		value = $.trim($('#textInput').val());

		//判断是否有表情，有则返回true
		if(isEmojiCharacter(value)) {
			layer.open({
				content: '请输入汉字或英文',
				btn: '我知道了'
			});

			$('#textInput').val('');
			return false;
		}
		if(value == '') {
			layerHint('文本不能为空')
			$('#textInput').val('');
			return false;
		}

		//请求接口来获得输入的文字
		//		$.ajax({
		//			url: apiDomain + '/diyapi/trade/echo',
		//			type: 'POST',
		//			timeout: 60000,
		//			async: false,
		//			dataType: 'json',
		//			data: {"text":value},
		//			success: function(data) {
		//				console.log(data)
		//				value = data.data;
		//				flag = true;
		//			},
		//			error: function(error) {
		//				console.log('冒的数据 搞毛呀');
		//				console.log(error);
		//				flag = false;
		//			}
		//
		//		});

		//		if(!flag) {
		//			layerHint('请输入汉字或英文');
		//			return false
		//		}

		return true;

	}

	if(detectionText() == false) {

		return false
	}

	if(value == $('.activeArea .additive .text').last().text() && !getCookie('repetitionTextTips')) {
		setCookie('repetitionTextTips')

		layer.open({
			content: '是否添加相同内容？',
			btn: ['确定', '取消'],
			yes: function(index) {
				$('.textInputBox .addTextBtn').click()
				layer.close(index);

			},
			no: function(index) {
				layer.close(index);
				return false;

			}

		})
		return false
	}

	//修改文本 记得也要检测是否为空，是否有表情
	$('.textInputBox .changeText').off().click(function() {

		if(detectionText() == false) {
			return false
		}

		if($('.activeArea .additive.addText.textConfirm .text').text() == value) {
			layerHint('文本未变')
		}

		$('.activeArea .addText.textConfirm .text').text(value);

	})

	var fontColor = $('.textModule .fontColor .item.act').attr('data-fontColor')
	var fontFamily = $('.textModule .fontFamily .item.act').attr('data-fontFamily')

	var text = '<div class="additive addText" data-fontColor="' + fontColor + '" data-fontFamily="' + fontFamily + '" data-transform = "false" data-text="' + value + '"><div class=" text">' + value + '</div><div class="close"></div></div>';
	var text2 = '<div class="additive2 addText"><div class="text">' + value + '</div><div class="close"></div></div>';
	$(".additiveBox").append(text);
	$(".additiveBox2").append(text2);
	checked();
	$('.addText.additive').last().click();
	var textWidth = $('.addText.additive').last().outerWidth();
	var textHeight = $('.addText.additive').last().outerHeight();

	$('.addText.additive').last().css({
		"margin-left": -textWidth / 2 + "px",
		"margin-top": -textHeight / 2 + "px"
	})
	$('.addText.additive2').last().css({
		"margin-left": -textWidth / 2 + "px",
		"margin-top": -textHeight / 2 + "px"
	})
	$('.addText.additive').last().attr('data-textWidth', $('.addText.additive').last().width())
	$('.addText.additive').last().attr('data-textHeight', $('.addText.additive').last().height())

	//	$('.textModule,.bottomBtn .textBtn').removeClass('act');

}

//防止键盘弹出时，定位的元素被顶起来  为了和谢磊xl-login.js里面的inputFouc()区别故前面加hd
function hdInputFouc() {

	var wHeight = window.innerHeight; //获取初始可视窗口高度 
	window.addEventListener('resize', function() { //监测窗口大小的变化事件 

		var hh = window.innerHeight; //当前可视窗口高度 

		if(wHeight > hh) { //可以作为虚拟键盘弹出事件 

			//			$('.moduleBox,.bottomBtn,.module').css('position', 'static');
			//			$('.moduleBox,.bottomBtn,.module').hide();

		} else { //可以作为虚拟键盘关闭事件 

			//			$('.moduleBox,.bottomBtn,.module').css('position', 'absolute');
			//			$('.moduleBox,.bottomBtn,.module').show();

			//			$('.addTextBtn').click()
		}
		wHeight = hh;
	});
}
//hdInputFouc()
//改变字体颜色，样式
function changeFont() {
	$('.textModule .fontColor .item').off("click").click(function() {
		var color = $(this).attr("data-fontColor");
		$('.textModule .fontColor .item').removeClass('act');
		$(this).addClass('act')
		$('.addText.textConfirm').css("color", color)
		$('.addText.textConfirm').attr("data-fontColor", color)

		//选中颜色居中
		var item = $(this);
		var container = $(".textModule .fontColorBox");
		var itemOffset = item.offset();
		var itemOffsetLeft = itemOffset.left + container.scrollLeft();
		var centerLeft = (container.width() - item.width()) / 2;
		container.scrollLeft(itemOffsetLeft - centerLeft);

	})
	$('.textModule .fontFamily .item').off("click").click(function() {
		//选中字体居中
		var item = $(this);
		var container = $(".textModule .fontFamilyBox");
		var itemOffset = item.offset();
		var itemOffsetLeft = itemOffset.left + container.scrollLeft();
		var centerLeft = (container.width() - item.width()) / 2;
		container.scrollLeft(itemOffsetLeft - centerLeft);

		var fontFamily = $(this).attr("data-fontFamily");
		$('.textModule .fontFamily .item').removeClass('act');
		$(this).addClass('act')
		$('.addText.textConfirm').attr("data-fontFamily", fontFamily)
		switch(fontFamily) {
			case 'a':
				fontFamily = "方正正纤体";
				break;
			case 'b':
				fontFamily = "新青年";
				break;
			case 'c':
				fontFamily = "汉仪黑荔枝体";
				break;
			case 'd':
				fontFamily = "书体坊硬笔行书";
				break;
			case 'e':
				fontFamily = "全新硬笔隶书体";
				break;
			default:
				fontFamily = "方正正纤体";
				break;
		}
		$('.addText.textConfirm').css("font-family", fontFamily)

	})

}
changeFont();

//操作添加上的元素
var handleImg = function(index) {

	var id = document.getElementsByClassName("additive")[index];
	var id2 = document.getElementsByClassName("additive2")[index];

	var close = $('.additive').eq(index).find('.close');
	var close2 = $('.additive2').eq(index).find('.close');

	var initScale = 1;

	if($('.additive').eq(index).attr('data-transform') == 'false') {

		Transform(id);
		Transform(id2);

		$('.additive').eq(index).attr('data-transform', 'true')
	}

	//先销毁实例
	newAlloyFinger = newAlloyFinger.destroy();

	newAlloyFinger = new AlloyFinger(templateImgBox, {
		rotate: function(evt) {

			//手势操作提示	
			gestureTips.rotate.flag = true;
			changeTips();

			id.rotateZ += evt.angle;
			id2.rotateZ += evt.angle;

		},
		multipointStart: function() {
			initScale = id.scaleX;

		},
		pinch: function(evt) {

			//手势操作提示	
			gestureTips.scale.flag = true;
			if(!gestureTips.rotate.flag) {
				changeTips(gestureTips.rotate.text)
			} else {
				changeTips();
			}

			var scale = initScale * evt.scale;

			// 控制缩放比例
			if(scale > 5) {
				scale = 5
			} else if(scale < 0.3) {
				scale = 0.3
			}

			id.scaleX = id.scaleY = scale;
			id2.scaleX = id2.scaleY = scale;

			//同时缩小删除按钮
			close.css({
				"-webkit-transform": "scale(" + 1 / scale + ")",
				"transform": "scale(" + 1 / scale + ")"
			})
			close2.css({
				"-webkit-transform": "scale(" + 1 / scale + ")",
				"transform": "scale(" + 1 / scale + ")"
			})

		},
		pressMove: function(evt) {

			//手势操作提示		
			gestureTips.move.flag = true;
			if(!gestureTips.scale.flag) {
				changeTips(gestureTips.scale.text)
			} else {
				changeTips();
			}

			id.translateX += evt.deltaX;
			id.translateY += evt.deltaY;

			id2.translateX += evt.deltaX;
			id2.translateY += evt.deltaY;

			evt.preventDefault();

		}

	});

	//元素移动超出操作区域则删除
	$('body').on('touchmove', '.templateImgBox', function() {

		var checked = $('.additive.textConfirm');
		if(checked.length == 0) {
			return
		}

		var x = checked.position().left + parseFloat(checked.css("margin-left"));
		var y = checked.position().top + parseFloat(checked.css("margin-top"));

		//如果是文字，加上padding 8px的距离，以文字左上角为基点
		if($('.additive.textConfirm.addText').length > 0) {
			x = x + 8;
			y = y + 8
		}

		var w = checked.width()
		var h = checked.height()
		var aW = $('.activeArea').width()
		var aH = $('.activeArea').height()

		if((x > aW) || (x < 0 && x < -w) || (y > aH) || (y < 0 && y < -h)) {
			layerHint('超出编辑范围，已移除')
			checked.find('.close').click()
		}

	})

}

//获得用户图片
function getUserImg() {
	// 检测是否支持File API
	if(window.File && window.FileReader && window.FileList && window.Blob) {
		//  支持
	} else {
		layer.open({
			content: '您的浏览器不支持上传文件！',
			btn: '我知道了'
		});
		return false;
	}

	$('.file-input').on('change', function(e) {

		//loading层
		layer.open({
			content: '',
			type: 2,
			shadeClose: false
		});

		//文件更改，将用户图片是否上传成功设为false
		ifImgUpload = false;

		//获取图片资源
		userImgFile = e.target.files[0];

		// 只选择图片文件
		if(!userImgFile.type.match('image.*')) {

			$('.layui-m-layer').remove()
			layer.open({
				content: '您上传的图片格式不正确，请重新选择！',
				btn: '我知道了'
			});

			return false;
		}

		//获取照片方向角属性，用户旋转控制
		EXIF.getData(userImgFile, function() {
			EXIF.getAllTags(this);
			Orientation = EXIF.getTag(this, 'Orientation');
		});

		var reader = new FileReader();
		// 读取文件
		reader.readAsDataURL(userImgFile);

		// 渲染文件
		reader.onload = function(arg) {

			var data = arg.target.result;
			//加载图片获取图片真实宽度和高度
			var image = new Image();
			image.src = data;
			image.onload = function() {

				// devicePlatform === 'ios'  发现android也会有这个问题，取消了只对ios的判断
				if(Orientation != null && Orientation != 1) {

					//如果方向角不为1，都需要进行旋转
					switch(Orientation) {
						case 6: //需要顺时针（向左）90度旋转

							imgOrientation = 90;
							imgRealWidth = image.height;
							imgRealHeight = image.width;
							break;
						case 8: //需要顺时针（向左）270度旋转

							imgOrientation = 270;
							imgRealWidth = image.height;
							imgRealHeight = image.width;
							break;
						case 3: //需要180度旋转

							imgOrientation = 180;
							imgRealWidth = image.width;
							imgRealHeight = image.height;
							break;
						default:
							imgRealWidth = image.width;
							imgRealHeight = image.height;
							break;
					}

				} else {
					imgRealWidth = image.width;
					imgRealHeight = image.height;
				}

				lrz(userImgFile)
					.then(function(rst) {
						// 处理成功会执行

						var getImg = '<div class="additive addImg" data-imgRealWidth="' + imgRealWidth + '" data-transform="false" data-url="这里是用户图片上传成功后的图片地址" data-imgId=""><img  src="' + rst.base64 + '"><div class="close"></div></div>';
						var getImg2 = '<div class="additive2 addImg"><img  src="' + rst.base64 + '"><div class="close"></div></div>';

						//弹窗 有照片了就出现
						if($(".addImg").length > 0 && layerReplaceImg1) {

							layer.open({
								content: '再次添加照片将替换掉原来的照片哦！（文字可添加多个）',
								btn: ['确定', '取消'],
								shadeClose: false,
								yes: function(index) {
									continueAdd()
									layer.close(index);

								},
								no: function(index) {
									layer.close(index);
									$('.layui-m-layer').remove()
								}
							});
							layerReplaceImg1 = false;
						} else {
							continueAdd();
						}

						function continueAdd() {
							$(".addImg").remove();
							$(".additiveBox").append(getImg)
							$(".additiveBox2").append(getImg2)

							//让图片居中 要让图片完全展示在操作区域，不然截图会有问题
							imgWidth = activeAreaWidth;
							imgHeight = imgWidth / imgRealWidth * imgRealHeight;

							if(imgHeight <= activeAreaHeight) {
								$(".addImg").css({
									"width": "150%",
									"margin-left": -imgWidth * 1.5 / 2 + "px",
									"margin-top": -imgHeight * 1.5 / 2 + "px"
								})
								$(".addImg img").css({
									"width": "100%",
									"height": "auto"
								})

							} else {
								imgHeight = activeAreaHeight;
								imgWidth = imgHeight / imgRealHeight * imgRealWidth;
								$(".addImg").css({
									"height": "150%",
									"margin-left": -imgWidth * 1.5 / 2 + "px",
									"margin-top": -imgHeight * 1.5 / 2 + "px"
								})
								$(".addImg img").css({
									"width": "auto",
									"height": "100%"
								})

							}
							$('.additive.addImg').attr("data-imgWidth", imgWidth)
							$('.additive.addImg').attr("data-imgHeight", imgHeight)
							$('.layui-m-layer').remove()

							//上传用户图片
							var form_data = new FormData();
							var file_data = userImgFile;

							form_data.append("file", file_data);
							var url = apiDomain + '/diyapi/upload/order';
							var successFun = function(data) {

								$('.additive.addImg').attr("data-url", data.data.ossPath)
								ifImgUpload = true;
							}
							var errorFun = function(err) {}

							ajaxUploadUserImg(url, true, form_data, successFun, errorFun);

							//添加点击选中事件
							checked();
							//默认进去是被点击后的状态
							$('.addImg').click();
						}

						// 将input控件的内容置空，保证change事件被触发

						$('.fileInputBox').empty().append('<input type="file" class="file-input" />')
						getUserImg();

					})
					.catch(function(err) {
						// 处理失败会执行

					})
					.always(function() {
						// 不管是成功失败，都会执行

					});

			};

		};

	});

}
getUserImg();

function getBase64Image(img) {
	var canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;

	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, img.width, img.height);
	var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
	var dataURL = canvas.toDataURL("image/" + ext);
	return dataURL;
}

//添加推荐的图片，或贴纸
function addOtherImg() {
	$('body').off('click', '.imgModule .moduleMain .mainItem.picture .moduleOption').on('click', '.imgModule .moduleMain .mainItem.picture .moduleOption', function() {

		// 为了区别之前请求的那张图，在后面添加233或者随便什么，不然就不会有新的请求，老的请求头里面没有又没有Access-Control-Allow-Origin:*；
		// 然后是为了解决cavans跨域的问题 核心是image.crossOrigin = '';
		// 那个会给图片请求头加上Access-Control-Allow-Origin:*；
		// 直接加?233，如果图片后缀有？就不行了，需要判断有没有 "？" 问号
		//		var src = $(this).find('img').attr('src').indexOf("?")!=-1 ? $(this).find('img').attr('src') + '&233': $(this).find('img').attr('src') + '?233';
		// 后来考虑到下面待选择的图片都较小，放大后模糊；故当用户添加图片是去掉后缀，请求原图
		//暂时不用加后缀来压缩，后台拿到缩放比例后是去乘以原图的大小这里只能用原图
		var src = $(this).find('img').attr('src').split('?')[0] + '?x-oss-process=image/resize,w_400'
		var imgId = $(this).attr('data-imgId');
		var image = new Image();
		image.crossOrigin = '';
		image.src = src;
		//loading层
		layer.open({
			content: '',
			type: 2,
			shadeClose: false
		});

		image.onload = function() {
			imgRealWidth = image.width;
			imgRealHeight = image.height;

			var base64 = getBase64Image(image);

			var getImg = '<div class="additive addImg" data-imgRealWidth="' + imgRealWidth + '"  data-transform="false" data-imgId=' + imgId + '><img src="' + base64 + '"><div class="close"></div></div>';
			var getImg2 = '<div class="additive2 addImg"><img src="' + base64 + '"><div class="close"></div></div>';

			if($(".addImg").length > 0 && layerReplaceImg2) {
				layer.open({
					content: '再次添加照片将替换掉原来的照片哦！（文字可添加多个）',
					btn: ['确定', '取消'],
					shadeClose: false,
					yes: function(index) {
						continueAdd2()
						layer.close(index);

					},
					no: function(index) {
						layer.close(index);
						$('.layui-m-layer').remove()
					}

				});
				layerReplaceImg2 = false;
			} else {
				continueAdd2();
			}

			function continueAdd2() {
				$(".addImg").remove();
				$(".additiveBox").append(getImg);
				$(".additiveBox2").append(getImg2);

				//让图片居中 要让图片完全展示在操作区域，不然截图会有问题
				//2017.10.20 图片添加后的默认大小要超出一部分，故将宽度或者高度设置为150%;由于传给后台的数据是直接取的最后的大小，故图片的大小数据不需要乘以1.5;
				imgWidth = activeAreaWidth;
				imgHeight = imgWidth / imgRealWidth * imgRealHeight;

				if(imgHeight <= activeAreaHeight) {
					$(".addImg").css({
						"width": "150%",
						"height": "auto",
						"margin-left": -imgWidth * 1.5 / 2 + "px",
						"margin-top": -imgHeight * 1.5 / 2 + "px"
					})
					$(".addImg img").css({
						"width": "100%",
						"height": "auto"
					})
				} else {

					imgHeight = activeAreaHeight;
					imgWidth = imgHeight / imgRealHeight * imgRealWidth;
					$(".addImg").css({
						"height": "150%",
						"width": "auto",
						"margin-left": -imgWidth * 1.5 / 2 + "px",
						"margin-top": -imgHeight * 1.5 / 2 + "px"
					})
					$(".addImg img").css({
						"width": "auto",
						"height": "100%"
					})
				}
				$('.additive.addImg').attr("data-imgWidth", imgWidth)
				$('.additive.addImg').attr("data-imgHeight", imgHeight)
				$('.layui-m-layer').remove()

				//添加点击选中事件
				checked();
				//默认进去是被点击后的状态
				$('.addImg').click();
			}

		};

	});

	//添加贴纸 2017.10.18取消
	//	$('.imgModule .moduleMain .mainItem.paster .moduleOption').off('click').click(function() {
	//
	//		if($('.activeArea .additive').length >= maxAdditive) {
	//			layer.open({
	//				content: '超过了添加元素个数',
	//				btn: '我知道了'
	//			});
	//			return false;
	//		}
	//
	//		var src = $(this).find('img').attr('src').split('?')[0] + '?x-oss-process=image/resize,w_400'
	//		var pasterId = $(this).attr('data-pasterId');
	//		var image = new Image();
	//		image.crossOrigin = '';
	//		image.src = src;
	//
	//		image.onload = function() {
	//			imgRealWidth = image.width;
	//			imgRealHeight = image.height;
	//
	//			var base64 = getBase64Image(image);
	//
	//			var getImg = '<div class="additive addPaster" data-imgRealWidth="' + imgRealWidth + '" data-transform="false" data-pasterId=' + pasterId + '><img  src="' + base64 + '"><div class="close"></div></div>';
	//			var getImg2 = '<div class="additive2 addPaster"><img src="' + base64 + '"><div class="close"></div></div>';
	//
	//			$(".additiveBox").append(getImg);
	//			$(".additiveBox2").append(getImg2);
	//
	//			//让图片居中 要让图片完全展示在操作区域，不然截图会有问题
	//			imgWidth = activeAreaWidth;
	//			imgHeight = imgWidth / imgRealWidth * imgRealHeight;
	//
	//			if(imgHeight <= activeAreaHeight) {
	//				$(".additive.addPaster:last").css({
	//					"width": "100%",
	//					"height":"auto",
	//					"margin-left": -imgWidth / 2 + "px",
	//					"margin-top": -imgHeight / 2 + "px"
	//				});
	//				$(".additive.addPaster:last img").css({
	//					"width": "100%",
	//					"height": "auto"
	//				})
	//				$(".additive2.addPaster:last").css({
	//					"width": "100%",
	//					"height":"auto",
	//					"margin-left": -imgWidth / 2 + "px",
	//					"margin-top": -imgHeight / 2 + "px"
	//				});
	//				$(".additive2.addPaster:last img").css({
	//					"width": "100%",
	//					"height": "auto"
	//				})
	//
	//			} else {
	//				imgHeight = activeAreaHeight;
	//				imgWidth = imgHeight / imgRealHeight * imgRealWidth;
	//
	//				$(".additive.addPaster:last").css({
	//					"height": "100%",
	//					"width":'auto',
	//					"margin-left": -imgWidth / 2 + "px",
	//					"margin-top": -imgHeight / 2 + "px"
	//				});
	//				$(".additive.addPaster:last img").css({
	//					"width": "auto",
	//					"height": "100%"
	//				})
	//				$(".additive2.addPaster:last").css({
	//					"height": "100%",
	//					"width":'auto',
	//					"margin-left": -imgWidth / 2 + "px",
	//					"margin-top": -imgHeight / 2 + "px"
	//				});
	//				$(".additive2.addPaster:last img").css({
	//					"width": "auto",
	//					"height": "100%"
	//				})
	//
	//			}
	//			$(".additive.addPaster:last").attr("data-imgWidth", imgWidth)
	//			$(".additive.addPaster:last").attr("data-imgHeight", imgHeight)
	//			//添加点击选中事件
	//			checked();
	//			//默认进去是被点击后的状态
	//			$(".additive.addPaster:last").click();
	//
	//		};
	//		image.src = src;
	//
	//	});

}
addOtherImg();

// 截屏预览
function preview() {
	//	截图之前要滚到最上面,防止出现误差
	$('.containerBox').scrollTop(0)
	//获取像素密度
	var getPixelRatio = function(context) {
		var backingStore = context.backingStorePixelRatio ||
			context.webkitBackingStorePixelRatio ||
			context.mozBackingStorePixelRatio ||
			context.msBackingStorePixelRatio ||
			context.oBackingStorePixelRatio ||
			context.backingStorePixelRatio || 1;
		return(window.devicePixelRatio || 1) / backingStore;
	};
	confirm();
	// event.preventDefault();

	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	var ratio = getPixelRatio(ctx);

	var activeArea = document.getElementsByClassName("activeArea")[0];
	var width = activeArea.offsetWidth; // 获取(原生）dom 宽度
	var height = activeArea.offsetHeight; // 获取(原生）dom 高
	var left = getElementLeft(activeArea); // 
	var top = getElementTop(activeArea); // 
	canvas.width = width * ratio;
	canvas.height = height * ratio;

	//修复其截图区域问题
	ctx.translate(-left * ratio, -top * ratio);
	ctx.scale(ratio, ratio);
	html2canvas(activeArea, {
		canvas: canvas,
		allowTaint: true,
		taintTest: false,
		onrendered: function(canvas) {
			var dataUrl = canvas.toDataURL("image/png", 0.1);

			var oImgPNG = Canvas2Image.saveAsPNG(canvas, true)

			//			var newImg = document.createElement("img");
			//			newImg.crossOrigin = 'anonymous';
			//			newImg.src = dataUrl;

			$(".previewPage .compoundImg").empty().append(oImgPNG);
			$('.layui-m-layer').remove()

		}
	});
}

// 确定 重做 缩放
function sideBtn() {

	$('.sideBtn .confirm').off('click').click(function() {
		confirm();
	});

	$('.sideBtn .reform').off('click').click(function() {

		layer.open({
			content: '是否确定重新制作？',
			btn: ['确定', '取消'],
			yes: function(index) {
				$('.activeArea .additiveBox,.activeArea .additiveBox2').empty();
				additiveLayer = 0;
				layer.close(index);

			},
			no: function(index) {
				layer.close(index);

			}
		});

	});

	$('.sideBtn .zoom').off('click').click(function() {
		if($('.templateImgBox').hasClass('zoom')) {
			$('.templateImgBox').removeClass('zoom');
			$('.sideBtn .zoom img').attr('src', 'img/diy-zoomIn.png');
		} else {
			$('.templateImgBox').addClass('zoom');
			$('.sideBtn .zoom img').attr('src', 'img/diy-zoomOut.png');
		}

	});

	//预览按钮 实际只是去掉所有选中 不是真正去生成预览图
	$('body').off('click', '.handleBtn.previewBtn').on('click', '.handleBtn.previewBtn', function() {
		confirm()
		$('.handleBtn').hide();
		$('.handleBtn.compileBtn').show();

	})
	//编辑按钮 选中元素 原需求是选中最后一个操作的 考虑到较麻烦 还有删掉元素之后选哪个等；现在是选中第一个元素，简单点
	$('body').off('click', '.handleBtn.compileBtn').on('click', '.handleBtn.compileBtn', function() {
		$('.handleBtn').hide();
		$('.handleBtn.previewBtn').show();

		$('.additive').eq(0).click()
	})

}
sideBtn();

//弹出的图片模块，点击切换tab
function clickChangeImgTab() {

	//输入框由内容则红叉出现，点击红叉清空输入框
	$('#textInput').bind('input propertychange', function() {
		if($.trim($(this).val()).length == 0) {
			$('.textInputBox .emptyInput').hide()
		} else {
			$('.textInputBox .emptyInput').show()
		}
	})
	$('body').on('click', '.textInputBox .emptyInput', function() {
		$('#textInput').val("")
		$('.textInputBox .emptyInput').hide()
	})

	//点击网络素材
	$('body').off('click', '.bottomBtn .imgBtn').on('click', '.bottomBtn .imgBtn', function() {

		if($(this).hasClass('act')) {
			$('.textModule,.bottomBtn .addBtn,.imgModule').removeClass('act');
		} else {
			$('.textModule,.bottomBtn .addBtn,.imgModule').removeClass('act');
			$('.imgModule,.bottomBtn .imgBtn').addClass('act');
		}

	});

	$('body').off('click', '.addTextBtn').on('click', '.addTextBtn', function() {
		addText()
	});

	//点击添加文字
	$('body').off('click', '.bottomBtn .textBtn').on('click', '.bottomBtn .textBtn', function(e) {

		if($(this).hasClass('act')) {
			$('.textModule,.bottomBtn .addBtn,.imgModule').removeClass('act');
		} else {
			$('.textModule,.bottomBtn .addBtn,.imgModule').removeClass('act');
			$('.textModule,.bottomBtn .textBtn').addClass('act');
		}

	})

	//点击上传图片 不需要再次点击就下去，每次点击都是去相册
	$('body').off('click', '.bottomBtn .uploadingImg').on('click', '.bottomBtn .uploadingImg', function() {

		$('.textModule,.bottomBtn .addBtn,.imgModule').removeClass('act');
		$(this).addClass('act')

	});

	$('body').off('click', '.module.imgModule .moduleTab .tabItem').on('click', '.module.imgModule .moduleTab .tabItem', function() {

		var index = $(this).index(),
			materialImage = materialImageGrouping[index],
			dataBox = '';
		$('.module.imgModule .moduleTab .tabItem').removeClass('act');
		$(this).addClass('act');

		if($('.module .moduleMain .mainItem.picture').eq(index).find(' .imgBox .moduleOption').length == 0) {

			$.each(materialImage, function(i) {
				dataBox += '<div class="moduleOption" data-imgId=' + materialImage[i].id + '><div><img src="' + addImgSuffix(materialImage[i].imageUrl) + '"></div></div>';
			});

			$('.module .moduleMain .mainItem.picture').eq(index).find('.imgBox').append(dataBox)
		}

		$('.module.imgModule .moduleMain .mainItem').hide().eq(index).show();
	});

	$('body').off('click', '.down').on('click', '.down', function() {
		//		confirm();
		//隐藏黑色半透明的遮罩
		$('.cover').hide()
		$('.module,.bottomBtn .textBtn,.bottomBtn .imgBtn').removeClass('act');
	});

	//文字操作框弹出的时候，将页面往上滚，消失的时候，页面下来  
	//好像是这个导致了点击的时候页面的抖动
	$('body').on('click', function() {
		if($('.textModule').hasClass('act')) {

			$('.goodsShow').addClass('act')

			$('.containerBox').scrollTop($('.textModule').height() + 50)
		} else {

			$('.goodsShow').removeClass('act')
			//			$('.containerBox').scrollTop(0)
		}
	})

}
clickChangeImgTab();

//监控dom变化，决定能否立即购买；添加文字色块颜色
function addImgBtnIfShow() {
	var EventUtil = {

		addHandler: function(element, type, handler) { //添加事件
			if(element.addEventListener) {
				element.addEventListener(type, handler, false); //使用DOM2级方法添加事件
			} else if(element.attachEvent) { //使用IE方法添加事件
				element.attachEvent("on" + type, handler);
			} else {
				element["on" + type] = handler; //使用DOM0级方法添加事件
			}
		},

		removeHandler: function(element, type, handler) { //取消事件
			if(element.removeEventListener) {
				element.removeEventListener(type, handler, false);
			} else if(element.detachEvent) {
				element.detachEvent("on" + type, handler);
			} else {
				element["on" + type] = null;
			}
		},

		getEvent: function(event) { //使用这个方法跨浏览器取得event对象
			return event ? event : window.event;
		},

		getTarget: function(event) { //返回事件的实际目标
			return event.target || event.srcElement;
		},

		preventDefault: function(event) { //阻止事件的默认行为
			if(event.preventDefault) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}
		},

		stopPropagation: function(event) { //立即停止事件在DOM中的传播
			//避免触发注册在document.body上面的事件处理程序
			if(event.stopPropagation) {
				event.stopPropagation();
			} else {
				event.cancelBubble = true;
			}
		},

		getRelatedTarget: function(event) { //获取mouseover和mouseout相关元素
			if(event.relatedTarget) {
				return event.relatedTarget;
			} else if(event.toElement) { //兼容IE8-
				return event.toElement;
			} else if(event.formElement) {
				return event.formElement;
			} else {
				return null;
			}
		},

		getButton: function(event) { //获取mousedown或mouseup按下或释放的按钮是鼠标中的哪一个
			if(document.implementation.hasFeature("MouseEvents", "2.0")) {
				return event.button;
			} else {
				switch(event.button) { //将IE模型下的button属性映射为DOM模型下的button属性
					case 0:
					case 1:
					case 3:
					case 5:
					case 7:
						return 0; //按下的是鼠标主按钮（一般是左键）
					case 2:
					case 6:
						return 2; //按下的是中间的鼠标按钮
					case 4:
						return 1; //鼠标次按钮（一般是右键）
				}
			}
		},

		getWheelDelta: function(event) { //获取表示鼠标滚轮滚动方向的数值
			if(event.wheelDelta) {
				return event.wheelDelta;
			} else {
				return -event.detail * 40;
			}
		},

		getCharCode: function(event) { //以跨浏览器取得相同的字符编码，需在keypress事件中使用
			if(typeof event.charCode == "number") {
				return event.charCode;
			} else {
				return event.keyCode;
			}
		}

	};

	EventUtil.addHandler(window, "load", function(event) {

		EventUtil.addHandler(document, "DOMSubtreeModified", function(event) {

			var length = $('.additiveBox .additive').length;
			if(length === 0) {
				//				$(".activeArea .addImgBtn").show();
				$('.bottomBtn .buyBtn').removeClass('act')
			} else {
				//				$(".activeArea .addImgBtn").hide();
				$('.bottomBtn .buyBtn').addClass('act')
			}

		});

	});

	var $fontColor = $('.textModule .fontColor .item');
	$.each($fontColor, function(i) {

		var fontColor = $fontColor.eq(i).attr("data-fontcolor");
		$(this).css("background", fontColor);

	});
}
addImgBtnIfShow();

// 预览页面
function previewPage() {
	var swiperPreview = false;
	var mySwiper;

	$('.sideBtn .preview').off('click').click(function() {
		//loading层
		layer.open({
			content: '',
			type: 2,
			shadeClose: false
		});

		$(".activeArea .addImgBtn").css("opacity", 0);

		//如果区域有放大，要先将区域缩小再截图 缩小的所用时间是1s
		var timeout = 0;
		if($('.templateImgBox').hasClass('zoom')) {
			timeout = 1000;
		}
		$('.templateImgBox').removeClass('zoom');
		setTimeout(function() {
			preview();
			$('.previewPage').show();

			//判断是否初始化过swiper，之前是不判断直接重复初始化。会有些小bug
			if(!swiperPreview) {
				mySwiper = new Swiper('.swiper-preview', {
					pagination: '.swiper-pagination',
					paginationType: 'fraction',
				});
				swiperPreview = true;
			}
			//切换到第一个
			mySwiper.slideTo(0)
		}, timeout);

	});

	$('.previewPage .close').off('click').click(function() {
		$(".activeArea .addImgBtn").css("opacity", 1);
		$(".previewPage .compoundImg").empty();
		$('.previewPage').hide();

	});

}
previewPage();

/* 
 * 发送数据给后台
 * url				发送的接口地址 
 * sendSuccessFun	发送成功的函数
 * sendErrorFun		发送失败的函数
 */
function sendData(url, sendSuccessFun, sendErrorFun) {

	//现在先做的是单面的图印，模版图和用户上传的图片或文字等数据只有一套，后面需要支持多面

	//所有添加的元素的坐标和大小比例传给后台的数据都是以模版的真实尺寸templateRealWidth作为参考
	//故先获取到模版图片的手机上显示的大小templateWidth，用templateRealWidth除以templateWidth得到一个初始的比例baseScale，所有添加的元素的坐标和大小比例传给后台的数据就要乘以这个比例
	//图片和贴纸现在也是传大小，不是传比例；大小是要取旋转放大等操作后的大小；但文字所取的大小是要取旋转放大的之前的，然后再去乘以缩放的大小 2017.8.25

	var templateWidth = $('.templateImgBox').eq(0).width();
	var templateRealWidth = $('.templateImgBox').eq(0).attr('data-templateRealWidth');
	var baseScale = templateRealWidth / templateWidth;

	//初始化发送数据
	var additiveData = {};
	additiveData.token = token || temporaryToken; //用户id
	additiveData.channel = channel; //用户id
	additiveData.goodsId = goodsId; //商品id
	additiveData.goodsStyleId = goodsStyleId; //商品属性Id
	additiveData.num = $(".attributePopup .ap-numBox .count input").val(); //商品数量
	additiveData.styleSideArray = []; //添加的元素

	var additiveItemData = {};
	additiveItemData.id = goodsSideId; //这个id来判断是一套商品属性组合的第几面
	additiveItemData.materialTemplateArray = []; //模版列表
	additiveItemData.materialImageArray = []; //图片列表
	additiveItemData.materialPasterArray = []; //贴纸列表
	additiveItemData.materialTextArray = []; //文字列表

	var additive = document.getElementsByClassName("additive");
	$.each(additive, function(i) {
		//区分图片元素
		if(js_hasClass(additive[i], "addImg")) {
			additiveLayer++;
			var dataBox = {};
			//			dataBox.pageNo = 1;
			dataBox.isReverse = false;
			dataBox.layer = additiveLayer;

			var $additive = $(".additive").eq(i);
			var x = $additive.position().left + parseFloat($additive.css("margin-left"));
			var y = $additive.position().top + parseFloat($additive.css("margin-top"));
			dataBox.origin = x * baseScale + ',' + y * baseScale;

			//传入的图片的比例，应该用图片没旋转的时候的宽度（刚好是操作区域的宽度，不能取图片旋转缩放后的大小）除以图片真实的宽度在乘以页面初始比例再乘以用户操作缩放的比例
			//			dataBox.scale = $additive.attr('data-imgWidth') / $additive.attr('data-imgRealWidth') * baseScale * additive[i].scaleX;

			dataBox.size = $additive.width() * baseScale + "," + $additive.height() * baseScale;

			//角度要加上有些图片需要默认旋转的度数，只有用户上传的图片可能会有
			dataBox.angle = additive[i].rotateZ + imgOrientation;
			// 如果添加的图片元素的data-imgId为空，则返回图片地址，否则返回后台素材id（素材图片与用户图片一起只能存在一张）
			//考虑到用户先上传一张自己的图片，删除后再点击我们推荐的图片，如果图片在这时才上传成功，则会给推荐的图片也加上data-url，只能用data-imgId来判断
			if(additive[i].getAttribute("data-imgId") === '') {
				dataBox.imageUrl = additive[i].getAttribute("data-url");

			} else {
				dataBox.materialImageId = additive[i].getAttribute("data-imgId");
			}

			additiveItemData.materialImageArray.push(dataBox);

			//区分文字元素
		} else if(js_hasClass(additive[i], "addText")) {
			additiveLayer++;
			var dataBox = {};
			//			dataBox.pageNo = 1;
			dataBox.isReverse = false;
			dataBox.layer = additiveLayer;
			var $additive = $(".additive").eq(i);
			//这里需要加上文字距离外层框框的距离
			var x = $additive.position().left + $additive.find(".text").position().left + parseFloat($additive.css("margin-left"))
			var y = $additive.position().top + $additive.find(".text").position().top + parseFloat($additive.css("margin-top"))
			dataBox.origin = x * baseScale + ',' + y * baseScale;

			dataBox.angle = additive[i].rotateZ;
			//原生获取计算后的css样式 
			var computedStyle = document.defaultView.getComputedStyle(additive[i], null);
			dataBox.size = $additive.attr('data-textWidth') * baseScale * additive[i].scaleX + "," + $additive.attr('data-textHeight') * baseScale * additive[i].scaleX;

			dataBox.fontSize = parseFloat(computedStyle.fontSize) * baseScale * additive[i].scaleX;
			dataBox.color = rgbToHex(computedStyle.color); //转换为16进制的
			dataBox.typeface = $additive.attr("data-fontFamily");
			dataBox.text = additive[i].getAttribute("data-text");
			additiveItemData.materialTextArray.push(dataBox);

			//区分贴纸元素
		} else if(js_hasClass(additive[i], "addPaster")) {
			additiveLayer++;
			var dataBox = {};
			//			dataBox.pageNo = 1;
			dataBox.isReverse = false;
			dataBox.layer = additiveLayer;

			var $additive = $(".additive").eq(i);
			var x = $additive.position().left + parseFloat($additive.css("margin-left"))
			var y = $additive.position().top + parseFloat($additive.css("margin-top"))
			dataBox.origin = x * baseScale + ',' + y * baseScale;
			//			dataBox.scale = $additive.attr('data-imgWidth') / $additive.attr('data-imgRealWidth') * baseScale * additive[i].scaleX;
			dataBox.size = $additive.width() * baseScale + "," + $additive.height() * baseScale;
			dataBox.angle = additive[i].rotateZ;
			dataBox.materialPasterId = additive[i].getAttribute("data-pasterId");

			additiveItemData.materialPasterArray.push(dataBox);

		}
	})

	additiveData.styleSideArray.push(additiveItemData)
	console.log(additiveData)

	//上传
	var form_data = new FormData();
	additiveData = JSON.stringify(additiveData);
	form_data.append("data", additiveData);

	var url = url;
	var successFunc = function(data) {

		//		$('.popupBox').hide()

		//这里成功后执行的函数
		sendSuccessFun(data);

	}
	var errorFunc = function(err) {
		console.log(err)
		sendErrorFun()

	}
	$.ajax({
		url: url,
		type: 'POST',
		timeout: 60000,
		async: true,
		dataType: 'json',
		crossDomain: true, // 如果用到跨域，需要后台开启CORS   zepto貌似没有这个属性
		processData: false, // 注意：不要 process data
		contentType: false, // 注意：不设置 contentType
		data: form_data,
		success: successFunc,
		error: errorFunc
	});

}

//上传用户图片
function uploadUserImg(url, sendSuccessFun, sendErrorFun) {

	var form_data = new FormData();
	var file_data = userImgFile;

	form_data.append("file", file_data);
	var url22 = apiDomain + '/diyapi/upload/order';
	var successFunc22 = function(data) {

		$('.additive.addImg').attr("data-url", data.data.ossPath)
		ifImgUpload = true;
		//		$('.popupBox').hide()
		sendData(url, sendSuccessFun, sendErrorFun);

	}

	var errorFunc22 = function(err) {
		console.log(err)
		uploadUserImg(url, sendSuccessFun, sendErrorFun);
	}
	ajaxUploadUserImg(url22, true, form_data, successFunc22, errorFunc22)

}

//点击立即购买或保存购买，发送数据给后台
function clickSendData() {
	//立即购买按钮为灰色的时候，点击提示请添加图片或文字		
	$('body').off('click', '.bottomBtn .buyBtn').on('click', '.bottomBtn .buyBtn', function() {
		if(!$(this).hasClass('act')) {
			layerHint('请添加图片或文字')
		}
	})

	// 点击立即购买与保存购买 如果没有token则先去请求一个临时的token，接口为user/login/temp
	$('body').off('click', '.bottomBtn .buyBtn.act, .previewPage .buy').on('click', '.bottomBtn .buyBtn.act, .previewPage .buy', function() {
		token = getCookie('token')
		temporaryToken = getCookie('temporaryToken')

		if(!token && !temporaryToken) {
			var url = apiDomain + '/diyapi/user/login/temp',
				successFunc = function(data) {
					if(data.code == 200) {
						temporaryToken = data.data.token;
						setCookie('temporaryToken', temporaryToken, 10)
						sendUserData()
					}

				};
			loadData(url, true, successFunc)
			//			layerHint('请先登录')
			//			setTimeout(function() {
			//				loginLayer('body',getCarNum)
			//				
			//			}, 1000)

			return;
		}

		function sendUserData() {
			//loading层
			layer.open({
				content: '',
				type: 2,
				shadeClose: false
			});

			var url = apiDomain + '/diyapi/trade/preorder';
			var sendSuccessFun = function(data) {

				$('.layui-m-layer').remove()
				if(data.code == 200) {
					window.localStorage.setItem('isComfirm', 1);
					window.location.href = 'orderConfirm.html?channel=' + channel + '&tradeOrderId=' + data.data.id;
				} else if(data.code == 1001) {
					//如果购买失败返回1001则说明token过期了，则删除token和temporaryToken然后再次获取temporaryToken，进行下一步
					deleteCookie('temporaryToken')
					deleteCookie('token')
					$('.bottomBtn .buyBtn.act').click()
				} else {
					layerHint('购买失败，请重试')
				}

			}
			var sendErrorFun = function() {
				//提示
				$('.layui-m-layer').remove()
				layerHint('购买失败，请重试')

			}

			//如果区域有放大，要先将区域缩小再截图 缩小的所用时间是1s
			var timeout = 0;
			if($('.templateImgBox').hasClass('zoom')) {
				timeout = 1000;
				$('.sideBtn .zoom').click()
			}

			setTimeout(function() {

				if(ifImgUpload) {
					//				$('.popupBox').hide()
					sendData(url, sendSuccessFun, sendErrorFun);

				} else {
					//				$('.popupBox').show()
					uploadUserImg(url, sendSuccessFun, sendErrorFun);
				}

			}, timeout);
		}
		sendUserData()

	})

}
clickSendData();

//更换操作提示信息
function changeTips(text) {
	if(text) {
		if(text != $('.goodsShow .tips').html()) {
			$('.goodsShow .tips').addClass('fadeOutUp');
			setTimeout(function() {
				$('.goodsShow .tips').html(text).removeClass('fadeOutUp').addClass('fadeInUp')
			}, 800)
		}
	} else {
		$('.goodsShow .tips').addClass('fadeOutUp');
		setTimeout(function() {
			$('.goodsShow .tips').html('');
		}, 800)

	}
}