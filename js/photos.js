/**
 * 移动端手机WEB相册js
 */
$(function(){
	var total = 17;
	var zWin = $(window);// zepto.min.js去取的
	var render = function(){
		var padding = 2;// 图片之间的间隙
		var scrollBarWidth = 0;
		var winWidth = $(window).width();
		var picWidth = Math.floor((winWidth-padding*3-scrollBarWidth)/4);// 单张图片的宽度
		var tmpl = '';// 一定要初始化
		for(var i=1;i<=total;i++){
			var p = padding;
			var imgSrc='img/'+i+'.jpg';
			if(i%4==1){// 第一张图片没有左边距
				p = 0;
			}
			// animate.css 规定对某个对象做动画时需要加 class="animated"
			tmpl+='<li data-id="'+i+'" class="animated bounceIn" style="width:'+picWidth+'px;height:'+picWidth+'px;padding-left:'+p+'px;padding-top:'+padding+'px;"><canvas id="cvs_'+i+'"></canvas></li>';
			var imageObj=new Image();
			imageObj.index=i;
			imageObj.onload=function(){
				// 获取 dom 引用[0] 数组第一个元素就是
				var cvs=$('#cvs_'+this.index)[0].getContext('2d');
				cvs.width=this.width;
				cvs.height=this.height;
				cvs.drawImage(this,0,0,this.width,this.height);
			}
			imageObj.src=imgSrc;
		}
		$('#container').html(tmpl);
	}
	render();// 调用 render 方法
	var wImage = $('#large_img');
	var domImage = wImage[0];// dom 引用
	// 加载大图
	var loadImg = function(id,callback){
		$('#container').css({height:zWin.height(),'overflow':'hidden'})
		$('#large_container').css({
			width:zWin.width(),
			height:zWin.height()
			// top:$(window).scrollTop()
		}).show();
		var imgsrc = 'img/'+id+'.large.jpg';
		var imageObj = new Image();
		imageObj.onload = function(){
			var w = this.width;// 图片宽度
			var h = this.height;// 图片高度
			var winWidth = zWin.width();// 设备快读
			var winHeight = zWin.height();// 设备高度
		    var realw = parseInt((winWidth - winHeight*w/h)/2);// 左右 padding
																// 窗口宽度减去图片真实宽度然后再除以2
			var realh = parseInt((winHeight - winWidth*h/w)/2);// 上下 padding
																// 窗口高度减去图片真实高度然后再除以2
			wImage.css('width','auto').css('height','auto');
			wImage.css('padding-left','0px').css('padding-top','0px');
			if(h/w>1.2){// 竖图
				 wImage.attr('src',imgsrc).css('height',winHeight).css('padding-left',realw+'px');;
			}else{// 横图
				 wImage.attr('src',imgsrc).css('width',winWidth).css('padding-top',realh+'px');
			}
			callback&&callback();
		}
		imageObj.src = imgsrc;
	}
	
	/* tap 事件而不是 click */
	/* 关于delegate的介绍 */
	/* http://www.jb51.net/article/44694.htm */
	/* http://www.cnblogs.com/lori/p/3484833.html */
	$('#container').delegate('li','tap',function(){
		var _id = cid = $(this).attr('data-id');// li 的自定义属性data-id
		loadImg(_id);
	});
	var cid;// 当前放大的图片编号
	// 关闭大图
	$('#large_container').tap(function(){
		// $('#container').css({height:'auto','overflow':'auto'})
		$('#large_container').hide();
	}).swipeLeft(function(){
		cid++;
		if(cid>total){
			cid=total;
		}else{
			loadImg(cid,function(){
				domImage.addEventListener('webkitAnimationEnd',function(){
					wImage.removeClass('animated bounceInRight');
					domImage.removeEventListener('webkitAnimationEnd',function(){});
				},false);// false 控制事件是否
				wImage.addClass('animated bounceInRight');
			});
		}
	}).swipeRight(function(){
		cid--;
		if(cid<1){
			cid=1;
		}else{
			loadImg(cid,function(){
				domImage.addEventListener('webkitAnimationEnd',function(){
					wImage.removeClass('animated bounceInLeft');
					domImage.removeEventListener('webkitAnimationEnd',function(){});
				},false);
				wImage.addClass('animated bounceInLeft');
			});
		}
	});
});