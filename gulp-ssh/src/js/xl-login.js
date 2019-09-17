function loginLayer(box){
	
	if($(".xl-page").length == 0) {
		var dataBox = '';
		dataBox = '<div class="xl-page no-toolbar no-tabbar" data-page="binding" id="binding"><div class="page-content bind"><div class="xl-close"><img src="img/diy-closePreviewWhite.png"/></div><img src="img/bindBg.png" class="bindBg" /><h1 class="bindTitle">手机登录</h1><div class="content-block"><div class="content-block-inner content-block-first"><div class="list-block"><ul><li class="phoneInput"><div class="phonePic"><img src="img/bindPhone.png"/></div><div  class="phoneN"><input type="number" pattern="[0-9]*"  placeholder="+86  请输入手机号码" class="userTelNum" minlength="11" maxlength="11" ></div></li><li class="phoneInput"><div class="codePic"><img src="img/bindMessg.png"/></div><div  class="codeN"><input type="number" placeholder="短信验证码" class="userCode" pattern="[0-9]*" maxlength="6"></div><div class="sendCode">发送验证码</div></li></ul><div class="bindNow"><button>立即登录</button></div><p class="bindText">登录后即可购买您精心设计好的定制产品</p></div></div></div></div></div>'
		$(box).append(dataBox)
	} else {
		$(".xl-page").show();
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
	
	
		var URL = window.location.pathname;
		var index =new RegExp ("index.html");
		var result = index.test(URL);
		
		$('.xl-close').off().click(function(){
			
			if(result){
				location.reload("index.html")
				setTimeout(function(){
					$(".xl-page").hide()
				},1000)
			}else{
				$(".xl-page").hide()
			}
			
			
		})
		
		//真实地址
		var apiHost = '//api.51app.cn';	
		
		//登录页面
//		inputFouc();   //检测键盘是否弹起
		
		var channel = localStorage.getItem('channel');
		var myreg = /^1(3|4|5|7|8)\d{9}$/;
		
		$('.bind input').on("input propertychange", function() {
			var time = 60;
			var userTelNum = $('.userTelNum').val();
			if (myreg.test(userTelNum)) {
				$('.sendCode').addClass('xl-act');
				var Num = userTelNum;
				$('.bind .xl-act').on('click',function(){
					var data = {
						'mobile':Num
					};
					var Sending = function(data){
						var url,data,successFunc;
						url = apiHost+'/diyapi/user/login/code';
						successFunc = function(data){
							if(data.code==3002){
								layer.open({
								    content: '发送的太频繁了啦，请稍后再试！',
								    skin: 'msg',
								    time: 1 //2秒后自动关闭
								  });
								return false;
							}else if(data.code==3001){
								layer.open({
								    content: '发送失败，请重新发送验证码！',
								    skin: 'msg',
								    time: 1 //2秒后自动关闭
								  });
								return false;
							}else if(data.code== 200){
								$('.sendCode').html('<i>60</i>&nbsp;S');
								$('.sendCode').addClass('codeTimeOut')
								time = 60;
								timer60 = setInterval(function(){
									time--;
									$('.codeTimeOut i').text(time);
									if(time==1){
										$('.sendCode').removeClass('codeTimeOut');
										$('.sendCode').html('发送验证码');
										clearTimeout(timer60);
										time = 60;
									}
								},1000)
								layer.open({
								    content: '正在发送验证码，请稍后',
								    skin: 'msg',
								    time: 2 //2秒后自动关闭
								});
							}
						};
						xlLoadData(url,successFunc,data);
					}
					Sending(data);
				});
			}else{
				$('.sendCode').removeClass('xl-act');
			}
			
			
			if (myreg.test(userTelNum) && $('.userCode').val().length==6) {
				$('.bindNow button').addClass('bindAct');
				$('.bind .bindAct').on('click',function(){
				var mobile = $('.userTelNum').val();	
				var channel = localStorage.getItem('channel');
				var userCode = $('.userCode').val();
				console.log(userCode)
				if(userCode==''){
					$('.bindNow button').attr("disabled",'disabled');
					layer.open({
					    content: '请输入验证码！',
					    skin: 'msg',
					    time: 1 //2秒后自动关闭
					  });
				}
				var data = {
					'code':userCode,
					'mobile':mobile,
					'channel':channel
				}
				console.log(data)
				var Binding = function(data){
					var url,data,successFunc;
					url = apiHost+'/diyapi/user/login';
					successFunc = function(data){
						if(data.code== 3011){
							layer.open({
							    content: '验证码不存在或已失效，请重新发送！',
							    skin: 'msg',
							    time: 1 //2秒后自动关闭
							  });
							  $('.sendCode').removeClass('codeTimeOut');
								$('.sendCode').html('发送验证码');
								time = 60;
								layer.open({
								    content: '校验失败，请输入正确的验证码！',
								    skin: 'msg',
								    time: 1 //2秒后自动关闭
								  });
							return false;
						}else if(data.code==3013){
							layer.open({
							    content: '验证码验证错误超过次数限制，请1分钟后重试',
							    skin: 'msg',
							    time: 1 //2秒后自动关闭
							  });
							  
							$('.sendCode').removeClass('codeTimeOut');
							$('.sendCode').html('发送验证码');
							time = 60;
							layer.open({
							    content: '校验失败，请输入正确的验证码！',
							    skin: 'msg',
							    time: 1 //2秒后自动关闭
							  });  
							return false;
						}else if(data.code== 3012){
							setTimeout(function(){
								$('.sendCode').removeClass('codeTimeOut');
								$('.sendCode').html('发送验证码');
								time = 60;
								layer.open({
								    content: '校验失败，请输入正确的验证码！',
								    skin: 'msg',
								    time: 1 //2秒后自动关闭
								  });
								  
								return false;
							},100)
						}else if(data.code== 200){
							layer.open({
							    content: '恭喜您，登录成功',
							    skin: 'msg',
							    time: 1 //2秒后自动关闭
							  });
							  
							//登录成功后，后端返回token，将token存入cookie  
							var token = data.data.token;
							console.log(token)
							//获取当前时间 
							var date=new Date(); 
							var expiresDays=10; 
							//将date设置为10天以后的时间 
							date.setTime(date.getTime()+expiresDays*24*3600*1000); 
							//将token设置为10天后过期 
							document.cookie='token='+ token +';expires='+date.toGMTString(); 
							setTimeout(function(){
								if(result){
									$('.xl-page').hide();
									loadMy();
									refreshCar();
									$('.xl-page').hide();
								}else{
									$('.xl-page').hide();
								}
								
								
							},2000)
						}
					};
					xlLoadData(url,successFunc,data);
				}
				console.log(data)
				Binding(data);
			})
		}else{
			$('.bindNow button').removeClass('bindAct');
		}
	})	
}
