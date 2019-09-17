function chooseAttribute(box, data, confirmAttribute) {
	/*
	 * 	box:弹窗出现的位置 如：'body'、'.mian'
	 *  data:全部的数据
	 *  confirmAttribute：点击确认按钮后执行的函数
	    attributeData：全部的属性组合
	    attributeKeys：所有的子属性
	    styleList：所有属性组合的图片、价格等信息
	*/

	console.log(data)
	//通过data.data里面有num这个字段则是来自购物车，需要把中间层的默认图改为用户合成图，也需要默认选中属性，和数量
	if(data.data.num == undefined) {
		var isFromCar = false;
	} else {
		var isFromCar = true;
	}

	if($(".attributePopupBox").length == 0) {
		$(box).append('		<div class="attributePopupBox">			<div class="attributePopup">				<div class="ap-arrows"></div>				<div class="ap-imgBox"></div>				<div class="ap-price"></div>				<div class="ap-selectedInfo"><i>请选择</i><span></span><span></span><span></span></div>				<div class="ap-main">						</div>				<div class="ap-numBox">					购买数量					<div class="count">						<div class="subtract"><img src="img/ap-subtract.png"></div>						<input disabled type="text" value="1" name="number" pattern="[0-9]*" maxlength="4">						<div class="add"><img src="img/ap-add.png"></div>					</div>				</div>				<div class="ap-confirm">确认</div>			</div>		</div>		');
	} else {
		$(".attributePopupBox").show();
		if(isFromCar) {
			$('.ap-selectedInfo i').text('请选择').siblings('span').text('');
			$(".ap-confirm").removeClass('act');
		}

	}

	//添加图片后缀，改变大小，img是传入图片地址，w是想要的宽度，不传就默认200，最大4000多，最大返回原图大小
	//https://help.aliyun.com/document_detail/44688.html?spm=5176.doc44957.6.939.V31dMk
	function addImgSuffix(img, w) {
		var w = w || 200;
		return img + '?x-oss-process=image/resize,w_' + w;
	}

	var dataBox = '';
	var previewList = data.data.styleList[0].previewList;

	//默认属性选择小图预览，用第一个属性组合的图,还有价格,预览图中用户的图片位置和大小是以750px作为基准的
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

	//属性选择的数据转换为所需要的格式，
	var styleList = data.data.styleList;
	var propertyList = data.data.propertyList;
	var attributeData = {};
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

	})

	var attributeKeys = [];

	//属性名称与子属性

	var attrItemData = '';
	var attrBoxData = '';
	$.each(propertyList, function(i) {
		attributeKeys[i] = [];
		attrItemData = ''
		$.each(propertyList[i].optionList, function(j) {

			var key = propertyList[i].optionList[j].propertyId + '-' + propertyList[i].optionList[j].id;
			attributeKeys[i].push(key);

			var items = key + ';';

			//如果只有一种属性 并且没有库存则不可点击
			if(propertyList.length == 1 && (attributeData[items] == undefined || attributeData[items].stock <= 0)) {

				attrItemData += '<div class="attrItem disabled" data-key=' + key + '>' + propertyList[i].optionList[j].name + '</div>'
			} else {
				attrItemData += '<div class="attrItem" data-key=' + key + '>' + propertyList[i].optionList[j].name + '</div>'
			}

			// attrItemData += '<div class="attrItem" data-key='+ key +'>'+ propertyList[i].optionList[j].name +'</div>'
		})
		attrBoxData += '<div class="attrBox"><div class="attrName">' + propertyList[i].name + '</div><div class="attrItemBox">' + attrItemData + '</div></div>'
	})
	$('.attributePopup .ap-main').empty().append(attrBoxData);

	//通过data.data里面有num这个字段则是来自购物车，需要把中间层的默认图改为用户合成图，也需要默认选中属性，和数量

	//延迟10ms等attrItem生成再click()
	setTimeout(function() {
		if(isFromCar) {
			$('.attributePopupBox').show()

			var checkedList = data.data.cartPropertyOptionList;
			$.each(checkedList, function(i) {
				var checkedItem = checkedList[i].goodsPropertyId + '-' + checkedList[i].goodsPropertyOptionId;
				$('.ap-main .attrItem[data-key=' + checkedItem + ']').click()

			});
			$('.attributePopup .ap-imgBox .ap-userImg').attr('src', data.data.designList.length != 0 ? data.data.designList[0].imageUrl : '')
			$('.attributePopup .ap-numBox .count input').val(data.data.num)

		} else {
			//			如果只有一个选项则不弹出
			$('.attributePopup .ap-main .attrItemBox .attrItem').eq(0).click()

			if($('.attributePopup .ap-main .attrItemBox .attrItem').length == 1) {

				$('.attributePopup .ap-confirm.act').click()

			} else {
				//默认选中一组可选的属性组合

				$('.attributePopupBox').show()
				for(var i = 1; i < $('.attributePopup .ap-main .attrBox').length; i++) {
					$('.attributePopup .ap-main .attrBox').eq(i).find('.attrItem:not(.disabled)').eq(0).click()
				}

			}

		}
	}, 10)

	var result = 0,
		i, j, m, items,
		attributeData = attributeData,
		attributeKeys = attributeKeys;

	function getNum(key, ps) {

		$('.attributePopup .ap-main .attrBox:not(:eq(' + ps + '))').find('.attrItem').removeClass('disabled' + ps).removeClass('able' + ps);

		if(attributeKeys.length === 1) {

			// for (i = 0; i < attributeKeys[0].length; i++) {
			//     items = key+';';
			//     if (attributeData[items] !== undefined && attributeData[items].stock !== 0) {

			//         $('.attributePopup .ap-main .attrBox').eq(0).find('.attrItem').eq(i).addClass('able' + ps);

			//     }
			// }

		} else if(attributeKeys.length === 2) {

			if(ps === 0) {

				for(i = 0; i < attributeKeys[1].length; i++) {

					items = key + ';' + attributeKeys[1][i] + ';';
					if(attributeData[items] !== undefined && attributeData[items].stock !== 0) {

						$('.attributePopup .ap-main .attrBox').eq(1).find('.attrItem').eq(i).addClass('able' + ps)

					}

				}

			} else if(ps === 1) {
				for(i = 0; i < attributeKeys[0].length; i++) {

					items = attributeKeys[0][i] + ';' + key + ';';
					if(attributeData[items] !== undefined && attributeData[items].stock !== 0) {

						$('.attributePopup .ap-main .attrBox').eq(0).find('.attrItem').eq(i).addClass('able' + ps)

					}

				}

			}

		} else if(attributeKeys.length === 3) {

			if(ps === 0) {

				for(i = 0; i < attributeKeys[1].length; i++) {
					for(j = 0; j < attributeKeys[2].length; j++) {
						items = key + ';' + attributeKeys[1][i] + ';' + attributeKeys[2][j] + ';';
						if(attributeData[items] !== undefined && attributeData[items].stock !== 0) {
							$('.attributePopup .ap-main .attrBox').eq(1).find('.attrItem').eq(i).addClass('able' + ps)
							break;
						}

					}
				}

				for(i = 0; i < attributeKeys[2].length; i++) {
					for(j = 0; j < attributeKeys[1].length; j++) {
						items = key + ';' + attributeKeys[1][j] + ';' + attributeKeys[2][i] + ';';
						if(attributeData[items] !== undefined && attributeData[items].stock !== 0) {
							$('.attributePopup .ap-main .attrBox').eq(2).find('.attrItem').eq(i).addClass('able' + ps)
							break;
						}

					}
				}

			} else if(ps === 1) {

				for(i = 0; i < attributeKeys[0].length; i++) {
					for(j = 0; j < attributeKeys[2].length; j++) {
						items = attributeKeys[0][i] + ';' + key + ';' + attributeKeys[2][j] + ';';
						if(attributeData[items] !== undefined && attributeData[items].stock !== 0) {

							$('.attributePopup .ap-main .attrBox').eq(0).find('.attrItem').eq(i).addClass('able' + ps)

							break;
						}

					}
				}

				for(i = 0; i < attributeKeys[2].length; i++) {
					for(j = 0; j < attributeKeys[0].length; j++) {
						items = attributeKeys[0][j] + ';' + key + ';' + attributeKeys[2][i] + ';';
						if(attributeData[items] !== undefined && attributeData[items].stock !== 0) {

							$('.attributePopup .ap-main .attrBox').eq(2).find('.attrItem').eq(i).addClass('able' + ps)

							break;
						}

					}
				}

			} else if(ps === 2) {

				for(i = 0; i < attributeKeys[0].length; i++) {
					for(j = 0; j < attributeKeys[1].length; j++) {
						items = attributeKeys[0][i] + ';' + attributeKeys[1][j] + ';' + key + ';';
						if(attributeData[items] !== undefined && attributeData[items].stock !== 0) {

							$('.attributePopup .ap-main .attrBox').eq(0).find('.attrItem').eq(i).addClass('able' + ps)

							break;
						}

					}
				}

				for(i = 0; i < attributeKeys[1].length; i++) {
					for(j = 0; j < attributeKeys[0].length; j++) {
						items = attributeKeys[0][j] + ';' + attributeKeys[1][i] + ';' + key + ';';
						if(attributeData[items] !== undefined && attributeData[items].stock !== 0) {

							$('.attributePopup .ap-main .attrBox').eq(1).find('.attrItem').eq(i).addClass('able' + ps)

							break;
						}

					}
				}

			}

		}

		$('.attributePopup .ap-main .attrBox:not(:eq(' + ps + '))').find('.attrItem:not(.able' + ps + ')').addClass('disabled' + ps);

	}

	//属性选择弹窗
	function attributePopup() {

		$('.attribute span').click(function() {

			$('.attributePopupBox').show();

		})

		$('.attributePopup .ap-numBox .count .subtract').off().click(function() {
			var num = $('.attributePopup .ap-numBox .count input').val();
			num--;
			if(num > 0) {
				$('.attributePopup .ap-numBox .count input').val(num);
			}

		});

		$('.attributePopup .ap-numBox .count .add').off().click(function() {
			var num = $('.attributePopup .ap-numBox .count input').val();
			num++;
			if(num < 10000) {
				$('.attributePopup .ap-numBox .count input').val(num);
			}

		});

		$('.attributePopup .ap-numBox .count input').blur(function() {
			var num = $('.attributePopup .ap-numBox .count input').val();
			if(num <= 0) {
				$('.attributePopup .ap-numBox .count input').val(1);
			}

		});


		console.log(attributeData)
		$('.attributePopup .ap-main .attrItemBox .attrItem').off("click").click(function() {

			if($(this).hasClass('disabled')) {
				return;
			}

			if($(this).hasClass('act')) {
				$(this).removeClass('act');
				var index = $(this).parents('.attrBox').index();
				$('.attributePopup .ap-main .attrItemBox .attrItem').removeClass("disabled" + index).removeClass('able' + index);
			} else {
				$(this).siblings().removeClass('act');
				$(this).addClass('act');
			}

			$('.attributePopup .ap-main .attrBox .attrItem').removeClass('disabled');

			var selected = $('.attributePopup .ap-main .attrItemBox .attrItem.act');

			//当我点弹窗阴影区域的时候就去点击确认按钮，这里就不用判断有没有选全了 哈哈哈
			$('body').on('click', '.attributePopupBox', function(e) {
				if(e.target == e.currentTarget) {
					$('.attributePopup .ap-confirm').click()
				}
			})

			//将已选的属性初始化
			$(".attributePopup .ap-selectedInfo i").text('请选择')
			$('.attributePopup .ap-selectedInfo span').text('');
			$.each(selected, function(i) {

				//获取所有选中子属性的父属性所在的index
				var ps = selected.eq(i).parents('.attrBox').index();
				var key = selected.eq(i).attr('data-key');

				getNum(key, ps)

				//更换已选属性
				if($('.attributePopup .ap-selectedInfo span').length === 0) {
					$(".attributePopup .ap-selectedInfo i").text('请选择')
				} else {
					$(".attributePopup .ap-selectedInfo i").text('已选')
					$('.attributePopup .ap-selectedInfo span').eq(ps).text(selected.eq(i).text())

				}

			});

			var attrItem = $('.attributePopup .ap-main .attrBox .attrItem');
			$.each(attrItem, function(i) {
				if(/disabled/.test(attrItem.eq(i).attr("class"))) {
					attrItem.eq(i).addClass('disabled');
				}
			});
			
			

			//虚拟选中可选的属性，获得图片更换左上角小预览图
			var virtualAttributes = '';
			for(var i = 0; i < attributeKeys.length; i++) {
				//如果用选中的属性就用选中的， 没有则用可选的第一个
				var virtualKey = $('.attributePopup .attrBox').eq(i).find('.attrItem.act').length != 0 ? $('.attributePopup .attrBox').eq(i).find('.attrItem.act').attr('data-key') : $('.attributePopup .ap-main .attrBox').eq(i).find('.attrItem:not(.disabled)').eq(0).attr('data-key');
				
				
			
				virtualAttributes += virtualKey + ';';
			}
			console.log(virtualAttributes)
			console.log(attributeData[virtualAttributes])
			if(attributeData[virtualAttributes] == undefined){return}
			var selectedStyleList = styleList[attributeData[virtualAttributes].index];

			//没有预览图的话就用替代的
			if(selectedStyleList.previewList.length == 0) {
				selectedStyleList.previewList = styleList[8].previewList;
			}

			$('.attributePopup .ap-imgBox .ap-frontImg').attr('src', addImgSuffix(selectedStyleList.previewList[0].foregroundImageUrl));
			//如果是来自购物车的则不更改中间层用户图
			if(!isFromCar) {
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
				priceSmall = 0
			}
			$('.attributePopup .ap-price').empty().append('<span>￥ <i>' + priceBig + '</i>.' + priceSmall + '</span>');

			

			//选择全部属性后，确认按钮变亮可点，点击确定或其他地方，弹窗消失
			if(selected.length === attributeKeys.length) {
				$('.attributePopup .ap-confirm').addClass('act');
				//点击材质确定按钮
				$('.attributePopup .ap-confirm.act').off('click').click(function() {
					$('.attributePopupBox').hide();
					//将选中的模板图传出去
					confirmAttribute(selectedStyleList);
				});
			} else {
				$('.attributePopup .ap-confirm').removeClass('act');
				$('.attributePopup .ap-confirm').off('click');
			}

		});

	}
	attributePopup();

}