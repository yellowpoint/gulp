/**
 * 设置cookie
 * @param {string} name  键名
 * @param {string} value 键值
 * @param {integer} days cookie周期
 */
function setCookie(name, value, days) {
	if(days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	} else {
		var expires = "";
	}
	document.cookie = name + "=" + value + expires + "; path=/";
}
	
var xlLoadData = function(url, successFunc,data) {
	$.ajax({
		url: url,
		type: 'POST',
		timeout: 60000,
		async: true,
		dataType: 'json',
		data: data||{},
		success: successFunc,
		error: function(error) {
			console.log('木有数据');
		}
	});
};
	
function loginLayer(box,succBack){
	//渠道号
	var channel = GetQueryString('channel')||getCookie('channel') ||'etime';
	setCookie('channel',channel)
	if($(".xl-page").length == 0) {
		var dataBox = '';
		dataBox = '<div class="xl-page no-toolbar no-tabbar" data-page="binding" id="binding"><div class="page-content bind"><div class="xl-close"><img src="../../img/login/diy-closePreviewWhite.png"/></div><div class="themeColor"><img src="../../img/login/bindBg.png" class="bindBg" /></div><h1 class="bindTitle">手机登录/注册</h1><div class="content-block"><div class="content-block-inner content-block-first"><div class="list-block"><ul><li class="phoneInput"><div class="phonePic"><img src="../../img/login/bindPhone.png"/></div><div  class="phoneN"><input type="text" pattern="[0-9]*"  placeholder="+86  请输入手机号码" class="userTelNum" minlength="11" maxlength="11" ></div></li><li class="phoneInput"><div class="codePic"><img src="../../img/login/bindMessg.png"/></div><div  class="codeN"><input type="text" placeholder="短信验证码" class="userCode" pattern="[0-9]*" maxlength="6"></div><div class="sendCode">发送验证码</div></li></ul><div class="bindNow"><button>立即登录</button></div><p class="bindText">登录/注册后即可购买您精心设计好的定制产品</p></div></div></div></div></div>'
		$(box).append(dataBox);
		$('.themeColor').css('background-color',themeColor);
	} else {
		$(".xl-page").show();
	}
	
	//爱思渠道时将背景遮罩图片改变
	if(getCookie('channel') == 'i4'){
		$('.xl-page .themeColor img').attr('src','../../img/bindBg-i4.png');
	}
	
		var URL = window.location.pathname;
		var index =new RegExp ("index.html");
		var result = index.test(URL);
		var goodDetail = new RegExp ("goodDetail.html").test(URL);
		
		$('.xl-close').click(function(){
			if(result){
				location=location;
				setTimeout(function(){
					$(".xl-page").hide()
				},1000)
			}else{
				$(".xl-page").hide()
			}
		})
		
		//登录页面
//		inputFouc();   //检测键盘是否弹起
		
		var myreg = /^1(3|4|5|7|8)\d{9}$/;
		$('.bind input').on("input propertychange", function() {
			var time = 60;
			var userTelNum = $('.userTelNum').val();
			if (myreg.test(userTelNum)) {
				
				if($('.sendCode').hasClass('codeTimeOut')){
					$('.sendCode').removeClass('xl-act');
				}else{
					$('.sendCode').addClass('xl-act');
				}
				
				
			}else{
				$('.sendCode').removeClass('xl-act');
			}
			
			
			if (myreg.test(userTelNum) && $('.userCode').val().length==6) {
				$('.bindNow button').addClass('bindAct');
				
		}else{
			$('.bindNow button').removeClass('bindAct');
		}
	})	
	
	var timer60;
	$('.bind').off('click','.xl-act').on('click','.xl-act',function(){
		clearTimeout(timer60);
		var Num = $('.userTelNum').val();
		var data = {
			'mobile':Num
		};
		var Sending = function(data){
			var url,data,successFunc;
			url = apiDomain+'/diyapi/user/login/code';
			successFunc = function(data){
				if(data.code==3002){
					layerHint('发送的太频繁了啦，请稍后再试！')
					return false;
				}else if(data.code==3001){
					layerHint('发送失败，请重新发送验证码！')
					return false;
				}else if(data.code== 200){
					$('.sendCode').html('<i>60</i>&nbsp;S');
					$('.sendCode').addClass('codeTimeOut');
					$('.sendCode').removeClass('xl-act');
					time = 60;
					timer60 = setInterval(function(){
						time--;
						$('.codeTimeOut i').text(time);
						if(time==1){
							$('.sendCode').removeClass('codeTimeOut');
							$('.sendCode').addClass('xl-act');
							$('.sendCode').html('发送验证码');
							clearTimeout(timer60);
							time = 60;
						}
					},1000)
					layerHint('正在发送验证码，请稍后')
				}
			};
			xlLoadData(url,successFunc,data);
		}
		Sending(data);
	});
				
				
				
		$('.bind').off('click','.bindAct').on('click','.bindAct',function(){
		var mobile = $('.userTelNum').val();	
		var userCode = $('.userCode').val();
		if(userCode==''){
			$('.bindNow button').attr("disabled",'disabled');
			layerHint('请输入验证码！')
		}
		var temporaryToken = getCookie('temporaryToken');//临时token
		var data = {
			'code':userCode,
			'mobile':mobile,
			'channel':channel,
			'token':temporaryToken
		}
		var Binding = function(data){
			var url,data,successFunc;
			url = apiDomain+'/diyapi/user/login';
			successFunc = function(data){
				if(data.code== 3011){
					layerHint('验证码不存在或已失效，请重新发送！')
					  $('.sendCode').removeClass('codeTimeOut');
						$('.sendCode').html('发送验证码');
						time = 60;
						layerHint('校验失败，请输入正确的验证码！')
					return false;
				}else if(data.code==3013){
					layerHint('验证码验证错误超过次数限制，请1分钟后重试');
					$('.sendCode').removeClass('codeTimeOut');
					$('.sendCode').html('发送验证码');
					time = 60;
					layerHint('校验失败，请输入正确的验证码！')  
					return false;
				}else if(data.code== 3012){
					setTimeout(function(){
						$('.sendCode').removeClass('codeTimeOut');
						$('.sendCode').html('发送验证码');
						time = 60;
						layerHint('校验失败，请输入正确的验证码！')
						  
						return false;
					},100)
				}else if(data.code== 200){
//					if (data.data.isFirstLogin) {
//						TDH5SDK.account.register(data.data.easeUsername);  //talkingData统计注册
//					} else{
//						TDH5SDK.account.login(data.data.easeUsername);    //talkingData统计登录
//					}
					  layerHint('恭喜您，登录成功')
					//登录成功后，后端返回token，将token存入cookie  
					var token = data.data.token;
					setCookie('token',token,10);
					deleteCookie('temporaryToken'); //删除临时token
					setTimeout(function(){
						if(result){
							$('.xl-page').hide();
							loadMy();
							refreshCar();
							$('.xl-page').hide();
						}else if(goodDetail){
							$('.xl-page').hide();
							loadShopCarNum();
						}
						else{
							$('.xl-page').hide();
							succBack();
							window.location.reload();
						}
						
						
					},2000)
				}
			};
			xlLoadData(url,successFunc,data);
		}
		Binding(data);
	})
}



function smallLoginLayer(box,succBack){
	//渠道号
	var channel = GetQueryString('channel')||getCookie('channel') ||'etime';
	setCookie('channel',channel)
	if($(".xl-page1").length == 0) {
		var dataBox = '';
//		dataBox = '<div class="xl-page no-toolbar no-tabbar" data-page="binding" id="binding"><div class="page-content bind"><div class="xl-close"><img src="img/diy-closePreviewWhite.png"/></div><img src="img/bindBg.png" class="bindBg" /><h1 class="bindTitle">手机登录/注册</h1><div class="content-block"><div class="content-block-inner content-block-first"><div class="list-block"><ul><li class="phoneInput"><div class="phonePic"><img src="img/bindPhone.png"/></div><div  class="phoneN"><input type="number" pattern="[0-9]*"  placeholder="+86  请输入手机号码" class="userTelNum" minlength="11" maxlength="11" ></div></li><li class="phoneInput"><div class="codePic"><img src="img/bindMessg.png"/></div><div  class="codeN"><input type="number" placeholder="短信验证码" class="userCode" pattern="[0-9]*" maxlength="6"></div><div class="sendCode">发送验证码</div></li></ul><div class="bindNow"><button>立即登录</button></div><p class="bindText">登录/注册后即可购买您精心设计好的定制产品</p></div></div></div></div></div>'
		dataBox ='<div class="xl-page1"><div class="xl-Login"><ul><li class="phoneNum"><span>+86</span><input type="number" pattern="[0-9]*" placeholder="请输入手机号" class="userTelNum" /></li><li class="checkCode"><input type="number" pattern="[0-9]*" name="" placeholder="请输入验证码" class="userCode" /><span class="sendCode">获取验证码</span></li>		</ul><div class="login"><button>登录</button></div></div></div>'
		$(box).append(dataBox)
	} else {
		$(".xl-page1").show();
	}
	
		
		
		//登录页面
//		inputFouc();   //检测键盘是否弹起
		
		//渠道号
		var myreg = /^1(3|4|5|7|8)\d{9}$/;
		$('.xl-page1 input').on("input propertychange", function() {
			var time = 60;
			var userTelNum = $('.userTelNum').val();
			if (myreg.test(userTelNum)) {
				
				if($('.sendCode').hasClass('codeTimeOut')){
					$('.sendCode').removeClass('xl-act1');
				}else{
					$('.sendCode').addClass('xl-act1');
				}
				
				
			}else{
				$('.sendCode').removeClass('xl-act1');
			}
			
			
			if (myreg.test(userTelNum) && $('.userCode').val().length==6) {
				$('.login button').addClass('bindAct');
			}else{
				$('.login button').removeClass('bindAct');
			}
	})	
	
	var timer60;
	$('.xl-page1').on('click','.sendCode',function(){
		if ($(this).hasClass('xl-act1')) {
			clearTimeout(timer60);
			var Num = $('.userTelNum').val();
			var data = {
				'mobile':Num
			};
			var Sending = function(data){
				var url,data,successFunc;
				url = apiDomain+'/diyapi/user/login/code';
				successFunc = function(data){
					if(data.code==3002){
						layerHint('发送的太频繁了啦，请稍后再试！')
						return false;
					}else if(data.code==3001){
						layerHint('发送失败，请重新发送验证码！')
						return false;
					}else if(data.code== 200){
						$('.sendCode').html('<i>60</i>&nbsp;S');
						$('.sendCode').addClass('codeTimeOut');
						$('.sendCode').removeClass('xl-act1');
						time = 60;
						timer60 = setInterval(function(){
							time--;
							$('.codeTimeOut i').text(time);
							if(time==1){
								$('.sendCode').removeClass('codeTimeOut');
								$('.sendCode').addClass('xl-act1');
								$('.sendCode').html('发送验证码');
								clearTimeout(timer60);
								time = 60;
							}
						},1000)
						layerHint('正在发送验证码，请稍后')
					}
				};
				xlLoadData(url,successFunc,data);
			}
			Sending(data);
		} else{
			layerHint('请输入正确的手机号码')
		}
		
	});
				
				
				
		$('.xl-page1').on('click','.bindAct',function(){
		var mobile = $('.userTelNum').val();	
		var userCode = $('.userCode').val();
		if(userCode ==''){
			$('.login button').attr("disabled",'disabled');
			layerHint('请输入验证码！')
		}
		var temporaryToken = getCookie('temporaryToken');//临时token
		var data = {
			'code':userCode,
			'mobile':mobile,
			'channel':channel,
			'token':temporaryToken
		}
		var Binding1 = function(data){
			var url,data,successFunc;
			url = apiDomain+'/diyapi/user/login';
			successFunc = function(data){
				if(data.code== 3011){
					layerHint('验证码不存在或已失效，请重新发送！')
					  $('.sendCode').removeClass('codeTimeOut');
						$('.sendCode').html('发送验证码');
						time = 60;
						layerHint('校验失败，请输入正确的验证码！')
					return false;
				}else if(data.code==3013){
					layerHint('验证码验证错误超过次数限制，请1分钟后重试');
					$('.sendCode').removeClass('codeTimeOut');
					$('.sendCode').html('发送验证码');
					time = 60;
					layerHint('校验失败，请输入正确的验证码！')  
					return false;
				}else if(data.code== 3012){
					setTimeout(function(){
						$('.sendCode').removeClass('codeTimeOut');
						$('.sendCode').html('发送验证码');
						time = 60;
						layerHint('校验失败，请输入正确的验证码！')
						  
						return false;
					},100)
				}else if(data.code== 200){
//					if (data.data.isFirstLogin) {
//						TDH5SDK.account.register(data.data.easeUsername);  //talkingData统计注册
//					} else{
//						TDH5SDK.account.login(data.data.easeUsername);    //talkingData统计登录
//					}
					  layerHint('恭喜您，登录成功');
					//登录成功后，后端返回token，将token存入cookie  
					var token = data.data.token;
					setCookie('token',token,10);
					deleteCookie('temporaryToken'); //删除临时token
					personalCenter();   //加载微信公众号里面个人信息页面
					setTimeout(function(){
						$('.xl-page1').hide();
						$('.userTelNum').val('');	
						$('.userCode').val('');
						$('.sendCode').removeClass('codeTimeOut');
						$('.sendCode').html('发送验证码');
					},1000)
				}
			};
			xlLoadData(url,successFunc,data);
		}
		Binding1(data);
	})
}





