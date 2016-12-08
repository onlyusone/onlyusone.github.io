$(function(){
	var detail={
		smallWrap: $('.glass .small'),
		filter: $('.filter'),
		largeWrap: $('.large'),
		largeImg: $('.large-img'),
		
		
		init:function(){
			this.xuanxiangka();
			/*放大镜*/
			this.mousemove();
			this.hover();
			/*************************************购物车*************************/
			this.main = $('.goods-detail');
			this.sizeCon = this.main.find('.size-content');
			this.amountInput = this.main.find('.amount-input');
			//增加数量按钮
			this.amountInc = this.main.find('.amount-increase');
			//减少数量按钮
			this.amountDec = this.main.find('.amount-decrease');
			//库存
			this.stock = this.main.find('.stock-num');
			
			this.data = {};
			
			//方法调用
			this.initData();
			
			this.shenbao();
		},
		//导航选项卡
		xuanxiangka:function(){			
			$('.nav-wrapper .nav-item').mouseenter(function(){
				var content = $('.tag-content .tag-con-item');
				$(this).addClass('current');
				$(this).siblings().removeClass('current');
				content.eq( $(this).index() ).show();
				content.eq( $(this).index() ).siblings().hide();
			});
			$('.nav-wrapper .nav-item').mouseleave(function(){
				var content = $('.tag-content .tag-con-item');
				content.hide();
				$(this).removeClass('current');
			});
		},
		//回到顶部
		top:function(){
			var backTop =$('.a4');
			backTop.onclick = function(){
				var scrollTop = $(body).scrollTop || $(documentElemnt).scrollTop;
				var timer = setInterval(function(){
					var that=this;
					this.scrollTop -= 20;
					if(this.scrollTop <= 0){
						this.scrollTop = 0;
						this.clearInterval(timer);
					}
					$(body).scrollTop = scrollTop;
				},13);
			}
		},
		
		
		/*放大镜*/
		mousemove: function(){
			var that = this;
			this.smallWrap.mousemove(function(e){
				var l=$(this).offset().left;
				var t=$(this).offset().top-$(window).scrollTop();
				e = e || window.event;
				var left = e.clientX -l;
				var top = e.clientY -t;
				//处理left和top，做边缘处理（防止越界）
				left = left < 100 ? 100 : (left > 300) ? 300 : left;
				top = top < 100 ? 100 : (top > 430) ? 430 : top;
				
				//改变滤镜的位置
				that.filter.css({
					left: left-100, //-100是为了让鼠标在滤镜的中心位置
					top: top-100
				});
				that.largeImg.css({
					left: -2*(left-100),
					top: -2*(top-100)
				});
			});
		},
		hover: function(){
			var that = this;
			this.smallWrap.hover(function(){
				that.filter.toggle();
				that.largeWrap.toggle();
			});
		},
		/*********************************购物车***********************************************/
		initData: function(){
			//通过attr方法获取元素的属性
			var gid = this.main.attr('data-gid');
			var that = this;
			//getJSON(url,fn)
			$.getJSON('js/data.json',function(result){
				/*console.log(result);
				console.log(gid);*/
				that.data = result[gid];
				
				//填充尺寸
				that.createSize();
				//点击尺寸事件
				that.sizeClick();
				//增加
				that.increase();
				//减少
				that.decrease();
				//直接输入
				that.input();

				//加入购物车
				that.addCart();
			});
		},
		createSize: function(){
			var size = this.data.size;
			//遍历所有的尺寸，拼接字符串     data-size 自定义属性
			var sizeStr = '';
			for(var key in size){
				sizeStr += '<li class="tb-con-item" data-size="'+key+'">'
						+		'<a href="javascript:;">'+size[key]+'</a>'
						+	'</li>';
			}
			this.sizeCon.html(sizeStr);
			//给第一个尺寸添加选中状态  children() 子元素
			this.sizeCon.children().eq(0).addClass('selected');
		},
		//点击尺寸
		sizeClick: function(){
			//利用事件委托给子元素添加事件
			this.sizeCon.on('click','li',function(){
				$(this).addClass('selected').siblings().removeClass('selected');
			});
		},
		//数量增加点击
		increase: function(){
			var that = this;
			this.amountInc.click(function(){
				var amount = parseInt( that.amountInput.val() );
				var stock = that.stock.html();
				//判断是否超出库存
				if(amount >= stock){
					return;
				}
				//数量++
				amount++;
				that.amountInput.val(amount);
			});
		},
		//减少
		decrease: function(){
			var that = this;
			this.amountDec.click(function(){
				var amount = parseInt( that.amountInput.val() );
				//判断是否越界
				if(amount <= 1){
					return;
				}
				//数量--
				amount--;
				that.amountInput.val(amount);
			});
		},
		//直接输入
		input: function(){
			var that = this;
			this.amountInput.on('input',function(){
				var amount = that.amountInput.val();
				//如果是空，不做处理
				if(amount == ''){
					return;
				}
				amount = parseInt( amount );  // 12 12w=>12  fds=>NaN
				
				var stock = that.stock.html();
				
				//判断是不是NaN或者是不是0
				if( isNaN(amount) || amount == 0 ){
					that.amountInput.val(1);
					return;
				}
				
				//判断是否越界 
				if(amount >= stock){ 
					that.amountInput.val(stock);
					return;
				}
				that.amountInput.val(amount);
			});
			//失去焦点判断是不是空 =》 1
			this.amountInput.blur(function(){
				var amount = that.amountInput.val();
				//如果是空，不做处理
				if(amount == ''){
					that.amountInput.val(1);
				}
			});
		},
		//加入购物车
		addCart: function(){
			var that = this;
			//【加入购物车】按钮点击
			this.main.find('.option-addCart').click(function(){
				//data() 获取以data-开的自定义属性的值
				var gid = that.main.data('gid');
				//sizeId
				var sizeId = that.sizeCon.find('.selected').data('size');
				var amount = parseInt( that.amountInput.val() );
				
				//cookie在哪？ $.cookie()
				var cart = $.cookie('tt_cart')  || '{}';
				cart = JSON.parse( cart );
				//判断购物车是否已经存在当前商品
				if(!cart[sizeId]){
					cart[sizeId] = {
						"goods-id": gid,
						"size-id": sizeId,
						"amount": amount
					};
				}else{
					cart[sizeId].amount += amount;
				}

				//重新写到cookie中
				$.cookie('tt_cart',JSON.stringify(cart),{expires:365,path: '/'});

				alert('添加成功');

				console.log( JSON.parse( $.cookie('tt_cart') ) );
			});
		},
		shenbao:function(){
			var pbcontent=$('.sp-content .sp-con-item');
			$('.navIem-wrapper .navItem').mouseenter(function(){
				$(this).addClass('pb-current');
				$(this).siblings().removeClass('pb-current');
				pbcontent.eq($(this).index()).show();
				pbcontent.eq($(this).index()).siblings().hide();
			})
		}
	};
	detail.init();
	
	

});

		
		