// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $ = this.Dom7;

// Add views

var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true,
    domCache: true,
    router:true
});

//var myApp = new Framework7({
//			 		modalButtonOk:"去意已决",
//			 		modalButtonCancel:"我再想想"
//			 	})

$('.shoppingcar-confirm .order-msg a').on('click', function () {
    mainView.hideToolbar(toolbar);
});

//动态改变html的fontsize
function changeFontSize() {
    var Width = document.documentElement.clientWidth || document.body.clientWidth;
    if(Width >= 750){
    	document.documentElement.style.fontSize = 750/7.5 +"px";
    }else{
    	document.documentElement.style.fontSize = Width/7.5 +"px";
    };
};
changeFontSize();


//确认订单页面返回按钮
var myApp = new Framework7({
	modalButtonOk: "确认",
	modalButtonCancel: "取消"
});


//金额强制保留2位小数
function toDecimal2(x) {
	var f = parseFloat(x);
	if (isNaN(f)) {
		return false;
	}
	var f = Math.round(x * 100) / 100;
	var s = f.toString();
	var rs = s.indexOf('.');
	if (rs < 0) {
		rs = s.length;
		s += '.';
	}
	while (s.length <= rs + 2) {
		s += '0';
	}
	return s;
}

//处理时间
function timeTodate(time) {
	var date = new Date(time);
	Y = date.getFullYear() + '-';
	M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	D = (date.getDate()<10?'0'+date.getDate():date.getDate()) + ' ';
	h = (date.getHours()<10?'0'+date.getHours():date.getHours()) + ':';
	m = (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()) + ':';
	s = date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
	return(Y + M + D + h + m + s);
}