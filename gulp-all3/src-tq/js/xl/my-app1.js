// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $ = window.Dom7;

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


