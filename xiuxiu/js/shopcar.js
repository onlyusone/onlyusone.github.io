/*
 	1、读取cookie   readCookie
 	2、设置cookie   setCookie
 	3、将cookie中的数据渲染到页面上   initData
 	4、数量增加
 	5、数量减少
 	6、直接输入
 	7、删除
 	8、选中
 	9、结算信息填充
*/
$(function(){
	var Cart = {
		data: null,
		cart: {},
		pay: {},
		cartCon: $('.cart-main-content'),
		init: function(){
			this.readCookie();
			var that = this;
			//读取商品数据（data.json）
			$.getJSON('js/data.json?key='+Math.random(),function(data){
				/*console.log(data);
				console.log(that.cart);*/
				that.data = data;
				//遍历cookie中的数据，放到页面上
				for(var key in that.cart){
					//利用闭包保留key值
					(function(k){
						var ul = $('<ul class="cart-goods-item clearfix"></ul>');
						
						ul.load('goodsInfo.html?key='+Math.random(),function(){
							//获取商品id
							var gid = that.cart[k]['goods-id'];
							ul.attr({
								'data-gid': gid,
								'data-sizeid': k
							});
							//信息填充
							ul.find('.goods-size').html( data[gid]['size'][k]);
							ul.find('.goods-price').html( data[gid]['goods-sale'].toFixed(2));
							ul.find('.amount-input').val( that.cart[k].amount );
							var total = that.cart[k].amount * data[gid]['goods-sale'];
							ul.find('.goods-money').html( total.toFixed(2) );
							//追加到商品区
							that.cartCon.append(ul);
						});
					})(key);
				}
			});
			
			this.increase();
			this.decrease();
			this.input();
			this.remove();
			this.goodsSelect();
			this.selectAll();
			this.delSelected();
		},
		//商品数量增加
		increase: function(){
			var that = this;
			//+点击
			this.cartCon.on("click",'.amount-increase',function(){
				//input是自己的前一个兄弟
				var amount = $(this).prev().val();
				//获取商品id和库存
				var gid = $(this).parents('.cart-goods-item').data('gid');
				var stock = that.data[gid].stock;
				//判断是否大于库存
				if(amount >= stock){
					return;
				}
				amount++;
				$(this).prev().val(amount);
				//调用会写cookie功能
				that.handleCookie( $(this).prev() );
			});
		},
		//商品数量增加
		decrease: function(){
			var that = this;
			//+点击
			this.cartCon.on("click",'.amount-decrease',function(){
				//input是自己的后一个兄弟
				var amount = $(this).next().val();
				//判断是否大于库存
				if(amount <= 1){
					return;
				}
				amount--;
				$(this).next().val(amount);
				that.handleCookie( $(this).next() );
			});
		},
		//直接修改数量
		input: function(){
			var that = this;
			//+点击
			this.cartCon.on("input",'.amount-input',function(){
				//input是自己的前一个兄弟
				var amount = $(this).val();
				amount = parseInt(amount);
				//获取商品id和库存
				var gid = $(this).parents('.cart-goods-item').data('gid');
				var stock = that.data[gid].stock;
				//判断是否大于库存
				if(amount >= stock){
					amount = stock;
				}
				//如果有非法字符或则为0，修改为1
				if(isNaN( amount ) || amount==0){
					$(this).val(1);
				}else{
					$(this).val(amount);
				}
				
				//调用会写cookie功能
				that.handleCookie( $(this) );
			});
		},
		//数量回写cookie   input
		handleCookie: function(input){
			var goodsItem = input.parents('.cart-goods-item');
			var sizeId = goodsItem.data('sizeid');
			
			//处理总价
			var price = parseFloat(goodsItem.find('.goods-price').html() );
			var totalMoneyBox = goodsItem.find('.goods-money');
			//重新显示单价商品总价
			var totalMoney = ( parseInt(input.val()) * price ).toFixed(2)
			totalMoneyBox.html( totalMoney );
			
			//重新给cart中的数量赋值
			this.cart[sizeId].amount = parseInt( input.val() );
			//回写cookie
			this.setCookie();
			
			//判断当前商品是否被选中
			if(goodsItem.find('input[type="checkbox"]').prop('checked')){
				//改变pay对象里面当前商品的总价
				this.pay[sizeId] = totalMoney;
				//调用结算商品信息方法
				this.handlePay();
			}
		},
		//单件商品删除
		remove: function(){
			var that = this;
			this.cartCon.on('click','.delete',function(){
				if( confirm('确定删除宝贝吗？') ){
					//当前商品从页面消失
					$(this).parents('.cart-goods-item').remove();
					//从cookie中删除
					var sizeId = $(this).parents('.cart-goods-item').data('sizeid');
					//删除  (复习delete)
					delete that.cart[sizeId];
					that.setCookie();
				}
			});
		},
		//商品选择
		goodsSelect: function(){
			var that = this;
			this.cartCon.on('change','.td-checkbox input[type="checkbox"]',function(){
				var goodsItem = $(this).parents('.cart-goods-item');
				//获取商品id
				var sizeId = goodsItem.data('sizeid');
				//总价
				var total = goodsItem.find('.goods-money').html();
				//如果已经存在，再点击取消
				if(!goodsItem.find('input[type="checkbox"]').prop('checked')){
					delete that.pay[sizeId];
				}else{
					that.pay[sizeId]=total
				}
				//判断是否需要选中或者撤销全选按钮的选中状态
				var allCheckBox = that.cartCon.find('input[type="checkbox"]');
				var allChecked = that.cartCon.find('input[type="checkbox"]:checked');
				//比较所有复选框的个数和被选中复选框的个数，如果相等，则全部被选中了
				if(allCheckBox.length == allChecked.length){
					//让全选按钮选中
					$('.select-all-btn').prop('checked',true);
				}else{
					$('.select-all-btn').prop('checked',false);
				}
				//处理页面
				that.handlePay();
			});
		},
		//处理数量和总价
		handlePay: function(){
			var goodsAmount = $('.user-goods-amount');
			var goodsMoney = $('.user-goods-money');
			var goPay = $('.go-pay');
			//遍历pay对象，获取件数和总价
			var totalNum = 0;
			var totalMoney = 0;
			for(var key in this.pay){
				totalNum++;
				totalMoney += parseFloat(this.pay[key]);
			}
			//处理结算按钮
			if(totalNum > 0){
				goPay.addClass('can-pay');
			}else{
				goPay.removeClass('can-pay');
			}
			//给总价和总量重新赋值
			goodsAmount.html(totalNum);
			goodsMoney.html(totalMoney.toFixed(2));
		},
		//全选
		selectAll: function(){
			$('.select-all-btn').click(function(){
				//获取自己的状态  选中或者不选中
				var status = $(this).prop('checked');
				var allCheckbox = $('.cart-main-content input[type="checkbox"]');
				console.log(status);
				//如果自己选中
				if(status){
					//让所有商品的选择按钮选中
					allCheckbox.prop('checked',true);
				}else{
					//让所有商品的选择按钮不选中
					allCheckbox.prop('checked',false);
				}
				//触发商品前面的复选框
				allCheckbox.change();
			});
		},
		//删除选中的商品
		delSelected: function(){
			var that = this;
			$('.cart-option .delete').click(function(){
				var allChecked = that.cartCon.find('input[type="checkbox"]:checked');
				if(allChecked.length == 0){
					alert('请选择需要删除的商品!!!');
					return;
				}
				if(confirm('确定删除选中的宝贝吗？')){
					//遍历所有被选中的商品
					allChecked.each(function(){
						//获取sizeid
						var sizeId = $(this).parents('.cart-goods-item').data('sizeid');
						//从页面消失
						$(this).parents('.cart-goods-item').remove();
						//从cookie中删除
						delete that.cart[sizeId];
						that.setCookie();
						//处理结算信息
						delete that.pay[sizeId];
						that.handlePay();
					});
				}
			});
		},
		//读取cookie
		readCookie: function(){
			this.cart = $.cookie('tb_cart') || '{}';
			//解析
			this.cart = JSON.parse( this.cart );
		},
		//设置cookie
		setCookie: function(){
			$.cookie('tb_cart',JSON.stringify(this.cart),{expires:365,path:'/'});
		}
	};
	Cart.init();
});

