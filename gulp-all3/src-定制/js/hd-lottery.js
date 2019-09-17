var click = false; //是否点击了抽奖按钮
var prizeList; //奖品列表
var prize_ajax = 1; //获取回去的中奖结果
var lotteryTimes = ''; //抽奖次数  接口返回3001表示次数限制 接口返回其他怎么处理
//var turnplateId = 2; //抽奖活动的id，为了区别其他的抽奖活动
var token = getCookie('token');
isLoginRefresh = true; //通过检测ajax有1001弹出登录，登录完成后是否刷新页面，可在需要刷新的页面将其改为true

var lottery = {
	index: 0, //当前转动到哪个位置
	count: 0, //总共有多少个位置
	timer: 0, //setTimeout的ID，用clearTimeout清除
	speed: 200, //初始转动速度
	times: 0, //转动次数
	cycle: 50, //转动基本次数：即至少需要转动多少次再进入抽奖环节
	prize: 2, //中奖位置
	init: function(id) {
		if($("#" + id).find(".lottery-unit").length > 0) {
			$lottery = $("#" + id);
			$units = $lottery.find(".lottery-unit");
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

	$('.lottery_popup .lp_name i').text(prizeList[prize_ajax].name)
	$('.lottery_popup .lp_prize').attr('href', prizeList[prize_ajax].url)
	$('.lottery_popup .lp_prize img').attr('src', prizeList[prize_ajax].imageUrl)
	$('.lottery_popup').fadeIn()
}

//加载奖品列表
function loadPrizeList() {
	var url = apiDomain + '/diyapi/lotto/load?token=' + token+'&lottoId=2',
		successFunc = function(data) {

			if(data.code == 200) {
				prizeList = data.data.itemList;
				lotteryTimes = data.data.lottoTime;
//				turnplateId = data.data.turnplate.id;
				$('.timeLimit i').text(lotteryTimes)
				$.each(prizeList, function(i) {
					$('.lottery-unit-' + i + ' img').attr('src', prizeList[i].imageUrl)

				})
				//数据加载完成后显示界面
				$('.hd-noLoad').hide();
				$('.hd-hasLoad').show();
			}

		};
	loadData(url, true, successFunc)
}

//加载奖品数据
loadPrizeList()
lottery.init('lottery');

$('body').on('click', '#lottery .lottery-btn', function() {

	//未登录先去登录才抽奖
	if(!token) {
		layerHint('登录后即可抽取精美礼品')
		$('body').addClass('act')
		loginLayer('body', function() {
			$('body').removeClass('act')
			token = getCookie('token');
			history.go(0)
		})
		return false;
	}

	$('#lottery').addClass('act')
	if(click) {
		return false;
	} else {
		var url = apiDomain + '/diyapi/lotto/draw?token=' + token + '&lottoId=2',
			successFunc = function(data) {

				if(data.code == 200) {
					prize_ajax = data.data;
					lotteryTimes -= 1;
					$('.timeLimit i').text(lotteryTimes)
					lottery.prize = prize_ajax;
					lottery.speed = 200;
					roll();
					click = true;
				} else if(data.code == 3001) {
					//抽奖没次数了
					layerHint('今日机会已用完，请明天再来~')
					$('.timeLimit i').text(0)
				}

			};
		loadData(url, true, successFunc)

		return false;
	}

});

$('body').on('click', '.lottery_popup .lp_close', function() {
	$('.lottery_popup').fadeOut()
})
$('body').on('click', '.lottery_my', function() {
	window.location.href = 'lottery_my.html';
})

//点击状态
Waves.init();
Waves.attach('.lottery-btn', ['waves-block', 'waves-float']);
Waves.attach('.lottery_my,.lottery .lottery-unit', ['waves-block']);
//设置分享内容
wxShare('乐乐定制跨年礼品节抽奖领取220元现金红包券', 'https://api.51app.cn/channel/lottery.html', 'https://api.51app.cn/channel/img/lottrty/share.png')