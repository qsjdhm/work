<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<%@page pageEncoding="UTF-8"%>
	<%@page import="com.work.util.ENV" %>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta http-equiv="Content-Language" content="zh-CN" />   
	<meta name="keywords" content="前端, 产品, 设计, javascript, jquery, css, html, czlqibu, doit, java, j2ee, 扁平化, 代码, 笔记, web前端, web起步, 从这里起步" />
	<meta name="description" content="linux设置mysql注意事项" />
	
	<!-- 响应式声明开始 -->
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<!-- 响应式声明结束 -->
	
	<link rel= "shortcut icon" href="<%=new ENV().baseUrl %>/common/images/icon.png" />
	
	<title>linux设置mysql注意事项 | do IT</title>
	
	<link rel="stylesheet" type="text/css" href="<%=new ENV().baseUrl %>/plugins/bootstrap-ui/css/bootstrap_show.min.css" />
	<link rel="stylesheet" type="text/css" href="<%=new ENV().baseUrl %>/plugins/semantic-ui/packaged/css/semantic.min.css" />
	<link rel="stylesheet" type="text/css" href="<%=new ENV().baseUrl %>/plugins/scrollup-master/css/themes/image.css" />
	<link rel="stylesheet" type="text/css" href="<%=new ENV().baseUrl %>/plugins/syntaxhighlighter_3.0.83/styles/shCoreDefault.css" />
	<link rel="stylesheet" href="<%=new ENV().baseUrl %>/common/css/common.css" type="text/css" />	
	<link rel="stylesheet" href="<%=new ENV().baseUrl %>/plugins/search/css/zySearch.css" type="text/css" />
	<link rel="stylesheet" href="<%=new ENV().baseUrl %>/plugins/comment/css/zyComment.css" type="text/css" />
	<!-- 提示所使用的css -->
	<link rel="stylesheet" href="<%=new ENV().baseUrl %>/plugins/tip/toastr.css" type="text/css" />
	<link rel="stylesheet" href="<%=new ENV().baseUrl %>/css/show.css" type="text/css" />
</head>
<body>
    
    <div class="container bs-docs-container">
		<!-- 版头 -->
		<div class="row pageTitle">
			<span class="logo">
				<a rel="home" title="Just do IT" href="<%=new ENV().baseUrl %>/home/0/home">
					<b class="bclass">Just do IT</b>
				</a>
				<i>专注于web前端开发，专注于用户体验</i> 
			</span>
			<span id="zySearch" class="zySearch">
				<b class="search-img"></b>
				<input id="searchInput" class="search-input" type="text" placeholder="搜索小贱鸡？">
				<button class="search-btn btn">搜索</button>
			</span>
		</div>
		<!-- 菜单栏 -->
		<div class="row" style="margin-top:10px;">
			<header class="navbar navbar-inverse bs-docs-nav" role="banner">
				<div class="container">
					<div class="navbar-header">
						<span class="navTips">网站导航</span>
						<button class="navbar-toggle" data-target=".bs-navbar-collapse" data-toggle="collapse" type="button">
							<span class="sr-only">Toggle navigation</span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
						</button>
					</div>
					<nav class="collapse navbar-collapse bs-navbar-collapse" role="navigation">
						<ul class="nav navbar-nav">
							<li><a href="<%=new ENV().baseUrl %>/home/0/home">首页</a></li>
							<li><a href="<%=new ENV().baseUrl %>/front/0/front">前端</a></li>
				      		<li><a href="<%=new ENV().baseUrl %>/java/0/java">JAVA</a></li>
				      		<li><a href="<%=new ENV().baseUrl %>/mobile/0/mobile">移动端</a></li>
				      		<li><a href="<%=new ENV().baseUrl %>/note/25/0/note">笔记</a></li>
				      		<li><a href="<%=new ENV().baseUrl %>/works/0/works">个人作品</a></li>
				      		<li><a href="<%=new ENV().baseUrl %>/book/3/0/book">读书乐趣</a></li>
				      		<li><a href="<%=new ENV().baseUrl %>/me">关于我</a></li>
						</ul>
					</nav>
				</div>
			</header>
		</div>
	
		<!-- 内容 -->
		<div class="row">
			<div id="articleItems" class="col-md-8" role="main">
				<div id="contentZoom" class="content_zoom" title="放大"></div>
				<!-- 文章标题 -->
				<div id="post-header" style="margin-bottom:40px;">
					<h3 style="color:#333;" id="articleTitle">linux设置mysql注意事项</h3>
					<div style="color:#434A54;" id="post-msg">
						<span id="articleDate">2016-09-11 16:31:35<i style="margin:0 2px 0 20px;" class="smile icon"></i>:&nbsp;&nbsp;<span id="articleReadNum"></span></span>
					</div>
					<div class="clear"></div>
				</div>
				
				<!-- 文章内容 -->
				<div id="post-content">
					<div id="articleContent">
						<p style="font-family: &#39;Helvetica Neue&#39;; font-size: 15px; margin-top: 0.667rem; margin-bottom: 0.667rem; line-height: 24px; white-space: normal; widows: auto;">1. 首先安装步骤：</p><p style="font-family: &#39;Helvetica Neue&#39;; font-size: 15px; margin-top: 0.667rem; margin-bottom: 0.667rem; line-height: 24px; white-space: normal; widows: auto;"><a href="http://www.cnblogs.com/shenliang123/p/3203546.html" _src="http://www.cnblogs.com/shenliang123/p/3203546.html">http://www.cnblogs.com/shenliang123/p/3203546.html</a></p><p style="font-family: &#39;Helvetica Neue&#39;; font-size: 15px; margin-top: 0.667rem; margin-bottom: 0.667rem; line-height: 24px; white-space: normal; widows: auto;">2.&nbsp;<strong style="font-family: tahoma, arial, 宋体; font-size: 14px; line-height: 25.2px;">如何访问Linux系统中的MySQL数据库？</strong><span style="font-family: tahoma, arial, 宋体; font-size: 14px; line-height: 25.2px;"></span></p><p style="font-family: &#39;Helvetica Neue&#39;; font-size: 15px; margin-top: 0.667rem; margin-bottom: 0.667rem; line-height: 24px; white-space: normal; widows: auto;"><strong style="font-family: tahoma, arial, 宋体; font-size: 14px; line-height: 25.2px;"><span style="line-height: 25.2px;">#mysql -u root -p&nbsp;</span><br style="line-height: 25.2px;"/><span style="line-height: 25.2px;">Enter password：&nbsp;</span><br style="line-height: 25.2px;"/><span style="line-height: 25.2px;">mysql&gt;use mysql;&nbsp;</span><br style="line-height: 25.2px;"/><span style="line-height: 25.2px;">mysql&gt;update user set host=&#39;%&#39; where user=&#39;root&#39; and host=&#39;localhost&#39;;&nbsp;</span><br style="line-height: 25.2px;"/><span style="line-height: 25.2px;">mysql&gt;select host,user from user;</span></strong></p><p style="font-family: &#39;Helvetica Neue&#39;; font-size: 15px; margin-top: 0.667rem; margin-bottom: 0.667rem; line-height: 24px; white-space: normal;"><span style="font-family:tahoma, arial, 宋体"><span style="font-size: 14px; line-height: 25.1875px;"><strong>设置完成之后需要重启：<span style="color: rgb(0, 0, 255); font-family: Verdana, Geneva, Arial, Helvetica, sans-serif; font-size: 13px; line-height: 19.5px;">service mysqld restart</span></strong></span></span></p><p style="font-family: &#39;Helvetica Neue&#39;; font-size: 15px; margin-top: 0.667rem; margin-bottom: 0.667rem; line-height: 24px; white-space: normal;"><span style="font-family:tahoma, arial, 宋体"><span style="font-size: 14px; line-height: 25.1875px;"><strong>这样外部就可以连接linux系统下的mysql数据库了</strong></span></span></p><p><br/></p>
					</div>
					<div id="articleTags">Tags : <a title='linux' rel='tag' href='/work/search/linux/0/2/search'>linux</a> , <a title='服务器' rel='tag' href='/work/search/%25E6%259C%258D%25E5%258A%25A1%25E5%2599%25A8/0/2/search'>服务器</a></div>
				</div>
				
				<div style="margin-top:20px;margin-bottom:20px;" class="ui fitted divider"></div>
				
				<!-- 上一篇下一篇 -->
				<div id="aboutArticle" class="row">
					<div class="col-md-6"><a href='/work/show/443'><i class='hand link left icon' style='font-size: 18px;'></i>《移动Web手册》读书笔记</a></div>
					<div class="col-md-6" style="text-align:right;"><a href='/work/show/445'>搭建gitlab和gitlab的用户、组、项目使用<i class='hand link right icon' style='font-size: 18px;'></i></a></div>
				</div>

				<div id="articleComment"></div>

			</div>
			<div class="col-md-4 newLeftDiv">
				<!-- 热门标签 -->
				<div class="boxDiv">
					<ul class="topic">
						<li><a href='/work/search/CSS/0/2/search'>CSS</a></li><li><a href='/work/search/jquery/0/2/search'>jquery</a></li><li><a href='/work/search/%25E5%259B%25BE%25E7%2589%2587%25E5%258E%258B%25E7%25BC%25A9/0/2/search'>图片压缩</a></li><li><a href='/work/search/%25E6%2596%2587%25E4%25BB%25B6%25E4%25B8%258A%25E4%25BC%25A0/0/2/search'>文件上传</a></li><li><a href='/work/search/%25E5%2593%258D%25E5%25BA%2594%25E5%25BC%258F/0/2/search'>响应式</a></li><li><a href='/work/search/%25E7%25AE%2580%25E7%25BA%25A6%25E8%25AE%25BE%25E8%25AE%25A1/0/2/search'>简约设计</a></li><li><a href='/work/search/%25E6%2589%2581%25E5%25B9%25B3%25E5%258C%2596/0/2/search'>扁平化</a></li><li><a href='/work/search/JAVA/0/2/search'>JAVA</a></li><li><a href='/work/search/WEB%25E4%25BC%2598%25E5%258C%2596/0/2/search'>WEB优化</a></li>
					</ul>
				</div>
				
				<!-- 艺术图片 -->
				<div class="boxDiv">
					<img src="<%=new ENV().baseUrl %>/common/images/grace.png" class="img-responsive " xsalt="Responsive image"></img>
				</div>
				
				<!-- 热门文章 -->
				<div class="ui segment ">
				  	<h3 class="ui left floated header">热门文章</h3>
				  	<h3 class="ui right floated header"><a style="color:#333;" href="<%=new ENV().baseUrl %>/more/0/more">更多</a></h3>
				  	<div class="ui clearing divider"></div>
				  	<div id="articleRecom" class="ui animated list">
				  		<p>	<span>●</span>	<a href='/work/show/341'>(一)zyUpload界面绝佳、体验超棒的HTML5上传插件</a></p><p>	<span>●</span>	<a href='/work/show/343'>(二)zyUpload界面绝佳、体验超棒的HTML5上传插件</a></p><p>	<span>●</span>	<a href='/work/show/339'>zyImage用户体验绝佳的图片轮播插件</a></p><p>	<span>●</span>	<a href='/work/show/353'>“互联网 ”时代，移动平台是传统企业转型的核心驱动力</a></p><p>	<span>●</span>	<a href='/work/show/346'>为初级前端开发工程师做学习计划</a></p>
					</div>
				</div>
				
				<!-- 经典笔记 -->
				<div class="ui segment">
				  	<h3 class="ui left floated header">经典笔记</h3>
				  	<h3 class="ui right floated header"><a style="color:#333;" href="<%=new ENV().baseUrl %>/note/25/0/note">更多</a></h3>
				  	<div class="ui clearing divider"></div>
				  	<div class="codeRecom ui animated list">
				  		<p>	<span>●</span>	<a href='/work/show/363'>Spring MVC过滤器-登录过滤</a></p><p>	<span>●</span>	<a href='/work/show/189'>50个必备的实用jQuery代码段</a></p><p>	<span>●</span>	<a href='/work/show/188'>jquery与dom的转换（详解）</a></p><p>	<span>●</span>	<a href='/work/show/337'>移动Web开发指南 6.移动web界面样式</a></p><p>	<span>●</span>	<a href='/work/show/390'>移动web资源</a></p>
					</div>
				</div>
				
				<!-- 精品书籍 -->
				<div class="ui segment">
				  	<h3 class="ui left floated header">精品书籍</h3>
				  	<h3 class="ui right floated header"><a style="color:#333;" href="<%=new ENV().baseUrl %>/book/3/0/book">更多</a></h3>
				  	<div class="ui clearing divider"></div>
				  	<div class="ui animated list">
				  	</div>
				  	<div id="bookRecom" class="ui selection list">
						<div class='item'>	<img class='ui avatar image' src='/admin/uploads/cf3c1e36-4ed6-476c-ba47-4e88969382f7.jpg'>	<div class='content'>		<div class='header'>manage-HTML5与CSS3权威指南代码清单</div>		<div class='header' style='margin-top:10px;'>			<a href='http://yun.baidu.com/share/link?shareid=38516906&uk=2972370755&third=0' target='_blank'>点此下载</a>		</div>	</div></div><div class='item'>	<img class='ui avatar image' src='/admin/uploads/0e1d2da4-5f2b-41e3-8b0f-6042da9f3d64.jpg'>	<div class='content'>		<div class='header'>Sass和Compass设计师指南</div>		<div class='header' style='margin-top:10px;'>			<a href='http://yun.baidu.com/share/link?shareid=152770271&uk=2972370755&third=0' target='_blank'>点此下载</a>		</div>	</div></div><div class='item'>	<img class='ui avatar image' src='/admin/uploads/609f30e3-ed92-4e1e-ae6f-dd94ea10226d.jpg'>	<div class='content'>		<div class='header'>JavaScript框架高级编程</div>		<div class='header' style='margin-top:10px;'>			<a href='http://yun.baidu.com/share/link?shareid=110244072&uk=2972370755&third=0' target='_blank'>点此下载</a>		</div>	</div></div>
					</div>
				</div>
				
				
				
				<!-- 对外链接 -->
				<div class="ui segment">
				    <h3 class="ui left floated header">对外链接</h3>
				    <div class="ui clearing divider"></div>
				    <div id="foreign" class="ui animated list topic_list">
				    	<ul>
				    		<li>	<span class='glyphicon glyphicon-hand-right'></span>	<a href='http://www.alloyteam.com' target='_blank'>腾讯 Web-前端端 AlloyTeam 团队</a></li><li>	<span class='glyphicon glyphicon-hand-right'></span>	<a href='http://cdc.tencent.com' target='_blank'>腾讯 CDC-体验设计中心</a></li><li>	<span class='glyphicon glyphicon-hand-right'></span>	<a href='http://isux.tencent.com' target='_blank'>腾讯 ISUX-社交用户体验中心</a></li><li>	<span class='glyphicon glyphicon-hand-right'></span>	<a href='http://mxd.tencent.com' target='_blank'>腾讯 MXD-移动互联网设计中心</a></li><li>	<span class='glyphicon glyphicon-hand-right'></span>	<a href='http://beforweb.com' target='_blank'>Be For Web 为网而生</a></li><li>	<span class='glyphicon glyphicon-hand-right'></span>	<a href='http://www.w3cfuns.com' target='_blank'>W3Cfuns 前端开发互动平台</a></li><li>	<span class='glyphicon glyphicon-hand-right'></span>	<a href='http://www.uisdc.com' target='_blank'>优设 优秀网页设计联盟</a></li><li>	<span class='glyphicon glyphicon-hand-right'></span>	<a href='http://5m3d.com' target='_blank'>5迷3道 HTML5和CSS3的真材实料</a></li><li>	<span class='glyphicon glyphicon-hand-right'></span>	<a href='http://www.itnote.cn' target='_blank'>IT笔记</a></li>
						</ul>
				    </div>
				</div>
				
				<!-- 话题碎片 -->
				<div class="ui segment">
				    <h3 class="ui left floated header">话题碎片</h3>
				    <div class="ui clearing divider"></div>
				    <div id="lableItems" class="ui animated list topic_list">
				    	<a href='/work/search/CSS/0/2/search' class='tagadelic level1' rel='tag' title='CSS'>CSS</a><a href='/work/search/jquery/0/2/search' class='tagadelic level1' rel='tag' title='jquery'>jquery</a><a href='/work/search/%25E5%259B%25BE%25E7%2589%2587%25E5%258E%258B%25E7%25BC%25A9/0/2/search' class='tagadelic level1' rel='tag' title='图片压缩'>图片压缩</a><a href='/work/search/%25E6%2596%2587%25E4%25BB%25B6%25E4%25B8%258A%25E4%25BC%25A0/0/2/search' class='tagadelic level1' rel='tag' title='文件上传'>文件上传</a><a href='/work/search/%25E5%2593%258D%25E5%25BA%2594%25E5%25BC%258F/0/2/search' class='tagadelic level1' rel='tag' title='响应式'>响应式</a><a href='/work/search/%25E7%25AE%2580%25E7%25BA%25A6%25E8%25AE%25BE%25E8%25AE%25A1/0/2/search' class='tagadelic level1' rel='tag' title='简约设计'>简约设计</a><a href='/work/search/%25E6%2589%2581%25E5%25B9%25B3%25E5%258C%2596/0/2/search' class='tagadelic level1' rel='tag' title='扁平化'>扁平化</a><a href='/work/search/JAVA/0/2/search' class='tagadelic level1' rel='tag' title='JAVA'>JAVA</a><a href='/work/search/WEB%25E4%25BC%2598%25E5%258C%2596/0/2/search' class='tagadelic level1' rel='tag' title='WEB优化'>WEB优化</a><a href='/work/search/jquery%25E5%25B8%25B8%25E7%2594%25A8%25E4%25BB%25A3%25E7%25A0%2581/0/2/search' class='tagadelic level1' rel='tag' title='jquery常用代码'>jquery常用代码</a><a href='/work/search/html%25E3%2580%2581css%25E5%25B8%25B8%25E7%2594%25A8%25E4%25BB%25A3%25E7%25A0%2581/0/2/search' class='tagadelic level1' rel='tag' title='html、css常用代码'>html、css常用代码</a><a href='/work/search/java%25E5%25B8%25B8%25E7%2594%25A8%25E4%25BB%25A3%25E7%25A0%2581/0/2/search' class='tagadelic level1' rel='tag' title='java常用代码'>java常用代码</a><a href='/work/search/java%25E6%25A1%2586%25E6%259E%25B6%25E7%259B%25B8%25E5%2585%25B3%25E7%259F%25A5%25E8%25AF%2586/0/2/search' class='tagadelic level1' rel='tag' title='java框架相关知识'>java框架相关知识</a><a href='/work/search/%25E8%25AF%25BB%25E4%25B9%25A6%25E7%25AC%2594%25E8%25AE%25B0%25E3%2580%2581%25E7%25AE%2580%25E5%258D%2595%25E7%25AE%2597%25E6%25B3%2595/0/2/search' class='tagadelic level1' rel='tag' title='读书笔记、简单算法'>读书笔记、简单算法</a><a href='/work/search/web%25E9%259D%2599%25E6%2580%2581%25E5%258C%2596/0/2/search' class='tagadelic level1' rel='tag' title='web静态化'>web静态化</a><a href='/work/search/web%25E7%25A7%25BB%25E5%258A%25A8%25E7%25AB%25AF%25E7%259B%25B8%25E5%2585%25B3%25E7%259F%25A5%25E8%25AF%2586/0/2/search' class='tagadelic level1' rel='tag' title='web移动端相关知识'>web移动端相关知识</a><a href='/work/search/%25E5%25AF%258C%25E6%2596%2587%25E6%259C%25AC%25E3%2580%2581jqgrid%25E3%2580%2581uploadify/0/2/search' class='tagadelic level1' rel='tag' title='富文本、jqgrid、uploadify'>富文本、jqgrid、uploadify</a><a href='/work/search/%25E6%25BB%259A%25E5%258A%25A8%25E6%259D%25A1mCustomScrollbar/0/2/search' class='tagadelic level1' rel='tag' title='滚动条mCustomScrollbar'>滚动条mCustomScrollbar</a><a href='/work/search/%25E6%25AD%25A3%25E5%2588%2599%25E9%25AA%258C%25E8%25AF%2581%25E8%25A1%25A8%25E8%25BE%25BE%25E5%25BC%258F/0/2/search' class='tagadelic level1' rel='tag' title='正则验证表达式'>正则验证表达式</a><a href='/work/search/web%25E6%259C%258D%25E5%258A%25A1%25E5%2599%25A8%25E9%2585%258D%25E7%25BD%25AE/0/2/search' class='tagadelic level1' rel='tag' title='web服务器配置'>web服务器配置</a><a href='/work/search/%25E4%25B8%25AA%25E4%25BA%25BA%25E5%25BC%2580%25E5%258F%2591%25E7%258E%25AF%25E5%25A2%2583%25E9%2585%258D%25E7%25BD%25AE/0/2/search' class='tagadelic level1' rel='tag' title='个人开发环境配置'>个人开发环境配置</a><a href='/work/search/%25E7%2594%25A8%25E6%2588%25B7%25E4%25BD%2593%25E9%25AA%258C/0/2/search' class='tagadelic level1' rel='tag' title='用户体验'>用户体验</a><a href='/work/search/HTML5/0/2/search' class='tagadelic level1' rel='tag' title='HTML5'>HTML5</a><a href='/work/search/%25E5%2589%258D%25E7%25AB%25AF/0/2/search' class='tagadelic level1' rel='tag' title='前端'>前端</a><a href='/work/search/web%25E7%25A7%25BB%25E5%258A%25A8%25E7%25AB%25AF/0/2/search' class='tagadelic level1' rel='tag' title='web移动端'>web移动端</a><a href='/work/search/Flex/0/2/search' class='tagadelic level1' rel='tag' title='Flex'>Flex</a><a href='/work/search//0/2/search' class='tagadelic level1' rel='tag' title=''></a><a href='/work/search/%25E6%2596%25B0%25E9%25A2%2596/0/2/search' class='tagadelic level1' rel='tag' title='新颖'>新颖</a><a href='/work/search/%25E8%25BF%25B7%25E8%258C%25AB/0/2/search' class='tagadelic level1' rel='tag' title='迷茫'>迷茫</a><a href='/work/search/%25E9%25A1%25B9%25E7%259B%25AE%25E5%25BC%2580%25E5%258F%2591/0/2/search' class='tagadelic level1' rel='tag' title='项目开发'>项目开发</a><a href='/work/search/java%2Bweb/0/2/search' class='tagadelic level1' rel='tag' title='java web'>java web</a><a href='/work/search/mysql/0/2/search' class='tagadelic level1' rel='tag' title='mysql'>mysql</a><a href='/work/search/%25E6%2588%2590%25E9%2595%25BF%25E8%25AF%25AD%25E5%25BD%2595/0/2/search' class='tagadelic level1' rel='tag' title='成长语录'>成长语录</a><a href='/work/search/%25E7%25AC%2594%25E8%25AF%2595%25E9%25A2%2598/0/2/search' class='tagadelic level1' rel='tag' title='笔试题'>笔试题</a><a href='/work/search/freemarker/0/2/search' class='tagadelic level1' rel='tag' title='freemarker'>freemarker</a><a href='/work/search/javascript/0/2/search' class='tagadelic level1' rel='tag' title='javascript'>javascript</a><a href='/work/search/%25E5%258E%259F%25E5%259E%258B/0/2/search' class='tagadelic level1' rel='tag' title='原型'>原型</a><a href='/work/search/%25E8%25AF%25BB%25E4%25B9%25A6%25E7%25AC%2594%25E8%25AE%25B0/0/2/search' class='tagadelic level1' rel='tag' title='读书笔记'>读书笔记</a><a href='/work/search/%25E9%259D%25A2%25E5%2590%2591%25E5%25AF%25B9%25E8%25B1%25A1/0/2/search' class='tagadelic level1' rel='tag' title='面向对象'>面向对象</a><a href='/work/search/%25E7%25BB%25A7%25E6%2589%25BF/0/2/search' class='tagadelic level1' rel='tag' title='继承'>继承</a><a href='/work/search/%25E5%258E%259F%25E5%259E%258B%25E9%2593%25BE/0/2/search' class='tagadelic level1' rel='tag' title='原型链'>原型链</a><a href='/work/search/%25E5%2586%2585%25E5%25AD%2598%25E7%25AE%25A1%25E7%2590%2586/0/2/search' class='tagadelic level1' rel='tag' title='内存管理'>内存管理</a><a href='/work/search/%25E7%25BC%2596%25E7%25A0%2581%25E8%25A7%2584%25E5%2588%2599/0/2/search' class='tagadelic level1' rel='tag' title='编码规则'>编码规则</a><a href='/work/search/zyMulinInput/0/2/search' class='tagadelic level1' rel='tag' title='zyMulinInput'>zyMulinInput</a><a href='/work/search/zyComplexInput/0/2/search' class='tagadelic level1' rel='tag' title='zyComplexInput'>zyComplexInput</a><a href='/work/search/%25E5%25BC%25B9%25E5%2587%25BA%25E5%25B1%2582/0/2/search' class='tagadelic level1' rel='tag' title='弹出层'>弹出层</a><a href='/work/search/%25E4%25B8%25AA%25E4%25BA%25BA%25E4%25BD%259C%25E5%2593%2581/0/2/search' class='tagadelic level1' rel='tag' title='个人作品'>个人作品</a><a href='/work/search/zyTable/0/2/search' class='tagadelic level1' rel='tag' title='zyTable'>zyTable</a><a href='/work/search/%25E5%25B7%25A5%25E5%2585%25B7/0/2/search' class='tagadelic level1' rel='tag' title='工具'>工具</a><a href='/work/search/AngularJS/0/2/search' class='tagadelic level1' rel='tag' title='AngularJS'>AngularJS</a><a href='/work/search/%25E5%25AF%258C%25E6%2596%2587%25E6%259C%25AC/0/2/search' class='tagadelic level1' rel='tag' title='富文本'>富文本</a><a href='/work/search/%25E5%25A8%25B1%25E4%25B9%2590/0/2/search' class='tagadelic level1' rel='tag' title='娱乐'>娱乐</a><a href='/work/search/%25E9%25A2%2584%25E7%25BC%2596%25E8%25AF%2591/0/2/search' class='tagadelic level1' rel='tag' title='预编译'>预编译</a><a href='/work/search/%25E5%258E%258B%25E7%25BC%25A9/0/2/search' class='tagadelic level1' rel='tag' title='压缩'>压缩</a><a href='/work/search/%25E9%259D%25A2%25E5%2590%2591%25E5%25AF%25B9%25E8%25B1%25A1%25E7%25BC%2596%25E7%25A8%258B%25E6%258C%2587%25E5%258D%2597/0/2/search' class='tagadelic level1' rel='tag' title='面向对象编程指南'>面向对象编程指南</a><a href='/work/search/%25E8%25AE%25BE%25E8%25AE%25A1%25E6%25A8%25A1%25E5%25BC%258F/0/2/search' class='tagadelic level1' rel='tag' title='设计模式'>设计模式</a><a href='/work/search/%25E6%2580%25A7%25E8%2583%25BD/0/2/search' class='tagadelic level1' rel='tag' title='性能'>性能</a><a href='/work/search/nodejs/0/2/search' class='tagadelic level1' rel='tag' title='nodejs'>nodejs</a><a href='/work/search/GitHub/0/2/search' class='tagadelic level1' rel='tag' title='GitHub'>GitHub</a><a href='/work/search/http/0/2/search' class='tagadelic level1' rel='tag' title='http'>http</a><a href='/work/search/%25E5%258E%259F%25E7%2590%2586/0/2/search' class='tagadelic level1' rel='tag' title='原理'>原理</a><a href='/work/search/LESS/0/2/search' class='tagadelic level1' rel='tag' title='LESS'>LESS</a><a href='/work/search/IDE/0/2/search' class='tagadelic level1' rel='tag' title='IDE'>IDE</a><a href='/work/search/WebStorm/0/2/search' class='tagadelic level1' rel='tag' title='WebStorm'>WebStorm</a><a href='/work/search/%25E9%259B%2586%25E6%2588%2590%25E5%25BC%2580%25E5%258F%2591/0/2/search' class='tagadelic level1' rel='tag' title='集成开发'>集成开发</a><a href='/work/search/Eclipse/0/2/search' class='tagadelic level1' rel='tag' title='Eclipse'>Eclipse</a><a href='/work/search/%25E8%25A3%2585%25E9%2580%25BC/0/2/search' class='tagadelic level1' rel='tag' title='装逼'>装逼</a><a href='/work/search/js%25E5%258E%259F%25E7%2590%2586/0/2/search' class='tagadelic level1' rel='tag' title='js原理'>js原理</a><a href='/work/search/ajax/0/2/search' class='tagadelic level1' rel='tag' title='ajax'>ajax</a><a href='/work/search/%25E5%2585%25BC%25E5%25AE%25B9%25E6%2580%25A7/0/2/search' class='tagadelic level1' rel='tag' title='兼容性'>兼容性</a><a href='/work/search/linux/0/2/search' class='tagadelic level1' rel='tag' title='linux'>linux</a><a href='/work/search/%25E6%259C%258D%25E5%258A%25A1%25E5%2599%25A8/0/2/search' class='tagadelic level1' rel='tag' title='服务器'>服务器</a><a href='/work/search/gitlab/0/2/search' class='tagadelic level1' rel='tag' title='gitlab'>gitlab</a><a href='/work/search/%25E4%25BA%258B%25E4%25BB%25B6/0/2/search' class='tagadelic level1' rel='tag' title='事件'>事件</a><a href='/work/search/%25E6%25AF%258F%25E6%2597%25A5%25E6%2580%25BB%25E7%25BB%2593/0/2/search' class='tagadelic level1' rel='tag' title='每日总结'>每日总结</a><a href='/work/search/BFC/0/2/search' class='tagadelic level1' rel='tag' title='BFC'>BFC</a><a href='/work/search/react/0/2/search' class='tagadelic level1' rel='tag' title='react'>react</a><a href='/work/search/webpack/0/2/search' class='tagadelic level1' rel='tag' title='webpack'>webpack</a>
				    </div>
				</div>
				
				<!-- 最新评论 -->
				<div class="ui segment">
				    <h3 class="ui left floated header">最新评论</h3>
				    <div class="ui clearing divider"></div>
				    <div id="comment" class="ui animated list topic_list">
				    	<p>	<span>开发</span><br/>	<span>对 : </span><a href='/work/me' target='_blank'>关于我</a><br/>	<span>评论 : </span><a href='/work/show' target='_blank'>我在ｇｉｔ　上
上面看到你的代码写的很不错，想学习下，但是缺失一部分东西，能否分享给我。

比如：数据库设计　还有

/WebContent/admin/index.html
/WebContent/admin/dist/

/WebContent/WEB-INF/applicationContext.xml
/WebContent/gitlab/</a></p><p>	<span>啦啦啦</span><br/>	<span>对 : </span><a href='/work/me' target='_blank'>关于我</a><br/>	<span>评论 : </span><a href='/work/show' target='_blank'>卖报的小行家</a></p><p>	<span>8</span><br/>	<span>对 : </span><a href='/work/show/358' target='_blank'>zyComment新颖、体验好的评论插件</a><br/>	<span>评论 : </span><a href='/work/show/358' target='_blank'>8</a></p><p>	<span>7</span><br/>	<span>对 : </span><a href='/work/show/358' target='_blank'>zyComment新颖、体验好的评论插件</a><br/>	<span>评论 : </span><a href='/work/show/358' target='_blank'>7</a></p><p>	<span>艹</span><br/>	<span>对 : </span><a href='/work/show/358' target='_blank'>zyComment新颖、体验好的评论插件</a><br/>	<span>评论 : </span><a href='/work/show/358' target='_blank'>艹 楼上的楼都歪到姥姥家了</a></p>
				    </div>
				</div>
			</div>
		</div>
	</div>
	
	<footer class="bs-footer" role="contentinfo">
		<br/><br/><br/><br/>
		<div class="row">
			<div class="col-md-8 record" role="main">
				<span>
					technology stays true here ©2015 
					<a href="http://www.52doit.com">
						www.52doit.com 
					</a>
					<a href="http://www.miitbeian.gov.cn/" target="_blank">
						鲁ICP备15007960号-2
					</a>
				</span>
			</div>
			<div class="col-md-4">
			</div>
		</div>
	</footer>

	<!-- 隐藏input，供获取数据 -->
	<input type="hidden" id="idHiddenInput" value="444" />
    <input type="hidden" id="titleHiddenInput" value="linux设置mysql注意事项" />
    
	<script type="text/javascript" src="<%=new ENV().baseUrl %>/common/js/jquery-1.7.2.min.js"></script>
	<script type="text/javascript" src="<%=new ENV().baseUrl %>/common/js/ENV.js"></script>
	<script type="text/javascript" src="<%=new ENV().baseUrl %>/plugins/bootstrap-ui/js/bootstrap.min.js"></script> 
	<script type="text/javascript" src="<%=new ENV().baseUrl %>/plugins/scrollup-master/src/jquery.scrollUp.js"></script>
	<script type="text/javascript" src="<%=new ENV().baseUrl %>/plugins/ueditor1.6.1/third-party/SyntaxHighlighter/shCore.js"></script> 
	<script type="text/javascript" src="<%=new ENV().baseUrl %>/plugins/syntaxhighlighter_3.0.83/scripts/shBrushJScript.js"></script>
	<script type="text/javascript" src="<%=new ENV().baseUrl %>/plugins/search/js/zySearch-doit.js"></script>
	<script type="text/javascript" src="<%=new ENV().baseUrl %>/plugins/comment/js/zyComment.js"></script>
	<!-- 提示所使用的js -->
	<script type="text/javascript" src="<%=new ENV().baseUrl %>/plugins/tip/toastr.js"></script>
	<script type="text/javascript" src="<%=new ENV().baseUrl %>/plugins/tip/glimpse.min.js"></script>
	<script type="text/javascript" src="<%=new ENV().baseUrl %>/plugins/tip/glimpse.toastr.js"></script>
	<script type="text/javascript" src="<%=new ENV().baseUrl %>/js/show.js"></script>
		
	<!-- 百度分享 -->
	<script>window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"2","bdMiniList":false,"bdPic":"","bdStyle":"0","bdSize":"16"},"slide":{"type":"slide","bdImg":"8","bdPos":"right","bdTop":"135.5"}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5)];</script>

	
</body>
</html>