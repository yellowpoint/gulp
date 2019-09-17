//信用卡列表页有4种情况， creditCardList.html?from=newPerson   
//1.newPerson 从新人推荐过来，我去cookie里取用户选的数据传给后台拿到数据
//2.bank 中心页点银行，跳转该银行的全部信用卡
//3.label 中心页点标签分类
//4.all 中心页点全部，不传参数给后台则返回全部数据

const endStr = '<div class="lastTips"><i class="left-line"></i>我们是有底线的<i class="right-line"></i></div>';
const mainClassName = '.body-main';
let url = apiDomain + '/creditcard/center/list';
let from = GetQueryString('from');
let page = 2;
let postData = {};
let nametype = 0;
switch(from) {
	case 'newPerson':
		//返回直接返回到信用卡中心页
		window.history.pushState("creditCardCenter", "", '#');
		window.addEventListener("popstate", function() {
			if(window.history.state == null) {
				history.go(-2)
			}
		})
		postData = {
			'filter': getCookie('newPerson')
		}
		break;
	case 'bank':
		postData = {
			'bankId': GetQueryString('bankId'),
			'test':1
		};
		break;
	case 'label':
		postData = {
			'typeId': GetQueryString('labelId')
		}
		break;
	case 'all':
		postData = {}
		break;
	default:
		break;
}
let successFunc = function(data) {
	//如果是银行专题列表，则展示顶部的银行信息
	if(from == 'bank') {
		var bank = data.data.bank;
		var bankDom = $('.creditCardList-bankInfo');
		var bankLabel = bank.labelList;
		var bankLabelStr = '';
		nametype=1;
		if(bankLabel && bankLabel.length > 0) {
			$.each(bank.labelList, function(i, v) {
				bankLabelStr += '<img src="' + v.imageUrl + '"/>'
			});
		}

		bankDom.find('.cb-logo').attr('src', bank.logoImageUrl)
		bankDom.find('.cb-name').text(bank.name)
		bankDom.find('.cb-intro').text(bank.intro)
		bankDom.find('.cb-label').empty().append(bankLabelStr)
		bankDom.show()
	}
	
	$('.commonProductList').empty().append(commonProductListFuc(data.data.creditCardList, nametype))
	if(data.data.creditCardList.length < 10) {
		if($('.lastTips').length == 0) {
			$('.infinite-scroll-preloader').remove();
			$('.body-main').append(endStr);
		}
		infiniteLoading = true;
	}

}
ajaxPost(url, postData, successFunc)
//数据加载完成后显示界面
$('body').removeClass('body-loading')

//无限滚动
let infiniteScroll = function() {
	infinite($(window), $('.body-main'), 10, function() {

		let url = apiDomain + '/creditcard/center/list';
		postData.page = page;
		infiniteLoading = true;

		let successFunc = function(data) {
			if(data.code == 200) {
				var dataList = data.data.creditCardList;
				$(mainClassName).find('.commonProductList').append(commonProductListFuc(dataList,nametype));
				if(dataList.length < 10) {
					if($(mainClassName).find('.lastTips').length == 0) {
						$(mainClassName).find('.infinite-scroll-preloader').remove();
						$(mainClassName).append(endStr);
					}
					return false;
				}
				page++;
				infiniteLoading = false;

			} else {
				console.log("不是200的我不要");
				if($(mainClassName).find('.lastTips').length == 0) {
					$(mainClassName).find('.infinite-scroll-preloader').remove();
					$(mainClassName).append(endStr);
				}
			}
		};
		ajaxPost(url, postData, successFunc)
	});
};
infiniteScroll()

//交行弹窗
//if(!getCookie('bankcomm')||getCookie('bankcomm') != 1){
//	$('.popup-bankcomm').show()
//	setCookie('bankcomm',1,30)
//}
$('body').on('click','.popup-bankcomm .pb-close',function(){
	$('.popup-bankcomm').hide()
})
