/*
	js方法集合
*/

/*
	$ 获取元素   
	@param
		selector  选择器（id、class、标签）
		parent 需要查找的子元素的父级元素
	
		写法示例：  
			$('#container')  返回一个元素
			$('.box')  返回一个集合
			$('div') 返回一个集合
*/
function $(selector,parent){
	//判断用户是否传入parent（元素的父级元素）
	parent = parent || document;
	//提取选择器的第一个字符（用于确定是id class 还是标签）
	var type = selector[0];
	var elems = [];
	//如果是id选择器
	if(type == '#'){
		return parent.getElementById(selector.substr(1));
	}
	//如果是class选择器
	if(type == '.'){
		selector = selector.substr(1);
		//浏览器支持getElementsByClassName
		if(document.getElementsByClassName){
			elems = parent.getElementsByClassName(selector);
		}else{
			//浏览器不支持getElementsByClassName
			var allEles = parent.getElementsByTagName('*');
			//变量所有的元素，匹配class
			for(var i=0; i<allEles.length; i++){
				if(allEles[i].className == selector){
					elems.push( allEles[i] );
				}
			}
		}
		
	}else{
		//标签选择器
		elems = parent.getElementsByTagName(selector);
	}
	if(elems.length == 1){
		elems = elems[0];
	}
	return elems;
}

/**
	css  获取或者设置元素样式的值
	@param
		elem 元素
		style 样式名
		value 样式值
*/
function css(elem,param1,param2){
	//如果是获取样式的值
	if(arguments.length == 2){
		if(typeof param1 == 'string'){
			//判断浏览器是否支持currentStyle
			if(elem.currentStyle){
				return elem.currentStyle[param1];
			}
			return window.getComputedStyle(elem)[param1];
		}else{
			for(var key in param1){
				elem.style[key] = (key=='opacity')?param1[key]:param1[key]+'px';
			}
		}
	}else{
		elem.style[param1] = (param1=='opacity')?param2:param2+'px';
	}
}

/**
	获取元素的第一个子元素
*/
function first(elem){
	return elem.firstElementChild || elem.firstChild;
}

/**
	获取元素的最后一个子元素
*/
function last(elem){
	return elem.lastElementChild || elem.lastChild;
}
/*
	元素显示
*/
function show(elem){
	elem.style.display = 'block';
}
/*
	元素隐藏
*/
function hide(elem){
	elem.style.display = 'none';
}


/**
	添加事件监听
	@param 
		elem 元素
		type 事件类型
		fn 要做的事情
		isCapture 是否捕捉
*/
function addEventListener(elem,type,fn,isCapture){
	//判断是否支持addEventListener(非IE)
	if(elem.addEventListener){
		isCapture = isCapture || false;
		elem.addEventListener(type,fn,isCapture);
	}else{
		elem.attachEvent('on'+type,fn);
	}
}

/**
	阻止事件冒泡
	@param
		e 事件对象

*/
function stopPropagation(e){
	e = e || window.event;
	//判断浏览器是否支持stopPropagation（非IE）
	if(e.stopPropagation){
		e.stopPropagation();
	}else{
		e.cancelBubble = true;
	}
}


/*
	阻止事件的默认行为
	@param
		e 事件对象
*/
function preventDefault(e){
	e = e || window.event;
	//判断浏览器是否支持preventDefault（非IE）
	if(e.preventDefault){
		e.preventDefault();
	}else {
		e.returnValue = false;
	}
}


/*
	设置cookie
	@param
		cname cookie名
		cvalue cookie值
		expires 存储的期限 (正整数)
*/
function setCookie(cname,cvalue,expires){
	if(arguments.length == 2){
		document.cookie = cname+'='+cvalue;
	}else {
		//var date = new Date(Date.now() + expires*24*3600*1000);
		var date = new Date();
		date.setDate( date.getDate() + expires );
		var time = date.toGMTString();
		document.cookie = cname+'='+cvalue+';expires='+time;
	}
}

/*
	获取某个cookie
	@param 
		cname cookie名
*/
function getCookie(cname){
	//按照分隔符'; '将所有的cookie分割成数组
	var cookie = document.cookie;
	var cookieArr = cookie.split('; ');
	//遍历所有的cookie
	for(var i in cookieArr){
		var str = cookieArr[i];//"psw=123456"
		var item = str.split('='); // ['psw','123456']
		//判断当前cookie名和传入的cookie名是否一致
		if(item[0] === cname){
			return item[1];
		}
	}
	return null; // 没有找到返回null
}

/*
	删除cookie
	将cookie的时间设置为过去时间，浏览器会自动删除cookie
*/
function delCookie(cname){
	setCookie(cname,null,-1);
}



/*
	给元素添加class
	@param
		elem 元素
		className 要添加的class
*/
function addClass(elem,className){
	var c = elem.className; // elem.getAttribute('class');
	//如果开始class为空
	if(c.length == 0){
		elem.className = className;
		return;
	}
	//将元素的class按照空格进行分割
	var classArr = c.split(' ');
	//遍历所有的class
	for(var i in classArr){
		//如果存在传入的className，直接返回
		if(classArr[i] == className){
			return;
		}
	}
	//执行到此处，说明elem没有传入的className，那么添加一个
	elem.className += ' '+className;
}

/*
	给元素去除class
	@param
		elem 元素
		className 要去除的class
*/
function removeClass(elem,className){
	//将元素的class按照空格进行分割
	var c = elem.className; // elem.getAttribute('class');
	var classArr = c.split(' ');
	var cname = '';
	//遍历所有的class
	for(var i in classArr){
		//判断是不是要删除的class或者空格
		if(classArr[i] != className && classArr[i].trim().length != 0){
			cname += classArr[i]
		}
	}
	elem.className = cname;
}


/**
 	ajax请求
 	@param	
 		type 请求类型  post get
 		url  请求路径
 		data 需要往后台发送的数据
 		success   服务器相应以后需要做的处理
 	
 	ajax({
 		type: 'post',
 		url: 'php/login.php',
 		data: {},
 		success: function(){}
 	});
*/
function ajax(json){
	var type = json.type || 'get';
	var url = json.url;
	var data = json.data;
	var success = json.success;
	
	//将json数据转化为字符串
	var dataStr = getStr(data);
	
	//创建通信对象
	var xhr = new XMLHttpRequest();
	//判断请求方式
	if(type == 'get'){
		xhr.open('get',url+'?'+dataStr,true);
		xhr.send(null);
	}else{
		xhr.open('post',url,true);
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded"); 
		xhr.send(dataStr);
	}
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			//调用success方法
			success(JSON.parse(xhr.responseText));
		}
	}
}
/**
 	将json转化为   类似  username=pine&password=123456的字符串
*/
function getStr(json){
	var result = '';
	for(var key in json){
		result += '&'+key + '=' + json[key];
	}
	return result.substr(1);
}

/**
 	获取浏览器的可用宽度和高度
*/
function getClientWidth(){
	return document.documentElement.clientWidth;
}
function getClientHeight(){
	return document.documentElement.clientHeight;
}

/**
 	运动框架（终极）
 	@param	
 		elem  元素
 		data  元素集合
 		time  运动时间
*/
function animate(elem,data,time,fn){
	//清除上一次的动画
	clearInterval(elem.timer);
	var over = {}; //用于记录已经变化结束的样式
	//定义数据数组 
	var arr = [];
	//遍历json  整合数据 {width:500} => [{style: 'width',end: 500}]
	for(var key in data){
		//获取初值
		var start = parseFloat(css(elem,key));
		var json = {
			start: start,
			end: data[key], 
			speed: (data[key]-start)/(time/13),
			style: key
		};
		arr.push(json);
		over[key] = false;
	}
	//利用定时器不断改变元素的每个要发生变化的样式
	elem.timer = setInterval(function(){
		//利用for循环改变每个样式
		for(var i in arr){
			arr[i].start += arr[i].speed;
			//判断是否达到终值
			if(arr[i].start * arr[i].speed >= arr[i].end * arr[i].speed){
				arr[i].start = arr[i].end;
				//如果结束，将状态置为true
				over[arr[i].style] = true;
			}
			elem.style[arr[i].style] = (arr[i].style=='opacity')? arr[i].start : arr[i].start + 'px';
		}
		var flag = true; //true 代表全部结束
		//判断是否所有的样式运动完毕
		for(var k in over){
			//如果有一个没结束
			if(!over[k]){
				flag = false;
				break;
			}
		}
		if(flag){
			clearInterval(elem.timer);
			fn && fn(); //如果不传递回调函数，fn是undefined
		}
	},13);
}