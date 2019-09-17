FastClick.attach(document.body); //初始化fastclick
//添加点击态
try {document.addEventListener("touchstart", function(){}, true)  } catch (err) {  }



//动态改变html的fontsize
(function changeFontSize() {
    var screenWidth = $(document).width();
    var htmlFontSize = screenWidth / 7.5;
    $("html").css("font-size", htmlFontSize);
    $(window).resize(function() {
        screenWidth = $(document).width();
        htmlFontSize = screenWidth / 7.5;
        $("html").css("font-size", htmlFontSize);
    });
})();



/*   js传值ios
 ==============================*/

//获取地址栏参数
var GetQueryString = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r !== null) return unescape(r[2]);
    return null;
};

//检测设备
function checkDevice() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
        return ('android');
    }
    if (isiOS) {
        return ('ios');
    }
}
var devicePlatform = checkDevice();
//加载数据
var loadData = function(url, async, successFunc) {

    $.ajax({
        url: url,
        type: 'GET',
        timeout: 60000,
        async: async,
        dataType: 'json',
        data: {},
        success: successFunc,
        error: function(error) {
            console.log('冒的数据 搞毛呀');
            console.log(error);

        }
    });
};

//无限加载  window为容器的时候
var infiniteLoading = false;
var infinite = function(container, content, distance, loadMore) {
    $(window).on('scroll', function() {
        if (infiniteLoading) return;

        var that = $(container),
            pageHeight = that.find(content).height(),
            containerHeight = $(window).height();

        if (pageHeight - $(window).scrollTop() < containerHeight + distance) {

            loadMore();
        }

    });

};


//回到顶部
var goTop = function() {
    $(window).on("scroll", function() {
        var top = $(window).scrollTop();
        if (top > 300) $(".gotoTop").show();
        if (top <= 300) $(".gotoTop").hide();
    });

    function scrollTo(who, target) {
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
    $('.gotoTop').on("click", function() {
        scrollTo(window, 1);
    });

};


//传网页的链接
function showWeb(data) {
    try { window.webkit.messageHandlers.showWeb.postMessage({ "url": data, "className": "CRInfoWebViewController" }); } catch (err) { console.log(data); }
}

//传json
function showJson(data) {
    try { window.webkit.messageHandlers.showJson.postMessage(data); } catch (err) { console.log(data); }
}

//点击立即申请 传弹窗上信息 不改的话就传空
function showPop(data) {
    try { window.webkit.messageHandlers.showPop.postMessage(data); } catch (err) { console.log(data); }
}

//传数据接口地址
function showList(data) {
    try { window.webkit.messageHandlers.showList.postMessage(data); } catch (err) { console.log(data); }
}

//backPress 返回按钮 ;customServicePress 客服
function buttonPress(data){
    try { window.webkit.messageHandlers.buttonPress.postMessage(data); } catch (err) { console.log(data); }

}
