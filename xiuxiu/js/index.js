$(function(){
	var me={
		init:function(){
		this.xuanxiangka();
		//this.home_shout();
//		this.top();
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
		}
	};
	me.init();
	
	

});