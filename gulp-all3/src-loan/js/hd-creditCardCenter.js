mui.init();
//首次进入弹出选择城市的弹窗
if(getCookie('cityText')) {
	//	mui.confirm('请选择您的城市', ' ', ['取消', '确认'], function(e) {
	//		if(e.index == 1) {
	//			location.href = 'choiceCity.html';
	//		}
	//	}, 'div')
	$('.cb-cityTips').hide()
}

//去cookie获取城市名称和编码并显示该城市的银行，没有的话就默认是全国，code传空返回的是所有数据
let cityText = getCookie('cityText') || '全国';
let cityCode = getCookie('cityValue') || '';
$('.cb-title a i').text(cityText)

let url = apiDomain + '/creditcard/center?cityCode=' + cityCode
let successFunc = function(data) {
	if(data.code != 200) {
		return false
	}
	let bankList = data.data.bankList;
	let labelList = data.data.typeList;
	let recomCreditCardList = data.data.recomCreditCardList;
	let dataBox = '';
	let bankUrl = '';
	let dataBox2 = '';

	//将银行的数据分割为最多6个为一块
	function chunked(arr, size = 6) {
		let arr1 = [];
		for(let i = 0; i < arr.length; i = i + size) {
			arr1.push(arr.slice(i, i + size))
		}
		return arr1;
	}

	if(bankList.length > 0) {
		bankList = chunked(bankList)
		$.each(bankList, function(i, k) {
			dataBox2 = ''
			$.each(k, function(j, v) {
				//银行 bankList中url有数据的话就跳url，没有的话则跳该银行id的列表
				bankUrl = v.url ? v.url : "creditCardList.html?from=bank&bankId=" + v.id;
				dataBox2 += `<a class="cb-item" href="` + bankUrl + `">
						<img src="` + v.logoImageUrl + `" alt="办信用卡" />
						<span>` + v.name + `</span>
						<p>` + v.slogan + `</p>
					</a>`;
			})
			dataBox += `<div class="cb-slide swiper-slide">` + dataBox2 + `</div>`;
		});

		$('.creditCardCenter-bank .cb-main .swiper-wrapper').empty().append(dataBox)
		let bankSlider = new Swiper('.swiper-bankSlider', {
			autoplayDisableOnInteraction: false,
			pagination: '.swiper-pagination'
		});
	} else {
		$('.creditCardCenter-bank .cb-main .swiper-wrapper').empty().html('<div class="cb-noBank">您所在区域暂时没有服务银行。</div>')
	}

	dataBox = '';
	$.each(labelList, function(i, v) {
		dataBox += `<a class="cl-item" href="creditCardList.html?from=label&labelId=` + v.id + `">
					<img src="` + v.iconImageUrl + `" />
					<h3>` + v.name + `</h3>
					<p>` + v.slogan + `</p>
				</a>`;
	});
	$('.creditCardCenter-label').empty().append(dataBox)
	$('.commonProductList').empty().append(commonProductListFuc(recomCreditCardList))
}
loadData(url, true, successFunc)

//数据加载完成后显示界面
$('body').removeClass('body-loading')
goTop()

//交行弹窗 

//if(!getCookie('bankcomm')||getCookie('bankcomm') != 1){
//	$('.popup-bankcomm').show()
//	setCookie('bankcomm',1,30)
//}
$('body').on('click', '.popup-bankcomm .pb-close', function() {
	$('.popup-bankcomm').hide()
})

//抽奖弹窗 显示两次 不管有没有点击   2018年6月29日 18:29:25 取消
if(!getCookie('creditCardCenter-lottery') || getCookie('creditCardCenter-lottery') != 2) {
	//	$('.popup-lottery').fadeIn()
	//	setCookie('creditCardCenter-lottery',(Number(getCookie('creditCardCenter-lottery')||0))+1,30)
}
$('body').on('click', '.popup-lottery .pl-close', function() {
	$('.popup-lottery').fadeOut()
})

var cccPopup = getCookie('cccPopup')
if(!cccPopup) {
	$('.popup-180705').fadeIn()
	setCookie('cccPopup', 1, 10)
}
$('body').on('click', '.popup-180705 .p180705-main .p180705-close', function() {
	$('.popup-180705').fadeOut()
})
//第二次再显示这个弹窗
if(cccPopup == 1) {
	$('.p180815').fadeIn()
	setCookie('cccPopup', 2, 10)
}






//按钮添加小红点，点击一次后消失,需要类名添加redPoint，再加上data-name=html文件名来区分
$.each($('.redPoint'), function(i, v) {
	if(getCookie('isClick' + $(v).attr('data-name')) == 1) {
		$(this).removeClass('redPoint')
	}
});
$('body').on('click', '.redPoint', function() {
	$(this).removeClass('redPoint')
	setCookie('isClick' + $(this).attr('data-name'), 1, 10)
})

//如果有渠道则不显示creditCardCenter-label
if(channel){
	$('.creditCardCenter-label').hide()
}
