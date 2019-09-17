function chooseAttribute(box, data, confirmAttribute, middleImg) {
	/*
	 * 	box:弹窗出现的位置 如：'body'、'.mian'
	 *  data:全部的数据
	 *  confirmAttribute：点击确认按钮后执行的函数
	    attributeData：对象；全部的属性组合以及对应的在styleList里面的位置
	    attributeList：数组，全部的属性组合
	    
	    attributeKeys：所有的子属性
	    styleList：所有属性组合的图片、价格等信息
	    
	    middleImg:如果有传入中间层图片，则中间的图片不随属性组合变化
	*/

	//商品详情页面传入的数据是没有再包裹一层data的，而其他的是有包裹的，故再做判断
	if(!data.data) {
		data.data = data
	}

	var styleList = data.data.styleList,
		attributeData = {},
		attributeList = [],
		attributeKeys = [],
		selectedStyleList;

	//通过data.data里面有num这个字段则是来自购物车，需要把中间层的默认图改为用户合成图，也需要默认选中属性，和数量
	if(data.data.num == undefined) {
		var isFromCar = false;
	} else {
		var isFromCar = true;
	}

	//添加图片后缀，改变大小，img是传入图片地址，w是想要的宽度，不传就默认200，最大4000多，最大返回原图大小
	//https://help.aliyun.com/document_detail/44688.html?spm=5176.doc44957.6.939.V31dMk
	function addImgSuffix(img, w) {
		var w = w || 200;
		return img + '?x-oss-process=image/resize,w_' + w;
	}

	//默认属性选择小图预览，用第一个属性组合的图,还有价格,预览图中用户的图片位置和大小是以750px作为基准的
	function loadDefault() {

		if($(".attributePopupBox").length == 0) {
			$(box).append('		<div class="attributePopupBox">			<div class="attributePopup">				<div class="ap-arrows"></div>				<div class="ap-imgBox"></div>				<div class="ap-price"></div>				<div class="ap-selectedInfo"><i>请选择</i><span></span><span></span><span></span></div>				<div class="ap-main">						</div>				<div class="ap-numBox">					购买数量					<div class="count">						<div class="subtract"><img src="img/ap-subtract-disabled.png"></div>						<input disabled type="text" value="1" name="number" pattern="[0-9]*" maxlength="4">						<div class="add"><img src="img/ap-add.png"></div>					</div>				</div>				<div class="ap-confirm">确认</div>			</div>		</div>		');
		} else {
			$(".attributePopupBox").show();
			if(isFromCar) {
				$('.ap-selectedInfo i').text('请选择').siblings('span').text('');
				$(".ap-confirm").removeClass('act');
			}

		}

		var dataBox = '';
		var previewList = data.data.styleList[0].previewList;

		var userImgStyle = 'top:' + previewList[0].userImageOrigin.split(',')[1] / 100 * 190 / 750 + 'rem' + ';left:' + previewList[0].userImageOrigin.split(',')[0] / 100 * 190 / 750 + 'rem' + ';width:' + previewList[0].userImageSize.split(',')[0] / 100 * 190 / 750 + 'rem' + ';height:' + previewList[0].userImageSize.split(',')[1] / 100 * 190 / 750 + 'rem' + '';

		dataBox = '<img class="ap-frontImg" src="' + addImgSuffix(previewList[0].foregroundImageUrl) + '"><img style="' + userImgStyle + '" class="ap-userImg" src="' + addImgSuffix(data.data.styleList[0].defaultImageUrl) + '"><img class="ap-bgImg" src="' + addImgSuffix(previewList[0].backgroundImageUrl) + '">';

		$('.attributePopup .ap-imgBox').empty().append(dataBox);

		var priceBig = String(data.data.styleList[0].priceWechat).split('.')[0];
		var priceSmall = String(data.data.styleList[0].priceWechat).split('.')[1];
		if(!priceSmall) {
			priceSmall = '00';
		} else if(String(priceSmall).length == 1) {
			priceSmall = String(priceSmall) + '0';
		}
		$('.attributePopup .ap-price').empty().append('<span>￥ <i>' + priceBig + '</i>.' + priceSmall + '</span>');
	}
	loadDefault()

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
		//		console.log(attributeData)
		//属性名称与子属性

		var attrItemData = '';
		var attrBoxData = '';
		$.each(propertyList, function(i) {
			attributeKeys[i] = [];
			attrItemData = ''
			$.each(propertyList[i].optionList, function(j) {

				//key后面要加';',保证其唯一性 如不加则检测key=38-45也会把key=38-454检测出来
				var key = propertyList[i].optionList[j].propertyId + '-' + propertyList[i].optionList[j].id + ';';
				attributeKeys[i].push(key);

				//如果只有一种属性 并且没有库存则不可点击  20171220 改为不显示
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
			if(isFromCar) {
				$('.attributePopupBox').show()
				$('.attributePopup .ap-imgBox .ap-userImg').attr('src', data.data.designList.length != 0 ? addImgSuffix(data.data.designList[0].imageUrl) : '')
				$('.attributePopup .ap-numBox .count input').val(data.data.num)

				var checkedList = data.data.cartPropertyOptionList;
				$.each(checkedList, function(i) {
					var checkedItem = checkedList[i].goodsPropertyId + '-' + checkedList[i].goodsPropertyOptionId;

					$('.ap-main .attrItem[data-key="' + checkedItem + '"]').click()

				});

			} else {

				if(middleImg) {
					$('.attributePopup .ap-imgBox .ap-userImg').attr('src', addImgSuffix(middleImg));
				}

				//			如果只有一套可选属性则不弹出	但用户点击还是可以弹出
				if(attributeList.length == 1) {
					$('.attributePopup .ap-main .attrItemBox .attrItem').eq(0).click()
					for(var i = 1; i < $('.attributePopup .ap-main .attrBox').length; i++) {
						$('.attributePopup .ap-main .attrBox').eq(i).find('.attrItem:not(.disabled)').eq(0).click()
					}

					$('.attributePopup .ap-confirm.act').click()

				} else {
					//默认选中一组可选的属性组合  8.2号又取消这个默认选中的功能，先放在这把，感觉随时有可能再改

					$('.attributePopupBox').show()
					//					for(var i = 1; i < $('.attributePopup .ap-main .attrBox').length; i++) {
					//						$('.attributePopup .ap-main .attrBox').eq(i).find('.attrItem:not(.disabled)').eq(0).click()
					//					}

				}

			}
		}, 10)
	}
	disposeData()

	/*
	 * 	处理选中属性，判断其他属性能否点击
	 */
	//循环每排属性，将除了该排的其他排属性里面选中的属性，拿去判断该排属性能否点击
	//如 共有A、B、C，3种属性，先判断A，将B选中的子属性（即有act的attrItem）拿到总属性组合attributeList开始过滤，然后把C选中的子属性拿到上面剩余的属性组合里面过滤；没有选中的则跳过；然后把A里面的所有子属性拿到最后过滤出的结果里面判断是否存在，从而判断每个子属性能否添加disabled（变灰不可点或不显示）；完成后再开始判断B；
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

		console.log(choosableBox.length)
		//找到对应的前景图，模型图等
		selectedStyleList = styleList[attributeData[choosableBox[0]].index];

		//没有预览图的话就用替代的
		if(selectedStyleList.previewList.length == 0) {
			selectedStyleList.previewList = styleList[8].previewList;
		}

		$('.attributePopup .ap-imgBox .ap-frontImg').attr('src', addImgSuffix(selectedStyleList.previewList[0].foregroundImageUrl));
		//如果是来自购物车的则不更改中间层用户图,没有用户图则用默认图

		if((!isFromCar || data.data.designList.length == 0) && !middleImg) {

			$('.attributePopup .ap-imgBox .ap-userImg').attr('src', addImgSuffix(selectedStyleList.defaultImageUrl));
		}

		$('.attributePopup .ap-imgBox .ap-bgImg').attr('src', addImgSuffix(selectedStyleList.previewList[0].backgroundImageUrl));
		$('.attributePopup .ap-imgBox .ap-userImg').css({
			'top': selectedStyleList.previewList[0].userImageOrigin.split(',')[1] / 100 * 190 / 750 + 'rem',
			'left': selectedStyleList.previewList[0].userImageOrigin.split(',')[0] / 100 * 190 / 750 + 'rem',
			'width': selectedStyleList.previewList[0].userImageSize.split(',')[0] / 100 * 190 / 750 + 'rem',
			'height': selectedStyleList.previewList[0].userImageSize.split(',')[1] / 100 * 190 / 750 + 'rem'
		});

		var priceBig = String(selectedStyleList.priceWechat).split('.')[0];
		var priceSmall = String(selectedStyleList.priceWechat).split('.')[1];
		if(!priceSmall) {
			priceSmall = '00';
		} else if(String(priceSmall).length == 1) {
			priceSmall = String(priceSmall) + '0';
		}
		$('.attributePopup .ap-price').empty().append('<span>￥ <i>' + priceBig + '</i>.' + priceSmall + '</span>');

	}

	//属性选择弹窗
	function attributePopup() {

		//当我点弹窗阴影区域的时候就去点击确认按钮，这里就不用判断有没有选全了 哈哈哈
		$('body').on('click', '.attributePopupBox', function(e) {

			if(e.target == e.currentTarget) {
				$('.attributePopup .ap-confirm').click()

			}
		})

		$('.attributePopup .ap-main .attrItemBox .attrItem').off().click(function() {

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
			disposeChecked()

			//将已选的属性初始化
			$(".attributePopup .ap-selectedInfo i").text('请选择')
			$('.attributePopup .ap-selectedInfo span').text('');

			var selected = $('.attributePopup .ap-main .attrItemBox .attrItem.act');

			$.each(selected, function(i) {
				//获取所有选中子属性的父属性所在的index
				var ps = selected.eq(i).parents('.attrBox').index();

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
				//点击材质确定按钮
				$('.attributePopup .ap-confirm.act').off('click').click(function() {
					//					$('.attributePopupBox').hide();  //由于选择属性弹窗有的地方是直接消失的，有的地方是慢慢降下去的，故把这步提取到外部，现在用到地方有购物车、定制页面、商品详情（素材优先版）有引入这个js
					//将选中的模板图传出去
					confirmAttribute(selectedStyleList);
				});
			} else {
				$('.attributePopup .ap-confirm').removeClass('act');
				$('.attributePopup .ap-confirm').off('click');
			}

		});

		$('.attribute span').click(function() {

			$('.attributePopupBox').show();

		})

		$('.attributePopup .ap-numBox .count .subtract').off().click(function() {
			var num = $('.attributePopup .ap-numBox .count input').val();
			num--;
			if(num > 0) {
				$('.attributePopup .ap-numBox .count input').val(num);
			}
			isShowSubtract()
		});

		$('.attributePopup .ap-numBox .count .add').off().click(function() {

			var num = $('.attributePopup .ap-numBox .count input').val();
			num++;
			if(num < 10000) {
				$('.attributePopup .ap-numBox .count input').val(num);
			}
			isShowSubtract()
		});

		$('.attributePopup .ap-numBox .count input').blur(function() {
			var num = $('.attributePopup .ap-numBox .count input').val();
			if(num <= 0) {
				$('.attributePopup .ap-numBox .count input').val(1);
			}

		});

		function isShowSubtract() {
			if($('.attributePopup .ap-numBox .count input').val() <= 1) {
				$('.attributePopup .ap-numBox .count .subtract img').attr('src', 'img/ap-subtract-disabled.png')
			} else {
				$('.attributePopup .ap-numBox .count .subtract img').attr('src', 'img/ap-subtract.png')
			}
		}
		isShowSubtract()

	}
	attributePopup();

}