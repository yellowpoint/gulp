function chooseAttribute(box, data, confirmAttribute,operate) {
	/*
	 * 	box:弹窗出现的位置 如：'body'、'.mian'
	 *  data:全部的数据
	 *  confirmAttribute：点击确认按钮后执行的函数
	    attributeData：对象；全部的属性组合以及对应的在styleList里面的位置
	    attributeList：数组，全部的属性组合
	    
	    attributeKeys：所有的子属性
	    styleList：所有属性组合的图片、价格等信息
	*/
		//商品详情页面传入的数据是没有再包裹一层data的，而其他的是有包裹的，故再做判断
		if(!data.data){
			data.data = data
		}
		
		var styleList = data.data.styleList,
		attributeData = {},
		attributeList = [],
		attributeKeys = [],
		choosableBox = [], //用choosableBox这个来存选了属性后剩下的属性组合
		selectedStyleList;
	

	
	
	/*
	 *  加载选择材质弹出框
	*/
	function loadDefault() {
		if($(".attributePopupBox").length == 0) {
			if(operate == 'addCarNow'){
				$(box).append('		<div class="attributePopupBox">			<div class="attributePopup">				<div class="closeit"></div>				<div class="ap-imgBox"></div>				<div class="ap-price"></div>				<div class="ap-selectedInfo"><i>请选择</i><span></span><span></span><span></span></div>				<div class="ap-main">						</div>				<div class="ap-numBox">					购买数量					<div class="count">						<div class="subtract"><img src="img/ap-subtract-disabled.png"></div>						<input disabled type="text" value="1" name="number" pattern="[0-9]*" maxlength="4">						<div class="add"><img src="img/ap-add.png"></div>					</div>				</div>				<div class="ap-confirm addCarNow">加入购物车</div>			</div>		</div>		');
			}else{
				$(box).append('		<div class="attributePopupBox">			<div class="attributePopup">				<div class="closeit"></div>				<div class="ap-imgBox"></div>				<div class="ap-price"></div>				<div class="ap-selectedInfo"><i>请选择</i><span></span><span></span><span></span></div>				<div class="ap-main">						</div>				<div class="ap-numBox">					购买数量					<div class="count">						<div class="subtract"><img src="img/ap-subtract-disabled.png"></div>						<input disabled type="text" value="1" name="number" pattern="[0-9]*" maxlength="4">						<div class="add"><img src="img/ap-add.png"></div>					</div>				</div>				<div class="ap-confirm bugNow">立即购买</div>			</div>		</div>		');
			}
			
		} else {
			if($('#goodDetail .toolbar').hasClass('Shopbuy')){
				$('.ap-confirm ').removeClass('addCarNow').addClass('bugNow');
				$('.ap-confirm ').text('立即购买')
			}else{
				$('.ap-confirm ').removeClass('bugNow').addClass('addCarNow');
				$('.ap-confirm ').text('加入购物车')
			}
		}

		var dataBox = '';
		var previewList = data.data.styleList[0].previewList;
		dataBox = '<img class="ap-frontImg" src="' + previewList[0].foregroundImageUrl + '">';
		$('.attributePopup .ap-imgBox').empty().append(dataBox);

		var priceBig = toDecimal2(data.data.styleList[0].priceWechat).split('.')[0]; //将金额强制转换成带两位小数的浮点型后，从小数点分开
		var priceSmall = toDecimal2(data.data.styleList[0].priceWechat).split('.')[1];
		$('.attributePopup .ap-price').empty().append('<span>￥ <i>' + priceBig + '</i>.' + priceSmall + '</span>');
	}
	loadDefault();
	
	//属性选择的数据转换为所需要的格式，
	function disposeData() {
		var propertyList = data.data.propertyList;
		var attributeItem, propertyOptionList, propertyOptionListNew = [];

		$.each(styleList, function(i) {
			attributeItem = '';
			propertyOptionList = styleList[i].propertyOptionList;
			//对可选属性组合内属性的顺序进行整理，规则是属性列表propertyList的顺序
			propertyOptionListNew = [];

			$.each(propertyList, function(k) {

				$.each(propertyOptionList, function(p) {
					if(propertyOptionList[p].goodsPropertyId == propertyList[k].id) {
						propertyOptionListNew.push(propertyOptionList[p]);
						return;
					}
				})
			})

			$.each(propertyOptionListNew, function(j) {
				attributeItem += propertyOptionListNew[j].goodsPropertyId + '-' + propertyOptionListNew[j].goodsPropertyOptionId + ';';
			})
			attributeData[attributeItem] = {};
			attributeData[attributeItem].index = i;
			attributeData[attributeItem].stock = styleList[i].stock;

			attributeList.push(attributeItem)
		})

		//属性名称与子属性

		var attrItemData = '';
		var attrBoxData = '';
		$.each(propertyList, function(i) {
			attributeKeys[i] = [];
			attrItemData = ''
			$.each(propertyList[i].optionList, function(j) {

//				var key = propertyList[i].optionList[j].propertyId + '-' + propertyList[i].optionList[j].id;
//				attributeKeys[i].push(key)+ ';';
				var key = propertyList[i].optionList[j].propertyId + '-' + propertyList[i].optionList[j].id+';';
				attributeKeys[i].push(key);

				//如果只有一种属性 并且没有库存则不可点击
				if(propertyList.length == 1 && (attributeData[key] == undefined || attributeData[key].stock <= 0)) {

//					attrItemData += '<div class="attrItem disabled" data-key=' + key + '>' + propertyList[i].optionList[j].name + '</div>'
				} else {
					attrItemData += '<div class="attrItem" data-key=' + key + '>' + propertyList[i].optionList[j].name + '</div>'
				}

			})
			attrBoxData += '<div class="attrBox"><div class="attrName">' + propertyList[i].name + '</div><div class="attrItemBox">' + attrItemData + '</div></div>'
		})
		$('.attributePopup .ap-main').empty().append(attrBoxData);

		//通过data.data里面有num这个字段则是来自购物车，需要把中间层的默认图改为用户合成图，也需要默认选中属性，和数量

		//延迟10ms等attrItem生成再click()
		setTimeout(function() {
			$('.attributePopupBox').show()
		}, 10)
	}
	disposeData();
	
	//点击关闭按钮，关闭弹窗
	$('body').off('click').on('click','.closeit',function(){
		$('.attributePopupBox').hide();
		$('.attributePopup .ap-confirm').removeClass('act');
	})
	
	
	/*
	 * 	处理选中属性，判断其他属性能否点击
	 *  key：选中的属性的具体属性
	 *  ps：选中属性的所在分类的排数
	 */
	function disposeChecked() {
		var choosableBox = []; //用choosableBox这个来存选了属性后剩下的属性组合
		var choosable = []; //用来存可选属性的临时盒子，记得用之后要清空
		var $attrItemBox = $('.attributePopup .ap-main .attrItemBox');
		var lastAttr = $attrItemBox.eq(attributeKeys.length - 1).find('.attrItem.act'); //最后一排的属性,如果有选中的话，就再筛选一次

		$.each(attributeKeys, function(i) {
			//初始化可选组合
			choosableBox = attributeList;
			$.each(attributeKeys, function(j) {
				var otherAct = $attrItemBox.eq(j).find('.attrItem.act')
				if(i != j && (otherAct.length == 1)) {

					$.each(choosableBox, function(k) {

						if(new RegExp(otherAct.attr('data-key')).test(choosableBox[k])) {
							choosable.push(choosableBox[k]);
						}
					});
					//未确定的属性进行判断
					var undeterminedAttrItem = $attrItemBox.eq(i).find('.attrItem');
					$.each(undeterminedAttrItem, function(k) {
						var kk = undeterminedAttrItem.eq(k);

						if(!(new RegExp(kk.attr('data-key')).test(choosable))) {
							kk.addClass('disabled')
						}

					});
					choosableBox = choosable;
					choosable = []; //清空临时可选组合
				}

			});

			if(i + 1 == attributeKeys.length) {

				if(lastAttr.length == 1) {

					$.each(choosableBox, function(k) {
						if(new RegExp(lastAttr.attr('data-key')).test(choosableBox[k])) {
							choosable.push(choosableBox[k]);
						}
					});
					choosableBox = choosable;
					choosable = []; //清空临时可选组合
				}
			}

		});

		//找到对应的前景图，模型图等
		selectedStyleList = styleList[attributeData[choosableBox[0]].index];

		//没有预览图的话就用替代的
		if(selectedStyleList.previewList.length == 0) {
			selectedStyleList.previewList = styleList[8].previewList;
		}

		$('.attributePopup .ap-imgBox .ap-frontImg').attr('src', selectedStyleList.previewList[0].foregroundImageUrl);
		//如果是来自购物车的则不更改中间层用户图,没有用户图则用默认图

		if(data.data.designList) {
			if(data.data.designList.length == 0){
				$('.attributePopup .ap-imgBox .ap-userImg').attr('src', selectedStyleList.defaultImageUrl);
			}
		}


		var priceBig = toDecimal2(selectedStyleList.priceWechat).split('.')[0];
		var priceSmall = toDecimal2(selectedStyleList.priceWechat).split('.')[1];
		$('.attributePopup .ap-price').empty().append('<span>￥ <i>' + priceBig + '</i>.' + priceSmall + '</span>');

	}
	
	//属性选择弹窗
	function attributePopup() {

		//当我点弹窗阴影区域的时候就去点击确认按钮，这里就不用判断有没有选全了 哈哈哈
		$('body').off('click').on('click', '.attributePopupBox .attributePopup', function(e) {
			if(e.target == e.currentTarget) {
				$('.attributePopupBox').hide()
			}else{
				
			}
		})
			$('.attributePopup .ap-main .attrItemBox').off('click').on('click','.attrItem',function() {
			if($(this).hasClass('disabled')) {
				return;
			}

			if($(this).hasClass('act')) {
				$(this).removeClass('act');
			} else {
				$(this).siblings().removeClass('act');
				$(this).addClass('act');
			}

			$('.attributePopup .ap-main .attrBox .attrItem').removeClass('disabled');

			//处理选中之后的显示与否
			disposeChecked();

			//将已选的属性初始化
			$(".attributePopup .ap-selectedInfo i").text('请选择')
			$('.attributePopup .ap-selectedInfo span').text('');
			var selected = $('.attributePopup .ap-main .attrItemBox .attrItem.act');
			//初始化选了属性后剩下的属性组合
//			choosableBox = attributeList;
			$.each(selected, function(i) {
				//获取所有选中子属性的父属性所在的index
				var ps = selected.eq(i).parents('.attrBox').index();
//				var key = selected.eq(i).attr('data-key');

//				disposeChecked(key, ps)

				//更换已选属性
				if($('.attributePopup .ap-selectedInfo span').length === 0) {
					$(".attributePopup .ap-selectedInfo i").text('请选择')
				} else {
					$(".attributePopup .ap-selectedInfo i").text('已选')
					$('.attributePopup .ap-selectedInfo span').eq(ps).text(selected.eq(i).text())

				}

			});
			
			//选择全部属性后，确认按钮变亮可点，点击确定或其他地方，弹窗消失
			if(selected.length === attributeKeys.length) {
				$('.attributePopup .ap-confirm').addClass('act');
				localStorage.setItem('selectedStyleList',JSON.stringify(selectedStyleList))
				//将选中的模板图传出去
				confirmAttribute(selectedStyleList)
			} else {
				$('.attributePopup .ap-confirm').removeClass('act');
				$('.attributePopup .ap-confirm').off('click');
			}
			
			//写在goodDeatil.html文件中，防止click点击多次
//			$('body').off('click','.attributePopup .ap-confirm').on('click','.attributePopup .ap-confirm',function() {
//					if($(this).hasClass('act')){
//						token = getCookie('token');
//						var goodsId = selectedStyleList.goodsId;
//						var goodsName = selectedStyleList.name;
//						var goodsStyleId = selectedStyleList.id;
//						var previewList = selectedStyleList.previewList;
//						var num = Number($(".attributePopup .ap-numBox .count input").val())
//						
//						if ($(this).hasClass('addCarNow')) {
//							//加入购物车
//								if(!token) {
//						
//									layerHint('请先登录')
//									setTimeout(function() {
//										loginLayer('body',loadShopCarNum)
//									}, 1000)
//						
//									return;
//								}
//								//loading层
//								layer.open({
//									content: '',
//									type: 2,
//									shadeClose: false
//								});
//								var url,successFunc,data,errorFunc;
//								url = apiHost + '/diyapi/trade/cart/add';
//								data = {data:JSON.stringify({
//									"token":token,
//									"channel":channel,
//									"goodsId": goodsId,
//									"name": goodsName,
//									"num":num,
//									"goodsStyleId":goodsStyleId,
//									"styleSideArray":[]
//								})}
//								successFunc = function(data) {
//						
//									$('.layui-m-layer').remove()
//									if(data.code == 200) {
//										layerHint('加入购物车成功')
//										
//										//点击加入购物车成功后调用talkingData
//									var TDH5SDKItem = {
//										"goodsId": goodsId,
//										"name": goodsName,
//										"unitPrice": Number($(".ap-price").text().slice(1)),
//										"count": Number($(".attributePopup .ap-numBox .count input").val())
//									}
//						
//									TDH5SDK.iap.addItem(TDH5SDKItem);
//										
//										
//									} else {
//										layerHint('加入购物车失败')
//									}
//						
//									loadShopCarNum()	
//						
//									
//								}
//								loadData(url, successFunc,data,errorFunc)
//								errorFunc = function() {
//									//提示
//									$('.layui-m-layer').remove()
//									layerHint('加入购物车失败，请重试')
//						
//								}
//						} else{
//							token = getCookie('token')
//							temporaryToken = getCookie('temporaryToken')
//							if(!token && !temporaryToken) {
//								var url= apiHost + '/diyapi/user/login/temp',
//								successFunc = function(data){
//									if(data.code == 200){
//										temporaryToken =  data.data.token;
//										setCookie('temporaryToken',temporaryToken,10)
//									sendUserData()
//									}
//								};
//								loadData(url, successFunc,data,'')
//								return;
//							}
//					
//							function sendUserData(){
//								//loading层
//								layer.open({
//									content: '',
//									type: 2,
//									shadeClose: false
//								});
//								var url,successFunc,data,errorFunc;
//								url = apiHost + '/diyapi/trade/preorder';
//								data = {data:JSON.stringify({
//										"token":getCookie('temporaryToken'),
//										"channel":channel,
//										"goodsId": goodsId,
//										"name": goodsName,
//										"num":num,
//										"goodsStyleId":goodsStyleId,
//										"styleSideArray":[]
//									})}
//								successFunc = function(data) {
//						
//									$('.layui-m-layer').remove()
//									if(data.code == 200) {
//										window.localStorage.setItem('isComfirm', 1);
//										window.location.href = 'orderConfirm.html?channel=' + channel + '&tradeOrderId=' + data.data.id;
//									} else {
//										layerHint('购买失败，请重试')
//									}
//						
//								}
//								loadData(url, successFunc,data,errorFunc)
//							
//							}
//							sendUserData
//						}
//						$('.attributePopupBox').hide();
//					}else{
//						layerHint('请将材质选择完整')
//					}
//			})
		});


		$('.attributePopup .ap-numBox .count input').blur(function() {
			var num = $('.attributePopup .ap-numBox .count input').val();
			if(num <= 0) {
				$('.attributePopup .ap-numBox .count input').val(1);
			}

		});
		
		
		isShowSubtract1()

	}
	attributePopup();
	
	
	
	
	
	
	
}