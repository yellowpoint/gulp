//接口 下面商品图片  https://api.51app.cn/diyapi/goods/detail?channel=etime&goodsId=1&token=c20ecb2a6e3d491ebfe74fe9576d0484
//其他主要的   http://192.168.1.10:10085/diyapi/album/goods/overview?albumId=3&goodsId=7
//接受数据的接口
var isFormBuy = false,
	url, successFunc, attributeData, albumId = GetQueryString('albumId'),
	goodsStyleId, goodsSideId, middleImgUrl,
	goodsId = GetQueryString('goodsId'),
	middleImgX = 0, //传给后台的中间层的定位和大小
	middleImgY = 0,
	middleImgWidth, middleImgHeight;
var channel = GetQueryString('channel') || getCookie('channel') || 'etime';
var token = getCookie('token')
var temporaryToken = getCookie('temporaryToken')
if(!token && !temporaryToken) {
	url = apiDomain + '/diyapi/user/login/temp';
	successFunc = function(data) {
		if(data.code == 200) {
			temporaryToken = data.data.token;
			setCookie('temporaryToken', temporaryToken, 10)

		}

	};
	loadData(url, true, successFunc)
}

//点击开始定制按钮
$('body').on('click', '.slider .goToDiy', function() {
	window.location.href = 'diy2.html?channel=' + channel + '&goodsId=' + goodsId;
})

url = apiDomain + '/diyapi/album/goods/overview?albumId=' + albumId + '&goodsId=' + goodsId;
successFunc = function(data) {

	attributeData = data.data.goodsOverview;
	$('.goodsInfo .name').text(attributeData.name)
	$('.goodsInfo .price span').text(attributeData.showPrice.toFixed(2))
	$('.goodsInfo .sell span').text(attributeData.soldNum)
	$('.promotion span').text(attributeData.activityList[0] ? attributeData.activityList[0].name : '爱上生活 爱上定制')

	var selectedStyleList = attributeData.styleList[0]

	$('.effectImg .frontImg').attr('src', addImgSuffix(selectedStyleList.previewList[0].foregroundImageUrl, 400));
	$('.effectImg .bgImg').attr('src', addImgSuffix(selectedStyleList.previewList[0].backgroundImageUrl), 400);
	$('.effectImg .middleImg img').attr('src', addImgSuffix(data.data.previewPath), 400);

	$('.effectImg .middleImg').css({
		'top': selectedStyleList.previewList[0].userImageOrigin.split(',')[1] / 100 + 'rem',
		'left': selectedStyleList.previewList[0].userImageOrigin.split(',')[0] / 100 + 'rem',
		'width': selectedStyleList.previewList[0].userImageSize.split(',')[0] / 100 + 'rem',
		'height': selectedStyleList.previewList[0].userImageSize.split(',')[1] / 100 + 'rem'
	});

	middleImgUrl = data.data.ossPath;

	var src = addImgSuffix(data.data.previewPath, 300);
	var image = new Image();
	image.crossOrigin = '';
	image.src = src;

	image.onload = function() {

		//中间层图片实际宽高
		var imgRealWidth = image.width;
		var imgRealHeight = image.height;

		//让图片铺满居中 

		//预览图中间编辑区域宽高
		var previewEditWidth = $('.middleImg').width();
		var previewEditHeight = $('.middleImg').height();

		//中间层图片显示宽高
		var imgWidth = previewEditWidth;
		var imgHeight = imgWidth / imgRealWidth * imgRealHeight;

		if(imgHeight >= previewEditHeight) {

			$('.effectImg .middleImg img').css({
				"width": "100%",
				"height": "auto",
				"margin-left": -imgWidth / 2 + "px",
				"margin-top": -imgHeight / 2 + "px"
			});

		} else {
			imgHeight = previewEditHeight;
			imgWidth = imgHeight / imgRealHeight * imgRealWidth;

			$('.effectImg .middleImg img').css({
				"height": "100%",
				"width": 'auto',
				"margin-left": -imgWidth / 2 + "px",
				"margin-top": -imgHeight / 2 + "px"
			});

		}
		//下载新的图片和计算完之后再显示中间层图片
		$('.effectImg .middleImg').show()
	};

	$('.hd-noLoad').hide()
	$('.hd-hasLoad').show()

	var mySwiper = new Swiper('.swiper-slider', {
		pagination: '.swiper-pagination',
		paginationType: 'fraction'
	});

	//获取传给后台去制作的中间层图片的大小和位置
	function getMiddleImgData(selectedStyleList) {

		var middleImgSize = selectedStyleList.sideList[0].editAreaSize;

		var src = addImgSuffix(data.data.previewPath, 300);
		var image = new Image();
		image.crossOrigin = '';
		image.src = src;

		image.onload = function() {

			var modelEditWidth = middleImgSize.split(',')[0]
			var modelEditHeight = middleImgSize.split(',')[1]

			//中间层图片实际宽高
			var imgRealWidth = image.width;
			var imgRealHeight = image.height;

			//中间层图片显示宽高
			middleImgWidth = modelEditWidth;
			middleImgHeight = modelEditWidth / imgRealWidth * imgRealHeight;

			if(middleImgHeight >= modelEditHeight) {

				//计算用户图在模版图编辑区域铺满后的位置和宽高
				middleImgWidth = modelEditWidth;
				middleImgHeight = modelEditWidth / imgRealWidth * imgRealHeight;
				middleImgX = 0;
				middleImgY = -(middleImgHeight - modelEditHeight) / 2;
				console.log(middleImgWidth)
			} else {

				//计算用户图在模版图编辑区域铺满后的位置和宽高
				middleImgWidth = modelEditHeight / imgRealHeight * imgRealWidth;
				middleImgHeight = modelEditHeight;
				middleImgX = -(middleImgWidth - modelEditWidth) / 2;
				middleImgY = 0;
				console.log(modelEditHeight)

			}
			//获取完成后再发送数据
			if(isFormBuy) {
				sendData()
			}

		};

	}

	function confirmAttribute(selectedStyleList) {

		$('.choose').html($('.ap-selectedInfo').html().slice(9));

		$('.attributePopupBox,.attributePopup').show()
		$('.attributePopupBox,.attributePopup,html,body').removeClass('act')

		setTimeout(function() {
			$('.attributePopupBox,.attributePopup').hide()
		}, 300)

		//商品属性id
		goodsStyleId = selectedStyleList.id;
		//商品该属性的第几面的id 暂时只有一面 
		goodsSideId = selectedStyleList.sideList[0].id;
		//获取传给后台去制作的中间层图片的大小和位置
		getMiddleImgData(selectedStyleList)
	}

	//点击立即购买
	$('body').on('click', '.buyBtn', function() {
		isFormBuy = true;
		if($('.choose').text() == '选择材质') {
			$('.choose').click();
		} else {

			sendData()
		}
	})

	//			如果只有一套可选属性则不弹出	但用户点击还是可以弹出
	if(attributeData.styleList.length == 1) {

		chooseAttribute('body', attributeData, confirmAttribute, data.data.previewPath);
	}

	$('.choose').click(function() {
		if($('.attributePopupBox').length == 0) {
			chooseAttribute('body', attributeData, confirmAttribute, data.data.previewPath);
			$('.attributePopup').append('<div class="ap-close"><img  src="img/ap-close.png"></div>')
		}

		//这里要让这个弹窗先show，再添加act，不然就是直接出现；hd-chooseAttribute.js里面的弹窗show也是延时10ms，但其他运行时间不能确定，里面也有只有一个选项不出现的判断
		$('.attributePopupBox,.attributePopup').show()
		setTimeout(function() {
			$('.attributePopupBox,.attributePopup,html,body').addClass('act')

		}, 0)

	})

	$('body').on('click', '.attributePopupBox,.ap-close', function(e) {
		var e = e || event;
		if(e.target == e.currentTarget) {
			$('.attributePopupBox,.attributePopup,html,body').removeClass('act')
			isFormBuy = false;
			setTimeout(function() {
				$('.attributePopupBox,.attributePopup').hide()
			}, 300)

		}

	})

}

loadData(url, true, successFunc)

url = apiDomain + '/diyapi/goods/detail?channel=' + channel + '&goodsId=' + goodsId;
successFunc = function(data) {
	var detailList = data.data.detailList;
	var dataBox = '';
	$.each(detailList, function(i) {
		dataBox += '<img src=' + detailList[i].imageUrl + ' />'
	})

	$('.detailImg').append(dataBox)

}

loadData(url, true, successFunc)

function sendData() {

	//loading层
	layer.open({
		content: '',
		type: 2,
		shadeClose: false
	});

	//初始化发送数据
	var additiveData = {};
	additiveData.token = token || temporaryToken; //用户id
	additiveData.channel = channel; //渠道
	additiveData.goodsId = goodsId; //商品id
	additiveData.goodsStyleId = goodsStyleId; //商品属性Id
	additiveData.num = $(".attributePopup .ap-numBox .count input").val(); //商品数量
	additiveData.styleSideArray = []; //添加的元素

	var additiveItemData = {};
	additiveItemData.id = goodsSideId; //这个id来判断是一套商品属性组合的第几面
	//				additiveItemData.materialTemplateArray = []; //模版列表
	additiveItemData.materialImageArray = []; //图片列表
	//				additiveItemData.materialPasterArray = []; //贴纸列表
	//				additiveItemData.materialTextArray = []; //文字列表

	var dataBox = {};
	dataBox.isReverse = false;
	dataBox.layer = 0;
	dataBox.origin = middleImgX + ',' + middleImgY;
	dataBox.size = middleImgWidth + ',' + middleImgHeight;
	dataBox.angle = 0;
	dataBox.imageUrl = middleImgUrl;

	additiveItemData.materialImageArray.push(dataBox);

	additiveData.styleSideArray.push(additiveItemData)
	console.log(additiveData)

	//上传
	var form_data = new FormData();
	additiveData = JSON.stringify(additiveData);
	form_data.append("data", additiveData);

	$.ajax({
		url: apiDomain + '/diyapi/trade/preorder',
		type: 'POST',
		timeout: 60000,
		async: true,
		dataType: 'json',
		crossDomain: true, // 如果用到跨域，需要后台开启CORS   zepto貌似没有这个属性
		processData: false, // 注意：不要 process data
		contentType: false, // 注意：不设置 contentType
		data: form_data,
		success: function(data) {
			$('.layui-m-layer').remove()
			if(data.code == 200) {
				window.localStorage.setItem('isComfirm', 1);
				window.location.href = 'orderConfirm.html?channel=' + channel + '&tradeOrderId=' + data.data.id;
			} else {
				layerHint('购买失败，请重试')
			}
		},
		error: function(error) {
			$('.layui-m-layer').remove()
			layerHint('购买失败，请重试')
		}
	});

}