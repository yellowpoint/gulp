// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $ = this.Dom7;

// Add views
var view1 = myApp.addView('#view-1');
var view2 = myApp.addView('#view-2', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});
var mainView = myApp.addView('#view-3', {
    dynamicNavbar: true,
    domCache: true
});

//var orderConfirm = myApp.addView('#orderConfirm', {
//  dynamicNavbar: true
//});
//var mainView = myApp.addView('.view-main', {
//  dynamicNavbar: false,
//  domCache: true
//});
// 


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

