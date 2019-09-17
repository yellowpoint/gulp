$('body').removeClass('body-loading')

var click = false; //是否点击了抽奖按钮
var prizeList; //奖品列表
var prize_ajax = 1; //获取回去的中奖结果
var lotteryTimes = ''; //抽奖次数  接口返回3001表示次数限制 接口返回其他怎么处理
//var turnplateId = 2; //抽奖活动的id，为了区别其他的抽奖活动
var token = getCookie('token_lottery');
var status = -1; //0表示不能抽奖 1表示能抽奖
var money = -1; //抽中的金额
var hasAjaxCheck = false; //是否刚请求过登录接口，因为这个接口一请求也表示抽奖了

var lottery = {
	index: 0, //当前转动到哪个位置
	count: 0, //总共有多少个位置
	timer: 0, //setTimeout的ID，用clearTimeout清除
	speed: 200, //初始转动速度
	times: 0, //转动次数
	cycle: 50, //转动基本次数：即至少需要转动多少次再进入抽奖环节
	prize: 6, //中奖位置
	init: function(id) {
		if($("#" + id).find(".lottery-unit").length > 0) {
			var $lottery = $("#" + id);
			var $units = $lottery.find(".lottery-unit");
			this.obj = $lottery;
			this.count = $units.length;
			$lottery.find(".lottery-unit-" + this.index).addClass("act");
		};
	},
	roll: function() {
		var index = this.index;
		var count = this.count;
		var lottery = this.obj;
		$(lottery).find(".lottery-unit-" + index).removeClass("act");
		index += 1;
		if(index > count - 1) {
			index = 0;
		};
		$(lottery).find(".lottery-unit-" + index).addClass("act");
		this.index = index;
		return false;
	},
	stop: function(index) {
		this.prize = index;
		return false;
	}
};

function roll() {
	lottery.times += 1;
	lottery.roll();
	if(lottery.times > lottery.cycle + 10 && lottery.prize == lottery.index) {
		clearTimeout(lottery.timer);
		lottery.prize = -1;
		lottery.times = 0;
		click = false;

		//延迟100ms展示中奖
		setTimeout(function() {
			Bingo()
		}, 100)
	} else {
		if(lottery.times < lottery.cycle) {
			lottery.speed -= 10;
		} else if(lottery.times == lottery.cycle) {
			//						var index = Math.random() * (lottery.count) | 0;
			//						lottery.prize = index;
		} else {
			if(lottery.times > lottery.cycle + 10 && ((lottery.prize == 0 && lottery.index == 7) || lottery.prize == lottery.index + 1)) {
				lottery.speed += 110;
			} else {
				lottery.speed += 20;
			}
		}
		if(lottery.speed < 40) {
			lottery.speed = 40;
		};
		lottery.timer = setTimeout(roll, lottery.speed);
	}

	return false;
}

//中奖后的弹窗
function Bingo() {
	$('.lottery-prize .lp-money i').text(money)
	$('.lottery-prize').fadeIn()
	switch(+status) {
		case 0:
			layerHint('您已抽奖，快去公众号领奖吧')
			break;
		default:
			break;
	}
}

lottery.init('lottery');

$('body').on('click', '#lottery .lottery-btn', function() {

	//未登录先去登录才抽奖
	if(!token) {
		layerHint('登录后即可抽取精美礼品')
		$('.lottery-login').fadeIn()
		return false;
	}

	if(click) {
		return false;
	}

	if(!hasAjaxCheck) {
		checkUserStatus()
			.then(() => {
				hasAjaxCheck = false;
				if(status == 0) {
					Bingo()
					return;
				}

				$('#lottery').addClass('act')

				roll();
				click = true;
			})
	} else {
		hasAjaxCheck = false;
		if(status == 0) {
			Bingo()
			return;
		}

		$('#lottery').addClass('act')

		roll();
		click = true;
	}

	//	(async() => {
	//		//刚请求过登录接口 就不再去查看状态了
	//		if(!hasAjaxCheck) {
	//			await checkUserStatus()
	//		}
	//		hasAjaxCheck = false;
	//		if(status == 0) {
	//			Bingo()
	//			return;
	//		}
	//
	//		$('#lottery').addClass('act')
	//
	//		roll();
	//		click = true;
	//
	//	})()
});

$('body').on('click', '.lottery_popup .lp_close', function() {
	$('.lottery_popup').fadeOut()
})
$('body').on('click', '.lottery_my', function() {
	window.location.href = 'lottery_my.html';
})
//奖品弹窗
$('body').on('click', '.lottery-prize .lp-close', function() {
	$('.lottery-prize').fadeOut()
})
//复制
$('body').on('click', '.lottery-prize .lp-copy .btn', function(e) {

	var copyText = $(this).attr('data-copy')
	var input = document.createElement('input');
	input.setAttribute('readonly', 'readonly');
	input.setAttribute('value', copyText);
	document.body.appendChild(input);
	input.setSelectionRange(0, 9999);

	if(document.execCommand('copy')) {
		document.execCommand('copy');
		layerHint('复制成功');
	} else {
		layerHint('复制失败,请长按复制');
	}

	document.body.removeChild(input);
})

/*登录模块开始*/
;
!(function() {
	var $phone = $('.ll-phone')
	var $code = $('.ll-code')
	var $getCode = $('.ll-getCode')
	var $time = $('.ll-getCode .ll-getCode-disable i')

	//点击获取验证码
	$('body').on('click', '.ll-getCode .ll-getCode-able', function() {
		if($phone.val() == '' || !isPhoneAvailable($phone.val())) {
			layerHint('请输入正确的手机号码')
			$phone.focus()
			return false;
		}
		var data = {
			"mobile": $phone.val()
		}
		var url = apiDomain + '/loan/code/send';
		var successFunc = function(data) {

			if(data.code == 200) {
				layerHint('发送成功')
				$getCode.addClass('disable')
				var timer = null;
				var time = 60;
				timer = setInterval(function() {
					time--;
					if(time > 0) {
						$time.text(time)
					} else {
						$getCode.removeClass('disable')
						clearInterval(timer)
						$time.text(60)
					}
				}, 1000)
				//						$code.focus()
			} else {
				layerHint(data.data)
			}

		}
		var errorFunc = function() {
			layerHint('发送失败，请再次发送')
		}
		ajaxPost(url, data, successFunc, errorFunc)
	})
	//点击提交
	$('body').on('click', '.ll-confim', function() {
		if($phone.val() == '' || !isPhoneAvailable($phone.val())) {
			layerHint('请输入正确的手机号码')
			$phone.focus()
			return false;
		}
		if($code.val().length != 6) {
			layerHint('请输入正确的验证码')
			$code.focus()
			return false;
		}
		var data = {
			"mobile": $phone.val(),
			"code": $code.val(),
			"token": token
		}
		var url = apiDomain + '/user/prize/code/check';
		var successFunc = function(data) {

			if(data.code == 200) {
				layerHint('验证成功')
				token = data.data.token
				setCookie('token_lottery', token, 15)
				setCookie('phone_lottery', $phone.val(), 15)
				status = data.data.status;
				money = data.data.money;

				setTimeout(function() {

					$('.lottery-login').fadeOut()
					handleUserPhone()
					layerHint('开始抽奖')
					hasAjaxCheck = true;
					$('.lottery .lottery-btn').click()

				}, 500)

			} else {
				layerHint(data.data)
			}

		}
		var errorFunc = function() {
			layerHint('验证失败，请确认验证码输入正确或再次发送验证码')
		}
		ajaxPost(url, data, successFunc, errorFunc)
	})

	//关闭登录框
	$('body').on('click', '.ll-close', function() {
		$('.lottery-login').fadeOut()
	})

})()
/*登录模块结束*/

//检查用户状态
function checkUserStatus() {
	return new Promise(function(resolve, reject) {
		ajaxPost(
			apiDomain + '/user/prize/info', {
				'token': token
			},
			function(data) {
				status = data.data.status;
				money = data.data.money;
				resolve()
			}
		)

	})

}

//操作用户手机号码，可以注销
function handleUserPhone() {
	var userPhone = getCookie('phone_lottery')
	if(userPhone) {
		userPhone = userPhone.substring(0, 3) + "****" + userPhone.substring(7, 11)
		$('.user-main').show().find('span').text(userPhone)
	} else {
		$('.user-main').hide().find('span').text('')
	}
	$('body').on('click', '.user i', function() {
		layer.open({
			content: '您确定要注销吗？',
			btn: ['确定', '取消'],
			yes: function(index) {
				deleteCookie('token_lottery')
				deleteCookie('phone_lottery')
				handleUserPhone()
				layerHint('注销成功')
				setTimeout(function() {
					history.go(0)
				}, 500)

				layer.close(index);
			}
		});

	})
}
handleUserPhone()

//波纹点击状态
Waves.init();
Waves.attach('.lottery-btn', ['waves-block', 'waves-float']);
Waves.attach('.lottery .lottery-unit', ['waves-block']);
//设置分享内容
wxShare(document.title, location.href, 'https://api.51app.cn/loanpage/v1.0.0/images/lottery/share.jpg')

////如果来自信用卡中心则设置个cookie让其只出现一次
//if(GetQueryString('from')=='creditCardCenter'){
//	setCookie('creditCardCenter-lottery',1,30)
//}