/**
 * 
 * <li class="layui-nav-item layui-nav-itemed">
 * <dd class="layui-this">
 * <a href="#">罗汉拳</a>
 * </dd>
 */

function HighLight(options){
	this.hrefContent = options.hrefContent;
	this._init();//执行初始化后
}

HighLight.prototype = {
	_init:function(){
		var _this = this;
		$("dd a[href*='"+_this.hrefContent+"']").addClass("layui-this");
		$("dd a[href*='"+_this.hrefContent+"']").parents("li.layui-nav-item").addClass("layui-nav-itemed");
	}	
}