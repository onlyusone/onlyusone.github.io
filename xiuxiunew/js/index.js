$(function(){
	var me={
		init:function(){
		this.xuanxiangka();
		this.rise();
		},
		//导航选项卡
		xuanxiangka:function(){			
			$('.nav-wrapper .nav-item').mouseenter(function(){
				var content = $('.tag-content .tag-con-item');
				$(this).addClass('current');
				$(this).siblings().removeClass('current');
				// $(this).index()
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
		//底部飞起
		rise:function(){
			var li=$('#home_sales').find('li');
			$('li').mouseenter(function(){
				var b=$(this).find('b');
					b.stop(true).animate({
					'bottom':0
				},300)
			});
			$('li').mouseleave(function(){
				var b=$(this).find('b');
					b.stop(true).animate({
					'bottom':-34
				},300)
			});
		},
	};
	me.init();
	//轮播
	var lunbo={
		imgWra:$('.img-wrapper'),
		imgs:$('.img-item'),
		now:0,
		next:0,
		timer:null,
		index:0,
		init:function(){
			var img = this.imgs.eq(0).clone(true);
			this.imgWra.append(img);
			this.imgs = this.imgWra.find('.img-item');
			this.imgSwitch();
			this.mouseenter();
			this.mouseleave();
			this.circle();
			this.circleClick();
		},
		//生成小圆点
		circle: function(){
			var str = '';
			for(var i=0; i<this.imgs.length-1; i++){
				str += '<span class="circle-item"></span>';
			}
			$('#banner .circle-wrapper').html(str);
			this.circle = $('#banner .circle .circle-item');
			this.circle.eq(0).addClass('active');
		},
		imgSwitch: function(){
			var that = this;
			this.timer = setInterval(function(){
				that.index++;
				that.imgmove();
			},2000);
		},
		imgmove:function(){
			if(this.index >= this.imgs.length){
				console.log(1);
				this.imgWra.css({left: 0});
				this.index = 1;
			}
			this.imgWra.animate({
				left:-this.index*this.imgs.eq(0).width()
			});
			//超出圆圈的数量时
			if(this.index > 1){
				this.circle.eq(0).addClass('active')
				.siblings().removeClass('active');
			}
			this.circle.eq(this.index).addClass('active')
				.siblings().removeClass('active');
		},
		//鼠标进入暂停
		mouseenter:function(){
			var that=this;
			$('#banner').mouseenter(function(){
				clearInterval(that.timer);
			});
		},
		//鼠标移出继续转动
		mouseleave:function(){
			var that=this;
			$('#banner').mouseleave(function(){
				that.imgSwitch();
			});
		},
		//点击圆圈
		circleClick: function(){
			var that = this;
			this.circle.on('click',function(){
				that.index = $(this).index();
				that.imgmove();
			});
		}
	};
	lunbo.init();
	//特效
	var texiao={
		li:$('#main').find('li'),
		init:function(){
			this.tx();
		},
		tx:function(){
			var that=this;
				$('li').each(function(k,v){
					$(v).mouseenter(function(){
						$(this).find('.topline').stop(true).animate({
							width:358
						},300);
						$(this).find('.leftline').stop(true).animate({
							height:268.5
						},300);
						$(this).find('.bottomline').stop(true).animate({
							width:358
						},300);
						$(this).find('.rightline').stop(true).animate({
							height:268.5
						},300);
					});
					$(v).mouseleave(function(){
						$(this).find('.topline').stop(true).animate({
							width:0
						},500);
						$(this).find('.leftline').stop(true).animate({
							height:0
						},500);
						$(this).find('.bottomline').stop(true).animate({
							width:0
						},500);
						$(this).find('.rightline').stop(true).animate({
							height:0
						},500);
					});
				});
		}
		
	};
	texiao.init();
});
