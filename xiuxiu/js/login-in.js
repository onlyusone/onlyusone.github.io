$(function(){
	var login={
		init:function(){
			this.aaa();
			this.duanxin();
			this.num();
			this.active();
		},
		//手机号码验证
		aaa:function(){
			$('.ltext').focus(function(){
				$('.j-mobile').css({
					'top':-10
				});
				$('.ltext').css({
					'border-color':'#7fbfe7'
				});
			});
			$('.ltext').blur(function(){
				
				var ipt=$('.ltext').val();
				var reg=/^1[34578]\d{9}$/
				if(!(reg.test(ipt))){
					$('.err-meg').find('b').css({
						'display': 'inline'
					});
					$('#errormesstxt').html(
						'请输入有效的手机号！'
					);
					$('#errormesstxt').css({
						'color':'red'
					});
					$('.ltext').val('');
				}else{
					$('.err-msgCode').find('b').hide();
					$('.err-meg').hide();
					$('.err-xinxi').show();
					$('.num').show();
				}
			});
		},
		/*****************短信验证**********************/
		duanxin:function(){
			$('.mtext').focus(function(){
				$('.duanxin').css({
					'top':-10
				});
				$('.mtext').css({
					'border-color':'#7fbfe7'
				});
			});
			$('.mtext').blur(function(){
				
				var ipt=$('.mtext').val();
				var reg=/^\d{4}$/;
				if(!(reg.test(ipt))){
					$('.err-msgCode').find('b').css({
						'display': 'inline'
					});
					$('#err-msgCode').html(
						'请输入您收到的验证码！'
					);
					$('#err-msgCode').css({
						'color':'red'
					});
					$('.mtext').val('');
				}else{
					$('.err-msgCode').find('b').hide();
					$('.err-msgCode').hide();
				};
				
			});
		},
		/*****************验证码验证**********************/
		num:function(){
			$('.num-text').focus(function(){
				$('.check-num').css({
					'top':-10
				});
				$('.num-text').css({
					'border-color':'#7fbfe7'
				});
			});
			$('.num-text').blur(function(){
				
				var ipt=$('.num-text').val();
				var reg=/^\d{1,}$/;
				if(!(reg.test(ipt))){
					$('.err-num').find('b').css({
						'display': 'inline'
					});
					$('.num-text').val('');
				}
			});
		},
		active:function(){
			$('.login-tab').find('.a').mouseenter(function(){
				$(this).addClass('active');
			});
			$('.login-tab').find('.a').mouseleave(function(){
				$(this).removeClass('active');
			});
		},
		//登录选项卡
		dl:function(){
			
		}
	};
	login.init();
})